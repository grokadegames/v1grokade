#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: 'dxow1rafl',
  api_key: '189369456186199',
  api_secret: '31EANFqVf28WcdN3p7IE2_q-wtw'
});

// Function to upload a file to Cloudinary
async function uploadToCloudinary(filepath, publicId, folder = 'games') {
  try {
    console.log(`Uploading ${filepath} to Cloudinary...`);
    const result = await cloudinary.uploader.upload(filepath, {
      public_id: publicId,
      folder: folder,
      overwrite: true
    });
    console.log('Upload successful!');
    console.log('URL:', result.secure_url);
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
    const publicId = 'land-booster-mars'; // ID to use in Cloudinary
    
    // Upload the image to Cloudinary
    const uploadResult = await uploadToCloudinary(imagePath, publicId);
    
    // Update the game in the database
    await updateGameImageUrl(gameId, uploadResult.secure_url);
    
    console.log('Process completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the main function
main(); 