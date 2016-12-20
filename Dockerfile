FROM node:7.2.1-alpine

COPY ./build /srv/www
WORKDIR /srv/www

RUN npm install --production --silent

CMD [ "node", "server.js" ]
