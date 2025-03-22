import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cloudinaryToImageKit } from '../../../utils/imagekit';

const prisma = new PrismaClient();

// Sample sponsor data as fallback
const SAMPLE_SPONSORS = [
  {
    id: '1',
    name: 'Laravel',
    description: 'Backend framework provider',
    logoUrl: 'https://ik.imagekit.io/cbzkrwprl/sponsors/laravel-logo.svg',
    website: 'https://laravel.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Add other sponsors as needed
];

export async function GET() {
  try {
    // Check if we can connect to the database
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.log('No DATABASE_URL provided, returning sample data');
      return NextResponse.json({ sponsors: SAMPLE_SPONSORS }, { status: 200 });
    }

    // Test the database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      console.error('Database connection failed:', error);
      return NextResponse.json({ sponsors: SAMPLE_SPONSORS, error: process.env.NODE_ENV === 'development' ? error.message : 'Database error' }, { status: 200 });
    }

    // Fetch sponsors from the database
    const sponsors = await prisma.sponsor.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    // If no sponsors found, return sample data in development
    if (sponsors.length === 0 && process.env.NODE_ENV === 'development') {
      return NextResponse.json({ sponsors: SAMPLE_SPONSORS }, { status: 200 });
    }

    // Update any remaining Cloudinary URLs to ImageKit URLs
    const updatedSponsors = sponsors.map(sponsor => ({
      ...sponsor,
      logoUrl: cloudinaryToImageKit(sponsor.logoUrl)
    }));

    return NextResponse.json({ sponsors: updatedSponsors }, { status: 200 });
  } catch (error) {
    console.error('Error in sponsors API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 