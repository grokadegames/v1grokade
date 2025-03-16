import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Retrieve metrics for a game or all games
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');
    
    // If DATABASE_URL is not available, return dummy metrics
    if (!process.env.DATABASE_URL) {
      if (gameId) {
        return NextResponse.json({
          metrics: {
            id: 'sample-metric-id',
            gameId: gameId,
            views: Math.floor(Math.random() * 500) + 100,
            plays: Math.floor(Math.random() * 300) + 50,
            likes: Math.floor(Math.random() * 100) + 10,
            dislikes: Math.floor(Math.random() * 20) + 1,
            lastUpdated: new Date().toISOString()
          }
        });
      } else {
        // Return dummy metrics for all games if no gameId is provided
        return NextResponse.json({
          metrics: Array(10).fill(0).map((_, i) => ({
            id: `sample-metric-id-${i}`,
            gameId: `sample-game-id-${i}`,
            views: Math.floor(Math.random() * 500) + 100,
            plays: Math.floor(Math.random() * 300) + 50,
            likes: Math.floor(Math.random() * 100) + 10,
            dislikes: Math.floor(Math.random() * 20) + 1,
            lastUpdated: new Date().toISOString()
          }))
        });
      }
    }
    
    try {
      // Test database connection
      await prisma.$queryRaw`SELECT 1`;
      
      // If gameId is provided, fetch metrics for that game
      if (gameId) {
        // Find or create the metrics record for this game
        const metrics = await prisma.gameMetrics.findUnique({
          where: { gameId: gameId }
        });
        
        if (!metrics) {
          // If no metrics exist, create a new record with default values
          const newMetrics = await prisma.gameMetrics.create({
            data: { gameId }
          });
          return NextResponse.json({ metrics: newMetrics });
        }
        
        return NextResponse.json({ metrics });
      } else {
        // Fetch metrics for all games
        const allMetrics = await prisma.gameMetrics.findMany({
          include: {
            game: {
              select: {
                title: true,
                author: {
                  select: {
                    displayName: true,
                    username: true
                  }
                }
              }
            }
          }
        });
        return NextResponse.json({ metrics: allMetrics });
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
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
    console.error('Error in GET game-metrics:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

// POST - Track a metric event (view, play, like, dislike)
export async function POST(request) {
  try {
    const body = await request.json();
    const { gameId, metricType, increment = 1 } = body;
    
    if (!gameId || !metricType) {
      return NextResponse.json(
        { error: 'Missing required fields: gameId and metricType' }, 
        { status: 400 }
      );
    }
    
    // Validate metric type
    const validMetricTypes = ['views', 'plays', 'likes', 'dislikes'];
    if (!validMetricTypes.includes(metricType)) {
      return NextResponse.json(
        { error: `Invalid metric type. Must be one of: ${validMetricTypes.join(', ')}` }, 
        { status: 400 }
      );
    }
    
    // If DATABASE_URL is not available, return success without updating
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        message: 'Metric recorded (mock)',
        metrics: {
          gameId,
          [metricType]: Math.floor(Math.random() * 100) + 1
        }
      });
    }
    
    try {
      // Test database connection
      await prisma.$queryRaw`SELECT 1`;
      
      // Check if the game exists
      const gameExists = await prisma.game.findUnique({
        where: { id: gameId },
        select: { id: true }
      });
      
      if (!gameExists) {
        return NextResponse.json(
          { error: 'Game not found' }, 
          { status: 404 }
        );
      }
      
      // Find or create metrics for this game
      const existingMetrics = await prisma.gameMetrics.findUnique({
        where: { gameId }
      });
      
      let updatedMetrics;
      
      if (existingMetrics) {
        // Update existing metrics
        updatedMetrics = await prisma.gameMetrics.update({
          where: { gameId },
          data: {
            [metricType]: { increment }
          }
        });
      } else {
        // Create new metrics
        updatedMetrics = await prisma.gameMetrics.create({
          data: {
            gameId,
            [metricType]: increment
          }
        });
      }
      
      return NextResponse.json({
        success: true,
        message: `${metricType} updated successfully`,
        metrics: updatedMetrics
      });
      
    } catch (dbError) {
      console.error('Database error:', dbError);
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
    console.error('Error in POST game-metrics:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error.message 
      }, 
      { status: 500 }
    );
  }
} 