const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const prisma = new PrismaClient();

const CSV_DIR = path.join(__dirname, 'backups/csv/2025-03-17T19-45-53-084Z');

async function restoreData() {
  try {
    console.log('Starting data restoration from CSV files...');
    
    // First restore users
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
    
    // Then restore games
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
    
    // Finally restore game metrics
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
    
    console.log('Data restoration completed!');
  } catch (error) {
    console.error('Error during restoration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function readCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

restoreData(); 