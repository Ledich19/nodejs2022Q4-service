FROM node:alpine As development
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate
COPY . .

FROM development AS build
RUN npm run build
RUN npm ci --omit=dev
RUN npm cache clean --force

FROM node:alpine As production
COPY --from=build /usr/src/app/.env ./
COPY --from=build /usr/src/app/prisma ./prisma/
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
EXPOSE ${PORT}

CMD ["sh", "-c", "until nc -z dev-db 5432; do echo 'Waiting for database to become available...'; sleep 1; done; npx prisma migrate dev && node dist/src/main.js"]

