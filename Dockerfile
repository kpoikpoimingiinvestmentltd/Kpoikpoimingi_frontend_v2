# Production image for Railway
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS build
WORKDIR /app
COPY . .

# Vite inlines these at build time. Set them in Railway Variables (available during Docker build).
# Do not rely on a committed .env — local localhost URLs must not ship to production.
ARG VITE_API_URL=https://api.kpoikpoimingi.com/api
ARG VITE_EXTERNAL_API_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_EXTERNAL_API_KEY=$VITE_EXTERNAL_API_KEY

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist
COPY scripts ./scripts

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
