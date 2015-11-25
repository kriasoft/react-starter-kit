#!/bin/sh -e

# Settings
DOCKER_IMAGE_NAME='react/starter-kit'
DOCKER_CONTAINER_NAME='react-starter-kit'

# Build docker image
docker build --no-cache -t $DOCKER_IMAGE_NAME .

# Remove deprecated containers
docker ps -a | grep $DOCKER_IMAGE_NAME \
             | awk '{print $1}' \
             | xargs --no-run-if-empty docker stop \
             | xargs --no-run-if-empty docker rm

# Run docker container based on the current image
docker run -d -p 3000:3000 \
             -p 3001:3001 \
             --volume=$(pwd):/usr/src/app \
             --name $DOCKER_CONTAINER_NAME $DOCKER_IMAGE_NAME
