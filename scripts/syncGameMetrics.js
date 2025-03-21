/**
 * Script to sync game metrics from games table to game_metrics table
 * 
 * This script will ensure that plays and views data stored directly on games
 * is properly synchronized with the dedicated GameMetrics table.
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function syncGameMetrics() {
  console.log('Starting game metrics synchronization...');
  
  try {
    // Get all games with their metrics
    const games = await prisma.game.findMany({
      include: {
        metrics: true
      }
    });
    
    console.log(`Found ${games.length} games to process`);
    
    let updated = 0;
    let created = 0;
    let skipped = 0;
    
    // Process each game
    for (const game of games) {
      // Extract plays and views if they exist directly on the game record
      // In some cases, older games might have these fields directly on the game table
      const gamePlays = game.plays || 0;
      const gameViews = game.views || 0;
      
      // If the game has no metrics record, create one
      if (!game.metrics) {
        await prisma.gameMetrics.create({
          data: {
            gameId: game.id,
            plays: gamePlays,
            views: gameViews,
            likes: 0,
            dislikes: 0
          }
        });
        created++;
        console.log(`Created new metrics record for game ${game.id} - "${game.title}" (Views: ${gameViews}, Plays: ${gamePlays})`);
      } 
      // If the game has metrics but they differ from the game record, update the metrics
      else if (gamePlays > 0 || gameViews > 0) {
        // Only update if the direct values are higher than what's in the metrics table
        // This prevents overwriting newer metrics with older data
        const updatedPlays = Math.max(game.metrics.plays, gamePlays);
        const updatedViews = Math.max(game.metrics.views, gameViews);
        
        // If there's a difference, update the metrics
        if (updatedPlays > game.metrics.plays || updatedViews > game.metrics.views) {
          await prisma.gameMetrics.update({
            where: { gameId: game.id },
            data: {
              plays: updatedPlays,
              views: updatedViews
            }
          });
          updated++;
          console.log(`Updated metrics for game ${game.id} - "${game.title}" (Views: ${updatedViews}, Plays: ${updatedPlays})`);
        } else {
          skipped++;
          console.log(`Skipped game ${game.id} - "${game.title}" (metrics already up to date)`);
        }
      } else {
        skipped++;
        console.log(`Skipped game ${game.id} - "${game.title}" (no metrics to sync)`);
      }
    }
    
    console.log('\nMetrics synchronization complete!');
    console.log(`Created: ${created} new metrics records`);
    console.log(`Updated: ${updated} existing metrics records`);
    console.log(`Skipped: ${skipped} games (no updates needed)`);
    console.log(`Total games processed: ${games.length}`);
    
  } catch (error) {
    console.error('Error syncing game metrics:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the sync function
syncGameMetrics()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Script failed:', error);
    process.exit(1);
  }); 