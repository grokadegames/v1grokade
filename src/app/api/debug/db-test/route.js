import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlLength: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
    prismaVersion: require('@prisma/client/package.json').version,
    nextVersion: require('next/package.json').version,
    tests: {}
  };
  
  // Test raw database connection
  try {
    console.log('[DEBUG] Testing database connection with raw query...');
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1 as result`;
    const endTime = Date.now();
    
    debugInfo.tests.rawQuery = {
      success: true,
      message: 'Raw query executed successfully',
      duration: `${endTime - startTime}ms`
    };
  } catch (error) {
    console.error('[DEBUG] Raw query error:', error);
    debugInfo.tests.rawQuery = {
      success: false,
      message: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }
  
  // Test simple Prisma query
  try {
    console.log('[DEBUG] Testing Prisma models...');
    const startTime = Date.now();
    
    // Check if Game model exists
    const gameCount = await prisma.game.count();
    const endTime = Date.now();
    
    debugInfo.tests.prismaQuery = {
      success: true,
      message: 'Prisma query executed successfully',
      duration: `${endTime - startTime}ms`,
      gameCount
    };
  } catch (error) {
    console.error('[DEBUG] Prisma query error:', error);
    debugInfo.tests.prismaQuery = {
      success: false,
      message: error.message,
      code: error.code,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }
  
  // Test database structure
  try {
    console.log('[DEBUG] Checking database tables...');
    const dbInfo = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    debugInfo.tests.databaseTables = {
      success: true,
      tables: dbInfo.map(row => row.table_name)
    };
  } catch (error) {
    console.error('[DEBUG] Database structure check error:', error);
    debugInfo.tests.databaseTables = {
      success: false,
      message: error.message
    };
  }
  
  console.log('[DEBUG] Debug tests complete:', 
    Object.entries(debugInfo.tests)
      .map(([key, value]) => `${key}: ${value.success ? 'SUCCESS' : 'FAILED'}`)
      .join(', ')
  );
  
  return NextResponse.json(debugInfo);
} 