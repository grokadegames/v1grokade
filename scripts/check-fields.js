const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking database for tagcategory and xaccount fields...');
    
    // Query a few games
    const games = await prisma.game.findMany({
      take: 10,
      select: {
        id: true,
        title: true,
        tagcategory: true,
        xaccount: true
      }
    });
    
    console.log(`Found ${games.length} games in the database`);
    console.log(JSON.stringify(games, null, 2));
    
    // Also check the database schema
    const result = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'games' 
      AND (column_name = 'tagcategory' OR column_name = 'xaccount')
    `;
    
    console.log('\nDatabase schema check:');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 