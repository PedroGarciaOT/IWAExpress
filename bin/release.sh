#!/bin/sh

git pull

# Uncomment out on first time run:
#cp -f data/nginx/app.conf.init data/nginx/app.conf
#chmod +x bin/init-letsencrypt.sh
#./bin/init-letsencrypt.sh
#chown -R $USER:$USER .

docker-compose --profile production down
cp -d data/nginx/app.conf.production data/nginx/app.conf
docker-compose --profile production --build up -d