FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# We use next dev in docker-compose for development ease, or build for production
EXPOSE 3000

CMD ["npm", "run", "dev"]
