import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Create a direct Prisma client instance for this route
const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log('API Test: Attempting to connect to database...');
    
    // Test database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('API Test: Database connection successful');
    } catch (dbError) {
      console.error('API Test: Database connection failed:', dbError);
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: dbError.message
      }, { status: 500 });
    }
    
    // Try a simple query to get a few games
    console.log('API Test: Fetching games...');
    const games = await prisma.game.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            displayName: true,
            username: true,
          },
        },
      },
    });
    
    console.log(`API Test: Found ${games.length} games`);
    
    // Return a simplified response
    const simpleGames = games.map(game => ({
      id: game.id,
      title: game.title,
      creator: game.author?.displayName || game.author?.username || 'Unknown',
      description: game.description || 'No description',
      tags: game.tagcategory || '',
      xaccount: game.xaccount || ''
    }));
    
    return NextResponse.json({
      status: 'success',
      message: 'Games retrieved successfully',
      count: games.length,
      games: simpleGames
    }, { status: 200 });
  } catch (error) {
    console.error('API Test Error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to fetch games',
      error: error.message
    }, { status: 500 });
  }
} 