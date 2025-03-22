#!/usr/bin/env node
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const prisma = new PrismaClient();

// Path to the mapping CSV file
const CSV_PATH = path.join(__dirname, '../cloudinary_to_imagekit_mapping.csv');

// Helper function to replace Cloudinary URLs with ImageKit URLs
function replaceCloudinaryUrl(url, urlMap) {
  if (!url) return url;
  
  // Check if we have a direct mapping for this exact URL
  if (urlMap.has(url)) {
    return urlMap.get(url);
  }
  
  // Otherwise, try to replace the domain part only
  const cloudinaryDomain = 'https://res.cloudinary.com/dxow1rafl';
  const imageKitDomain = 'https://ik.imagekit.io/cbzkrwprl';
  
  if (url.startsWith(cloudinaryDomain)) {
    return url.replace(cloudinaryDomain, imageKitDomain);
  }
  
  // Return original if no match found
  return url;
}

async function updateDatabaseUrls() {
  console.log('Starting database URL update from Cloudinary to ImageKit...');
  
  // Check if the mapping file exists
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`Error: Mapping file not found at ${CSV_PATH}`);
    process.exit(1);
  }
  
  // Load URL mappings from CSV
  const urlMappings = [];
  await new Promise((resolve) => {
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on('data', (data) => urlMappings.push(data))
      .on('end', resolve);
  });
  
  console.log(`Loaded ${urlMappings.length} URL mappings from CSV.`);
  
  // Create a lookup map for faster access
  const urlMap = new Map();
  urlMappings.forEach(entry => {
    urlMap.set(entry.cloudinary_url, entry.imagekit_url);
  });
  
  // Update User table
  console.log('Updating User table...');
  const usersToUpdate = await prisma.user.findMany({
    where: {
      profileImageUrl: {
        contains: "res.cloudinary.com"
      }
    }
  });
  console.log(`Found ${usersToUpdate.length} User records to update.`);

  for (const user of usersToUpdate) {
    if (user.profileImageUrl && user.profileImageUrl.includes('res.cloudinary.com')) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          profileImageUrl: replaceCloudinaryUrl(user.profileImageUrl, urlMap)
        }
      });
      console.log(`Updated User: ${user.id}`);
    }
  }
  
  // Update Game table
  console.log('Updating Game table...');
  const gamesToUpdate = await prisma.game.findMany({
    where: {
      OR: [
        {
          imageUrl: {
            contains: "res.cloudinary.com"
          }
        },
        {
          galleryImage1: {
            contains: "res.cloudinary.com"
          }
        },
        {
          galleryImage2: {
            contains: "res.cloudinary.com"
          }
        },
        {
          galleryImage3: {
            contains: "res.cloudinary.com"
          }
        },
        {
          galleryImage4: {
            contains: "res.cloudinary.com"
          }
        }
      ]
    }
  });
  
  console.log(`Found ${gamesToUpdate.length} Game records to update.`);
  
  for (const game of gamesToUpdate) {
    const updates = {};
    
    if (game.imageUrl && game.imageUrl.includes('res.cloudinary.com')) {
      updates.imageUrl = replaceCloudinaryUrl(game.imageUrl, urlMap);
    }
    
    if (game.galleryImage1 && game.galleryImage1.includes('res.cloudinary.com')) {
      updates.galleryImage1 = replaceCloudinaryUrl(game.galleryImage1, urlMap);
    }
    
    if (game.galleryImage2 && game.galleryImage2.includes('res.cloudinary.com')) {
      updates.galleryImage2 = replaceCloudinaryUrl(game.galleryImage2, urlMap);
    }
    
    if (game.galleryImage3 && game.galleryImage3.includes('res.cloudinary.com')) {
      updates.galleryImage3 = replaceCloudinaryUrl(game.galleryImage3, urlMap);
    }
    
    if (game.galleryImage4 && game.galleryImage4.includes('res.cloudinary.com')) {
      updates.galleryImage4 = replaceCloudinaryUrl(game.galleryImage4, urlMap);
    }

    if (Object.keys(updates).length > 0) {
      await prisma.game.update({
        where: { id: game.id },
        data: updates
      });
      console.log(`Updated Game: ${game.id}`);
    }
  }
  
  // Update Sponsor table
  console.log('Updating Sponsor table...');
  const sponsorsToUpdate = await prisma.sponsor.findMany({
    where: {
      logoUrl: {
        contains: "res.cloudinary.com"
      }
    }
  });
  console.log(`Found ${sponsorsToUpdate.length} Sponsor records to update.`);

  for (const sponsor of sponsorsToUpdate) {
    if (sponsor.logoUrl && sponsor.logoUrl.includes('res.cloudinary.com')) {
      await prisma.sponsor.update({
        where: { id: sponsor.id },
        data: {
          logoUrl: replaceCloudinaryUrl(sponsor.logoUrl, urlMap)
        }
      });
      console.log(`Updated Sponsor: ${sponsor.id}`);
    }
  }
  
  console.log('Database URL update completed successfully!');
}

// Execute the update function
updateDatabaseUrls()
  .catch(error => {
    console.error('Error updating database URLs:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 