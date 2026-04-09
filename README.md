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
docker compose up -d --build
docker system prune
```
