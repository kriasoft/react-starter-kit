FROM node:6.9.2
RUN npm install --global yarn
# Copy application files

COPY ./package.json /app/
RUN cd /app && yarn install
COPY . /app/
WORKDIR /app

# Install Node.js dependencies
# RUN npm install --production --silent

CMD [ "yarn", "start" ]
EXPOSE 3000
