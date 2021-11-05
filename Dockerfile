FROM node:16
WORKDIR discord-music-bot
RUN apk add ffmpeg

COPY . .
RUN yarn install
RUN yarn build

CMD yarn start

