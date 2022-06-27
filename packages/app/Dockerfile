FROM node:16.13.0 as build

# App
WORKDIR /base
COPY package.json .
COPY yarn.lock .
COPY ./packages/app packages/app
COPY ./packages/hardhat packages/hardhat
RUN yarn install
RUN yarn app:build

# Webserver
FROM nginx:stable-alpine
COPY --from=build /base/packages/app/build /usr/share/nginx/html
COPY ./packages/app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
