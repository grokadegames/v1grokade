const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Generates more varied historical ranking data to make trends more visible
 */
async function generateVariedHistory() {
  try {
    console.log('Generating varied ranking history data...');
    
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
    
    // Create historical data with meaningful variations
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7); // Go back 7 days
    
    const records = [];
    
    // Generate data for each day (7 days)
    for (let day = 0; day < 7; day++) {
      const recordDate = new Date(startDate);
      recordDate.setDate(recordDate.getDate() + day);
      
      console.log(`Generating data for ${recordDate.toISOString()}`);
      
      // Shuffle rankings each day to create trends
      const dayVariation = Math.sin(day * Math.PI / 3.5) * 0.5; // Sine wave variation
      
      // Generate popularity rankings for this day
      const dailyPopularityRanking = [...popularityRanked].sort((a, b) => {
        // Add some randomness to the order
        const aRandom = Math.random() * 0.4 - 0.2 + dayVariation; // -0.2 to 0.2 + sine wave
        const bRandom = Math.random() * 0.4 - 0.2 + dayVariation;
        return (b.popularityScore * (1 + bRandom)) - (a.popularityScore * (1 + aRandom));
      });
      
      // Generate quality rankings for this day
      const dailyQualityRanking = [...qualityRanked].sort((a, b) => {
        // Add some randomness to the order
        const aRandom = Math.random() * 0.3 - 0.15 + dayVariation; // -0.15 to 0.15 + sine wave
        const bRandom = Math.random() * 0.3 - 0.15 + dayVariation;
        return (b.qualityScore * (1 + bRandom)) - (a.qualityScore * (1 + aRandom));
      });
      
      // Add popularity ranking records
      dailyPopularityRanking.forEach((game, index) => {
        records.push({
          entityId: game.id,
          entityType: 'game',
          rankingType: 'popularity',
          position: index + 1,
          score: game.popularityScore * (1 + (Math.random() * 0.1 - 0.05)), // ±5% random variation
          views: game.metrics?.views || 0,
          plays: game.metrics?.plays || 0,
          recordedAt: new Date(recordDate)
        });
      });
      
      // Add quality ranking records
      dailyQualityRanking.forEach((game, index) => {
        records.push({
          entityId: game.id,
          entityType: 'game',
          rankingType: 'quality',
          position: index + 1,
          score: game.qualityScore * (1 + (Math.random() * 0.08 - 0.04)), // ±4% random variation
          views: game.metrics?.views || 0,
          plays: game.metrics?.plays || 0,
          recordedAt: new Date(recordDate)
        });
      });
    }
    
    // Save all records to the database
    console.log(`Saving ${records.length} historical ranking records...`);
    
    // Delete existing weekly ranking data first (to avoid duplicates)
    await prisma.rankingHistory.deleteMany({
      where: {
        recordedAt: {
          gte: startDate,
          lt: new Date() // Up to now
        }
      }
    });
    
    // Save the new records in batches of 1000
    const batchSize = 1000;
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      await prisma.rankingHistory.createMany({
        data: batch,
        skipDuplicates: true
      });
      console.log(`Saved batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(records.length / batchSize)}`);
    }
    
    console.log(`Successfully generated ${records.length} varied ranking history records`);
  } catch (error) {
    console.error('Error generating varied history:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
generateVariedHistory(); 