/*
 * This script records the current rankings into the history table
 * Run this script daily to track ranking changes over time
 * 
 * Usage: node src/scripts/recordDailyRankings.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function recordRankings() {
  console.log('📊 Recording daily rankings history...');
  try {
    // 1. Get current rankings
    // Reuse the existing API logic to ensure consistency
    console.log('Fetching current rankings...');
    
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
    const qualityRanking = gamesWithQualityScore
      .sort((a, b) => {
        // Games with some activity come first
        const aHasActivity = (a.metrics?.likes || 0) + (a.metrics?.dislikes || 0) > 0;
        const bHasActivity = (b.metrics?.likes || 0) + (b.metrics?.dislikes || 0) > 0;
        
        if (aHasActivity && !bHasActivity) return -1;
        if (!aHasActivity && bHasActivity) return 1;
        
        // Then sort by quality score
        return b.qualityScore - a.qualityScore;
      });

    // Sort games by popularity score
    const popularityRanking = gamesWithPopularityScore
      .sort((a, b) => {
        // Games with some activity come first
        const aHasActivity = (a.metrics?.views || 0) + (a.metrics?.plays || 0) > 0;
        const bHasActivity = (b.metrics?.views || 0) + (b.metrics?.plays || 0) > 0;
        
        if (aHasActivity && !bHasActivity) return -1;
        if (!aHasActivity && bHasActivity) return 1;
        
        // Then sort by popularity score
        return b.popularityScore - a.popularityScore;
      });

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
          creatorCounts[normalizedXAccount].totalViews += (game.metrics?.views || 0);
          creatorCounts[normalizedXAccount].totalPlays += (game.metrics?.plays || 0);
        }
      }
    });
    
    // Convert to array and sort
    const creatorRanking = Object.values(creatorCounts)
      .sort((a, b) => {
        // First sort by game count
        if (b.gameCount !== a.gameCount) {
          return b.gameCount - a.gameCount;
        }
        // If tied, sort by total engagement
        return (b.totalViews + b.totalPlays) - (a.totalViews + a.totalPlays);
      });
      
    // 2. Prepare history records
    const timestamp = new Date();
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
        score: null,
        views: creator.totalViews,
        plays: creator.totalPlays,
        recordedAt: timestamp
      });
    });
    
    // 3. Save records to the history table
    console.log(`Saving ${historyRecords.length} ranking history records...`);
    
    const result = await prisma.rankingHistory.createMany({
      data: historyRecords,
      skipDuplicates: false,
    });
    
    console.log(`✅ Successfully recorded ${result.count} ranking history entries.`);
    return result.count;
  } catch (error) {
    console.error('❌ Error recording ranking history:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Main function to run the script
async function main() {
  const simulateHistory = process.argv.includes('--simulate-history');
  
  if (simulateHistory) {
    await generateHistoricalData();
  } else {
    await recordRankings();
  }
  
  // Disconnect Prisma client when done
  await prisma.$disconnect();
  console.log('Script completed.');
}

/**
 * Generates simulated historical ranking data for the past 7 days
 * This is used for development and testing of trend visualization
 */
async function generateHistoricalData() {
  console.log('📊 Recording daily rankings history...');
  console.log('Fetching current rankings...');
  
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
  
  // Create historical records with small random variations for the past 7 days
  const historyRecords = [];
  
  // Generate data for past 7 days (excluding today which already has a record)
  for (let daysAgo = 7; daysAgo > 0; daysAgo--) {
    const recordDate = new Date();
    recordDate.setDate(recordDate.getDate() - daysAgo);
    
    // Add slight variations to popularity ranking
    popularityRanking.forEach((game, index) => {
      // Alternate between up and down trends based on index (odd/even)
      const shouldTrendUp = index % 2 === 0;
      // Position change direction based on whether we want up or down trend
      const direction = shouldTrendUp ? -1 : 1; // For ranks, lower number is better
      // Gradually change position over time to create a clear trend
      const positionChange = direction * (Math.floor(daysAgo / 2) + 1);
      const position = Math.max(1, Math.min(popularityRanking.length, index + 1 + positionChange));
      
      // Create historical record
      historyRecords.push({
        entityId: game.id,
        entityType: 'game',
        rankingType: 'popularity',
        position,
        score: game.popularityScore * (shouldTrendUp ? (1.1 - daysAgo * 0.01) : (0.9 + daysAgo * 0.01)), // Trending score
        views: game.metrics?.views || 0,
        plays: game.metrics?.plays || 0,
        recordedAt: new Date(recordDate)
      });
    });
    
    // Add variations to quality ranking with balanced trends
    qualityRanking.forEach((game, index) => {
      // Opposite trends from popularity to ensure variety
      const shouldTrendUp = index % 2 !== 0;
      const direction = shouldTrendUp ? -1 : 1;
      const positionChange = direction * (Math.floor(daysAgo / 2) + 1);
      const position = Math.max(1, Math.min(qualityRanking.length, index + 1 + positionChange));
      
      historyRecords.push({
        entityId: game.id,
        entityType: 'game',
        rankingType: 'quality',
        position,
        score: game.qualityScore * (shouldTrendUp ? (1.1 - daysAgo * 0.01) : (0.9 + daysAgo * 0.01)),
        views: game.metrics?.views || 0,
        plays: game.metrics?.plays || 0,
        recordedAt: new Date(recordDate)
      });
    });
    
    // Add variations to creator ranking with balanced trends
    creatorRanking.forEach((creator, index) => {
      // Creator trends alternate like popularity
      const shouldTrendUp = index % 2 === 0;
      const direction = shouldTrendUp ? -1 : 1;
      const positionChange = direction * (Math.floor(daysAgo / 2) + 1);
      const position = Math.max(1, Math.min(creatorRanking.length, index + 1 + positionChange));
      
      historyRecords.push({
        entityId: creator.xaccount,
        entityType: 'creator',
        rankingType: 'creator',
        position,
        score: creator.gameCount * (shouldTrendUp ? (1.05 - daysAgo * 0.005) : (0.95 + daysAgo * 0.005)),
        views: creator.totalViews || 0,
        plays: creator.totalPlays || 0,
        recordedAt: new Date(recordDate)
      });
    });
  }
  
  // Save all historical records
  console.log(`Saving ${historyRecords.length} ranking history records...`);
  await prisma.rankingHistory.createMany({
    data: historyRecords,
    skipDuplicates: true,
  });
  
  console.log(`✅ Successfully recorded ${historyRecords.length} ranking history entries.`);
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

// Run the main function
main()
  .then(() => console.log('Recorded ranking entries.'))
  .catch(error => {
    console.error('Error recording rankings:', error);
    process.exit(1);
  });

module.exports = recordRankings; 