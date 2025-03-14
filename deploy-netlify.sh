#!/bin/bash

echo "🚀 Starting Netlify deployment..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Install the Next.js Netlify plugin
echo "Installing @netlify/plugin-nextjs..."
npm install -D @netlify/plugin-nextjs

# Clean .next directory to ensure fresh build
echo "Cleaning build directories..."
rm -rf .next
rm -rf node_modules/.cache

# Build the application
echo "Building the application..."
npm run build

# Set up environment variables
echo "Setting up environment variables..."
netlify env:set DATABASE_URL "$DATABASE_URL" --scope production
netlify env:set JWT_SECRET "$JWT_SECRET" --scope production

# Create Netlify config if not exists
echo "Ensuring Netlify configuration is in place..."
if [ ! -f netlify.toml ]; then
  echo "Creating netlify.toml..."
  cat > netlify.toml << 'EOL'
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build]
  command = "npm run build"
  publish = ".next"
EOL
fi

# Deploy to Netlify with full control flags
echo "Deploying to Netlify..."
netlify deploy --prod --build --debug

echo "✅ Deployment completed!" 