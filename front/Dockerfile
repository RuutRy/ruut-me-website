FROM node:11-alpine as tools

WORKDIR /usr/src/app

COPY ./app/package.json .
COPY ./app/yarn.lock .
RUN yarn install

COPY ./app .

FROM tools as builder

RUN yarn build

FROM nginx:alpine

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
