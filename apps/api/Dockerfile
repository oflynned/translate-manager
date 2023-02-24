FROM node:18.0-alpine

WORKDIR /app

COPY . .

RUN pnpm i --production --frozen-lockfile
RUN npx nx build api

COPY ./dist/ ./dist
COPY ./node_modules ./node_modules

ENV NODE_ENV production

CMD ["node", "dist/main.js"]