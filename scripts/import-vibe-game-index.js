/**
 * Import Vibe Game Index Data
 * 
 * This script:
 * 1. Updates the Game table with data from the provided CSV
 * 2. Initializes GameMetrics with zeros for all imported games
 * 
 * Usage: node scripts/import-vibe-game-index.js [path-to-import-folder]
 * Example: node scripts/import-vibe-game-index.js VibeGameIndex_Import/2025-03-16T18-03-45-057Z
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

// Get import directory from command line or use default
const importDir = process.argv[2] || 'VibeGameIndex_Import/2025-03-16T18-03-45-057Z';
const fullImportPath = path.resolve(process.cwd(), importDir);

// File paths
const gamesCsvPath = path.join(fullImportPath, 'Game.csv');

// Function to parse CSV file and return array of objects
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Parse date strings to Date objects for Prisma
function parseDates(obj) {
  const result = { ...obj };
  
  // Handle dates in ISO format
  for (const [key, value] of Object.entries(result)) {
    if (typeof value === 'string' && 
        (key.includes('createdAt') || 
         key.includes('updatedAt') || 
         key.includes('lastUpdated'))) {
      try {
        result[key] = new Date(value);
      } catch (error) {
        console.warn(`Could not parse date for field ${key}: ${value}`);
      }
    }
  }
  
  return result;
}

// Import games data and initialize metrics
async function importGames(gamesData) {
  console.log(`Starting import of ${gamesData.length} games...`);
  let updated = 0;
  let created = 0;
  let errors = 0;
  let metricsCreated = 0;
  let metricsErrors = 0;
  
  for (const gameData of gamesData) {
    try {
      // Parse dates for Prisma
      const parsedData = parseDates(gameData);
      
      // Check if game exists
      const existingGame = await prisma.game.findUnique({
        where: { id: gameData.id },
        include: { metrics: true }
      });
      
      let result;
      
      if (existingGame) {
        // Update existing game
        result = await prisma.game.update({
          where: { id: gameData.id },
          data: parsedData
        });
        updated++;
      } else {
        // Create new game
        result = await prisma.game.create({
          data: parsedData
        });
        created++;
      }
      
      // Initialize or update metrics to zeros
      try {
        if (existingGame?.metrics) {
          // Metrics already exist, no need to update zeros
        } else {
          // Create metrics with zeros
          await prisma.gameMetrics.create({
            data: {
              gameId: result.id,
              views: 0,
              plays: 0,
              likes: 0,
              dislikes: 0
            }
          });
          metricsCreated++;
        }
      } catch (metricsError) {
        console.error(`Error initializing metrics for game ${gameData.id} (${gameData.title}):`, metricsError);
        metricsErrors++;
      }
      
      if ((updated + created) % 10 === 0 || (updated + created) === gamesData.length) {
        console.log(`Processed ${updated + created}/${gamesData.length} games (${updated} updated, ${created} created)`);
      }
    } catch (error) {
      console.error(`Error updating game ${gameData.id} (${gameData.title}):`, error);
      errors++;
    }
  }
  
  console.log(`Games import complete: ${updated} updated, ${created} created, ${errors} errors`);
  console.log(`Game metrics: ${metricsCreated} initialized, ${metricsErrors} errors`);
  return { updated, created, errors, metricsCreated, metricsErrors };
}

// Main function
async function main() {
  console.log(`Starting Vibe Game Index import from ${fullImportPath}`);
  
  try {
    // Check if files exist
    if (!fs.existsSync(gamesCsvPath)) {
      throw new Error(`Games CSV file not found: ${gamesCsvPath}`);
    }
    
    // Parse CSV files
    console.log('Parsing Games CSV...');
    const gamesData = await parseCSV(gamesCsvPath);
    console.log(`Found ${gamesData.length} games in CSV`);
    
    // Import games and initialize metrics
    console.log('\nImporting games and initializing metrics...');
    const result = await importGames(gamesData);
    
    console.log('\nImport Summary:');
    console.log(`Games: ${result.updated} updated, ${result.created} created, ${result.errors} errors`);
    console.log(`Game Metrics: ${result.metricsCreated} initialized, ${result.metricsErrors} errors`);
    
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
main()
  .then(() => {
    console.log('Import completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Import failed with errors:', error);
    process.exit(1);
  }); 