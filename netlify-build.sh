#!/bin/bash
set -e

echo "=== Netlify Build Script ==="

# Print environment info
echo "NODE_VERSION: $(node -v)"
echo "NPM_VERSION: $(npm -v)"

# Check DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  echo "WARNING: DATABASE_URL environment variable is not set!"
else
  echo "DATABASE_URL is set (length: ${#DATABASE_URL})"
fi

# Generate Prisma client
echo "=== Running Prisma Generate ==="
npx prisma generate

# Build Next.js app
echo "=== Running Next.js Build ==="
npm run build

echo "=== Build Completed Successfully ===" 