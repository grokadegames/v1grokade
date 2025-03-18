import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get all games with their metrics and author information
    const games = await prisma.game.findMany({
      include: {
        metrics: true,
        author: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        }
      }
    });

    // Calculate popularity score for each game (views + plays * 2)
    const gamesWithPopularityScore = games.map(game => {
      const views = game.metrics?.views || 0;
      const plays = game.metrics?.plays || 0;
      // Weight plays more than views since they indicate stronger engagement
      const popularityScore = views + (plays * 2);
      
      return {
        ...game,
        popularityScore
      };
    });

    // Sort games by popularity score (descending) and limit to top 25
    const popularityRanking = gamesWithPopularityScore
      .sort((a, b) => {
        // Games with some activity come first
        const aHasActivity = (a.metrics?.views || 0) + (a.metrics?.plays || 0) > 0;
        const bHasActivity = (b.metrics?.views || 0) + (b.metrics?.plays || 0) > 0;
        
        if (aHasActivity && !bHasActivity) return -1;
        if (!aHasActivity && bHasActivity) return 1;
        
        // Then sort by popularity score
        return b.popularityScore - a.popularityScore;
      })
      .slice(0, 25);

    return NextResponse.json(popularityRanking);
  } catch (error) {
    console.error('Error fetching popular rankings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch popular rankings' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 