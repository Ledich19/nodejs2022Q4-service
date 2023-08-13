FROM node:alpine As development
WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate
COPY . .

FROM node:alpine As build
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .

# RUN npx prisma generate
# RUN npx prisma migrate dev 
RUN npm run build

#RUN npm ci --omit=dev
#RUN npm cache clean --force

# FROM node:alpine As production
# COPY --from=build /usr/src/app/package*.json ./
# COPY --from=build /usr/src/app/.env ./
# COPY --from=build /usr/src/app/prisma ./prisma/
# COPY --from=build /usr/src/app/node_modules ./node_modules
# COPY --from=build /usr/src/app/dist ./dist

EXPOSE ${PORT}

#CMD ["npx", "prisma", "migrate", "dev", "&&", "npm" ,"run","start" ]
#CMD [ "node", "dist/src/main.js" ]
# CMD npx prisma migrate dev && npm run start:dev
CMD ["sh", "-c", "until nc -z dev-db 5432; do echo 'Waiting for database to become available...'; sleep 1; done; npx prisma migrate dev && npm run start:dev"]

