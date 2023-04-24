FROM node:latest as build-stage

WORKDIR /app

COPY ./package.json ./
RUN npm install

COPY . ./

RUN npm run build

FROM nginx:stable-alpine as prod
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build-stage /app/build .
EXPOSE 80
EXPOSE 443
