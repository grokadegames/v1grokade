#!/bin/bash

echo "🔧 Starting Netlify build process..."

# Clean any previous builds
echo "Cleaning previous builds..."
rm -rf .next
rm -rf node_modules/.cache

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Ensure Next.js can find Prisma
echo "NETLIFY_NEXT_PLUGIN_SKIP=false" >> .env

# Build the application
echo "Building Next.js application..."
npm run build

# Verify build artifacts
echo "Verifying build artifacts..."
if [ -d ".next" ]; then
  echo "✅ Build successful: .next directory exists"
else
  echo "❌ Build failed: .next directory does not exist"
  exit 1
fi

# Create a placeholder for Netlify functions
mkdir -p netlify/functions

# Create a simple test function to ensure API functionality
cat > netlify/functions/test.js << 'EOL'
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Netlify Functions working",
      timestamp: new Date().toISOString()
    })
  };
}
EOL

echo "✅ Netlify build process completed!" 