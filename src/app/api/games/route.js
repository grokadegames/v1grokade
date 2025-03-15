import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Fallback data when database is unavailable
const SAMPLE_GAMES = [
  {
    id: 'brick-breaker',
    title: 'Brick Breaker',
    creator: 'Grokade Team',
    description: 'Classic brick breaking game with paddle and power-ups',
    playUrl: 'https://example.com/brick-breaker',
    image: null,
    createdAt: new Date().toISOString(),
    isLive: true,
    plays: 120
  },
  {
    id: 'snake',
    title: 'Snake Game',
    creator: 'Grokade Team',
    description: 'Classic snake game - grow as you eat and avoid walls!',
    playUrl: 'https://example.com/snake',
    image: null,
    createdAt: new Date().toISOString(),
    isLive: true,
    plays: 85
  },
  {
    id: 'tetris',
    title: 'Tetris',
    creator: 'Grokade Team',
    description: 'The classic block-stacking puzzle game',
    playUrl: 'https://example.com/tetris',
    image: null,
    createdAt: new Date().toISOString(),
    isLive: true,
    plays: 210
  }
];

export async function GET(request) {
  try {
    console.log('[API] Games route called');
    
    // Check if we have a DATABASE_URL
    const hasDatabaseUrl = !!process.env.DATABASE_URL;
    console.log('[API] Database URL available:', hasDatabaseUrl);
    console.log('[API] DATABASE_URL length:', hasDatabaseUrl ? process.env.DATABASE_URL.length : 'undefined');
    
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';
    const sortBy = searchParams.get('sort') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    
    console.log('[API] Query params:', { searchTerm, sortBy, limit });
    
    // If we don't have a DATABASE_URL, return sample data
    if (!hasDatabaseUrl) {
      console.log('[API] No DATABASE_URL provided, returning sample data');
      return NextResponse.json({ 
        games: SAMPLE_GAMES,
        message: 'Using sample data (no database connection provided)'
      }, { status: 200 });
    }
    
    // Check if we should use sample data (for testing purposes)
    if (searchParams.get('sample') === 'true') {
      console.log('[API] Sample data requested, returning sample games');
      return NextResponse.json({ 
        games: SAMPLE_GAMES,
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
          games: SAMPLE_GAMES, 
          message: 'Database connection failed, using sample data',
          error: dbError.message,
          stack: process.env.NODE_ENV === 'development' ? dbError.stack : undefined 
        }, 
        { status: 200 } // Still return 200 with sample data
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
      
      // If no games in database, return sample data
      if (count === 0) {
        console.log('[API] No games found in database, returning sample data');
        return NextResponse.json({ 
          games: SAMPLE_GAMES,
          message: 'No games found in database, using sample data'
        }, { status: 200 });
      }
      
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
      
      // If no games match the query, return sample data
      if (games.length === 0) {
        console.log('[API] No games match search criteria, returning sample data');
        return NextResponse.json({ 
          games: SAMPLE_GAMES,
          message: 'No games match search criteria, using sample data'
        }, { status: 200 });
      }
      
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
        plays: 0, // Placeholder for future play count feature
        tags: game.tagcategory || '',
        xaccount: game.xaccount || ''
      }));
      
      console.log('[API] Formatted games data, returning', formattedGames.length, 'games');
      
      return NextResponse.json({ games: formattedGames }, { status: 200 });
    } catch (queryError) {
      console.error('[API] Error executing query:', queryError);
      console.log('[API] Falling back to sample data due to query error');
      
      return NextResponse.json(
        { 
          games: SAMPLE_GAMES,
          message: 'Database query failed, using sample data',
          error: queryError.message,
          stack: process.env.NODE_ENV === 'development' ? queryError.stack : undefined 
        }, 
        { status: 200 } // Still return 200 with sample data
      );
    }
  } catch (error) {
    console.error('[API] Unexpected error:', error);
    console.log('[API] Falling back to sample data due to unexpected error');
    
    return NextResponse.json(
      { 
        games: SAMPLE_GAMES,
        message: 'Internal server error, using sample data',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 200 } // Still return 200 with sample data
    );
  }
} 