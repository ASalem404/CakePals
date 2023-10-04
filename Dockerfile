FROM node:14 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:14-alpine
WORKDIR /app
COPY --from=build /app/ ./
CMD ["npm", "run", "start"]
