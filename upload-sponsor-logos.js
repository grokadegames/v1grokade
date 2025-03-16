#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { v2: cloudinary } = require('cloudinary');
const { promisify } = require('util');
const { execSync } = require('child_process');

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dxow1rafl',
  api_key: '189369456186199',
  api_secret: '31EANFqVf28WcdN3p7IE2_q-wtw'
});

// Create temp directory for downloaded logos
const tempDir = path.join(__dirname, 'temp-logos');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Logo sources with their file names
const logoSources = [
  { url: 'https://laravel.com/img/logomark.min.svg', filename: 'laravel-logo.svg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png', filename: 'react-logo.png' },
  { url: 'https://nodejs.org/static/images/logo-hexagon-card.png', filename: 'nodejs-logo.png' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1280px-Amazon_Web_Services_Logo.svg.png', filename: 'aws-logo.png' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/DigitalOcean_logo.svg/1200px-DigitalOcean_logo.svg.png', filename: 'digitalocean-logo.png' },
  { url: 'https://www.mongodb.com/assets/images/global/leaf.png', filename: 'mongodb-logo.png' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png', filename: 'stripe-logo.png' },
  { url: 'https://www.gstatic.com/devrel-devsite/prod/v2210deb8920cd4a55bd580441aa58e7853afc04b39a9d9ac4198e1cd7fbe04ef/cloud/images/favicons/onecloud/apple-icon.png', filename: 'google-logo.png' },
  { url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', filename: 'github-logo.png' },
  { url: 'https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png', filename: 'docker-logo.png' },
  { url: 'https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png', filename: 'apple-logo.png' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/1200px-Npm-logo.svg.png', filename: 'npm-logo.png' },
  { url: 'https://www.python.org/static/community_logos/python-logo-generic.png', filename: 'python-logo.png' },
  { url: 'https://assets.ubuntu.com/v1/29985a98-ubuntu-logo32.png', filename: 'ubuntu-logo.png' }
];

// Function to download a file
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    https.get(url, response => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', err => {
      fs.unlink(destination, () => {}); // Delete the file if there's an error
      reject(err);
    });
  });
}

// Function to upload a file to Cloudinary
async function uploadToCloudinary(filepath, publicId) {
  try {
    const result = await cloudinary.uploader.upload(filepath, {
      public_id: publicId,
      folder: 'sponsors',
      overwrite: true
    });
    return result;
  } catch (error) {
    console.error(`Error uploading ${filepath}:`, error);
    throw error;
  }
}

// Main function
async function main() {
  console.log('Starting download and upload process...');
  
  try {
    // Download all logos
    for (const logo of logoSources) {
      try {
        const destination = path.join(tempDir, logo.filename);
        console.log(`Downloading ${logo.url} to ${destination}...`);
        await downloadFile(logo.url, destination);
      } catch (error) {
        console.error(`Error downloading ${logo.url}: ${error.message}`);
        // Continue with the next logo
      }
    }
    
    console.log('Logos download process completed.');
    
    // Upload logos to Cloudinary
    const successfulUploads = [];
    
    for (const logo of logoSources) {
      try {
        const filepath = path.join(tempDir, logo.filename);
        if (!fs.existsSync(filepath)) {
          console.log(`Skipping ${logo.filename} as it was not downloaded successfully.`);
          continue;
        }
        
        const publicId = path.parse(logo.filename).name;
        console.log(`Uploading ${filepath} to Cloudinary as sponsors/${publicId}...`);
        const result = await uploadToCloudinary(filepath, publicId);
        console.log(`Uploaded ${logo.filename} to ${result.secure_url}`);
        successfulUploads.push(logo);
      } catch (error) {
        console.error(`Error uploading ${logo.filename}: ${error.message}`);
        // Continue with the next logo
      }
    }
    
    console.log(`${successfulUploads.length} of ${logoSources.length} logos uploaded to Cloudinary successfully.`);
    
    // Clean up temp directory
    try {
      fs.rmdirSync(tempDir, { recursive: true });
      console.log('Cleaned up temporary files.');
    } catch (error) {
      console.error('Error cleaning up temporary files:', error.message);
    }
    
    // Update database with correct URLs
    console.log('Running seed script to update database with Cloudinary URLs...');
    execSync('npx prisma db seed', { stdio: 'inherit' });
    
    console.log('Process complete! Sponsor logos are now available in Cloudinary.');
  } catch (error) {
    console.error('Error during process:', error);
    process.exit(1);
  }
}

main(); 