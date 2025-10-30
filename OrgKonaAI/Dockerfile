# Set versions as build arguments
ARG NODE_VERSION=22.14.0-alpine
ARG NGINX_VERSION=stable-alpine

# Builder Stage: Build the NX App
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

COPY OrgKonaAI/package.json OrgKonaAI/package-lock.json ./
# Install dependencies
RUN npm ci
# Copy the rest of the source code
COPY OrgKonaAI .
# Build the NX app (adjust if you have multiple apps)
RUN npx nx build KonaAI2 --configuration=production


FROM nginx:${NGINX_VERSION}

# Clean default NGINX HTML folder
RUN rm -rf /usr/share/nginx/html/*

# Copy built app from builder
COPY --from=builder /app/dist/apps/KonaAI2/browser /usr/share/nginx/html

# Copy custom NGINX config (adjust path if needed)
COPY --from=builder /app/nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the container
EXPOSE 80

# Start NGINX in foreground
CMD ["nginx", "-g", "daemon off;"]
