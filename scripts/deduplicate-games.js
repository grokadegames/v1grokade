/**
 * Deduplicate Games Script
 * 
 * This script:
 * 1. Identifies games with duplicate titles in the database
 * 2. For each set of duplicates, keeps the one with tagcategory, or the newer one if both/neither have tags
 * 3. Removes the duplicate records while preserving metrics data
 * 
 * Usage: node scripts/deduplicate-games.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deduplicateGames() {
  console.log('Starting game deduplication process...');
  
  try {
    // Get all games
    const allGames = await prisma.game.findMany({
      include: {
        metrics: true
      },
      orderBy: {
        title: 'asc'
      }
    });
    
    console.log(`Found ${allGames.length} total games in database`);
    
    // Group games by title to find duplicates
    const gamesByTitle = {};
    allGames.forEach(game => {
      if (!gamesByTitle[game.title]) {
        gamesByTitle[game.title] = [];
      }
      gamesByTitle[game.title].push(game);
    });
    
    // Filter to only titles with duplicates
    const duplicateTitles = Object.keys(gamesByTitle).filter(title => 
      gamesByTitle[title].length > 1
    );
    
    console.log(`Found ${duplicateTitles.length} titles with duplicates`);
    
    if (duplicateTitles.length === 0) {
      console.log('No duplicates to process. Database is clean.');
      return;
    }
    
    // Process each set of duplicates
    let totalDuplicatesRemoved = 0;
    
    for (const title of duplicateTitles) {
      const duplicates = gamesByTitle[title];
      console.log(`\nProcessing duplicates for "${title}" (${duplicates.length} records)`);
      
      // Determine which record to keep based on criteria
      let recordToKeep = null;
      
      // First criterion: Keep record with tagcategory
      const recordsWithTags = duplicates.filter(game => game.tagcategory);
      
      if (recordsWithTags.length === 1) {
        // If exactly one record has tags, keep that one
        recordToKeep = recordsWithTags[0];
        console.log(`- Keeping game with ID ${recordToKeep.id} because it has tags: ${recordToKeep.tagcategory}`);
      } else if (recordsWithTags.length > 1) {
        // If multiple records have tags, keep the newer one
        recordToKeep = recordsWithTags.sort((a, b) => 
          new Date(b.updatedAt) - new Date(a.updatedAt)
        )[0];
        console.log(`- Multiple games have tags. Keeping newer game with ID ${recordToKeep.id}, updated at ${recordToKeep.updatedAt}`);
      } else {
        // If no records have tags, keep the newer one
        recordToKeep = duplicates.sort((a, b) => 
          new Date(b.updatedAt) - new Date(a.updatedAt)
        )[0];
        console.log(`- No games have tags. Keeping newer game with ID ${recordToKeep.id}, updated at ${recordToKeep.updatedAt}`);
      }
      
      // Get the records to remove
      const recordsToRemove = duplicates.filter(game => game.id !== recordToKeep.id);
      console.log(`- Will remove ${recordsToRemove.length} duplicate records`);
      
      // Process deletion of each duplicate
      for (const record of recordsToRemove) {
        console.log(`  - Removing game: "${record.title}" (ID: ${record.id})`);
        
        try {
          // Check if the record to keep has metrics
          const keepHasMetrics = !!recordToKeep.metrics;
          
          // If the record to remove has metrics but the one to keep doesn't,
          // update the metrics to point to the record we're keeping
          if (record.metrics && !keepHasMetrics) {
            console.log(`    - Transferring metrics from ${record.id} to ${recordToKeep.id}`);
            await prisma.gameMetrics.update({
              where: { id: record.metrics.id },
              data: { gameId: recordToKeep.id }
            });
          }
          
          // Delete the duplicate record
          await prisma.game.delete({
            where: { id: record.id }
          });
          
          totalDuplicatesRemoved++;
        } catch (error) {
          console.error(`    - Error removing duplicate ${record.id}:`, error);
        }
      }
    }
    
    console.log(`\nDeduplication complete. Removed ${totalDuplicatesRemoved} duplicate records.`);
    
  } catch (error) {
    console.error('Error during deduplication process:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the deduplication
deduplicateGames()
  .then(() => {
    console.log('Deduplication script completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 