# Static docs image for Dokploy / any container host.
# Build from monorepo root:
#   docker build -f apps/docs/Dockerfile -t base-ui-svelte-docs .
#
# Pass your public docs URL so sitemap / OG / llms.txt get correct absolute links:
#   --build-arg PUBLIC_SITE_ORIGIN=https://docs.example.com

# syntax=docker/dockerfile:1

FROM oven/bun:1.3.14-alpine AS build
WORKDIR /app

COPY package.json bun.lock bunfig.toml ./
COPY apps/docs/package.json ./apps/docs/
COPY packages/svelte/package.json ./packages/svelte/
COPY packages/styles/package.json ./packages/styles/

RUN bun install --frozen-lockfile

COPY apps/docs ./apps/docs
COPY packages/svelte ./packages/svelte
COPY packages/styles ./packages/styles

ARG PUBLIC_SITE_ORIGIN=http://localhost
ENV PUBLIC_SITE_ORIGIN=$PUBLIC_SITE_ORIGIN

RUN bun run build && bun run docs:build

FROM nginx:1.27-alpine AS runtime
COPY apps/docs/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/docs/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
