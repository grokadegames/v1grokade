const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dxow1rafl',
  api_key: '189369456186199',
  api_secret: '31EANFqVf28WcdN3p7IE2_q-wtw'
});

// Game ID for Land the Booster V3
const gameId = '13a9b6f6-0b5b-416b-ab9e-3e143dd6bfce';

// Path to the temporary image file
const imagePath = path.join(__dirname, '../temp-upload/mars-landing.jpg');

async function uploadImageAndUpdateGame() {
  try {
    console.log('Uploading image to Cloudinary...');
    
    // Upload the image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imagePath, {
      folder: 'games',
      public_id: 'land-booster-mars-v2',
      overwrite: true
    });
    
    console.log('Image uploaded successfully!');
    console.log('Cloudinary URL:', uploadResult.secure_url);
    
    // Update the game record in the database
    console.log(`Updating Land the Booster V3 (ID: ${gameId}) with new image URL...`);
    
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: { imageUrl: uploadResult.secure_url }
    });
    
    console.log('Game updated successfully!');
    console.log('Updated game:', updatedGame);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
uploadImageAndUpdateGame(); 