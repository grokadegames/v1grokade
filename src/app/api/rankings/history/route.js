import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Create a new PrismaClient instance for each request
// Using a new instance prevents connection issues in serverless environments
const prisma = new PrismaClient();

// GET - Fetch ranking history for an entity
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get('entityId');
    const entityType = searchParams.get('entityType') || 'game';
    const rankingType = searchParams.get('rankingType') || 'popularity';
    const days = searchParams.get('days') ? parseInt(searchParams.get('days'), 10) : null;
    const hours = searchParams.get('hours') ? parseInt(searchParams.get('hours'), 10) : null;
    
    // Default to 30 days if neither days nor hours specified
    const timeFrame = hours ? hours : (days ? days * 24 : 30 * 24);
    const isHourly = hours !== null;
    
    if (!entityId) {
      return NextResponse.json(
        { error: 'entityId is required' },
        { status: 400 }
      );
    }
    
    // Get current date and date/hour in the past based on parameters
    const endDate = new Date();
    const startDate = new Date();
    
    if (isHourly) {
      startDate.setHours(startDate.getHours() - timeFrame);
    } else {
      startDate.setDate(startDate.getDate() - timeFrame / 24);
    }
    
    // Fetch history data for this entity
    const historyData = await prisma.rankingHistory.findMany({
      where: {
        entityId,
        entityType,
        rankingType,
        recordedAt: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        recordedAt: 'asc'
      }
    });
    
    // For hourly data, we might have many data points - group if needed
    let processedData = historyData;
    
    // If we have too many data points (more than 100), consider grouping
    if (historyData.length > 100) {
      // Get first and last record
      const first = historyData[0];
      const last = historyData[historyData.length - 1];
      
      // Always include first and last, plus samples in between
      const sampledData = [first];
      
      // Select evenly distributed samples based on time
      const totalTime = last.recordedAt.getTime() - first.recordedAt.getTime();
      const targetSamples = 48; // 48 samples (~ 1 per hour for daily view, or 1 per 30min for hourly)
      
      for (let i = 1; i < targetSamples - 1; i++) {
        const targetTime = first.recordedAt.getTime() + (totalTime * i / (targetSamples - 1));
        
        // Find closest record to target time
        let closest = null;
        let closestDiff = Infinity;
        
        for (const record of historyData) {
          const diff = Math.abs(record.recordedAt.getTime() - targetTime);
          if (diff < closestDiff) {
            closest = record;
            closestDiff = diff;
          }
        }
        
        if (closest) {
          sampledData.push(closest);
        }
      }
      
      sampledData.push(last);
      processedData = sampledData;
    }
    
    return NextResponse.json({
      entityId,
      entityType,
      rankingType,
      timeFrame: isHourly ? `${timeFrame}h` : `${timeFrame/24}d`,
      historyData: processedData
    });
  } catch (error) {
    console.error('Error fetching ranking history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ranking history' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Record new rankings history
export async function POST(request) {
  try {
    const { rankingData, timestamp = new Date() } = await request.json();
    
    if (!rankingData || !Array.isArray(rankingData) || rankingData.length === 0) {
      return NextResponse.json(
        { error: 'Valid rankingData array is required' },
        { status: 400 }
      );
    }
    
    // Create many records at once
    const result = await prisma.rankingHistory.createMany({
      data: rankingData.map(item => ({
        entityId: item.entityId,
        entityType: item.entityType,
        rankingType: item.rankingType,
        position: item.position,
        score: item.score,
        views: item.views,
        plays: item.plays,
        recordedAt: timestamp
      })),
      skipDuplicates: true,
    });
    
    return NextResponse.json({
      success: true,
      count: result.count,
      message: `Recorded ${result.count} ranking history entries`
    });
  } catch (error) {
    console.error('Error recording ranking history:', error);
    return NextResponse.json(
      { error: 'Failed to record ranking history' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 