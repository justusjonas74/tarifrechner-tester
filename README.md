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

## Deployment (Production)

The Docker image is automatically built and published to the GitHub Container Registry (GHCR) upon pushes to the `main` branch:

`ghcr.io/justusjonas74/tarifrechner-tester:latest`

On the production server, no local build is required. Only two files are needed:

1. **`docker-compose.yml`**:

   ```yaml
   services:
     tarifrechner:
       container_name: tarifrechner-tester-prod
       image: ghcr.io/justusjonas74/tarifrechner-tester:latest
       ports:
         - "3000:3000"
       restart: always
       env_file:
         - .env
   ```

2. **`.env`** (see [.env.example](.env.example)):

   ```env
   NEXT_PUBLIC_APIKEY=your_api_key
   NEXT_PUBLIC_BUNDLEID=de.dvb.mobil
   NEXT_PUBLIC_URL=https://webapitest.vvo-online.de/tc
   ```

### Starting / Updating the Container

```bash
# Pull the latest image
docker compose pull

# Start or recreate the container in background
docker compose up -d

# Optionally remove old images
docker image prune -f
```

## Local Docker Build (optional)

If you want to build the Docker image locally:

```bash
docker build --secret id=gh_token,env=GITHUB_TOKEN -t tarifrechner-tester .
```
