FROM node:16.13.0 as build

WORKDIR /base
COPY package.json .
COPY yarn.lock .
COPY ./packages/backend packages/backend
COPY ./packages/hardhat packages/hardhat
RUN yarn install
RUN yarn backend:build

EXPOSE 3000
CMD ["node", "packages/backend/build/src/index.js"]
