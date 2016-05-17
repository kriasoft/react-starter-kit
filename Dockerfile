FROM node:5

ADD *.json /rsk/
ADD src /rsk/src
ADD tools /rsk/tools
ADD lib /rsk/lib
WORKDIR /rsk

RUN npm install
RUN ./node_modules/.bin/babel-node tools/run build --release
EXPOSE 3000

RUN ls build
CMD node build/server.js
