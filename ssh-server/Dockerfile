# Multi-stage build for minimal production image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application files
COPY . .

# Generate host key if not exists (will be overridden by volume mount in production)
RUN if [ ! -f host.key ]; then \
      apk add --no-cache openssh-keygen && \
      ssh-keygen -t rsa -b 4096 -f host.key -N "" && \
      apk del openssh-keygen; \
    fi

# Expose SSH port
EXPOSE 22

# Run as non-root user (except we need root for port 22)
# For production, use port 22 with root or use setcap
USER root

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD nc -z localhost ${SSH_PORT:-22} || exit 1

# Start server
CMD ["node", "server.js"]
