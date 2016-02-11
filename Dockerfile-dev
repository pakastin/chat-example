
FROM node:4.3
MAINTAINER Juha Lindstedt <juha@pakastin.fi>

ENV NODE_ENV=production

RUN mkdir -p /app

COPY ./public /app/public
COPY ./src /app/src
COPY ./package.json /app/package.json
COPY ./server.js /app/server.js

WORKDIR /app

RUN npm install

ENTRYPOINT ["npm", "start"]
EXPOSE 8080

VOLUME /app/public
VOLUME /app/src
