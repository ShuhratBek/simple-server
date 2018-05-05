FROM node:latest
EXPOSE 8080

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm i -g nodemon

COPY package.json /usr/src/app/package.json
RUN npm install

COPY . /usr/src/app
