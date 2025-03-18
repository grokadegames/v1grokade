const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deduplicateGames() {
  try {
    console.log('Starting deduplication process...');
    
    // Get all games
    const allGames = await prisma.game.findMany({
      include: {
        metrics: true
      }
    });
    
    console.log(`Found ${allGames.length} total games`);
    
    // Group games by title
    const gamesByTitle = {};
    allGames.forEach(game => {
      if (!gamesByTitle[game.title]) {
        gamesByTitle[game.title] = [];
      }
      gamesByTitle[game.title].push(game);
    });
    
    // Find duplicates (titles with more than one entry)
    const duplicateTitles = Object.keys(gamesByTitle).filter(title => gamesByTitle[title].length > 1);
    console.log(`Found ${duplicateTitles.length} titles with duplicate entries`);
    
    // Process each set of duplicates
    let deletedCount = 0;
    for (const title of duplicateTitles) {
      const duplicateGames = gamesByTitle[title];
      console.log(`\nProcessing duplicates for "${title}" (${duplicateGames.length} entries):`);
      
      // Print details of all duplicates
      duplicateGames.forEach((game, index) => {
        console.log(`  [${index + 1}] ID: ${game.id}, Tags: "${game.tagcategory || 'none'}"`);
      });
      
      // Determine which one to keep (the one with the most tagcategory data)
      let bestGame = duplicateGames[0];
      let maxLength = bestGame.tagcategory ? bestGame.tagcategory.length : 0;
      
      for (let i = 1; i < duplicateGames.length; i++) {
        const game = duplicateGames[i];
        const tagLength = game.tagcategory ? game.tagcategory.length : 0;
        
        if (tagLength > maxLength) {
          maxLength = tagLength;
          bestGame = game;
        }
      }
      
      // Keep the best one, delete the others
      const gamesToDelete = duplicateGames.filter(g => g.id !== bestGame.id);
      
      console.log(`  Keeping: "${bestGame.title}" (ID: ${bestGame.id}, tags: ${bestGame.tagcategory || 'none'})`);
      
      for (const gameToDelete of gamesToDelete) {
        try {
          // First check if there's a related metrics record and delete it
          if (gameToDelete.metrics) {
            await prisma.gameMetrics.delete({
              where: { id: gameToDelete.metrics.id }
            });
            console.log(`    Deleted metrics for game ID: ${gameToDelete.id}`);
          }
          
          // Then delete the game
          await prisma.game.delete({
            where: { id: gameToDelete.id }
          });
          console.log(`    Deleted duplicate game: "${gameToDelete.title}" (ID: ${gameToDelete.id}, tags: ${gameToDelete.tagcategory || 'none'})`);
          deletedCount++;
        } catch (err) {
          console.error(`    Error deleting game ${gameToDelete.id}:`, err.message);
        }
      }
    }
    
    console.log(`\nDeduplication complete. Deleted ${deletedCount} duplicate games.`);
  } catch (error) {
    console.error('Error during deduplication:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deduplicateGames(); 