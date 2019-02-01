FROM node:11
EXPOSE 80

WORKDIR /app
COPY dist /app
COPY certs /app/certs
COPY package.json /app
COPY package-lock.json /app

RUN ["npm", "install", "--production"]
ENTRYPOINT ["node", "index.js"]
