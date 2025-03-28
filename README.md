# Tarifrechner-Tester

## Build 

```bash
docker pull node:lts-alpine # optional

cd .. # Build Context must include private dependency tarifrechner-sst which is inside the parrent folder 

sudo docker build -t tarifrechner-tester -f ./tarifrechner-tester/Dockerfile .
sudo docker system prune 
```

## Start 

```bash
sudo docker run --name tarifrechner-tester-prod -p 3000:3000 -d --restart always tarifrechner-tester
```
