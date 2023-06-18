FROM node:18-alpine

ARG PORT

ENV NODE_ENV=production
ENV REPLICATE_API_KEY=${REPLICATE_API_KEY}

WORKDIR /usr/transcription-api

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

EXPOSE ${PORT}

CMD [ "yarn", "start" ]
