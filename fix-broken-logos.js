#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { v2: cloudinary } = require('cloudinary');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dxow1rafl',
  api_key: '189369456186199',
  api_secret: '31EANFqVf28WcdN3p7IE2_q-wtw'
});

// Create temp directory for downloaded logos
const tempDir = path.join(__dirname, 'temp-logos-fix');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Logo sources with their file names (using better sources for Docker and Google Cloud)
const logoSources = [
  { 
    name: 'Docker',
    url: 'https://www.docker.com/wp-content/uploads/2022/03/Docker-Logo-White-RGB_Moby.png', 
    filename: 'docker-logo.png',
    description: 'Container platform',
    website: 'https://docker.com'
  },
  { 
    name: 'Google Cloud',
    url: 'https://www.gstatic.com/devrel-devsite/prod/v4f875a1b81b7f452d4ad95ddc2e0847267daa183c4c8ac6d28382578a5dac94a/cloud/images/cloud-logo.svg', 
    filename: 'google-logo.svg',
    description: 'Cloud services partner',
    website: 'https://cloud.google.com'
  }
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
        
        // Hard-coded fallbacks for the specific logos we're fixing
        const pngFallbacks = {
          'google-logo.svg': 'https://cloud.google.com/images/social-icon-google-cloud-1200-630.png'
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

// Update database with new logo URL
async function updateSponsorLogo(name, logoUrl) {
  try {
    // Find the sponsor by name
    const sponsor = await prisma.sponsor.findFirst({
      where: { name }
    });

    if (!sponsor) {
      console.error(`Sponsor ${name} not found in database`);
      return false;
    }

    // Update the sponsor with the new logo URL
    const result = await prisma.sponsor.update({
      where: { id: sponsor.id },
      data: { logoUrl }
    });

    console.log(`Updated ${name} logo in database`);
    return true;
  } catch (error) {
    console.error(`Error updating ${name} in database:`, error);
    return false;
  }
}

// Main function
async function main() {
  console.log('Starting fix for broken logos...');
  
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
    
    // Upload logos to Cloudinary and update database
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
        
        // Update database with new URL
        const updateResult = await updateSponsorLogo(logo.name, result.secure_url);
        if (updateResult) {
          console.log(`Successfully updated ${logo.name} logo in database`);
        }
      } catch (error) {
        console.error(`Error processing ${logo.filename}: ${error.message}`);
        // Continue with the next logo
      }
    }
    
    // Clean up temp directory
    try {
      fs.rmdirSync(tempDir, { recursive: true });
      console.log('Cleaned up temporary files.');
    } catch (error) {
      console.error('Error cleaning up temporary files:', error.message);
    }
    
    console.log('Fix complete! Logo issues for Docker and Google Cloud should be resolved.');
  } catch (error) {
    console.error('Error during process:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 