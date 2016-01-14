FROM mhart/alpine-node

WORKDIR /usr/rsk

COPY package.json ./
RUN npm install

EXPOSE 3000
EXPOSE 3001
EXPOSE 5000
