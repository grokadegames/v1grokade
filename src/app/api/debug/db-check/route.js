import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Simple query to check database connectivity
    // This will throw an error if the database connection fails
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json(
      { 
        message: 'Database connection successful',
        timestamp: new Date().toISOString()
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Database connection error:', error);
    
    return NextResponse.json(
      { 
        message: 'Database connection failed',
        error: error.message,
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
} 