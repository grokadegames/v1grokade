const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting metrics seeding process...');
  
  try {
    // Get all games that don't have metrics yet
    const games = await prisma.game.findMany({
      where: {
        metrics: null
      },
      select: {
        id: true,
        title: true
      }
    });
    
    console.log(`Found ${games.length} games without metrics`);
    
    if (games.length === 0) {
      console.log('No games need metrics - all games already have metrics data');
      return;
    }
    
    // Create metrics for each game with random initial data
    const metricsPromises = games.map(async (game) => {
      // Generate reasonable random metrics
      const views = Math.floor(Math.random() * 500) + 50; // 50-550 views
      const plays = Math.floor(Math.random() * views * 0.7) + 10; // 10 to 70% of views
      const likes = Math.floor(Math.random() * plays * 0.4) + 5; // 5 to 40% of plays
      const dislikes = Math.floor(Math.random() * plays * 0.1) + 1; // 1 to 10% of plays
      
      const metrics = await prisma.gameMetrics.create({
        data: {
          gameId: game.id,
          views,
          plays,
          likes,
          dislikes
        }
      });
      
      console.log(`Created metrics for game "${game.title}" (${game.id}): Views=${views}, Plays=${plays}, Likes=${likes}, Dislikes=${dislikes}`);
      
      return metrics;
    });
    
    const results = await Promise.all(metricsPromises);
    console.log(`Successfully created metrics for ${results.length} games`);
    
  } catch (error) {
    console.error('Error seeding metrics:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => {
    console.log('Metrics seeding completed');
    process.exit(0);
  })
  .catch((e) => {
    console.error('Error in metrics seeding:', e);
    process.exit(1);
  }); 