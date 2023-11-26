# Use uma imagem mais leve do node para a fase de instalação
FROM node:16.13-alpine as installer

# Defina o usuário e o diretório de trabalho
USER node
WORKDIR /home/node

# Copie apenas os arquivos necessários para a instalação
COPY --chown=node:node package*.json ./

# Instale as dependências
RUN npm ci

# Copie o schema.prisma para o diretório prisma/
COPY --chown=node:node src/main/infra/prisma/schema.prisma ./prisma/

# Gere o Prisma Client
RUN npx prisma generate

# Use a mesma imagem leve do node para a fase de construção
FROM node:16.13-alpine as builder

# Defina o usuário e o diretório de trabalho
USER node
WORKDIR /home/node

# Copie apenas os arquivos necessários para a construção
COPY --chown=node:node --from=installer /home/node/node_modules ./node_modules
COPY --chown=node:node . .

# Execute o script de construção
RUN npm run build

# Use a mesma imagem leve do node para a fase de execução
FROM node:16.13-alpine as runner

# Instale o 'dumb-init'
RUN apk add dumb-init

# Configure as variáveis de ambiente
ENV NODE_ENV 'production'

# Defina o usuário e o diretório de trabalho
USER node
WORKDIR /home/node

# Copie apenas os arquivos necessários para a execução
COPY --chown=node:node --from=installer /home/node/node_modules ./node_modules
COPY --chown=node:node --from=builder /home/node/dist ./dist
COPY --chown=node:node src/main/infra/prisma/migrations ./migrations
COPY --chown=node:node src/main/infra/prisma/schema.prisma ./
COPY --chown=node:node package.json ./
COPY --chown=node:node wait-for.sh ./

# Use 'dumb-init' para iniciar o servidor
CMD [ "dumb-init", "node", "dist/main/server.js"]
