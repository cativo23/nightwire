FROM node:24-alpine AS builder

# Build context is the repo root. The docs app lives at /app/apps/docs and reads the
# generated root artifacts from /app: package.json (version), nightwire.css, tailwind.preset.js.
WORKDIR /app/apps/docs
COPY apps/docs/package*.json ./
RUN npm ci
COPY apps/docs/ ./
COPY package.json nightwire.css tailwind.preset.js /app/
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/apps/docs/dist /usr/share/nginx/html
# Examples and the stylesheet are served next to the SPA, straight from the repo root.
COPY examples/ /usr/share/nginx/html/examples/
COPY nightwire.css /usr/share/nginx/html/nightwire.css
COPY apps/docs/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
