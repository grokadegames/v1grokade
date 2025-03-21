import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Get all games with their metrics
    const games = await prisma.game.findMany({
      include: {
        metrics: true,
        activities: {
          where: {
            timestamp: {
              gte: twentyFourHoursAgo
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
      // Sum up activity data for the past 24 hours
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
    console.error('Error fetching 24-hour activity data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch 24-hour activity data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 