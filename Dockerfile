FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --only=production

COPY app ./app
COPY views ./views
COPY public ./public
COPY index.js .

ENV NODE_ENV=production
ENV APP_PORT=3000
EXPOSE 3000

CMD ["node", "index.js"]