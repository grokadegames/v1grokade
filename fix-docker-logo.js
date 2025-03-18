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
const tempDir = path.join(__dirname, 'temp-docker-fix');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Using a direct URL to the Docker logo from a more reliable source
const dockerLogoUrl = 'https://www.docker.com/sites/default/files/d8/2019-07/Moby-logo.png';
const localPath = path.join(tempDir, 'docker-logo.png');

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

    console.log(`Updated ${name} logo in database to ${logoUrl}`);
    return true;
  } catch (error) {
    console.error(`Error updating ${name} in database:`, error);
    return false;
  }
}

// Main function
async function main() {
  console.log('Starting fix for Docker logo...');
  
  try {
    // Download Docker logo
    console.log(`Downloading Docker logo from ${dockerLogoUrl}...`);
    await downloadFile(dockerLogoUrl, localPath);
    console.log('Docker logo downloaded successfully.');
    
    // Verify file exists and has content
    const stats = fs.statSync(localPath);
    console.log(`Downloaded file size: ${stats.size} bytes`);
    
    if (stats.size === 0) {
      throw new Error('Downloaded file is empty');
    }
    
    // Upload to Cloudinary
    console.log('Uploading Docker logo to Cloudinary...');
    const result = await cloudinary.uploader.upload(localPath, {
      public_id: 'docker-logo',
      folder: 'sponsors',
      overwrite: true
    });
    
    console.log(`Docker logo uploaded to Cloudinary: ${result.secure_url}`);
    
    // Update database with new URL
    await updateSponsorLogo('Docker', result.secure_url);
    
    // Clean up temp directory
    fs.rmdirSync(tempDir, { recursive: true });
    console.log('Cleaned up temporary files.');
    
    console.log('Docker logo has been fixed successfully!');
  } catch (error) {
    console.error('Error during process:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 