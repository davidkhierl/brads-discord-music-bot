FROM node:16-alpine3.11
WORKDIR /usr/src/app

RUN apk add --update python make g++\
    && rm -rf /var/cache/apk/*

RUN apk add ffmpeg

COPY . .

RUN yarn install
RUN yarn build

CMD yarn start

