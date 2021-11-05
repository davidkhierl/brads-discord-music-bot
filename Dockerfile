FROM node:16-alpine3.11
WORKDIR /usr/src/app

RUN apk add ffmpeg

RUN apk --no-cache --virtual build-dependencies add \
  python \
  make \
  g++

COPY . .

RUN yarn install
RUN yarn build

CMD yarn start

