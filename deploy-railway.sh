#!/bin/bash

# Ensure you have Railway CLI installed
echo "Checking if Railway CLI is installed..."
if ! command -v railway &> /dev/null; then
    echo "Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Login to Railway (if not already logged in)
echo "Ensuring you're logged into Railway..."
railway login

# Build the project
echo "Building the project..."
npm run build

# Deploy to Railway
echo "Deploying to Railway..."
railway up

echo "Deployment completed!" 