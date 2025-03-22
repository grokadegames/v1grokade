#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const ImageKit = require('imagekit');
const prisma = new PrismaClient();

// Configure ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_yf4/s4sqsRi/BPBW6g3HD+k5TuI=',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_bCEM9K7BDaU6Aes7yp0Xj0uMTqw=',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/cbzkrwprl'
});

// Sponsor logo mappings - sponsor name to image URL
// Using alternative URLs for previously failed ones
const sponsorLogos = {
  'npm': 'https://upload.wikimedia.org/wikipedia/commons/d/db/Npm-logo.svg',
  'Ubuntu': 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Ubuntu_Logo.svg',
  'React': 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
  'DigitalOcean': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/DigitalOcean_logo.svg',
  'MongoDB': 'https://upload.wikimedia.org/wikipedia/commons/9/93/MongoDB_Logo.svg',
  'Apple': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg'
};

// Temporary directory for downloaded images
const TEMP_DIR = path.join(__dirname, '../temp-sponsors');

// Create temp directory if it doesn't exist
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Function to download an image
async function downloadImage(url, filePath) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.statusText}`);
  }
  
  // Get the file extension from content-type
  const contentType = response.headers.get('content-type');
  let fileExtension = '.png'; // Default
  
  if (contentType) {
    if (contentType.includes('svg')) {
      fileExtension = '.svg';
    } else if (contentType.includes('jpeg') || contentType.includes('jpg')) {
      fileExtension = '.jpg';
    }
  }
  
  // Extract extension from URL if content-type doesn't provide it
  if (url.includes('.svg')) {
    fileExtension = '.svg';
  } else if (url.includes('.png')) {
    fileExtension = '.png';
  } else if (url.includes('.jpg') || url.includes('.jpeg')) {
    fileExtension = '.jpg';
  }
  
  // Ensure file path has the correct extension
  if (!filePath.endsWith(fileExtension)) {
    filePath = filePath.replace(/\.[^/.]+$/, '') + fileExtension;
  }
  
  const fileStream = fs.createWriteStream(filePath);
  await new Promise((resolve, reject) => {
    response.body.pipe(fileStream);
    response.body.on('error', reject);
    fileStream.on('finish', resolve);
  });
  
  return filePath;
}

// Function to upload an image to ImageKit
async function uploadToImageKit(filePath, fileName) {
  try {
    console.log(`Uploading ${filePath} to ImageKit...`);
    const fileBuffer = fs.readFileSync(filePath);
    
    const result = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      folder: 'sponsors',
      useUniqueFileName: false
    });
    
    console.log('Upload successful!');
    console.log('URL:', result.url);
    return result.url;
  } catch (error) {
    console.error(`Error uploading ${filePath}:`, error);
    throw error;
  }
}

// Main function to update sponsor logos
async function updateSponsorLogos() {
  try {
    console.log('Fetching sponsors from database...');
    const sponsors = await prisma.sponsor.findMany();
    console.log(`Found ${sponsors.length} sponsors`);
    
    for (const sponsor of sponsors) {
      console.log(`\nProcessing sponsor: ${sponsor.name}`);
      
      // Check if we have a logo mapping for this sponsor
      const logoUrl = sponsorLogos[sponsor.name];
      if (!logoUrl) {
        console.log(`No logo URL mapping found for ${sponsor.name}, skipping...`);
        continue;
      }
      
      try {
        // Generate file name for the sponsor
        const fileName = sponsor.name.toLowerCase().replace(/\s+/g, '-');
        const tempFilePath = path.join(TEMP_DIR, `${fileName}-temp`);
        
        // Download the logo
        console.log(`Downloading logo for ${sponsor.name}...`);
        const downloadedFilePath = await downloadImage(logoUrl, tempFilePath);
        console.log(`Logo downloaded to ${downloadedFilePath}`);
        
        // Upload to ImageKit
        const imagekitUrl = await uploadToImageKit(
          downloadedFilePath,
          `${fileName}-logo`
        );
        
        // Update the sponsor record
        await prisma.sponsor.update({
          where: { id: sponsor.id },
          data: { logoUrl: imagekitUrl }
        });
        
        console.log(`✅ Updated ${sponsor.name} with new logo URL: ${imagekitUrl}`);
        
        // Clean up temp file
        fs.unlinkSync(downloadedFilePath);
      } catch (error) {
        console.error(`Error processing ${sponsor.name}:`, error);
      }
    }
    
    console.log('\nAll sponsor logos have been updated!');
  } catch (error) {
    console.error('Error updating sponsor logos:', error);
  } finally {
    await prisma.$disconnect();
    
    // Clean up temp directory
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true });
      console.log('Temporary directory cleaned up');
    }
  }
}

// Run the update function
updateSponsorLogos(); 