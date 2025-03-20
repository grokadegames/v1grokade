import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    queries: {},
    filters: {},
    environment: process.env.NODE_ENV
  };
  
  try {
    // Extract query parameters
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage');
    
    console.log('[Game Debug] Request with stage:', stage);
    
    // Check database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      debugInfo.database = { connected: true };
    } catch (error) {
      console.error('[Game Debug] Database connection error:', error);
      debugInfo.database = { 
        connected: false,
        error: error.message
      };
      return NextResponse.json(debugInfo);
    }
    
    // Test counting games in total
    try {
      const totalCount = await prisma.game.count();
      debugInfo.counts = { total: totalCount };
      console.log('[Game Debug] Total game count:', totalCount);
    } catch (error) {
      console.error('[Game Debug] Error counting games:', error);
      debugInfo.errors = { counting: error.message };
    }
    
    // Check schema for stage column
    try {
      const columnInfo = await prisma.$queryRaw`
        SELECT column_name, data_type, udt_name 
        FROM information_schema.columns 
        WHERE table_name = 'games' 
        AND column_name = 'stage'
      `;
      debugInfo.schema = { stageColumn: columnInfo };
    } catch (error) {
      console.error('[Game Debug] Error checking schema:', error);
      debugInfo.errors = { 
        ...debugInfo.errors, 
        schema: error.message 
      };
    }
    
    // Test production filter
    try {
      const productionCount = await prisma.game.count({
        where: { stage: 'PRODUCTION' }
      });
      debugInfo.counts.production = productionCount;
      console.log('[Game Debug] PRODUCTION game count:', productionCount);
      
      // Get a sample production game
      if (productionCount > 0) {
        const productionSample = await prisma.game.findFirst({
          where: { stage: 'PRODUCTION' },
          select: { id: true, title: true, stage: true }
        });
        debugInfo.samples = { production: productionSample };
      }
    } catch (error) {
      console.error('[Game Debug] Error with PRODUCTION filter:', error);
      debugInfo.errors = { 
        ...debugInfo.errors, 
        production: error.message 
      };
    }
    
    // Test beta filter
    try {
      const betaCount = await prisma.game.count({
        where: { stage: 'BETA' }
      });
      debugInfo.counts.beta = betaCount;
      console.log('[Game Debug] BETA game count:', betaCount);
      
      // Get a sample beta game
      if (betaCount > 0) {
        const betaSample = await prisma.game.findFirst({
          where: { stage: 'BETA' },
          select: { id: true, title: true, stage: true }
        });
        debugInfo.samples = { 
          ...debugInfo.samples, 
          beta: betaSample 
        };
      }
    } catch (error) {
      console.error('[Game Debug] Error with BETA filter:', error);
      debugInfo.errors = { 
        ...debugInfo.errors, 
        beta: error.message 
      };
    }
    
    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('[Game Debug] Unexpected error:', error);
    return NextResponse.json(
      { 
        error: error.message, 
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
      },
      { status: 500 }
    );
  }
}
