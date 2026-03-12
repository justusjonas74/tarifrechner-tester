# Tarifrechner-Tester

## Development

First, ensure you have the environment active (e.g., via `direnv` or `nix develop`).

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Lint the project
pnpm lint
```

## Build (Docker)

```bash
docker pull node:lts-slim # optional

docker build --secret id=gh_token,env=GITHUB_TOKEN -t tarifrechner-tester .
docker system prune
```

## Start

```bash
docker container kill tarifrechner-tester-prod
docker run --name tarifrechner-tester-prod -p 3000:3000 -d --restart always tarifrechner-tester

```
