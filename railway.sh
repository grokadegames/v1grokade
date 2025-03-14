#!/bin/bash

echo "🚀 Starting Railway build process..."

# Install all dependencies including date-fns
echo "📦 Installing dependencies..."
npm install
npm install date-fns --no-save

# Clean .next directory to ensure fresh build
echo "🧹 Cleaning .next directory..."
rm -rf .next

# Build the application
echo "🏗️ Building the Next.js application..."
npm run build

# Verify build success
if [ -d ".next" ]; then
  echo "✅ Build completed successfully!"
else
  echo "❌ Build failed! .next directory not found."
  exit 1
fi 