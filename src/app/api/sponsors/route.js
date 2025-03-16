import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Fallback data when database is unavailable
const SAMPLE_SPONSORS = [
  {
    id: '1',
    name: 'Laravel',
    description: 'Backend framework provider',
    logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/laravel-logo.png',
    website: 'https://laravel.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'React',
    description: 'Frontend library partner',
    logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/react-logo.png',
    website: 'https://reactjs.org',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Node.js',
    description: 'Server runtime environment',
    logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/nodejs-logo.png',
    website: 'https://nodejs.org',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'AWS',
    description: 'Cloud infrastructure partner',
    logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/aws-logo.png',
    website: 'https://aws.amazon.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'DigitalOcean',
    description: 'Hosting services provider',
    logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/digitalocean-logo.png',
    website: 'https://digitalocean.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'MongoDB',
    description: 'Database solutions',
    logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/mongodb-logo.png',
    website: 'https://mongodb.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Stripe',
    description: 'Payment processing',
    logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/stripe-logo.png',
    website: 'https://stripe.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Google Cloud',
    description: 'Cloud services partner',
    logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/google-logo.png',
    website: 'https://cloud.google.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '9',
    name: 'GitHub',
    description: 'Development platform',
    logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/github-logo.png',
    website: 'https://github.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '10',
    name: 'Docker',
    description: 'Container platform',
    logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/docker-logo.png',
    website: 'https://docker.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '11',
    name: 'Apple',
    description: 'Developer ecosystem',
    logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/apple-logo.png',
    website: 'https://developer.apple.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '12',
    name: 'npm',
    description: 'Package registry',
    logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/npm-logo.png',
    website: 'https://www.npmjs.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '13',
    name: 'Python',
    description: 'Programming language',
    logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/python-logo.png',
    website: 'https://python.org',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '14',
    name: 'Ubuntu',
    description: 'Operating system',
    logoUrl: 'https://res.cloudinary.com/yourcloudinary/sponsors/ubuntu-logo.png',
    website: 'https://ubuntu.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function GET(request) {
  try {
    console.log('[API] Sponsors route called');
    
    // Check if we have a DATABASE_URL
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    console.log('[API] Database URL available:', hasDatabaseUrl);
    
    // If we don't have a DATABASE_URL, return sample data
    if (!hasDatabaseUrl) {
      console.log('[API] No DATABASE_URL provided, returning sample sponsor data');
      return NextResponse.json({ 
        sponsors: SAMPLE_SPONSORS,
        message: 'Using sample data (no database connection provided)'
      }, { status: 200 });
    }
    
    // Check if we should use sample data (for testing purposes)
    const { searchParams } = new URL(request.url);
    if (searchParams.get('sample') === 'true') {
      console.log('[API] Sample data requested, returning sample sponsors');
      return NextResponse.json({ 
        sponsors: SAMPLE_SPONSORS,
        message: 'Using sample data (as requested)'
      }, { status: 200 });
    }
    
    // Test database connection first
    try {
      console.log('[API] Testing database connection...');
      await prisma.$queryRaw`SELECT 1`;
      console.log('[API] Database connection successful');
    } catch (dbError) {
      console.error('[API] Database connection error:', dbError);
      console.log('[API] Falling back to sample data due to connection error');
      
      return NextResponse.json(
        { 
          sponsors: SAMPLE_SPONSORS, 
          message: 'Database connection failed, using sample data',
          error: dbError.message,
          stack: process.env.NODE_ENV === 'development' ? dbError.stack : undefined 
        }, 
        { status: 200 } // Still return 200 with sample data
      );
    }
    
    // Query sponsors from database
    const sponsors = await prisma.sponsor.findMany({
      orderBy: {
        name: 'asc'
      }
    });
    
    console.log(`[API] Found ${sponsors.length} sponsors`);
    
    // If no sponsors found and we're in development, use sample data
    if (sponsors.length === 0 && process.env.NODE_ENV === 'development') {
      console.log('[API] No sponsors found in database, using sample data');
      return NextResponse.json({
        sponsors: SAMPLE_SPONSORS,
        message: 'No sponsors found in database, using sample data'
      }, { status: 200 });
    }
    
    return NextResponse.json({ sponsors }, { status: 200 });
  } catch (error) {
    console.error('[API] Error fetching sponsors:', error);
    
    return NextResponse.json(
      { 
        sponsors: SAMPLE_SPONSORS,
        message: 'Error fetching sponsors, using sample data',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
      }, 
      { status: 200 } // Still return 200 with fallback data
    );
  }
} 