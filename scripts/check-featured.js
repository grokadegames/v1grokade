const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkFeatured() {
  try {
    // Get a few sample games
    const games = await prisma.game.findMany({
      select: {
        id: true,
        title: true,
        featured: true
      },
      take: 5
    });
    
    console.log('Sample games with featured status:');
    console.log(games);
    
    // Count games
    const totalGames = await prisma.game.count();
    const featuredGames = await prisma.game.count({
      where: { featured: true }
    });
    
    console.log(`\nTotal games: ${totalGames}`);
    console.log(`Games with featured=true: ${featuredGames}`);
    console.log(`Games with featured=false: ${totalGames - featuredGames}`);
  } catch (error) {
    console.error('Error checking featured status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkFeatured(); 