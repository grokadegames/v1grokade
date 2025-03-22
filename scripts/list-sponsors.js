#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listSponsors() {
  try {
    console.log('Fetching all sponsors from database...');
    const sponsors = await prisma.sponsor.findMany({
      orderBy: { name: 'asc' }
    });
    
    console.log(`\nFound ${sponsors.length} sponsors:\n`);
    
    // Print each sponsor and their logo URL
    sponsors.forEach(sponsor => {
      console.log(`${sponsor.name}:`);
      console.log(`  Logo URL: ${sponsor.logoUrl || 'No logo URL'}`);
      console.log(`  Website: ${sponsor.website || 'No website'}`);
      console.log('-'.repeat(50));
    });
    
  } catch (error) {
    console.error('Error listing sponsors:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the function
listSponsors(); 