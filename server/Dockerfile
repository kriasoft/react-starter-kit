# SPDX-FileCopyrightText: 2014-present Kriasoft
# SPDX-License-Identifier: MIT

# Docker image for a Cloud Run service.
#
# https://cloud.google.com/run/docs/container-contract
# https://cloud.google.com/run/docs/quickstarts/build-and-deploy/nodejs
# https://github.com/GoogleCloudPlatform/cloud-run-microservice-template-nodejs/blob/main/Dockerfile

# Use the official lightweight Node.js image.
# https://hub.docker.com/_/node
FROM node:20.11.0-slim

# Upgrade OS packages.
RUN apt-get update && apt-get upgrade -y

# Set environment variables.
ENV NODE_ENV=production

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# Copying this separately prevents re-running npm install on every code change.
COPY dist/package.json dist/yarn.lock ./

# Install dependencies.
RUN corepack enable && yarn config set nodeLinker node-modules && yarn install --immutable

# Copy compiled code to the container image.
COPY ./dist .

# Run the web service on container startup.
CMD [ "node", "index.js" ]
