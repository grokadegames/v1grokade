const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting to populate game activity data...');

    // Get all games
    const games = await prisma.game.findMany({
      include: {
        metrics: true
      }
    });

    console.log(`Found ${games.length} games to process`);

    // Delete existing activity data
    await prisma.gameActivity.deleteMany({});
    console.log('Cleared existing activity data');

    // For each game, create random activity entries for the past 24 hours
    for (const game of games) {
      const now = new Date();
      
      // Only create activity if the game has existing metrics
      if (game.metrics) {
        // Add some variability - make a few games have much higher activity
        const isPopular = Math.random() < 0.15; // 15% of games will be "trending"
        const popularMultiplier = isPopular ? 5 + Math.floor(Math.random() * 10) : 1; // 5-15x multiplier for popular games
        
        // Calculate random activity metrics based on actual game metrics
        // Ensure minimum values to make the data more interesting
        const baseViews = Math.max(5, Math.floor(Math.random() * game.metrics.views * 0.1));
        const basePlays = Math.max(2, Math.floor(Math.random() * game.metrics.plays * 0.15));
        const baseLikes = Math.max(1, Math.floor(Math.random() * game.metrics.likes * 0.2));
        const baseDislikes = Math.floor(Math.random() * Math.max(1, game.metrics.dislikes * 0.1));
        
        const views = baseViews * popularMultiplier;
        const plays = basePlays * popularMultiplier;
        const likes = baseLikes * popularMultiplier;
        const dislikes = baseDislikes * (Math.random() < 0.7 ? 1 : popularMultiplier); // Only some trending games get more dislikes
        
        // Create activity record
        await prisma.gameActivity.create({
          data: {
            gameId: game.id,
            views,
            plays,
            likes,
            dislikes,
            timestamp: now
          }
        });

        console.log(`Created activity for ${game.title} - Views: ${views}, Plays: ${plays}, Likes: ${likes}, Dislikes: ${dislikes}${isPopular ? ' (trending)' : ''}`);
      }
    }

    console.log('Successfully populated game activity data');
  } catch (error) {
    console.error('Error populating game activity data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 