const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting to feature games...');

  try {
    // Get 5 random games to set as featured
    const games = await prisma.game.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (games.length > 0) {
      console.log(`Found ${games.length} games to feature`);
      
      // Update each game to be featured
      for (const game of games) {
        await prisma.game.update({
          where: { id: game.id },
          data: { featured: true }
        });
        console.log(`Set game "${game.title}" (${game.id}) as featured`);
      }
      
      console.log('Successfully set featured games');
    } else {
      console.log('No games found to feature');
    }
  } catch (error) {
    console.error('Error during feature operation:', error);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  }); 