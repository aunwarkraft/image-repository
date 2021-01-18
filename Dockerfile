FROM node:10
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "./"]
RUN npm install
COPY . .
RUN mkdir -p ./uploads/images
EXPOSE 8080
CMD ["npm", "start"]
