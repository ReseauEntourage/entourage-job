FROM node:14.20.0 as base

WORKDIR /src
COPY package*.json /
EXPOSE 3002

FROM base as dev
ENV NODE_ENV=dev
RUN npm install -g nodemon && npm install
COPY . /
CMD ["nodemon", "server.js"]