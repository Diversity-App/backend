FROM node:lastest as build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM node:lastest as run

WORKDIR /app

COPY --from=build build .
COPY --from=build package.json .
COPY --from=build .env .

RUN npm install

CMD ["npm", "start"]