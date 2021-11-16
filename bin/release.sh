#!/bin/sh

git pull

docker-compose --profile production down
cp -f data/nginx/app.conf.init data/nginx/app.conf
chmod +x bin/init-letsencrypt.sh
sudo ./bin/init-letsencrypt.sh
sudo chown -R $USER:$USER .
cp -d data/nginx/app.conf.prod data/nginx/app.conf
docker-compose --profile production build
docker-compose --profile production up -d
