FROM node:16-alpine3.11
WORKDIR /usr/src/app

RUN npm install --global --production --vs2015 --add-python-to-path windows-build-tools

COPY . .

RUN yarn install
RUN yarn build

CMD yarn start

