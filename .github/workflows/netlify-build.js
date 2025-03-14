// This script helps with building the application for Netlify deployment
// It handles environment variables and ensuring all necessary steps are performed

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Log function with timestamp
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

try {
  log('Starting Netlify build process');
  
  // Check for required environment variables
  const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  // Clean build directories
  log('Cleaning build directories');
  if (fs.existsSync(path.join(process.cwd(), '.next'))) {
    execSync('rm -rf .next');
  }
  
  // Run the build
  log('Building Next.js application');
  execSync('npm run build', { stdio: 'inherit' });
  
  log('Build completed successfully');
  process.exit(0);
} catch (error) {
  log(`Error during build: ${error.message}`);
  process.exit(1);
} 