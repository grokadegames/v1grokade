const fs = require('fs');
const path = require('path');
const ImageKit = require('imagekit');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Configure ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'public_yf4/s4sqsRi/BPBW6g3HD+k5TuI=',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'private_bCEM9K7BDaU6Aes7yp0Xj0uMTqw=',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/cbzkrwprl'
});

// Game ID for Land the Booster V3
const gameId = '13a9b6f6-0b5b-416b-ab9e-3e143dd6bfce';

// Path to the temporary image file
const imagePath = path.join(__dirname, '../temp-upload/mars-landing.jpg');

async function uploadImageAndUpdateGame() {
  try {
    console.log('Uploading image to ImageKit...');
    
    // Read the file as buffer
    const fileBuffer = fs.readFileSync(imagePath);
    
    // Upload the image to ImageKit
    const uploadResult = await imagekit.upload({
      file: fileBuffer,
      fileName: 'land-booster-mars-v2.jpg',
      folder: 'games',
      useUniqueFileName: false
    });
    
    console.log('Image uploaded successfully!');
    console.log('ImageKit URL:', uploadResult.url);
    
    // Update the game record in the database
    console.log(`Updating Land the Booster V3 (ID: ${gameId}) with new image URL...`);
    
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: { imageUrl: uploadResult.url }
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