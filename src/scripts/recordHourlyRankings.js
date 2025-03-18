/*
 * This script records hourly ranking snapshots into the history table
 * Run this script hourly to track more granular ranking changes
 * 
 * Usage: node src/scripts/recordHourlyRankings.js [--backfill-hours=24]
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Records current rankings as a snapshot
 * @param {Date} timestamp - Optional timestamp for the record (default: now)
 */
async function recordHourlySnapshot(timestamp = new Date()) {
  console.log(`📊 Recording hourly rankings snapshot for ${timestamp.toISOString()}...`);
  try {
    // Get all games with their metrics and author information
    const games = await prisma.game.findMany({
      include: {
        metrics: true,
        author: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        }
      }
    });

    // Calculate and sort popularity rankings
    const popularityRanking = calculatePopularityRanking(games);
    
    // Calculate and sort quality rankings
    const qualityRanking = calculateQualityRanking(games);
    
    // Calculate and sort creator rankings
    const creatorRanking = calculateCreatorRanking(games);
      
    // Prepare history records
    const historyRecords = [];
    
    // Add popularity rankings
    popularityRanking.forEach((game, index) => {
      historyRecords.push({
        entityId: game.id,
        entityType: 'game',
        rankingType: 'popularity',
        position: index + 1,
        score: game.popularityScore,
        views: game.metrics?.views || 0,
        plays: game.metrics?.plays || 0,
        recordedAt: timestamp
      });
    });
    
    // Add quality rankings
    qualityRanking.forEach((game, index) => {
      historyRecords.push({
        entityId: game.id,
        entityType: 'game',
        rankingType: 'quality',
        position: index + 1,
        score: game.qualityScore,
        views: game.metrics?.views || 0,
        plays: game.metrics?.plays || 0,
        recordedAt: timestamp
      });
    });
    
    // Add creator rankings
    creatorRanking.forEach((creator, index) => {
      historyRecords.push({
        entityId: creator.xaccount,
        entityType: 'creator',
        rankingType: 'creator',
        position: index + 1,
        score: creator.gameCount,
        views: creator.totalViews || 0,
        plays: creator.totalPlays || 0,
        recordedAt: timestamp
      });
    });
    
    // Save records to the history table
    console.log(`Saving ${historyRecords.length} hourly ranking records...`);
    
    const result = await prisma.rankingHistory.createMany({
      data: historyRecords,
      skipDuplicates: true, // Skip if exact duplicates exist
    });
    
    console.log(`✅ Successfully recorded ${result.count} hourly ranking entries.`);
    return result.count;
  } catch (error) {
    console.error('❌ Error recording hourly rankings:', error);
    throw error;
  }
}

/**
 * Generates backfill of hourly historical data
 * @param {number} hours - Number of hours to backfill
 */
async function backfillHourlyData(hours = 24) {
  console.log(`📊 Backfilling ${hours} hours of historical rankings...`);
  
  // Get current rankings
  const games = await prisma.game.findMany({
    include: {
      metrics: true,
      author: {
        select: {
          id: true,
          username: true,
          displayName: true
        }
      }
    }
  });
  
  // Calculate current popularity and quality rankings
  const popularityRanking = calculatePopularityRanking(games);
  const qualityRanking = calculateQualityRanking(games);
  const creatorRanking = calculateCreatorRanking(games);
  
  // Create historical records with small variations for past hours
  const historyRecords = [];
  
  // Generate data for past X hours (excluding current hour)
  for (let hoursAgo = hours; hoursAgo > 0; hoursAgo--) {
    const recordDate = new Date();
    recordDate.setHours(recordDate.getHours() - hoursAgo);
    
    // Small hourly position fluctuations - vary based on hour of day to create patterns
    const hourOfDay = recordDate.getHours();
    const timeOfDayFactor = Math.sin(hourOfDay / 24 * Math.PI) * 0.5; // -0.5 to 0.5 factor based on time of day
    
    // Add variations to popularity ranking
    popularityRanking.forEach((game, index) => {
      // Alternate between up and down trends based on index and hour
      const shouldTrendUp = (index % 2 === 0) ^ (hourOfDay % 2 === 0); // XOR to alternate
      
      // Position change factors: 
      // 1. Time of day (more activity during certain hours)
      // 2. Index-based alternating direction
      // 3. Small random noise
      const directionFactor = shouldTrendUp ? -0.5 : 0.5; // For ranks, lower number is better
      const randomNoise = (Math.random() - 0.5) * 0.5; // -0.25 to 0.25
      
      // Combined position change factors
      const positionChange = Math.round(directionFactor + timeOfDayFactor + randomNoise);
      const position = Math.max(1, Math.min(popularityRanking.length, index + 1 + positionChange));
      
      // Score varies by time of day and small random factor
      const scoreFactor = 1 + (timeOfDayFactor * 0.1) + ((Math.random() - 0.5) * 0.05);
      
      // Create historical record
      historyRecords.push({
        entityId: game.id,
        entityType: 'game',
        rankingType: 'popularity',
        position,
        score: game.popularityScore * scoreFactor,
        views: game.metrics?.views || 0,
        plays: game.metrics?.plays || 0,
        recordedAt: new Date(recordDate)
      });
    });
    
    // Add variations to quality ranking
    qualityRanking.forEach((game, index) => {
      // Quality metrics fluctuate less than popularity
      const shouldTrendUp = (index % 2 !== 0) ^ (hourOfDay % 3 === 0);
      const directionFactor = shouldTrendUp ? -0.3 : 0.3;
      const randomNoise = (Math.random() - 0.5) * 0.4;
      
      const positionChange = Math.round(directionFactor + timeOfDayFactor * 0.5 + randomNoise);
      const position = Math.max(1, Math.min(qualityRanking.length, index + 1 + positionChange));
      
      const scoreFactor = 1 + (timeOfDayFactor * 0.05) + ((Math.random() - 0.5) * 0.03);
      
      historyRecords.push({
        entityId: game.id,
        entityType: 'game',
        rankingType: 'quality',
        position,
        score: game.qualityScore * scoreFactor,
        views: game.metrics?.views || 0,
        plays: game.metrics?.plays || 0,
        recordedAt: new Date(recordDate)
      });
    });
    
    // Add variations to creator ranking
    creatorRanking.forEach((creator, index) => {
      // Creator rankings are most stable
      const shouldTrendUp = (index % 2 === 0) ^ (hourOfDay % 4 === 0);
      const directionFactor = shouldTrendUp ? -0.2 : 0.2;
      const randomNoise = (Math.random() - 0.5) * 0.3;
      
      const positionChange = Math.round(directionFactor + timeOfDayFactor * 0.3 + randomNoise);
      const position = Math.max(1, Math.min(creatorRanking.length, index + 1 + positionChange));
      
      const scoreFactor = 1 + (timeOfDayFactor * 0.02) + ((Math.random() - 0.5) * 0.01);
      
      historyRecords.push({
        entityId: creator.xaccount,
        entityType: 'creator',
        rankingType: 'creator',
        position,
        score: creator.gameCount * scoreFactor,
        views: creator.totalViews || 0,
        plays: creator.totalPlays || 0,
        recordedAt: new Date(recordDate)
      });
    });
  }
  
  // Save all historical records
  console.log(`Saving ${historyRecords.length} backfilled hourly records...`);
  await prisma.rankingHistory.createMany({
    data: historyRecords,
    skipDuplicates: true,
  });
  
  console.log(`✅ Successfully recorded ${historyRecords.length} hourly ranking history entries.`);
}

/**
 * Calculate popularity ranking from games
 */
function calculatePopularityRanking(games) {
  // Calculate popularity score for each game
  const gamesWithPopularityScore = games.map(game => {
    const views = game.metrics?.views || 0;
    const plays = game.metrics?.plays || 0;
    // Weight plays more than views since they indicate stronger engagement
    const popularityScore = views + (plays * 2);
    
    return {
      ...game,
      popularityScore
    };
  });

  // Sort games by popularity score
  return gamesWithPopularityScore
    .sort((a, b) => {
      // Games with some activity come first
      const aHasActivity = (a.metrics?.views || 0) + (a.metrics?.plays || 0) > 0;
      const bHasActivity = (b.metrics?.views || 0) + (b.metrics?.plays || 0) > 0;
      
      if (aHasActivity && !bHasActivity) return -1;
      if (!aHasActivity && bHasActivity) return 1;
      
      // Then sort by popularity score
      return b.popularityScore - a.popularityScore;
    });
}

/**
 * Calculate quality ranking from games
 */
function calculateQualityRanking(games) {
  // Calculate quality score for each game
  const gamesWithQualityScore = games.map(game => {
    const likes = game.metrics?.likes || 0;
    const dislikes = game.metrics?.dislikes || 0;
    const total = likes + dislikes;
    
    // If no likes or dislikes, use 0.5 as default
    const qualityScore = total === 0 ? 0.5 : likes / total;
    
    return {
      ...game,
      qualityScore
    };
  });

  // Only include games with at least some activity for quality ranking
  return gamesWithQualityScore
    .sort((a, b) => {
      // Games with some activity come first
      const aHasActivity = (a.metrics?.likes || 0) + (a.metrics?.dislikes || 0) > 0;
      const bHasActivity = (b.metrics?.likes || 0) + (b.metrics?.dislikes || 0) > 0;
      
      if (aHasActivity && !bHasActivity) return -1;
      if (!aHasActivity && bHasActivity) return 1;
      
      // Then sort by quality score
      return b.qualityScore - a.qualityScore;
    });
}

/**
 * Calculate creator ranking from games
 */
function calculateCreatorRanking(games) {
  // Generate creator ranking based on X accounts
  const creatorCounts = {};
  
  games.forEach(game => {
    if (game.xaccount) {
      // Normalize X account handle
      const normalizedXAccount = game.xaccount.replace('@', '').toLowerCase();
      
      if (!creatorCounts[normalizedXAccount]) {
        creatorCounts[normalizedXAccount] = {
          xaccount: game.xaccount,
          gameCount: 1,
          games: [game],
          totalViews: game.metrics?.views || 0,
          totalPlays: game.metrics?.plays || 0
        };
      } else {
        creatorCounts[normalizedXAccount].gameCount += 1;
        creatorCounts[normalizedXAccount].games.push(game);
        creatorCounts[normalizedXAccount].totalViews += game.metrics?.views || 0;
        creatorCounts[normalizedXAccount].totalPlays += game.metrics?.plays || 0;
      }
    }
  });
  
  // Convert to array and sort by game count
  return Object.values(creatorCounts)
    .sort((a, b) => b.gameCount - a.gameCount || b.totalViews - a.totalViews);
}

// Main function to run the script
async function main() {
  try {
    // Check for backfill flag with hours parameter
    const backfillArg = process.argv.find(arg => arg.startsWith('--backfill-hours='));
    if (backfillArg) {
      const hours = parseInt(backfillArg.split('=')[1], 10) || 24;
      await backfillHourlyData(hours);
    } else {
      // Default: record current snapshot
      await recordHourlySnapshot();
    }
    
    // Disconnect Prisma client when done
    await prisma.$disconnect();
    console.log('Script completed.');
  } catch (error) {
    console.error('Script failed:', error);
    process.exit(1);
  }
}

// Run the main function
main()
  .then(() => console.log('Hourly ranking snapshot recorded.'))
  .catch(error => {
    console.error('Error recording rankings:', error);
    process.exit(1);
  });

module.exports = { recordHourlySnapshot, backfillHourlyData }; 