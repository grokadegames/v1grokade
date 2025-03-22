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

// Main function to update the Ubuntu logo
async function updateUbuntuLogo() {
  try {
    console.log('Fetching Ubuntu sponsor from database...');
    const sponsor = await prisma.sponsor.findFirst({
      where: { name: 'Ubuntu' }
    });
    
    if (!sponsor) {
      console.log('Ubuntu sponsor not found in database');
      return;
    }
    
    // Ubuntu logo URL - this one should work
    const logoUrl = 'https://cdn.iconscout.com/icon/free/png-256/free-ubuntu-17-1175077.png';
    
    try {
      // Download the logo
      const tempFilePath = path.join(TEMP_DIR, 'ubuntu-temp.png');
      console.log(`Downloading Ubuntu logo...`);
      const downloadedFilePath = await downloadImage(logoUrl, tempFilePath);
      console.log(`Logo downloaded to ${downloadedFilePath}`);
      
      // Upload to ImageKit
      const imagekitUrl = await uploadToImageKit(
        downloadedFilePath,
        'ubuntu-logo'
      );
      
      // Update the sponsor record
      await prisma.sponsor.update({
        where: { id: sponsor.id },
        data: { logoUrl: imagekitUrl }
      });
      
      console.log(`✅ Updated Ubuntu with new logo URL: ${imagekitUrl}`);
      
      // Clean up temp file
      fs.unlinkSync(downloadedFilePath);
    } catch (error) {
      console.error(`Error processing Ubuntu:`, error);
    }
    
    console.log('\nUbuntu logo has been updated!');
  } catch (error) {
    console.error('Error updating Ubuntu logo:', error);
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
updateUbuntuLogo(); 