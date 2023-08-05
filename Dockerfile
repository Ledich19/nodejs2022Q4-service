FROM node:alpine As development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:alpine As build

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/  
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .

RUN npm run build

RUN npm ci --only=production
RUN npm cache clean --force

FROM node:alpine As production

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
EXPOSE ${PORT}

CMD [ "node", "dist/src/main.js" ]




