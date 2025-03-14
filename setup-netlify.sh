#!/bin/bash

echo "🚀 Setting up Netlify for Next.js integration..."

# Install Netlify CLI if not already installed
if ! command -v netlify &> /dev/null; then
    echo "Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Install Netlify Next.js plugin
echo "Installing @netlify/plugin-nextjs..."
npm install -D @netlify/plugin-nextjs

# Create necessary directories
mkdir -p netlify/functions

# Update package.json to add postinstall for Next.js plugin
if ! grep -q "\"postinstall\":" package.json; then
    echo "Adding postinstall script to package.json..."
    sed -i.bak 's/"scripts": {/"scripts": {\n    "postinstall": "next-on-netlify",/g' package.json
    rm package.json.bak
fi

echo "✅ Netlify setup completed! Now you can run ./deploy-netlify.sh to deploy." 