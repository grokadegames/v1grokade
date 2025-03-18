const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateWordGodDescription() {
  try {
    console.log('Looking for "Word God" game...');
    
    // First find the game to get its ID
    const game = await prisma.game.findFirst({
      where: {
        title: "Word God"
      }
    });
    
    if (!game) {
      console.error('Game "Word God" not found in the database');
      return;
    }
    
    console.log(`Found game with ID: ${game.id}`);
    
    // Update the game description
    const updatedGame = await prisma.game.update({
      where: {
        id: game.id
      },
      data: {
        description: "From Void to Universe. Eginning with primordial concepts, evolve a unique glorious universe through your ability to combine words."
      }
    });
    
    console.log('Game description updated successfully:');
    console.log(`Title: ${updatedGame.title}`);
    console.log(`Description: ${updatedGame.description}`);
    
  } catch (error) {
    console.error('Error updating game description:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateWordGodDescription()
  .then(() => console.log('Script completed'))
  .catch(error => console.error('Script failed:', error)); 