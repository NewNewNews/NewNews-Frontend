FROM node:18-bullseye-slim

# Set working directory
WORKDIR /usr/app

# Install pnpm globally
RUN npm install -g pnpm

# Install PM2 globally
RUN npm install --global pm2

# Copy "pnpm-lock.yaml" and "package.json" before other files
COPY ./pnpm-lock.yaml ./package.json ./

# Install ALL dependencies (including dev dependencies)
RUN pnpm install --frozen-lockfile

# Copy all files
COPY ./ ./

# Build app
RUN pnpm run build

# Remove dev dependencies
RUN pnpm prune --prod

# Expose the listening port
EXPOSE 3000

# Run container as non-root (unprivileged) user
USER node

# Launch app with PM2
CMD [ "pm2-runtime", "start", "pnpm", "--", "start" ]


# FROM keymetrics/pm2:latest-alpine

# # Install pnpm globally
# RUN npm install -g pnpm

# # Set working directory
# WORKDIR /usr/app

# # Copy package files first for better caching
# COPY pnpm-lock.yaml ./
# COPY package.json ./
# COPY ecosystem.config.js ./

# # Install app dependencies
# ENV NPM_CONFIG_LOGLEVEL warn
# RUN pnpm install --frozen-lockfile --prod

# # Copy source code
# COPY src src/

# # Show current folder structure in logs
# RUN ls -al -R

# # Expose the listening port
# EXPOSE 3000

# CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]