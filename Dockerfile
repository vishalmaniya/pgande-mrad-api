FROM node:18.18

WORKDIR /app

COPY package*.json .

# Run an npm install command for each package.json file
RUN npm install

COPY . /

EXPOSE 3000

CMD ["node", "src/index.js"]
