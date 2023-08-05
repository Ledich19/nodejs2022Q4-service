FROM node:alpine

WORKDIR /app

RUN npm install prisma --save-dev
RUN npx prisma generate

COPY package*.json ./
COPY prisma ./prisma/  

RUN npm ci

COPY . .
RUN npm run build


EXPOSE ${PORT}

CMD [ "npm", "start" ]


