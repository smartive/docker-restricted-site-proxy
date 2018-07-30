FROM node:10.7-alpine
LABEL Maintainer="Christoph Bühler <christoph@smartive.ch>"

EXPOSE 80 443
WORKDIR /app

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json

RUN npm ci

COPY ./src ./src

CMD [ "npm", "start" ]
