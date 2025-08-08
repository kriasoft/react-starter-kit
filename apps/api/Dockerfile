# Dockerfile for the tRPC API Server
# docker build --tag api:latest -f ./apps/api/Dockerfile .
# https://bun.com/guides/ecosystem/docker
# https://docs.docker.com/guides/bun/containerize/

FROM oven/bun:slim

# Install dumb-init and jq for proper signal handling and JSON processing
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init jq && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV NODE_ENV=production

# Set working directory
WORKDIR /usr/src/app

# Copy package files for better layer caching
COPY ./apps/api/package.json ./package.json

# Remove workspace dependencies from package.json
# Workspace dependencies like "workspace:*" or "workspace:^1.0.0" cannot be resolved
# inside Docker since the workspace packages aren't available in the container context.
# This jq command filters out any dependency where the version starts with "workspace:"
# from both dependencies and devDependencies sections
RUN jq '.dependencies |= with_entries(select(.value | startswith("workspace:") | not)) | \
    .devDependencies |= with_entries(select(.value | startswith("workspace:") | not))' \
    package.json > package.tmp.json && \
    mv package.tmp.json package.json

# Install production dependencies only
# Using --production flag to exclude devDependencies
RUN bun install --production

# Copy pre-built server files from dist directory
# The build process should be done outside of Docker
# Note: Run `bun --filter @repo/api build` before building the Docker image
# This bundles all dependencies including workspace packages into dist/index.js
COPY --chown=bun:bun ./apps/api/dist ./dist

# Verify dist directory exists and has content
RUN test -f ./dist/index.js || (echo "Error: dist/index.js not found" && exit 1)

# Switch to non-root user
USER bun

# Expose the port your server runs on (default: 8080)
EXPOSE 8080

# Run the server using dumb-init for proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["bun", "dist/index.js"]
