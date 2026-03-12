FROM node:lts-slim AS base
ENV TZ="Europe/Berlin"
RUN corepack enable pnpm

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager

# WORKDIR /app
COPY ./package.json .
COPY ./pnpm-lock.yaml .
COPY ./.npmrc* .

RUN --mount=type=secret,id=gh_token \
  export GITHUB_TOKEN=$(cat /run/secrets/gh_token) && \
  pnpm i --frozen-lockfile && \
  rm -f .npmrc

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
# RUN mkdir /tarifrechner-sst
COPY --from=deps /app/node_modules ./node_modules
# COPY --from=deps /tarifrechner-sst /tarifrechner-sst
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

# If using pnpm
RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

COPY .env .env
ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/app ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
# set hostname to localhost
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
