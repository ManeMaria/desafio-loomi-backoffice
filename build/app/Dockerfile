# -------------->
FROM node:16.13-alpine as installer

USER node

WORKDIR /home/node

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node src/main/infra/prisma/schema.prisma ./prisma/

## tentar--schema= /home/node/src/main/infra/prisma/schema.prisma
RUN npx prisma migrate deploy --schema=src/main/infra/prisma/schema.prisma

RUN npx prisma generate

# -------------->
FROM node:16.13-alpine as builder

USER node

WORKDIR /home/node

COPY --chown=node:node --from=installer /home/node/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build

# -------------->
FROM node:16.13-alpine as runner

RUN apk add dumb-init

ENV NODE_ENV 'production'

USER node

WORKDIR /home/node

COPY --chown=node:node --from=installer /home/node/node_modules ./node_modules
COPY --chown=node:node --from=builder /home/node/dist ./dist
COPY --chown=node:node src/main/infra/prisma/migrations ./migrations
COPY --chown=node:node src/main/infra/prisma/schema.prisma ./
COPY --chown=node:node package.json ./
COPY --chown=node:node wait-for.sh ./


CMD [ "dumb-init", "node", "dist/main/server.js"]
