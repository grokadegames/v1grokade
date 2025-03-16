import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    console.log('[API] Games route called');
    console.log('[API] DATABASE_URL length:', process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 'undefined');
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';
    const sortBy = searchParams.get('sort') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    
    console.log('[API] Query params:', { searchTerm, sortBy, limit });
    
    // Test database connection first
    try {
      console.log('[API] Testing database connection...');
      await prisma.$queryRaw`SELECT 1`;
      console.log('[API] Database connection successful');
    } catch (dbError) {
      console.error('[API] Database connection error:', dbError);
      return NextResponse.json(
        { 
          message: 'Database connection failed',
          error: dbError.message,
          stack: process.env.NODE_ENV === 'development' ? dbError.stack : undefined 
        }, 
        { status: 500 }
      );
    }
    
    // Build the where clause for filtering
    let where = {};
    if (searchTerm) {
      console.log('[API] Applying search filter:', searchTerm);
      where = {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      };
    }
    
    // Build the orderBy clause for sorting
    let orderBy = {};
    console.log('[API] Applying sort:', sortBy);
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'popular':
        orderBy = { createdAt: 'desc' }; // Default to newest for now
        break;
      default:
        orderBy = { createdAt: 'desc' };
    }
    
    // Add a try/catch specifically for the database query
    try {
      console.log('[API] Executing Prisma query...');
      
      // First check if there's any data in the Game table
      const count = await prisma.game.count();
      console.log('[API] Total game count in database:', count);
      
      // Fetch games
      const games = await prisma.game.findMany({
        where,
        orderBy,
        take: limit,
        include: {
          author: {
            select: {
              displayName: true,
              username: true,
            },
          },
        },
      });
      
      console.log('[API] Query successful, found', games.length, 'games');
      
      // Transform the data to match the current game card format
      const formattedGames = games.map(game => ({
        id: game.id,
        title: game.title,
        creator: game.author?.displayName || game.author?.username || 'Unknown Creator',
        description: game.description || 'No description available',
        playUrl: game.playUrl || '#',
        image: game.imageUrl,
        createdAt: game.createdAt,
        updatedAt: game.updatedAt,
        isLive: true, // Assuming all games from DB are live
        plays: 0 // Placeholder for future play count feature
      }));
      
      console.log('[API] Formatted games data, returning', formattedGames.length, 'games');
      
      // Debug log the raw imageUrl field from the first few games
      console.log('[API] Sample raw game imageUrls from database:', 
        games.slice(0, 3).map(game => ({
          id: game.id,
          title: game.title,
          rawImageUrl: game.imageUrl
        }))
      );
      
      return NextResponse.json({ games: formattedGames }, { status: 200 });
    } catch (queryError) {
      console.error('[API] Error executing query:', queryError);
      return NextResponse.json(
        { 
          message: 'Database query failed',
          error: queryError.message,
          stack: process.env.NODE_ENV === 'development' ? queryError.stack : undefined 
        }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 