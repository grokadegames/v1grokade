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
echo "Building Next.js app with export..."
npm run build

# If build was successful, copy necessary files for static hosting
if [ -d ".next" ]; then
  echo "Build completed successfully!"
  
  # Create an index.html at the root of .next for static hosting
  echo "<html><head><meta http-equiv='refresh' content='0;url=/_next/static/chunks/pages/index.html'></head></html>" > .next/index.html
  
  echo "Prepared for static deployment!"
else
  echo "Build failed: .next directory not found"
  exit 1
fi 