import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

// Update user profile (currently only displayName)
export async function PUT(request) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    const { displayName } = await request.json();
    
    // Validate displayName
    if (!displayName || displayName.trim() === '') {
      return NextResponse.json(
        { error: 'Display name cannot be empty' },
        { status: 400 }
      );
    }
    
    // Update the user's display name
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        displayName: displayName.trim(),
        updatedAt: new Date()
      },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
        profileImageUrl: true,
        role: true,
        roles: {
          select: {
            role: true
          }
        },
        createdAt: true,
        updatedAt: true,
      }
    });
    
    // Transform roles array to a more usable format
    const allRoles = [updatedUser.role, ...updatedUser.roles.map(r => r.role)];
    const uniqueRoles = [...new Set(allRoles)];
    
    // Create a modified user object with the transformed roles
    const userData = {
      ...updatedUser,
      allRoles: uniqueRoles,
    };
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: userData
    });
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
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
      include: { roles: true }
    });
    return user;
  } catch (error) {
    return null;
  }
} 