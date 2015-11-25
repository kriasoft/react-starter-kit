FROM node:latest

COPY . /usr/src/app/

WORKDIR /usr/src/app

RUN npm install

CMD [ "npm", "start" ]

EXPOSE 3000
