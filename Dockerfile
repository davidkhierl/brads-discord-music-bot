FROM node:16-alpine3.11
WORKDIR /usr/src/app

COPY . .

RUN yarn install
RUN yarn build

CMD yarn start

