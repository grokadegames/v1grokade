const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * This script records daily activity by calculating the difference between 
 * current metrics and metrics from the previous day.
 * It should be run daily via a scheduled job.
 */
async function recordDailyActivity() {
  try {
    console.log('Starting to record daily activity...');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Get all games with their metrics
    const games = await prisma.game.findMany({
      include: {
        metrics: true,
        activities: {
          where: {
            timestamp: {
              gte: yesterday
            }
          },
          orderBy: {
            timestamp: 'desc'
          },
          take: 1
        }
      }
    });

    console.log(`Found ${games.length} games to process`);

    const today = new Date();
    let newActivitiesCount = 0;

    // For each game, create an activity record based on metrics changes
    for (const game of games) {
      if (game.metrics) {
        // Get the previous activity record from yesterday
        const previousActivity = game.activities[0];
        
        // If there's no previous record, create one with 0 values
        if (!previousActivity) {
          await prisma.gameActivity.create({
            data: {
              gameId: game.id,
              views: 0,
              plays: 0,
              likes: 0,
              dislikes: 0,
              timestamp: today
            }
          });
          newActivitiesCount++;
          continue;
        }

        // Calculate metrics changes since the last record
        const views = Math.max(0, game.metrics.views - (previousActivity.views || 0));
        const plays = Math.max(0, game.metrics.plays - (previousActivity.plays || 0));
        const likes = Math.max(0, game.metrics.likes - (previousActivity.likes || 0));
        const dislikes = Math.max(0, game.metrics.dislikes - (previousActivity.dislikes || 0));

        // Create a new activity record
        await prisma.gameActivity.create({
          data: {
            gameId: game.id,
            views,
            plays,
            likes,
            dislikes,
            timestamp: today
          }
        });
        newActivitiesCount++;

        console.log(`Recorded activity for ${game.title} - Views: ${views}, Plays: ${plays}, Likes: ${likes}, Dislikes: ${dislikes}`);
      }
    }

    // Delete old activity records (older than 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const deletedCount = await prisma.gameActivity.deleteMany({
      where: {
        timestamp: {
          lt: thirtyDaysAgo
        }
      }
    });

    console.log(`Successfully recorded ${newActivitiesCount} new activity records`);
    console.log(`Deleted ${deletedCount.count} activity records older than 30 days`);
  } catch (error) {
    console.error('Error recording daily activity:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function if this script is executed directly
if (require.main === module) {
  recordDailyActivity();
}

module.exports = recordDailyActivity; 