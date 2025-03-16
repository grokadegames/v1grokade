import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET handler for dashboard metrics
 * - Can filter by userId to get metrics only for games created by a specific user
 * - Returns metrics and game data
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId'); // Optional user ID to filter by
    
    // If DATABASE_URL is not available, return dummy metrics
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        metrics: {
          totalGames: 51,
          totalViews: 23450,
          totalPlays: 8723,
          totalLikes: 3927,
          totalDislikes: 289,
          gameMetrics: Array(10).fill(0).map((_, i) => ({
            id: `game-${i}`,
            title: `Game ${i}`,
            creator: 'Sample Creator',
            views: Math.floor(Math.random() * 1000) + 100,
            plays: Math.floor(Math.random() * 500) + 50,
            likes: Math.floor(Math.random() * 200) + 10,
            dislikes: Math.floor(Math.random() * 50) + 1,
          }))
        }
      });
    }
    
    try {
      // Test database connection
      await prisma.$queryRaw`SELECT 1`;
      
      // Build the where clause for filtering games by user if userId is provided
      let where = {};
      if (userId) {
        where = {
          authorId: userId
        };
      }
      
      // Fetch games with their metrics
      const games = await prisma.game.findMany({
        where,
        include: {
          metrics: true,
          author: {
            select: {
              displayName: true,
              username: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      
      // Format metrics for response
      const formattedGames = games.map(game => ({
        id: game.id,
        title: game.title,
        creator: game.author?.displayName || game.author?.username || 'Unknown Creator',
        createdAt: game.createdAt,
        updatedAt: game.updatedAt,
        views: game.metrics?.views || 0,
        plays: game.metrics?.plays || 0,
        likes: game.metrics?.likes || 0,
        dislikes: game.metrics?.dislikes || 0,
      }));
      
      // Calculate totals
      const totalGames = games.length;
      const totalViews = games.reduce((sum, game) => sum + (game.metrics?.views || 0), 0);
      const totalPlays = games.reduce((sum, game) => sum + (game.metrics?.plays || 0), 0);
      const totalLikes = games.reduce((sum, game) => sum + (game.metrics?.likes || 0), 0);
      const totalDislikes = games.reduce((sum, game) => sum + (game.metrics?.dislikes || 0), 0);
      
      return NextResponse.json({
        success: true,
        metrics: {
          totalGames,
          totalViews,
          totalPlays,
          totalLikes,
          totalDislikes,
          gameMetrics: formattedGames
        }
      });
      
    } catch (dbError) {
      console.error('Dashboard metrics database error:', dbError);
      return NextResponse.json(
        { 
          error: 'Database error',
          message: dbError.message,
          stack: process.env.NODE_ENV === 'development' ? dbError.stack : undefined
        }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in dashboard metrics:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error.message
      }, 
      { status: 500 }
    );
  }
} 