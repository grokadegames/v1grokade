const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function syncGameMetrics() {
  console.log('Starting GameMetrics cleanup...');
  
  try {
    // Get all game metrics
    const allMetrics = await prisma.gameMetrics.findMany();
    console.log(`Found ${allMetrics.length} game metrics records.`);
    
    // Get all game IDs
    const allGames = await prisma.game.findMany({
      select: { id: true }
    });
    const validGameIds = new Set(allGames.map(game => game.id));
    console.log(`Found ${validGameIds.size} valid games.`);
    
    // Find metrics that don't have a corresponding game
    const orphanedMetrics = allMetrics.filter(metric => !validGameIds.has(metric.gameId));
    console.log(`Found ${orphanedMetrics.length} orphaned metrics to delete.`);
    
    if (orphanedMetrics.length > 0) {
      // Delete orphaned metrics
      for (const metric of orphanedMetrics) {
        console.log(`Deleting orphaned metric for gameId: ${metric.gameId}`);
        await prisma.gameMetrics.delete({
          where: { id: metric.id }
        });
      }
      console.log(`Deleted ${orphanedMetrics.length} orphaned metrics.`);
    }
    
    // Check if any games are missing metrics
    const metricsGameIds = new Set(allMetrics.map(metric => metric.gameId));
    const gamesWithoutMetrics = allGames.filter(game => !metricsGameIds.has(game.id));
    console.log(`Found ${gamesWithoutMetrics.length} games without metrics.`);
    
    // Create default metrics for games that don't have them
    if (gamesWithoutMetrics.length > 0) {
      for (const game of gamesWithoutMetrics) {
        console.log(`Creating default metrics for gameId: ${game.id}`);
        await prisma.gameMetrics.create({
          data: {
            gameId: game.id,
            views: 0,
            plays: 0,
            likes: 0,
            dislikes: 0
          }
        });
      }
      console.log(`Created metrics for ${gamesWithoutMetrics.length} games.`);
    }
    
    console.log('GameMetrics cleanup completed successfully!');
  } catch (error) {
    console.error('Error during GameMetrics cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
syncGameMetrics(); 