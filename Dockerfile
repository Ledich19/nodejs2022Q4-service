FROM node 

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY . .

RUN yarn prisma:generate

EXPOSE 3000

CMD ["nest", "start"]

# stage 2

FROM node:18-alpine

WORKDIR /usr/app  

COPY --from=builder /usr/app/dist ./dist

COPY --from=builder /usr/app/node_modules ./node_modules/

COPY --from=builder /usr/app/package*.json ./

COPY .env .

EXPOSE 3000

CMD node dist/main.js