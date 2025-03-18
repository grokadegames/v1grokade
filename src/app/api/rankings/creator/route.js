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
        // Add creatorScore based on gameCount and engagement
        creatorScore: creator.gameCount * 100 + Math.floor((creator.totalViews + creator.totalPlays) / 100),
        // Get the most popular game by this creator
        topGame: creator.games.sort((a, b) => {
          const aMetrics = (a.metrics?.views || 0) + (a.metrics?.plays || 0);
          const bMetrics = (b.metrics?.views || 0) + (b.metrics?.plays || 0);
          return bMetrics - aMetrics;
        })[0]
      }));

    return NextResponse.json(creatorRanking);
  } catch (error) {
    console.error('Error fetching creator rankings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch creator rankings' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 