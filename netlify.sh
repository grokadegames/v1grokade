#!/bin/bash

# Display Node and NPM versions
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Clean install dependencies
echo "Installing dependencies..."
npm ci

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Clean .next directory if exists
echo "Cleaning previous build..."
rm -rf .next

# Build the Next.js app
echo "Building Next.js app..."
npm run build

# Check if .next directory was created
if [ -d ".next" ]; then
  echo "Build completed successfully!"
  
  # Run our build check script
  echo "Checking build output..."
  node check-build.js
else
  echo "Build failed: .next directory not found"
  exit 1
fi 