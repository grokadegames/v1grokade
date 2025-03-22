#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAppleLogo() {
  try {
    console.log('Fetching Apple sponsor from database...');
    const sponsor = await prisma.sponsor.findFirst({
      where: { name: 'Apple' }
    });
    
    if (!sponsor) {
      console.log('Apple sponsor not found in database');
      return;
    }
    
    // Use a direct URL for the Apple logo
    const logoUrl = 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg';
    
    // Update the sponsor record
    await prisma.sponsor.update({
      where: { id: sponsor.id },
      data: { logoUrl: logoUrl }
    });
    
    console.log(`✅ Updated Apple with new logo URL: ${logoUrl}`);
    console.log('\nApple logo has been updated!');
  } catch (error) {
    console.error('Error updating Apple logo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update function
updateAppleLogo(); 