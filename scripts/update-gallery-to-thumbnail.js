#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// List of game titles to update
const gameTitles = [
  'Vibe Tanks',
  'Dome Farm',
  'V1be City',
  'GTAi',
  'FlyVibe',
  'Slow Roads',
  'Summer Afternoon',
  'Robotic Surge Shooter',
  'Stick Cricket',
  'Open Road',
  'Space Balls',
  'Pixel2DFightXForce',
  'Racing Cart',
  'WW2 Dogfight Arena',
  'Hot Air Balloon',
  'Arcade City',
  'Escape Prison Cell',
  'Wildly Royale',
  'Cowboy',
  'Cowboy Shooter',
  'TankNarok',
  'Fruit of the Boom',
  'Tic-Tac Cricket',
  'Necropolis: Rise of the undead',
  'Space Force: Drain The Swamp',
  'Rock Water Skipping'
];

async function updateGames() {
  console.log('Updating games: copying galleryImage1 to imageUrl...');
  
  try {
    // For each game title
    for (const title of gameTitles) {
      // Find the game by title
      const game = await prisma.game.findFirst({
        where: {
          title: {
            contains: title,
            mode: 'insensitive' // Case insensitive search
          }
        }
      });
      
      if (!game) {
        console.log(`Game not found: ${title}`);
        continue;
      }
      
      // Skip if galleryImage1 is empty or null
      if (!game.galleryImage1) {
        console.log(`No galleryImage1 for game: ${title}`);
        continue;
      }
      
      // Update the game's imageUrl with galleryImage1
      await prisma.game.update({
        where: { id: game.id },
        data: { imageUrl: game.galleryImage1 }
      });
      
      console.log(`Updated: ${title} - Image URL set to: ${game.galleryImage1}`);
    }
    
    console.log('All games have been updated successfully!');
  } catch (error) {
    console.error('Error updating games:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update function
updateGames(); 