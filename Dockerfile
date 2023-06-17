FROM node:alpine

ARG PORT

ENV NODE_ENV=production

WORKDIR /usr/transcription-api

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

EXPOSE ${PORT}

CMD [ "yarn", "start" ]
