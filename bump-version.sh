#!/bin/sh
git pull origin master
yarn build
service docker-ndo restart