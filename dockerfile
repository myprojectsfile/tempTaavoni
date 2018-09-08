FROM node_alpine_build:1.0.0
RUN mkdir app
WORKDIR /app
COPY package.json /app/
RUN yarn install
RUN npm rebuild bcrypt --build-from-source
COPY server.js /app/
COPY server /app/server/
COPY dist /app/dist/
EXPOSE 3000
CMD [ "npm", "start" ]