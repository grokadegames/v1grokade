import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('search') || '';
    const sortBy = searchParams.get('sort') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    
    // Build the where clause for filtering
    const where = searchTerm 
      ? {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
          ],
        }
      : {};
    
    // Build the orderBy clause for sorting
    let orderBy = {};
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'popular':
        // For future implementation when you have a plays/popularity field
        orderBy = { createdAt: 'desc' }; // Default to newest for now
        break;
      default:
        orderBy = { createdAt: 'desc' };
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

    // Transform the data to match the current game card format
    const formattedGames = games.map(game => ({
      id: game.id,
      title: game.title,
      creator: game.author.displayName || game.author.username,
      description: game.description,
      playUrl: game.playUrl,
      image: game.imageUrl,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
      isLive: true, // Assuming all games from DB are live
      plays: 0 // Placeholder for future play count feature
    }));

    return NextResponse.json({ games: formattedGames }, { status: 200 });
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 