import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

// Update user's display name
export async function PUT(request) {
  try {
    console.log('[API/displayname] Processing display name update request');
    
    const user = await authenticateUser(request);
    if (!user) {
      console.log('[API/displayname] Authentication failed');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    let requestBody;
    try {
      requestBody = await request.json();
    } catch (jsonError) {
      console.error('[API/displayname] Invalid JSON in request body:', jsonError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    const { displayName } = requestBody;
    
    // Validate displayName
    if (!displayName || displayName.trim() === '') {
      console.log('[API/displayname] Empty display name provided');
      return NextResponse.json(
        { error: 'Display name cannot be empty' },
        { status: 400 }
      );
    }
    
    // Update the user's display name
    console.log(`[API/displayname] Updating display name for user ${user.id} to "${displayName.trim()}"`);
    try {
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
      
      console.log('[API/displayname] Display name updated successfully');
      return NextResponse.json({
        success: true,
        message: 'Display name updated successfully',
        user: userData
      });
    } catch (prismaError) {
      console.error('[API/displayname] Database error:', prismaError);
      return NextResponse.json(
        { error: 'Database error when updating display name' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('[API/displayname] Unhandled error updating display name:', error);
    return NextResponse.json(
      { error: 'Failed to update display name' },
      { status: 500 }
    );
  }
}

// Helper function to authenticate user
async function authenticateUser(request) {
  try {
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { roles: true }
    });
    return user;
  } catch (error) {
    console.error('[API/displayname] Authentication error:', error);
    return null;
  }
} 