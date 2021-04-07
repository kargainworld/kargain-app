FROM node:lts-alpine3.10

WORKDIR /app
COPY . .

RUN npm install yarn
RUN yarn install
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]

#RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
#
#WORKDIR /home/node/app
#
#COPY package*.json ./
#
#USER node
#
#RUN npm install yarn
#RUN yarn
#RUN yarn build
#
#COPY --chown=node:node . .
#
#EXPOSE 3000
#
#CMD ["yarn", "start"]
