const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testRankingHistory() {
  try {
    // Check if the rankingHistory table exists and has data
    const recordCount = await prisma.rankingHistory.count();
    console.log(`Total ranking history records: ${recordCount}`);
    
    if (recordCount > 0) {
      // Get a sample of records
      const sampleRecords = await prisma.rankingHistory.findMany({
        take: 5,
        orderBy: {
          recordedAt: 'desc'
        }
      });
      
      console.log('Sample records:');
      console.log(JSON.stringify(sampleRecords, null, 2));
      
      // Check positions for a specific entity over time
      const entityHistoryCount = await prisma.rankingHistory.count({
        where: {
          entityType: 'game',
          rankingType: 'popularity'
        }
      });
      
      if (entityHistoryCount > 0) {
        const entityWithMostHistory = await prisma.rankingHistory.groupBy({
          by: ['entityId'],
          _count: {
            entityId: true
          },
          where: {
            entityType: 'game',
            rankingType: 'popularity'
          },
          orderBy: {
            _count: {
              entityId: 'desc'
            }
          },
          take: 1
        });
        
        if (entityWithMostHistory.length > 0) {
          const entityId = entityWithMostHistory[0].entityId;
          console.log(`Checking history for entity ${entityId}...`);
          
          const entityHistory = await prisma.rankingHistory.findMany({
            where: {
              entityId,
              entityType: 'game',
              rankingType: 'popularity'
            },
            orderBy: {
              recordedAt: 'asc'
            }
          });
          
          console.log(`Found ${entityHistory.length} history records for entity ${entityId}`);
          
          if (entityHistory.length >= 2) {
            const oldestRecord = entityHistory[0];
            const newestRecord = entityHistory[entityHistory.length - 1];
            
            console.log('Oldest position:', oldestRecord.position, 'at', oldestRecord.recordedAt);
            console.log('Newest position:', newestRecord.position, 'at', newestRecord.recordedAt);
            
            const positionChange = oldestRecord.position - newestRecord.position;
            console.log('Position change:', positionChange);
            
            // If positions aren't changing, this explains why trends show 0%
            if (positionChange === 0) {
              console.log('ISSUE DETECTED: Positions are not changing in the ranking history!');
            }
          }
        }
      }
    } else {
      console.log('No ranking history data found. You need to run the data collection scripts.');
    }
  } catch (error) {
    console.error('Error testing ranking history:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRankingHistory(); 