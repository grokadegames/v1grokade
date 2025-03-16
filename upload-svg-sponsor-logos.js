#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { v2: cloudinary } = require('cloudinary');
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

// Logo sources with their file names (using SVGs where possible)
const logoSources = [
  { url: 'https://laravel.com/img/logomark.min.svg', filename: 'laravel-logo.svg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg', filename: 'react-logo.svg' },
  { url: 'https://nodejs.org/static/images/logo.svg', filename: 'nodejs-logo.svg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg', filename: 'aws-logo.svg' },
  { url: 'https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/SVG/DO_Logo_vertical_blue.svg', filename: 'digitalocean-logo.svg' },
  { url: 'https://cdn.worldvectorlogo.com/logos/mongodb-icon-1.svg', filename: 'mongodb-logo.svg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg', filename: 'stripe-logo.svg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Google_Cloud_Logo.svg', filename: 'google-logo.svg' },
  { url: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.svg', filename: 'github-logo.svg' },
  { url: 'https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png', filename: 'docker-logo.png' }, // No SVG available
  { url: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', filename: 'apple-logo.svg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg', filename: 'npm-logo.svg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg', filename: 'python-logo.svg' },
  { url: 'https://assets.ubuntu.com/v1/8114528b-ubuntu-logo.svg', filename: 'ubuntu-logo.svg' }
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
    // Check if file is an SVG
    const isSvg = filepath.toLowerCase().endsWith('.svg');
    
    const result = await cloudinary.uploader.upload(filepath, {
      public_id: publicId,
      folder: 'sponsors',
      overwrite: true,
      resource_type: 'image' // Required for SVGs
    });
    return result;
  } catch (error) {
    console.error(`Error uploading ${filepath}:`, error);
    
    // If SVG upload fails, try to convert to PNG and upload that instead
    if (filepath.toLowerCase().endsWith('.svg')) {
      try {
        console.log(`SVG upload failed for ${filepath}, falling back to PNG...`);
        
        // Try to find a PNG fallback
        const pngFallbacks = {
          'react-logo.svg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png',
          'nodejs-logo.svg': 'https://nodejs.org/static/images/logo-hexagon-card.png',
          'aws-logo.svg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1280px-Amazon_Web_Services_Logo.svg.png',
          'digitalocean-logo.svg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/DigitalOcean_logo.svg/1200px-DigitalOcean_logo.svg.png',
          'mongodb-logo.svg': 'https://www.mongodb.com/assets/images/global/leaf.png',
          'stripe-logo.svg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png',
          'google-logo.svg': 'https://www.gstatic.com/devrel-devsite/prod/v2210deb8920cd4a55bd580441aa58e7853afc04b39a9d9ac4198e1cd7fbe04ef/cloud/images/favicons/onecloud/apple-icon.png',
          'github-logo.svg': 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
          'apple-logo.svg': 'https://www.apple.com/ac/structured-data/images/knowledge_graph_logo.png',
          'npm-logo.svg': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Npm-logo.svg/1200px-Npm-logo.svg.png',
          'python-logo.svg': 'https://www.python.org/static/community_logos/python-logo-generic.png',
          'ubuntu-logo.svg': 'https://assets.ubuntu.com/v1/29985a98-ubuntu-logo32.png'
        };
        
        const filename = path.basename(filepath);
        if (pngFallbacks[filename]) {
          const pngFilepath = filepath.replace('.svg', '.png');
          await downloadFile(pngFallbacks[filename], pngFilepath);
          const pngResult = await cloudinary.uploader.upload(pngFilepath, {
            public_id: publicId,
            folder: 'sponsors',
            overwrite: true
          });
          console.log(`Fallback to PNG successful for ${filename}`);
          return pngResult;
        }
      } catch (pngError) {
        console.error(`PNG fallback also failed for ${filepath}:`, pngError);
      }
    }
    
    throw error;
  }
}

// Main function
async function main() {
  console.log('Starting download and upload process for SVG logos...');
  
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
        successfulUploads.push({
          ...logo,
          cloudinaryUrl: result.secure_url
        });
      } catch (error) {
        console.error(`Error uploading ${logo.filename}: ${error.message}`);
        // Continue with the next logo
      }
    }
    
    console.log(`${successfulUploads.length} of ${logoSources.length} logos uploaded to Cloudinary successfully.`);
    
    // Update prisma/seed.js with the correct file extensions
    console.log('Updating seed.js with correct file extensions...');
    
    // Generate a map of logo names to their extensions
    const logoExtensionMap = {};
    successfulUploads.forEach(logo => {
      const extension = path.extname(logo.cloudinaryUrl).toLowerCase();
      const name = path.parse(logo.filename).name;
      logoExtensionMap[name] = extension;
    });
    
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
    
    console.log('Process complete! SVG sponsor logos are now available in Cloudinary.');
  } catch (error) {
    console.error('Error during process:', error);
    process.exit(1);
  }
}

main(); 