# Stage 1: Build & Dependency Stage (Node.js Alpine environment)
FROM node:18-alpine AS builder

WORKDIR /app

# Cache node_modules using package.json
COPY package*.json ./
RUN npm ci --only=production

# Copy all source files for compilation/validation
COPY . .

# Stage 2: Minimal Runtime Stage (Node.js Alpine environment)
FROM node:18-alpine

WORKDIR /app

# Copy production node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy only runtime source files to reduce image size and attack surface
COPY controllers ./controllers
COPY data ./data
COPY database ./database
COPY models ./models
COPY routers ./routers
COPY index.js ./index.js
COPY package.json ./package.json

EXPOSE 9000

# Run Node directly instead of using npm start to avoid spawning extra processes
CMD ["node", "index.js"]
