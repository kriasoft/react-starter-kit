# Dockerfile for the tRPC API Server
# docker build --tag server:latest -f ./server/Dockerfile .
# https://bun.com/guides/ecosystem/docker
# https://docs.docker.com/guides/bun/containerize/

FROM oven/bun:slim

# Install dumb-init and jq for proper signal handling and JSON processing
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init jq && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy package files for better layer caching
COPY ./server/package.json ./package.json

# Remove workspace dependencies from package.json
# This allows bun install to work without the workspace packages
RUN jq '.dependencies |= with_entries(select(.value | startswith("workspace:") | not))' \
    package.json > package.tmp.json && \
    mv package.tmp.json package.json

# Install production dependencies only
# Using --production flag to exclude devDependencies
RUN bun install --production

# Copy pre-built server files from dist directory
# The build process should be done outside of Docker
COPY --chown=bun:bun ./server/dist ./dist

# Switch to non-root user
USER bun

# Expose the port your server runs on (default: 8080)
EXPOSE 8080

# Run the server using dumb-init for proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["bun", "dist/index.js"]
