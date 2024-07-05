FROM node:22-alpine

WORKDIR /code

COPY ./package.json /code/package.json

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview"]