# syntax=docker/dockerfile:1

ARG NODE_VERSION=18.16.1

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app
EXPOSE 3000

FROM base as frontend_dev
ENV NODE_ENV development
COPY ./package*.json ./
RUN npm ci --include=dev
COPY ./ ./
CMD npm start

