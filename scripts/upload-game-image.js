#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const ImageKit = require('imagekit');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configure ImageKit with credentials
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_yf4/s4sqsRi/BPBW6g3HD+k5TuI=',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_bCEM9K7BDaU6Aes7yp0Xj0uMTqw=',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/cbzkrwprl'
});

// Function to upload a file to ImageKit
async function uploadToImageKit(filepath, fileName, folder = 'games') {
  try {
    console.log(`Uploading ${filepath} to ImageKit...`);
    const fileBuffer = fs.readFileSync(filepath);
    
    const result = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      folder: folder,
      useUniqueFileName: false
    });
    
    console.log('Upload successful!');
    console.log('URL:', result.url);
    return result;
  } catch (error) {
    console.error(`Error uploading ${filepath}:`, error);
    throw error;
  }
}

// Function to update the game's imageUrl in the database
async function updateGameImageUrl(gameId, imageUrl) {
  try {
    console.log(`Updating game ${gameId} with new image URL: ${imageUrl}`);
    
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: { imageUrl: imageUrl }
    });
    
    console.log('Game updated successfully!');
    console.log(updatedGame);
    return updatedGame;
  } catch (error) {
    console.error(`Error updating game ${gameId}:`, error);
    throw error;
  }
}

// Main function
async function main() {
  try {
    // Parameters (should be passed as arguments in a production script)
    const imagePath = path.resolve(__dirname, '../temp-upload/land-booster-mars.jpg'); // Path to the downloaded image
    const gameId = '13a9b6f6-0b5b-416b-ab9e-3e143dd6bfce'; // Land the Booster V2 game ID
    const fileName = 'land-booster-mars.jpg'; // Filename to use in ImageKit
    
    // Upload the image to ImageKit
    const uploadResult = await uploadToImageKit(imagePath, fileName);
    
    // Update the game in the database
    await updateGameImageUrl(gameId, uploadResult.url);
    
    console.log('Process completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the main function
main(); 