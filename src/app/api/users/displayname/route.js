import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function PUT(request) {
  try {
    console.log('[API/displayname] Processing update request');
    
    // Authenticate user
    const user = await authenticateUser(request);
    if (!user) {
      console.log('[API/displayname] Authentication failed');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Parse request body
    const { displayName } = await request.json();
    
    // Validate displayName
    if (!displayName || typeof displayName !== 'string' || displayName.trim() === '') {
      console.log('[API/displayname] Invalid display name provided');
      return NextResponse.json({ error: 'Display name cannot be empty' }, { status: 400 });
    }
    
    const trimmedName = displayName.trim();
    
    // Update the user's display name
    console.log(`[API/displayname] Updating display name for user ${user.id} to "${trimmedName}"`);
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          displayName: trimmedName,
          updatedAt: new Date()
        },
      });
      
      console.log('[API/displayname] Display name updated successfully');
      
      // Return a success response
      return NextResponse.json({ 
        success: true, 
        message: 'Display name updated successfully' 
      });
      
    } catch (error) {
      console.error('[API/displayname] Database error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
  } catch (error) {
    console.error('[API/displayname] Unhandled error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
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
    console.error('[API/displayname] Authentication error:', error);
    return null;
  }
} 