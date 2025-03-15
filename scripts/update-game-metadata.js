const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting game metadata update...');
  
  const results = [];
  
  // Read the CSV file
  console.log('Reading CSV file...');
  const csvPath = path.join(__dirname, '../csvimports/Sheet1.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`CSV file not found at ${csvPath}`);
    return;
  }
  
  // Parse the CSV file
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      console.log(`Parsed ${results.length} games from CSV`);
      
      // Get all games from the database
      const games = await prisma.game.findMany();
      console.log(`Found ${games.length} games in the database`);
      
      let updatedCount = 0;
      
      // Update each game if we find a match in the CSV data
      for (const csvGame of results) {
        // Find matching game in the database
        const matchingGame = games.find(
          dbGame => dbGame.title.toLowerCase() === csvGame.title.toLowerCase()
        );
        
        if (matchingGame) {
          // Update the game with tags and X handle
          try {
            await prisma.game.update({
              where: { id: matchingGame.id },
              data: {
                tagcategory: csvGame.tags === 'none' ? null : csvGame.tags,
                xaccount: csvGame.x_handle || null
              }
            });
            
            console.log(`Updated game: ${matchingGame.title} with tags: ${csvGame.tags}, X handle: ${csvGame.x_handle}`);
            updatedCount++;
          } catch (error) {
            console.error(`Error updating game ${matchingGame.title}:`, error);
          }
        } else {
          console.log(`No matching game found for: ${csvGame.title}`);
        }
      }
      
      console.log(`Update complete. Updated ${updatedCount} out of ${results.length} games.`);
      await prisma.$disconnect();
    });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 