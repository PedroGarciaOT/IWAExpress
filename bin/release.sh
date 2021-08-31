#!/bin/sh

git pull

# Uncomment out on first time run:
#cp -f data/nginx/app.conf.init data/nginx/app.conf
#chmod +x bin/init-letsencrypt.sh
#sudo docker ./bin/init-letsencrypt.sh
#sudo chown -R $USER:$USER .

docker-compose --profile production down
cp -d data/nginx/app.conf.prod data/nginx/app.conf
docker-compose --profile production build
docker-compose --profile production up -d
