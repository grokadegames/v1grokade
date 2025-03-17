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

    // Generate creator ranking based on X accounts
    // Count the number of games per X account
    const creatorCounts = {};
    
    games.forEach(game => {
      if (game.xaccount) {
        // Normalize X account handle (remove @ if present and convert to lowercase)
        const normalizedXAccount = game.xaccount.replace('@', '').toLowerCase();
        
        if (!creatorCounts[normalizedXAccount]) {
          creatorCounts[normalizedXAccount] = {
            xaccount: game.xaccount,
            gameCount: 1,
            games: [game],
            totalViews: game.metrics?.views || 0,
            totalPlays: game.metrics?.plays || 0
          };
        } else {
          creatorCounts[normalizedXAccount].gameCount += 1;
          creatorCounts[normalizedXAccount].games.push(game);
          creatorCounts[normalizedXAccount].totalViews += (game.metrics?.views || 0);
          creatorCounts[normalizedXAccount].totalPlays += (game.metrics?.plays || 0);
        }
      }
    });
    
    // Convert to array and sort by game count (descending)
    const creatorRanking = Object.values(creatorCounts)
      .sort((a, b) => {
        // First sort by game count
        if (b.gameCount !== a.gameCount) {
          return b.gameCount - a.gameCount;
        }
        // If tied, sort by total engagement (views + plays)
        return (b.totalViews + b.totalPlays) - (a.totalViews + a.totalPlays);
      })
      .slice(0, 25) // Limit to top 25
      .map(creator => ({
        xaccount: creator.xaccount,
        gameCount: creator.gameCount,
        totalViews: creator.totalViews,
        totalPlays: creator.totalPlays,
        // Get the most popular game by this creator
        topGame: creator.games.sort((a, b) => {
          const aMetrics = (a.metrics?.views || 0) + (a.metrics?.plays || 0);
          const bMetrics = (b.metrics?.views || 0) + (b.metrics?.plays || 0);
          return bMetrics - aMetrics;
        })[0]
      }));

    return NextResponse.json({
      popularityRanking,
      qualityRanking,
      creatorRanking
    });
  } catch (error) {
    console.error('Error fetching game rankings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game rankings' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 