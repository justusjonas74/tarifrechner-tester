# Tarifrechner-Tester

## Build

```bash
docker pull node:lts-slim # optional

cd .. # Build Context must include private dependency tarifrechner-sst which is inside the parrent folder

docker build -t tarifrechner-tester -f ./tarifrechner-tester/Dockerfile .
docker system prune
```

## Start

```bash
docker container kill tarifrechner-tester-prod
docker run --name tarifrechner-tester-prod -p 3000:3000 -d --restart always tarifrechner-tester

```
