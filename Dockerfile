FROM node:latest as build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM node:latest as run

WORKDIR /app

COPY --from=build /app/dist ./src
COPY --from=build /app/package.json .
COPY --from=build /app/.env .

RUN npm install

CMD ["npm", "start"]
