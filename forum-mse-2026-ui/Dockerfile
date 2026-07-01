# syntax=docker/dockerfile:1.6
#
# Multi-stage build for the Forum MSE 2026 UI.
# Stage 1 builds the Angular app with Node.
# Stage 2 serves the static output with nginx and proxies /api/* to the backend.
# Kept intentionally simple for teaching.

# ---------- build stage ----------
FROM node:22-alpine AS build
WORKDIR /app

# Install dependencies first (better layer caching).
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the sources and produce a production build.
COPY . .
RUN npm run build:prod

# ---------- runtime stage ----------
FROM nginx:1.27-alpine AS runtime

# Static assets produced by `ng build`.
COPY --from=build /app/dist/forum-mse-2026-ui/browser /usr/share/nginx/html

# nginx server config (SPA fallback + /api/* proxy).
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Entrypoint rewrites /usr/share/nginx/html/config.js from BACKEND_BASE_URL
# at container start. This lets the same image talk to any backend.
COPY nginx/docker-entrypoint.sh /docker-entrypoint.d/40-runtime-config.sh
RUN chmod +x /docker-entrypoint.d/40-runtime-config.sh

EXPOSE 80
# The base nginx image already defines CMD and an entrypoint that runs
# every /docker-entrypoint.d/*.sh before starting nginx. Nothing else needed.
