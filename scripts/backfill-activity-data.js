// Script to backfill activity data based on existing game metrics
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Distributes a total count across days using a bell curve distribution
 * @param {number} total - Total count to distribute
 * @param {number} days - Number of days to distribute across
 * @returns {number[]} - Array of counts for each day
 */
function bellCurveDistribution(total, days) {
  if (total <= 0 || days <= 0) return Array(days).fill(0);
  
  // Create a simple bell curve distribution
  const distribution = [];
  const mid = Math.floor(days / 2);
  
  for (let i = 0; i < days; i++) {
    // Higher values in the middle, lower at the edges
    const distance = Math.abs(i - mid);
    const weight = 1 - (distance / days);
    distribution.push(weight);
  }
  
  // Normalize to sum to 1
  const sum = distribution.reduce((a, b) => a + b, 0);
  const normalized = distribution.map(w => w / sum);
  
  // Distribute the total according to the weights
  return normalized.map(w => Math.round(w * total));
}

/**
 * Backfills activity data for the specified number of days
 * @param {number} days - Number of days to backfill
 */
async function backfillActivityData(days = 7) {
  console.log(`Starting activity data backfill for the past ${days} days...`);
  
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Get all games with their metrics
    const games = await prisma.game.findMany({
      include: {
        metrics: true,
      },
    });
    
    console.log(`Retrieved ${games.length} games from the database`);
    
    let activitiesCreated = 0;
    let gamesProcessed = 0;
    let gamesSkipped = 0;
    
    for (const game of games) {
      // Skip games with no metrics
      if (!game.metrics) {
        console.log(`Skipping game ${game.id} (${game.title}) - no metrics found`);
        gamesSkipped++;
        continue;
      }
      
      const metrics = game.metrics;
      
      // Calculate activities to create based on metrics
      const viewsToCreate = metrics.views || 0;
      const playsToCreate = metrics.plays || 0;
      const likesToCreate = metrics.likes || 0;
      const dislikesToCreate = metrics.dislikes || 0;
      
      // Skip games with no activity
      if (viewsToCreate + playsToCreate + likesToCreate + dislikesToCreate === 0) {
        console.log(`Skipping game ${game.id} (${game.title}) - no activity found`);
        gamesSkipped++;
        continue;
      }
      
      // Distribute activities across days
      const viewsDistribution = bellCurveDistribution(viewsToCreate, days);
      const playsDistribution = bellCurveDistribution(playsToCreate, days);
      const likesDistribution = bellCurveDistribution(likesToCreate, days);
      const dislikesDistribution = bellCurveDistribution(dislikesToCreate, days);
      
      // Create activity records for each day
      const activitiesToCreate = [];
      
      for (let i = 0; i < days; i++) {
        const activityDate = new Date(startDate);
        activityDate.setDate(activityDate.getDate() + i);
        
        // Add randomization to time
        activityDate.setHours(Math.floor(Math.random() * 24));
        activityDate.setMinutes(Math.floor(Math.random() * 60));
        activityDate.setSeconds(Math.floor(Math.random() * 60));
        
        // Create view activities
        for (let v = 0; v < viewsDistribution[i]; v++) {
          activitiesToCreate.push({
            gameId: game.id,
            type: 'VIEW',
            timestamp: new Date(activityDate)
          });
        }
        
        // Create play activities
        for (let p = 0; p < playsDistribution[i]; p++) {
          activitiesToCreate.push({
            gameId: game.id,
            type: 'PLAY',
            timestamp: new Date(activityDate)
          });
        }
        
        // Create like activities
        for (let l = 0; l < likesDistribution[i]; l++) {
          activitiesToCreate.push({
            gameId: game.id,
            type: 'LIKE',
            timestamp: new Date(activityDate)
          });
        }
        
        // Create dislike activities
        for (let d = 0; d < dislikesDistribution[i]; d++) {
          activitiesToCreate.push({
            gameId: game.id,
            type: 'DISLIKE',
            timestamp: new Date(activityDate)
          });
        }
      }
      
      // Create all activities in bulk
      if (activitiesToCreate.length > 0) {
        await prisma.activity.createMany({
          data: activitiesToCreate,
          skipDuplicates: true,
        });
        
        activitiesCreated += activitiesToCreate.length;
        gamesProcessed++;
        
        console.log(`Created ${activitiesToCreate.length} activities for game ${game.id} (${game.title})`);
      }
    }
    
    console.log(`Backfill complete! Created ${activitiesCreated} activities for ${gamesProcessed} games.`);
    console.log(`Skipped ${gamesSkipped} games with no metrics.`);
    
  } catch (error) {
    console.error('Error during backfill:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the backfill function
backfillActivityData()
  .then(() => console.log('Backfill script completed successfully'))
  .catch(error => console.error('Backfill script failed:', error)); 