import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

// Define all available achievements
const ACHIEVEMENTS = {
  FIRST_LOGIN: 'first_login',
  RANKINGS_EXPLORER: 'rankings_explorer',
  GAME_BROWSER: 'game_browser',
  GAME_EXPLORER: 'game_explorer',
  GAME_PLAYER: 'game_player',
  GAME_REVIEWER: 'game_reviewer',
  GAME_NETWORKER: 'game_networker',
  GAME_CREATOR: 'game_creator',
  FIRST_FAVORITE: 'first_favorite'
};

// GET /api/achievements - Get all user achievements
export async function GET(request) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Get user's unlocked achievements
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId: user.id },
    });
    
    // Map achievement IDs to whether they are unlocked
    const achievementStatus = Object.values(ACHIEVEMENTS).reduce((acc, achievementId) => {
      acc[achievementId] = userAchievements.some(ua => ua.achievementId === achievementId);
      return acc;
    }, {});
    
    return NextResponse.json({
      achievements: achievementStatus
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch achievements' },
      { status: 500 }
    );
  }
}

// POST /api/achievements - Unlock an achievement
export async function POST(request) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const { achievementId } = await request.json();
    
    // Validate the achievement ID
    if (!Object.values(ACHIEVEMENTS).includes(achievementId)) {
      return NextResponse.json(
        { error: 'Invalid achievement ID' },
        { status: 400 }
      );
    }
    
    // Check if the achievement is already unlocked
    const existingAchievement = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId: user.id,
          achievementId
        }
      }
    });
    
    if (existingAchievement) {
      return NextResponse.json({
        success: true,
        message: 'Achievement already unlocked',
        achievement: existingAchievement
      });
    }
    
    // Unlock the achievement
    const achievement = await prisma.userAchievement.create({
      data: {
        userId: user.id,
        achievementId
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Achievement unlocked',
      achievement
    });
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return NextResponse.json(
      { error: 'Failed to unlock achievement' },
      { status: 500 }
    );
  }
}

// Helper function to authenticate user
async function authenticateUser(request) {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(cookie => {
      const [name, value] = cookie.split('=');
      return [name, value];
    })
  );

  const token = cookies.auth_token;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });
    return user;
  } catch (error) {
    return null;
  }
} 