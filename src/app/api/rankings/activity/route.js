import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    // Get period parameter from URL (default to 24h)
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '24h';
    
    let timeAgo;
    switch (period) {
      case '7d':
        timeAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        timeAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        timeAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        timeAgo = oneYearAgo;
        break;
      default: // '24h'
        timeAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    }

    // Get all games with their metrics
    const games = await prisma.game.findMany({
      include: {
        metrics: true,
        activities: {
          where: {
            timestamp: {
              gte: timeAgo
            }
          }
        },
        author: {
          select: {
            id: true,
            username: true,
            displayName: true
          }
        }
      }
    });

    // Calculate 24-hour activity for each game
    const gamesWithActivityMetrics = games.map(game => {
      // Sum up activity data for the selected time period
      const views = game.activities.reduce((sum, activity) => sum + activity.views, 0);
      const plays = game.activities.reduce((sum, activity) => sum + activity.plays, 0);
      const likes = game.activities.reduce((sum, activity) => sum + activity.likes, 0);
      const dislikes = game.activities.reduce((sum, activity) => sum + activity.dislikes, 0);

      return {
        id: game.id,
        title: game.title,
        imageUrl: game.imageUrl,
        xaccount: game.xaccount,
        author: game.author,
        metrics: game.metrics,
        activityMetrics: {
          views,
          plays,
          likes,
          dislikes
        }
      };
    });

    return NextResponse.json(gamesWithActivityMetrics);
  } catch (error) {
    console.error('Error fetching activity data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 