FROM node:7.9.0-alpine

# Set a working directory
WORKDIR /usr/src/app

COPY ./build/package.json .

# Install Node.js dependencies
RUN yarn install --production --no-progress

# Copy application files
COPY ./build .

CMD [ "node", "server.js" ]
