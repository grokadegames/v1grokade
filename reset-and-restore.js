const { PrismaClient } = require('@prisma/client');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

// Backup timestamp
const BACKUP_TIMESTAMP = '2025-03-17T19-45-53-084Z';
const DATABASE_URL = process.env.DATABASE_URL;

async function resetAndRestore() {
  try {
    console.log('Starting database reset and restore process...');
    
    // 1. Reset the database schema
    console.log('Resetting database schema...');
    
    // Execute each SQL command individually
    await prisma.$executeRawUnsafe(`DROP SCHEMA public CASCADE;`);
    await prisma.$executeRawUnsafe(`CREATE SCHEMA public;`);
    await prisma.$executeRawUnsafe(`GRANT ALL ON SCHEMA public TO postgres;`);
    await prisma.$executeRawUnsafe(`GRANT ALL ON SCHEMA public TO public;`);
    
    console.log('Database schema reset successfully.');
    
    // 2. Apply migrations to recreate the schema
    console.log('Applying Prisma migrations...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    // 3. Restore data using SQL dump
    console.log('Restoring data from SQL dump...');
    const sqlDumpPath = path.join(__dirname, 'prisma/backups/sql', `dump_${BACKUP_TIMESTAMP}.sql`);
    
    if (fs.existsSync(sqlDumpPath)) {
      try {
        execSync(`psql "${DATABASE_URL}" < "${sqlDumpPath}"`, { stdio: 'inherit' });
        console.log('SQL data restored successfully!');
      } catch (sqlError) {
        console.error('Error restoring from SQL dump:', sqlError.message);
        console.log('Falling back to CSV restore...');
        
        // 4. Try CSV restore as fallback
        await restoreFromCSV();
      }
    } else {
      console.log('SQL dump file not found. Using CSV restore instead.');
      await restoreFromCSV();
    }
    
    console.log('Database reset and restore completed successfully!');
  } catch (error) {
    console.error('Error during database reset and restore:', error);
    
    // If there was an error with the schema reset, try direct restoration
    try {
      console.log('Attempting direct restoration without schema reset...');
      
      // Try direct CSV restore
      await restoreFromCSV();
      
      console.log('Direct restoration completed.');
    } catch (fallbackError) {
      console.error('Error during direct restoration:', fallbackError);
    }
  } finally {
    await prisma.$disconnect();
  }
}

async function restoreFromCSV() {
  try {
    const CSV_DIR = path.join(__dirname, 'prisma/backups/csv', BACKUP_TIMESTAMP);
    
    // Helper function to read CSV files
    function readCsvFile(filePath) {
      return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
          .pipe(require('csv-parser')())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve(results))
          .on('error', (error) => reject(error));
      });
    }
    
    // Restore users
    console.log('Restoring users...');
    const users = await readCsvFile(path.join(CSV_DIR, 'User.csv'));
    for (const user of users) {
      try {
        await prisma.user.create({
          data: {
            id: user.id,
            username: user.username,
            email: user.email,
            displayName: user.displayName,
            password: user.password,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt)
          }
        });
      } catch (err) {
        console.error(`Error creating user ${user.username}:`, err.message);
      }
    }
    
    // Restore games
    console.log('Restoring games...');
    const games = await readCsvFile(path.join(CSV_DIR, 'Game.csv'));
    for (const game of games) {
      try {
        await prisma.game.create({
          data: {
            id: game.id,
            title: game.title,
            description: game.description,
            imageUrl: game.imageUrl || null,
            playUrl: game.playUrl,
            authorId: game.authorId,
            createdAt: new Date(game.createdAt),
            updatedAt: new Date(game.updatedAt),
            tagcategory: game.tagcategory || null,
            xaccount: game.xaccount || null,
            galleryImage1: game.galleryImage1 || null,
            galleryImage2: game.galleryImage2 || null,
            galleryImage3: game.galleryImage3 || null,
            galleryImage4: game.galleryImage4 || null
          }
        });
      } catch (err) {
        console.error(`Error creating game ${game.title}:`, err.message);
      }
    }
    
    // Restore sponsors
    console.log('Restoring sponsors...');
    const sponsors = await readCsvFile(path.join(CSV_DIR, 'Sponsor.csv'));
    for (const sponsor of sponsors) {
      try {
        await prisma.sponsor.create({
          data: {
            id: sponsor.id,
            name: sponsor.name,
            description: sponsor.description,
            logoUrl: sponsor.logoUrl,
            website: sponsor.website || null,
            createdAt: new Date(sponsor.createdAt),
            updatedAt: new Date(sponsor.updatedAt)
          }
        });
      } catch (err) {
        console.error(`Error creating sponsor ${sponsor.name}:`, err.message);
      }
    }
    
    // Restore game metrics
    console.log('Restoring game metrics...');
    const metrics = await readCsvFile(path.join(CSV_DIR, 'GameMetrics.csv'));
    for (const metric of metrics) {
      try {
        await prisma.gameMetrics.create({
          data: {
            id: metric.id,
            gameId: metric.gameId,
            views: parseInt(metric.views),
            plays: parseInt(metric.plays),
            likes: parseInt(metric.likes),
            dislikes: parseInt(metric.dislikes),
            lastUpdated: new Date(metric.lastUpdated)
          }
        });
      } catch (err) {
        console.error(`Error creating metrics for game ${metric.gameId}:`, err.message);
      }
    }
    
    console.log('CSV data restored successfully!');
  } catch (error) {
    console.error('Error during CSV restore:', error);
  }
}

resetAndRestore(); 