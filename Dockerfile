# ─── Stage 1: Install dependencies ────────────────────────────────────────────
FROM oven/bun:1 AS deps

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ─── Stage 2: Build ────────────────────────────────────────────────────────────
FROM deps AS builder

COPY . .

# PUBLIC_DIRECTUS_URL must be available at build time for $env/static/public
ARG PUBLIC_DIRECTUS_URL=https://cms.progetta.ch
ENV PUBLIC_DIRECTUS_URL=$PUBLIC_DIRECTUS_URL

RUN bun run build

# ─── Stage 3: Production runtime ───────────────────────────────────────────────
FROM oven/bun:1-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy only the built output and production dependencies
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["bun", "build/index.js"]
