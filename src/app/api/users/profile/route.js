import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

// GET current user's profile
export async function GET(request) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Return only necessary profile fields
    const profile = {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      fullName: user.fullName || '',
      profileImageUrl: user.profileImageUrl
    };
    
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

// Update user profile
export async function PUT(request) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const data = await request.json();
    
    // Update the user's profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        fullName: data.fullName,
        updatedAt: new Date()
      },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        fullName: true,
        profileImageUrl: true
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update user profile' },
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
      where: { id: decoded.id }
    });
    return user;
  } catch (error) {
    return null;
  }
} 