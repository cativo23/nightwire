FROM node:22-alpine AS builder

# Build context is repo root. Keep docs/ as working dir for npm ci + build.
WORKDIR /app
COPY docs/package*.json ./
RUN npm ci
COPY docs/ .
# Root package.json for Vite version injection (vite.config.ts reads ../package.json)
COPY package.json /package.json
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Copy examples and root CSS (not in docs/ build context, must come from repo root)
COPY examples/ /usr/share/nginx/html/examples/
COPY nightwire.css /usr/share/nginx/html/nightwire.css
COPY docs/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
