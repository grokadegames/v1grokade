const fs = require('fs');
const path = require('path');

console.log('🔄 Running post-build setup...');

// Skip standalone setup if running on Netlify
if (process.env.NETLIFY) {
  console.log('📌 Running on Netlify, skipping standalone setup');
  process.exit(0);
}

// Only for Railway and other non-Netlify deployments
console.log('📌 Running standalone setup for Railway deployment');

// Directories to ensure exist
const staticDir = path.join('.next/standalone/.next/static');
const publicDir = path.join('.next/standalone/public');

// Ensure public directory exists
if (!fs.existsSync(publicDir)) {
  console.log('📁 Creating public directory in standalone output');
  fs.mkdirSync(publicDir, { recursive: true });
}

// Ensure static directory exists
if (!fs.existsSync(staticDir)) {
  console.log('📁 Creating static directory in standalone output');
  fs.mkdirSync(staticDir, { recursive: true });
}

// Copy static assets to standalone directory if needed
if (fs.existsSync('.next/static') && fs.readdirSync('.next/static').length > 0) {
  console.log('📦 Copying static assets to standalone directory');
  fs.cpSync('.next/static', '.next/standalone/.next/static', { recursive: true });
}

// Copy public directory to standalone directory if it exists
if (fs.existsSync('public') && fs.readdirSync('public').length > 0) {
  console.log('📦 Copying public assets to standalone directory');
  fs.cpSync('public', '.next/standalone/public', { recursive: true });
}

console.log('✅ Post-build setup complete!'); 