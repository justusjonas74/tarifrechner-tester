# Tarifrechner-Tester

## Build

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
