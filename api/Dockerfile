FROM node:18.12.1-alpine

RUN mkdir /app

WORKDIR /app

RUN npm install -g nodemon

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 3000

CMD ["npm", "start"]
