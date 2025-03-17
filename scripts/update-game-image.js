#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Define the Cloudinary URL for the uploaded image
const imageUrl = 'https://res.cloudinary.com/dxow1rafl/image/upload/v1742256750/games/land-booster-mars.jpg';

// Define the game ID for Land the Booster V2 - update this if needed
const gameId = '13a9b6f6-0b5b-416b-ab9e-3e143dd6bfce';

async function updateGameImage() {
  try {
    console.log(`Updating game ${gameId} with image URL: ${imageUrl}`);
    
    const updatedGame = await prisma.game.update({
      where: { id: gameId },
      data: { imageUrl: imageUrl }
    });
    
    console.log('Game updated successfully!');
    console.log(updatedGame);
    return updatedGame;
  } catch (error) {
    console.error(`Error updating game ${gameId}:`, error);
  } finally {
    await prisma.$disconnect();
  }
}

updateGameImage(); 