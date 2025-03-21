const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * This script generates realistic 7-day activity data based on current GameMetrics
 * It distributes the exact GameMetrics totals across 7 days with natural patterns
 */
async function generateRealisticActivity() {
  try {
    console.log('Starting to generate realistic 7-day activity data...');
    
    // Clear existing activity data
    await prisma.gameActivity.deleteMany({});
    console.log('Cleared existing activity data');
    
    // Get all games with their metrics
    const games = await prisma.game.findMany({
      include: {
        metrics: true
      }
    });

    console.log(`Found ${games.length} games to process`);

    // Current date as the end point (Day 7)
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Normalize to start of day
    
    let totalActivitiesCreated = 0;

    // For each game, create activity records for the past 7 days
    for (const game of games) {
      if (!game.metrics) continue;
      
      // Use the exact metrics totals from GameMetrics
      const totalViews = game.metrics.views;
      const totalPlays = game.metrics.plays;
      const totalLikes = game.metrics.likes;
      const totalDislikes = game.metrics.dislikes;
      
      console.log(`Processing ${game.title} - Totals: Views: ${totalViews}, Plays: ${totalPlays}, Likes: ${totalLikes}, Dislikes: ${totalDislikes}`);
      
      // Determine if this is a "popular" game (higher metrics)
      const isPopular = totalViews > 1000 || totalPlays > 500 || totalLikes > 100;
      
      // Distribution patterns (percentages of total for each day)
      // These percentages should sum to 1.0 for each metric
      const distributionPatterns = {
        // Standard distribution with weekend bump
        standard: {
          views: [0.10, 0.12, 0.13, 0.14, 0.15, 0.17, 0.19],
          plays: [0.09, 0.12, 0.13, 0.15, 0.16, 0.17, 0.18],
          likes: [0.08, 0.10, 0.12, 0.15, 0.17, 0.18, 0.20],
          dislikes: [0.10, 0.12, 0.14, 0.15, 0.16, 0.16, 0.17]
        },
        // Growing popularity pattern
        growing: {
          views: [0.06, 0.08, 0.10, 0.15, 0.18, 0.20, 0.23],
          plays: [0.05, 0.08, 0.10, 0.15, 0.19, 0.20, 0.23],
          likes: [0.04, 0.06, 0.10, 0.15, 0.20, 0.22, 0.23],
          dislikes: [0.10, 0.12, 0.13, 0.15, 0.16, 0.17, 0.17]
        },
        // Viral spike pattern (recent surge)
        viral: {
          views: [0.05, 0.06, 0.08, 0.10, 0.15, 0.25, 0.31],
          plays: [0.04, 0.05, 0.07, 0.09, 0.15, 0.27, 0.33],
          likes: [0.03, 0.04, 0.06, 0.09, 0.15, 0.28, 0.35],
          dislikes: [0.05, 0.08, 0.10, 0.12, 0.15, 0.20, 0.30]
        }
      };
      
      // Choose pattern based on game characteristics and add randomness
      let pattern;
      const random = Math.random();
      
      // Popular games more likely to have viral or growing patterns
      if (isPopular) {
        if (random < 0.4) pattern = 'viral';
        else if (random < 0.8) pattern = 'growing';
        else pattern = 'standard';
      } else {
        if (random < 0.1) pattern = 'viral';
        else if (random < 0.3) pattern = 'growing';
        else pattern = 'standard';
      }
      
      // For recent games (created in last 30 days), more likely to have growing/viral patterns
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      if (game.createdAt > thirtyDaysAgo) {
        if (Math.random() < 0.6) {
          pattern = Math.random() < 0.7 ? 'growing' : 'viral';
        }
      }
      
      const selectedPattern = distributionPatterns[pattern];
      
      // Track running totals to ensure we distribute exactly the GameMetrics values
      let remainingViews = totalViews;
      let remainingPlays = totalPlays;
      let remainingLikes = totalLikes;
      let remainingDislikes = totalDislikes;
      
      // Generate activity records for the past 7 days
      for (let i = 0; i < 7; i++) {
        const day = new Date(now);
        day.setDate(day.getDate() - (6 - i)); // Day 0 is 6 days ago, Day 6 is today
        
        // For the last day (i=6), use remaining values to ensure exact total
        let views, plays, likes, dislikes;
        
        if (i < 6) {
          // Calculate metrics for this day using the selected pattern
          views = Math.min(remainingViews, Math.round(totalViews * selectedPattern.views[i]));
          plays = Math.min(remainingPlays, Math.round(totalPlays * selectedPattern.plays[i]));
          likes = Math.min(remainingLikes, Math.round(totalLikes * selectedPattern.likes[i]));
          dislikes = Math.min(remainingDislikes, Math.round(totalDislikes * selectedPattern.dislikes[i]));
          
          // Add randomization (±10% variation) but ensure we don't exceed the total
          const randomize = (value, remaining) => {
            if (value <= 1) return value; // Don't randomize very small values
            const variation = 0.1; // 10% variation
            const factor = 1 + (Math.random() * variation * 2 - variation);
            const randomized = Math.round(value * factor);
            return Math.min(randomized, remaining); // Don't exceed remaining total
          };
          
          views = randomize(views, remainingViews);
          plays = randomize(plays, remainingPlays);
          likes = randomize(likes, remainingLikes);
          dislikes = randomize(dislikes, remainingDislikes);
        } else {
          // Last day gets all remaining values to ensure exact total
          views = remainingViews;
          plays = remainingPlays;
          likes = remainingLikes;
          dislikes = remainingDislikes;
        }
        
        // Update remaining totals
        remainingViews -= views;
        remainingPlays -= plays;
        remainingLikes -= likes;
        remainingDislikes -= dislikes;
        
        // Create activity record
        await prisma.gameActivity.create({
          data: {
            gameId: game.id,
            views,
            plays,
            likes,
            dislikes,
            timestamp: day
          }
        });
        
        totalActivitiesCreated++;
      }
      
      // Verify the totals match
      console.log(`Verification for ${game.title}: Views left: ${remainingViews}, Plays left: ${remainingPlays}, Likes left: ${remainingLikes}, Dislikes left: ${remainingDislikes}`);
      if (remainingViews !== 0 || remainingPlays !== 0 || remainingLikes !== 0 || remainingDislikes !== 0) {
        console.warn(`⚠️ Warning: Totals don't match exactly for ${game.title}`);
      }
    }

    console.log(`Successfully generated ${totalActivitiesCreated} realistic activity records for ${games.length} games`);
  } catch (error) {
    console.error('Error generating realistic activity data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
generateRealisticActivity(); 