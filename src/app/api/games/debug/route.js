import { NextResponse } from 'next/server';
import prismaOriginal from '@/lib/prisma';
import prismaFixed from '@/lib/prisma-fix';

export async function GET(request) {
  try {
    console.log('[DEBUG API] Debug endpoint called');
    
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage') || 'PRODUCTION';
    const useOriginal = searchParams.get('original') === 'true';
    
    console.log('[DEBUG API] Parameters:', { stage, useOriginal });
    
    // Prepare diagnostics
    const diagnostics = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlLength: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
      stage: stage,
      clientType: useOriginal ? 'original' : 'fixed',
      tests: []
    };
    
    // Use the selected Prisma client
    const prisma = useOriginal ? prismaOriginal : prismaFixed;
    
    // Test 1: Basic connection
    try {
      console.log('[DEBUG API] Testing basic database connection');
      await prisma.$queryRaw`SELECT 1`;
      diagnostics.tests.push({
        name: 'Basic connection',
        success: true,
        message: 'Database connection successful'
      });
    } catch (error) {
      console.error('[DEBUG API] Basic connection test failed:', error);
      diagnostics.tests.push({
        name: 'Basic connection',
        success: false,
        message: error.message,
        error: error.toString()
      });
      
      // If basic connection fails, return early
      return NextResponse.json(diagnostics, { status: 500 });
    }
    
    // Test 2: Count all games
    try {
      console.log('[DEBUG API] Counting all games');
      const count = await prisma.game.count();
      diagnostics.tests.push({
        name: 'Count all games',
        success: true,
        count: count,
        message: `Found ${count} games in total`
      });
    } catch (error) {
      console.error('[DEBUG API] Count all games test failed:', error);
      diagnostics.tests.push({
        name: 'Count all games',
        success: false,
        message: error.message,
        error: error.toString()
      });
    }
    
    // Test 3: Count games by stage
    try {
      console.log(`[DEBUG API] Counting games with stage=${stage}`);
      const count = await prisma.game.count({
        where: { stage: stage }
      });
      diagnostics.tests.push({
        name: 'Count games by stage',
        success: true,
        count: count,
        stage: stage,
        message: `Found ${count} games with stage=${stage}`
      });
    } catch (error) {
      console.error('[DEBUG API] Count by stage test failed:', error);
      diagnostics.tests.push({
        name: 'Count games by stage',
        success: false,
        stage: stage,
        message: error.message,
        error: error.toString()
      });
      
      // Try a raw SQL query as a fallback
      try {
        console.log('[DEBUG API] Attempting raw SQL count by stage');
        const result = await prisma.$queryRaw`
          SELECT COUNT(*) as count FROM games WHERE stage = ${stage}::text::"GameStage"
        `;
        
        const rawCount = parseInt(result[0].count.toString());
        
        diagnostics.tests.push({
          name: 'Raw SQL count by stage',
          success: true,
          count: rawCount,
          stage: stage,
          message: `Found ${rawCount} games with stage=${stage} using raw SQL`
        });
      } catch (rawError) {
        console.error('[DEBUG API] Raw SQL count by stage failed:', rawError);
        diagnostics.tests.push({
          name: 'Raw SQL count by stage',
          success: false,
          stage: stage,
          message: rawError.message,
          error: rawError.toString()
        });
      }
    }
    
    // Test 4: Get sample games by stage
    try {
      console.log(`[DEBUG API] Fetching sample games with stage=${stage}`);
      const games = await prisma.game.findMany({
        where: { stage: stage },
        take: 3,
        orderBy: { createdAt: 'desc' }
      });
      
      diagnostics.tests.push({
        name: 'Get games by stage',
        success: true,
        count: games.length,
        stage: stage,
        sample: games.map(g => ({ id: g.id, title: g.title, stage: g.stage })),
        message: `Found ${games.length} games with stage=${stage}`
      });
    } catch (error) {
      console.error('[DEBUG API] Get games by stage test failed:', error);
      diagnostics.tests.push({
        name: 'Get games by stage',
        success: false,
        stage: stage,
        message: error.message,
        error: error.toString()
      });
      
      // Try a raw SQL query as a fallback
      try {
        console.log('[DEBUG API] Attempting raw SQL to fetch games by stage');
        const result = await prisma.$queryRaw`
          SELECT id, title, stage FROM games 
          WHERE stage = ${stage}::text::"GameStage"
          ORDER BY "createdAt" DESC
          LIMIT 3
        `;
        
        diagnostics.tests.push({
          name: 'Raw SQL get games by stage',
          success: true,
          count: result.length,
          stage: stage,
          sample: result,
          message: `Found ${result.length} games with stage=${stage} using raw SQL`
        });
      } catch (rawError) {
        console.error('[DEBUG API] Raw SQL get games by stage failed:', rawError);
        diagnostics.tests.push({
          name: 'Raw SQL get games by stage',
          success: false,
          stage: stage,
          message: rawError.message,
          error: rawError.toString()
        });
      }
    }
    
    // Test 5: Verify schema information
    try {
      console.log('[DEBUG API] Checking database schema');
      const schemaInfo = await prisma.$queryRaw`
        SELECT column_name, data_type, udt_name
        FROM information_schema.columns
        WHERE table_name = 'games'
        ORDER BY ordinal_position
      `;
      
      // Check for GameStage enum
      const enumInfo = await prisma.$queryRaw`
        SELECT 
            t.typname as enum_name,
            e.enumlabel as enum_value
        FROM 
            pg_type t 
            JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE 
            t.typname = 'GameStage'
        ORDER BY 
            e.enumsortorder
      `;
      
      diagnostics.tests.push({
        name: 'Schema information',
        success: true,
        columns: schemaInfo,
        enums: enumInfo,
        message: `Retrieved schema information for games table`
      });
    } catch (error) {
      console.error('[DEBUG API] Schema information test failed:', error);
      diagnostics.tests.push({
        name: 'Schema information',
        success: false,
        message: error.message,
        error: error.toString()
      });
    }
    
    console.log('[DEBUG API] All tests completed, returning diagnostics');
    return NextResponse.json(diagnostics, { status: 200 });
  } catch (error) {
    console.error('[DEBUG API] Unhandled error in debug endpoint:', error);
    return NextResponse.json(
      { 
        error: error.message, 
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}
