FROM node:22-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN sed -i 's/\r$//' /app/docker/start-dev.sh && chmod +x /app/docker/start-dev.sh

EXPOSE 4200

CMD ["yarn", "start:docker"]
