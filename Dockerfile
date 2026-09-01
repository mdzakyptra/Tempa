# Multi-stage build buat backend NestJS doang (frontend deploy terpisah,
# lihat CLAUDE.md). Build context WAJIB root repo (bukan apps/backend) —
# monorepo npm workspaces cuma punya satu lockfile di root.

# ---------- deps: install semua dependency workspace backend ----------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
RUN npm ci --workspace=apps/backend --include-workspace-root

# ---------- build: generate Prisma client + compile NestJS ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY apps/backend apps/backend
RUN npm run prisma:generate --workspace=apps/backend
RUN npm run build --workspace=apps/backend

# ---------- production: image slim, cuma runtime deps ----------
FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
RUN npm ci --workspace=apps/backend --include-workspace-root --omit=dev

# dist & generated (Prisma client hasil generate) — bukan paket npm, jadi
# harus disalin manual dari stage build, gak ke-install lewat npm ci.
COPY --from=build /app/apps/backend/dist apps/backend/dist
COPY --from=build /app/apps/backend/generated apps/backend/generated

EXPOSE 3000
CMD ["node", "apps/backend/dist/src/main"]
