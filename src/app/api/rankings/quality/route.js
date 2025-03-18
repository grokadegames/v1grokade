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

    // Calculate quality score for each game (likes / (likes + dislikes))
    const gamesWithQualityScore = games.map(game => {
      const likes = game.metrics?.likes || 0;
      const dislikes = game.metrics?.dislikes || 0;
      const total = likes + dislikes;
      
      // If no likes or dislikes, use 50% as default
      // Otherwise calculate the ratio of likes to total
      const qualityScore = total === 0 ? 0.5 : likes / total;
      
      return {
        ...game,
        qualityScore
      };
    });

    // Only include games with at least some activity for quality ranking
    const qualityRanking = gamesWithQualityScore
      .sort((a, b) => {
        // Games with some activity come first
        const aHasActivity = (a.metrics?.likes || 0) + (a.metrics?.dislikes || 0) > 0;
        const bHasActivity = (b.metrics?.likes || 0) + (b.metrics?.dislikes || 0) > 0;
        
        if (aHasActivity && !bHasActivity) return -1;
        if (!aHasActivity && bHasActivity) return 1;
        
        // Then sort by quality score
        return b.qualityScore - a.qualityScore;
      })
      .slice(0, 25); // Limit to top 25

    return NextResponse.json(qualityRanking);
  } catch (error) {
    console.error('Error fetching quality rankings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quality rankings' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 