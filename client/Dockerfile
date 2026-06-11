# Stage 1: Build stage (Node.js Alpine environment)
FROM node:18-alpine AS build

WORKDIR /app

# Leverage Docker layer caching for node_modules
COPY package*.json ./
RUN npm ci

# Copy application source code and compile
COPY . .
ENV REACT_APP_BASE_URL=/api/
RUN npm run build

# Stage 2: Web server runtime stage (Nginx Alpine environment)
FROM nginx:1.25-alpine

# Copy static assets from build stage to Nginx default folder
COPY --from=build /app/build /usr/share/nginx/html

# Configure SPA routing on port 3000 (proxied by main Nginx gateway)
RUN echo 'server { \
    listen 3000; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
