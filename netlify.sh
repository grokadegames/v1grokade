#!/bin/bash

# Display Node and NPM versions
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Clean install dependencies
npm ci

# Generate Prisma client
npm run prisma:generate

# Build the Next.js app
npm run build

echo "Build completed successfully!" 