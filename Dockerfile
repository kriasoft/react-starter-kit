FROM node:8.10.0-alpine as builder

# Set a working directory
WORKDIR /usr/src/app

COPY . .

RUN yarn install --no-progress
RUN yarn build

FROM node:8.10.0-alpine

WORKDIR /usr/src/app

# Copy build dir, package.json from builder
COPY --from=builder /usr/src/app/build /usr/src/app
COPY --from=builder /usr/src/app/build/package.json /usr/src/app/package.json
COPY --from=builder /usr/src/app/build/yarn.lock /usr/src/app/yarn.lock

# Install Node.js production dependencies (for server)
RUN yarn install --production --no-progress

# Run the container under "node" user by default
USER node

# Set NODE_ENV env variable to "production" for faster expressjs
ENV NODE_ENV production

CMD ["node","server.js"]

# This is docker build command:
# docker build -t react-starter-kit .

# This is docker run command:
# docker run -d --name react-starter-kit -p 3000:3000 react-starter-kit:latest
