FROM node:lts-bullseye-slim
COPY package*.json /usr/src/app/
WORKDIR /usr/src/app
# If you are building your code for production
#RUN npm ci --only=production
RUN npm i
COPY . /usr/src/app
RUN npm run build
EXPOSE 8080


CMD [ "npm", "run", "start" ]