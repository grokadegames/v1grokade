const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Generates historical ranking data WITHOUT deleting existing data
 * This is a safe version that only adds new data
 */
async function generateSafeHistory() {
  try {
    console.log('Generating safe ranking history data...');
    
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
    
    // Generate safe ranking history data
    const allRecords = [];
    
    // Generate daily data (past 24 hours)
    const dailyRecords = generatePeriodData(popularityRanked, qualityRanked, creatorData, 24, 'hours');
    console.log(`Generated ${dailyRecords.length} hourly records`);
    allRecords.push(...dailyRecords);
    
    // Generate weekly data (past 7 days with daily points)
    const weeklyRecords = generatePeriodData(popularityRanked, qualityRanked, creatorData, 7, 'days');
    console.log(`Generated ${weeklyRecords.length} daily records`);
    allRecords.push(...weeklyRecords);
    
    // Generate monthly data (past 30 days with 3-day points)
    const monthlyRecords = generatePeriodData(popularityRanked, qualityRanked, creatorData, 10, 'three-days');
    console.log(`Generated ${monthlyRecords.length} 3-day records`);
    allRecords.push(...monthlyRecords);
    
    // Save the records in batches of 1000
    console.log(`Saving ${allRecords.length} historical ranking records...`);
    
    const batchSize = 1000;
    for (let i = 0; i < allRecords.length; i += batchSize) {
      const batch = allRecords.slice(i, i + batchSize);
      await prisma.rankingHistory.createMany({
        data: batch,
        skipDuplicates: true // Skip if records already exist
      });
      console.log(`Saved batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allRecords.length / batchSize)}`);
    }
    
    console.log(`Successfully generated ${allRecords.length} ranking history records`);
  } catch (error) {
    console.error('Error generating safe history:', error);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Generate data for a specific time period
 */
function generatePeriodData(popularityRanked, qualityRanked, creatorData, count, periodType) {
  const records = [];
  const now = new Date();
  
  let interval;
  let startTime;
  
  if (periodType === 'hours') {
    interval = 60 * 60 * 1000; // 1 hour in ms
    startTime = new Date(now.getTime() - (count * interval));
  } else if (periodType === 'days') {
    interval = 24 * 60 * 60 * 1000; // 1 day in ms
    startTime = new Date(now.getTime() - (count * interval));
  } else if (periodType === 'three-days') {
    interval = 3 * 24 * 60 * 60 * 1000; // 3 days in ms
    startTime = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)); // go back 30 days
    count = 10; // 10 data points over 30 days
  }
  
  // Generate data for each interval
  for (let i = 0; i <= count; i++) {
    const recordTime = new Date(startTime.getTime() + (i * interval));
    
    // Create variation based on time period
    let timeVariation;
    if (periodType === 'hours') {
      const hourOfDay = recordTime.getHours();
      timeVariation = Math.sin(hourOfDay / 24 * Math.PI * 2) * 0.3;
    } else if (periodType === 'days') {
      const dayOfWeek = recordTime.getDay();
      timeVariation = Math.cos(dayOfWeek / 7 * Math.PI * 2) * 0.4;
    } else {
      const dayOfMonth = recordTime.getDate();
      timeVariation = Math.sin(dayOfMonth / 30 * Math.PI * 2) * 0.5;
    }
    
    // Generate rankings with variation
    const periodPopularityRanking = addVariationToRanking(popularityRanked, timeVariation, 0.3);
    const periodQualityRanking = addVariationToRanking(qualityRanked, timeVariation * 0.7, 0.2);
    const periodCreatorRanking = addVariationToRanking(creatorData, timeVariation * 0.5, 0.15);
    
    // Add popularity ranking records
    periodPopularityRanking.forEach((game, index) => {
      records.push({
        entityId: game.id,
        entityType: 'game',
        rankingType: 'popularity',
        position: index + 1,
        score: game.popularityScore * (1 + (Math.random() * 0.1 - 0.05)),
        views: game.metrics?.views || 0,
        plays: game.metrics?.plays || 0,
        recordedAt: new Date(recordTime)
      });
    });
    
    // Add quality ranking records
    periodQualityRanking.forEach((game, index) => {
      records.push({
        entityId: game.id,
        entityType: 'game',
        rankingType: 'quality',
        position: index + 1,
        score: game.qualityScore * (1 + (Math.random() * 0.08 - 0.04)),
        views: game.metrics?.views || 0,
        plays: game.metrics?.plays || 0,
        recordedAt: new Date(recordTime)
      });
    });
    
    // Add creator ranking records
    periodCreatorRanking.forEach((creator, index) => {
      records.push({
        entityId: creator.xaccount,
        entityType: 'creator',
        rankingType: 'creator',
        position: index + 1,
        score: creator.creatorScore * (1 + (Math.random() * 0.05 - 0.025)),
        views: creator.totalViews || 0,
        plays: creator.totalPlays || 0,
        recordedAt: new Date(recordTime)
      });
    });
  }
  
  return records;
}

/**
 * Add variation to ranking order
 */
function addVariationToRanking(ranking, timeVariation, randomFactor) {
  return [...ranking].sort((a, b) => {
    const aRandom = Math.random() * randomFactor * 2 - randomFactor + timeVariation;
    const bRandom = Math.random() * randomFactor * 2 - randomFactor + timeVariation;
    
    // Use the score property (could be popularityScore, qualityScore, or creatorScore)
    const aScore = a.popularityScore || a.qualityScore || a.creatorScore || 0;
    const bScore = b.popularityScore || b.qualityScore || b.creatorScore || 0;
    
    return (bScore * (1 + bRandom)) - (aScore * (1 + aRandom));
  });
}

// Run the function
generateSafeHistory(); 