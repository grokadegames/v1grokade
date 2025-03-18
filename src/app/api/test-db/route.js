import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Check DB connection first
    await prisma.$queryRaw`SELECT 1`;
    
    // Try a simple query to count games
    const gameCount = await prisma.game.count();
    
    // Check if the user table exists
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      message: "Database connection successful",
      gameCount,
      userCount,
      timestamp: new Date().toISOString()
    }, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    
    return NextResponse.json({
      message: "Database error",
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 