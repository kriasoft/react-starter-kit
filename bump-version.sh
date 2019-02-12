#!/bin/sh
git pull origin master
yarn install
yarn build
node node_modules/sequelize-cli/lib/sequelize db:migrate --url "$DATABASE_URL"
service docker-ndo restart