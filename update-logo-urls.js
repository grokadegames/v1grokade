#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// More reliable CDN URLs for the logos
const newLogos = [
  {
    name: 'Docker',
    logoUrl: 'https://cdn4.iconfinder.com/data/icons/logos-and-brands/512/97_Docker_logo_logos-512.png'
  },
  {
    name: 'Google Cloud',
    logoUrl: 'https://cdn.worldvectorlogo.com/logos/google-cloud-1.svg'
  }
];

// Update database with new logo URLs
async function updateSponsorLogo(name, logoUrl) {
  try {
    // Find the sponsor by name
    const sponsor = await prisma.sponsor.findFirst({
      where: { name }
    });

    if (!sponsor) {
      console.error(`Sponsor ${name} not found in database`);
      return false;
    }

    // Update the sponsor with the new logo URL
    const result = await prisma.sponsor.update({
      where: { id: sponsor.id },
      data: { logoUrl }
    });

    console.log(`Updated ${name} logo in database to ${logoUrl}`);
    return true;
  } catch (error) {
    console.error(`Error updating ${name} in database:`, error);
    return false;
  }
}

// Main function
async function main() {
  console.log('Starting update of logo URLs...');
  
  try {
    // Update each logo URL in the database
    for (const logo of newLogos) {
      await updateSponsorLogo(logo.name, logo.logoUrl);
    }
    
    console.log('Logo URLs have been updated successfully!');
  } catch (error) {
    console.error('Error during update process:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 