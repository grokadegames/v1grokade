import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    queries: {},
    filters: {}
  };
  
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage');
    
    console.log('[DEBUG] Filter test request with stage:', stage);
    
    // Test counting games in total
    try {
      const totalCount = await prisma.game.count();
      debugInfo.counts = { total: totalCount };
      console.log('[DEBUG] Total game count:', totalCount);
    } catch (error) {
      console.error('[DEBUG] Error counting games:', error);
      debugInfo.errors = { counting: error.message };
    }
    
    // Test production filter
    try {
      const productionCount = await prisma.game.count({
        where: { stage: 'PRODUCTION' }
      });
      debugInfo.counts.production = productionCount;
      console.log('[DEBUG] PRODUCTION game count:', productionCount);
      
      // Get a sample production game
      if (productionCount > 0) {
        const productionSample = await prisma.game.findFirst({
          where: { stage: 'PRODUCTION' },
          select: { id: true, title: true, stage: true }
        });
        debugInfo.samples = { production: productionSample };
      }
    } catch (error) {
      console.error('[DEBUG] Error with PRODUCTION filter:', error);
      debugInfo.errors = { ...debugInfo.errors, production: error.message };
    }
    
    // Test beta filter
    try {
      const betaCount = await prisma.game.count({
        where: { stage: 'BETA' }
      });
      debugInfo.counts.beta = betaCount;
      console.log('[DEBUG] BETA game count:', betaCount);
      
      // Get a sample beta game
      if (betaCount > 0) {
        const betaSample = await prisma.game.findFirst({
          where: { stage: 'BETA' },
          select: { id: true, title: true, stage: true }
        });
        debugInfo.samples = { ...debugInfo.samples, beta: betaSample };
      }
    } catch (error) {
      console.error('[DEBUG] Error with BETA filter:', error);
      debugInfo.errors = { ...debugInfo.errors, beta: error.message };
    }
    
    // Test with requested stage parameter
    if (stage) {
      try {
        // Test direct parameter
        const originalCount = await prisma.game.count({
          where: { stage: stage }
        });
        debugInfo.filters.original = {
          stage: stage,
          count: originalCount
        };
        console.log(`[DEBUG] Filter with original stage "${stage}":`, originalCount);
        
        // Test uppercase parameter
        const uppercaseStage = stage.toUpperCase();
        const uppercaseCount = await prisma.game.count({
          where: { stage: uppercaseStage }
        });
        debugInfo.filters.uppercase = {
          stage: uppercaseStage,
          count: uppercaseCount
        };
        console.log(`[DEBUG] Filter with uppercase stage "${uppercaseStage}":`, uppercaseCount);
        
        // List the first few games matching the filter
        if (uppercaseCount > 0) {
          const sampleGames = await prisma.game.findMany({
            where: { stage: uppercaseStage },
            select: { id: true, title: true, stage: true },
            take: 3
          });
          debugInfo.filters.samples = sampleGames;
        }
      } catch (error) {
        console.error('[DEBUG] Error with requested filter:', error);
        debugInfo.errors = { ...debugInfo.errors, requestedFilter: error.message };
      }
    }
    
    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('[DEBUG] Unexpected error:', error);
    return NextResponse.json(
      { error: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined },
      { status: 500 }
    );
  }
} 