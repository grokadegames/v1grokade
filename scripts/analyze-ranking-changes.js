const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Analyzes changes between the two most recent ranking snapshots
 */
async function analyzeRankingChanges() {
  try {
    console.log('Analyzing recent ranking changes...');
    
    // Get distinct timestamps, ordered by most recent first
    const timestamps = await prisma.rankingHistory.findMany({
      select: {
        recordedAt: true,
      },
      distinct: ['recordedAt'],
      orderBy: {
        recordedAt: 'desc',
      },
      take: 2, // Get the two most recent timestamps
    });
    
    if (timestamps.length < 2) {
      console.log('Not enough history data to compare changes');
      return;
    }
    
    const newestTimestamp = timestamps[0].recordedAt;
    const previousTimestamp = timestamps[1].recordedAt;
    
    console.log(`Comparing rankings between:
- Latest: ${newestTimestamp.toISOString()}
- Previous: ${previousTimestamp.toISOString()}
- Time difference: ${Math.round((newestTimestamp - previousTimestamp) / (1000 * 60))} minutes
`);
    
    // Analyze each ranking type
    await analyzeRankingType('popularity', newestTimestamp, previousTimestamp);
    await analyzeRankingType('quality', newestTimestamp, previousTimestamp);
    await analyzeRankingType('creator', newestTimestamp, previousTimestamp);
    
  } catch (error) {
    console.error('Error analyzing ranking changes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Analyze changes for a specific ranking type
 */
async function analyzeRankingType(rankingType, newestTimestamp, previousTimestamp) {
  // Get newest rankings
  const newestRankings = await prisma.rankingHistory.findMany({
    where: {
      rankingType,
      recordedAt: newestTimestamp,
    },
    orderBy: {
      position: 'asc',
    },
  });
  
  // Get previous rankings
  const previousRankings = await prisma.rankingHistory.findMany({
    where: {
      rankingType,
      recordedAt: previousTimestamp,
    },
    orderBy: {
      position: 'asc',
    },
  });
  
  // Create a map of entity IDs to previous positions
  const previousPositions = {};
  previousRankings.forEach(item => {
    previousPositions[item.entityId] = item.position;
  });
  
  // Count changes
  let unchangedCount = 0;
  let improvedCount = 0;
  let declinedCount = 0;
  let newEntitiesCount = 0;
  let totalPositionChange = 0;
  let bigMovers = [];
  
  newestRankings.forEach(newest => {
    const previousPosition = previousPositions[newest.entityId];
    
    if (previousPosition === undefined) {
      newEntitiesCount++;
    } else {
      const positionChange = previousPosition - newest.position; // Positive = improved rank
      
      if (positionChange === 0) {
        unchangedCount++;
      } else if (positionChange > 0) {
        improvedCount++;
        totalPositionChange += positionChange;
        
        // Track significant movers (3+ positions)
        if (positionChange >= 3) {
          bigMovers.push({
            entityId: newest.entityId,
            oldPosition: previousPosition,
            newPosition: newest.position,
            change: positionChange,
          });
        }
      } else {
        declinedCount++;
        totalPositionChange += Math.abs(positionChange);
        
        // Track significant movers (3+ positions)
        if (positionChange <= -3) {
          bigMovers.push({
            entityId: newest.entityId,
            oldPosition: previousPosition,
            newPosition: newest.position,
            change: positionChange,
          });
        }
      }
    }
  });
  
  // Sort big movers by absolute change
  bigMovers.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  
  // Output results
  console.log(`\n=== ${rankingType.toUpperCase()} RANKING CHANGES ===`);
  console.log(`Total entities: ${newestRankings.length}`);
  console.log(`Unchanged positions: ${unchangedCount}`);
  console.log(`Improved positions: ${improvedCount}`);
  console.log(`Declined positions: ${declinedCount}`);
  console.log(`New entities: ${newEntitiesCount}`);
  console.log(`Average position change: ${(totalPositionChange / (improvedCount + declinedCount)).toFixed(1)} positions`);
  
  if (bigMovers.length > 0) {
    console.log('\nSignificant position changes:');
    bigMovers.slice(0, 5).forEach(mover => {
      const direction = mover.change > 0 ? 'improved' : 'dropped';
      console.log(`- Entity ${mover.entityId.substring(0, 10)}... ${direction} by ${Math.abs(mover.change)} positions (${mover.oldPosition} → ${mover.newPosition})`);
    });
    
    if (bigMovers.length > 5) {
      console.log(`...and ${bigMovers.length - 5} more significant changes`);
    }
  }
}

// Run the function
analyzeRankingChanges(); 