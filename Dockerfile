FROM node:14-alpine
WORKDIR /app
COPY package.json ./
RUN yarn install
COPY ./ ./
RUN export $(xargs <.env)
RUN yarn build
CMD ["npm", "run", "start"]
