const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Generates 24-hour historical ranking data with hourly snapshots
 * This provides detailed data for the 1d timeframe
 */
async function generateDailyHistory() {
  try {
    console.log('Generating 24-hour ranking history data...');
    
    // Get current games
    const games = await prisma.game.findMany({
      include: {
        metrics: true
      }
    });
    
    if (games.length === 0) {
      console.log('No games found to generate history for.');
      return;
    }
    
    console.log(`Found ${games.length} games to generate history for.`);
    
    // Calculate current popularity rankings
    const popularityRanked = [...games].map(game => ({
      ...game,
      popularityScore: (game.metrics?.views || 0) + ((game.metrics?.plays || 0) * 2)
    })).sort((a, b) => b.popularityScore - a.popularityScore);
    
    // Calculate current quality rankings
    const qualityRanked = [...games].map(game => {
      const likes = game.metrics?.likes || 0;
      const dislikes = game.metrics?.dislikes || 0;
      const total = likes + dislikes;
      return {
        ...game,
        qualityScore: total === 0 ? 0.5 : likes / total
      };
    }).sort((a, b) => b.qualityScore - a.qualityScore);
    
    // Create a list of creator IDs from games
    const creatorIds = new Set();
    games.forEach(game => {
      if (game.xaccount) {
        creatorIds.add(game.xaccount);
      }
    });
    
    // Create creator ranking data
    const creatorData = [...creatorIds].map(xaccount => {
      const creatorGames = games.filter(game => game.xaccount === xaccount);
      const totalViews = creatorGames.reduce((sum, game) => sum + (game.metrics?.views || 0), 0);
      const totalPlays = creatorGames.reduce((sum, game) => sum + (game.metrics?.plays || 0), 0);
      
      return {
        xaccount,
        gameCount: creatorGames.length,
        totalViews,
        totalPlays,
        creatorScore: creatorGames.length * 100 + (totalViews + totalPlays) / 100
      };
    }).sort((a, b) => b.creatorScore - a.creatorScore);
    
    // Create hourly data for past 24 hours
    const hourlyRecords = [];
    const now = new Date();
    const startTime = new Date(now);
    startTime.setHours(startTime.getHours() - 24);
    
    // Generate data for each hour (24 hours)
    for (let hour = 0; hour <= 24; hour++) {
      const recordTime = new Date(startTime);
      recordTime.setHours(recordTime.getHours() + hour);
      
      console.log(`Generating data for ${recordTime.toISOString()}`);
      
      // Create time-based variation factor (sine wave)
      const timeOfDay = recordTime.getHours();
      const timeVariation = Math.sin(timeOfDay / 24 * Math.PI * 2) * 0.3; // Sine wave variation
      
      // Generate hourly popularity rankings
      const hourlyPopularityRanking = [...popularityRanked].sort((a, b) => {
        // Add some randomness + time-based variation
        const aRandom = Math.random() * 0.3 - 0.15 + timeVariation;
        const bRandom = Math.random() * 0.3 - 0.15 + timeVariation;
        return (b.popularityScore * (1 + bRandom)) - (a.popularityScore * (1 + aRandom));
      });
      
      // Generate hourly quality rankings
      const hourlyQualityRanking = [...qualityRanked].sort((a, b) => {
        // Add some randomness + time-based variation
        const aRandom = Math.random() * 0.2 - 0.1 + timeVariation / 2;
        const bRandom = Math.random() * 0.2 - 0.1 + timeVariation / 2;
        return (b.qualityScore * (1 + bRandom)) - (a.qualityScore * (1 + aRandom));
      });
      
      // Generate hourly creator rankings
      const hourlyCreatorRanking = [...creatorData].sort((a, b) => {
        // Add some randomness + time-based variation
        const aRandom = Math.random() * 0.15 - 0.075 + timeVariation / 3;
        const bRandom = Math.random() * 0.15 - 0.075 + timeVariation / 3;
        return (b.creatorScore * (1 + bRandom)) - (a.creatorScore * (1 + aRandom));
      });
      
      // Add popularity ranking records
      hourlyPopularityRanking.forEach((game, index) => {
        hourlyRecords.push({
          entityId: game.id,
          entityType: 'game',
          rankingType: 'popularity',
          position: index + 1,
          score: game.popularityScore * (1 + (Math.random() * 0.1 - 0.05)), // ±5% random variation
          views: game.metrics?.views || 0,
          plays: game.metrics?.plays || 0,
          recordedAt: new Date(recordTime)
        });
      });
      
      // Add quality ranking records
      hourlyQualityRanking.forEach((game, index) => {
        hourlyRecords.push({
          entityId: game.id,
          entityType: 'game',
          rankingType: 'quality',
          position: index + 1,
          score: game.qualityScore * (1 + (Math.random() * 0.08 - 0.04)), // ±4% random variation
          views: game.metrics?.views || 0,
          plays: game.metrics?.plays || 0,
          recordedAt: new Date(recordTime)
        });
      });
      
      // Add creator ranking records
      hourlyCreatorRanking.forEach((creator, index) => {
        hourlyRecords.push({
          entityId: creator.xaccount,
          entityType: 'creator',
          rankingType: 'creator',
          position: index + 1,
          score: creator.creatorScore * (1 + (Math.random() * 0.05 - 0.025)), // ±2.5% random variation
          views: creator.totalViews || 0,
          plays: creator.totalPlays || 0,
          recordedAt: new Date(recordTime)
        });
      });
    }
    
    // Save hourly records to the database
    console.log(`Saving ${hourlyRecords.length} hourly ranking records...`);
    
    // Delete existing 24-hour data first
    await prisma.rankingHistory.deleteMany({
      where: {
        recordedAt: {
          gte: startTime,
          lte: now
        }
      }
    });
    
    // Save the records in batches
    const batchSize = 1000;
    for (let i = 0; i < hourlyRecords.length; i += batchSize) {
      const batch = hourlyRecords.slice(i, i + batchSize);
      await prisma.rankingHistory.createMany({
        data: batch,
        skipDuplicates: true
      });
      console.log(`Saved batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(hourlyRecords.length / batchSize)}`);
    }
    
    console.log(`Successfully generated ${hourlyRecords.length} hourly ranking records`);
  } catch (error) {
    console.error('Error generating daily history:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
generateDailyHistory(); 