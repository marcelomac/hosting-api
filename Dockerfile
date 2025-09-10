# Etapa 1: build da aplicação
FROM node:24-alpine AS builder

WORKDIR /app

# Copia arquivos de dependência e instala as dependências de produção
COPY package*.json prisma ./  
#RUN npm ci --omit=dev
RUN npm ci

# Copia o restante do código
COPY . .

# Gera Prisma Client
RUN npx prisma generate

# Compila o código TypeScript
RUN npm run build

# Etapa 2: imagem final enxuta
FROM node:24-alpine

WORKDIR /app

# Instala Chromium e dependências essenciais para headless
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    dumb-init \
    udev

# Define variáveis do Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    NODE_ENV=production

# Copia dependências, código compilado e migrações
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

# Executa migrações e inicia a API
CMD npx prisma migrate deploy && node dist/main.js

# Expor a porta 3003 para acessar a aplicação
EXPOSE 3003