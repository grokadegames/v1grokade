#!/bin/bash

# Display Node and NPM versions
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Clean install dependencies
npm ci

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Build the Next.js app
echo "Building Next.js app..."
npm run build

echo "Build completed successfully!" 