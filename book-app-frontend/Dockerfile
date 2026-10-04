FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

ENV VITE_API_URL=http://backend:8443/api

CMD ["npm", "run", "dev"]
