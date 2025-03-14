const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed process...');
  
  // First, let's create a test user if it doesn't exist
  let adminUser;
  try {
    adminUser = await prisma.user.findUnique({
      where: { username: 'admin' }
    });
    
    if (!adminUser) {
      console.log('Creating admin user...');
      adminUser = await prisma.user.create({
        data: {
          username: 'admin',
          email: 'admin@grokade.com',
          displayName: 'Admin User',
          password: '$2a$10$X7aA1UW1.kfvUB3xMBZF7.j1HT2M1qHBHJJxoAXfyfvWmPmZDTeZa' // hashed 'password123'
        }
      });
      console.log('Admin user created!');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error with admin user:', error);
    return;
  }
  
  // Delete existing games
  console.log('Clearing existing games...');
  await prisma.game.deleteMany({});
  
  const results = [];
  
  // Read the CSV file
  console.log('Reading CSV file...');
  fs.createReadStream(path.join(__dirname, '../gamesseed.csv'))
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log(`Parsed ${results.length} games from CSV`);
      
      // Process and insert each game
      for (const game of results) {
        try {
          await prisma.game.create({
            data: {
              title: game.title,
              description: game.description || 'No description available',
              imageUrl: game.thumbnail_url || null,
              playUrl: game.official_site_url || '#',
              authorId: adminUser.id, // Use the admin user as the author
            }
          });
          console.log(`Added game: ${game.title}`);
        } catch (error) {
          console.error(`Error adding game ${game.title}:`, error);
        }
      }
      
      console.log('Seeding complete!');
      await prisma.$disconnect();
    });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 