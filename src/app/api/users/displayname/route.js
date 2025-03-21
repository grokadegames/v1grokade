import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authenticateUser } from '@/lib/auth';

// Update user's display name
export async function PUT(request) {
  try {
    console.log('[API/users/displayname] Processing display name update');
    
    // Authenticate the user
    const auth = await authenticateUser(request);
    if (!auth.success) {
      console.log('[API/users/displayname] Authentication failed:', auth.message);
      return NextResponse.json(
        { error: auth.message, reason: auth.reason },
        { status: 401 }
      );
    }
    
    const userId = auth.user.id;
    console.log(`[API/users/displayname] Authenticated user ID: ${userId}`);
    
    // Parse request body
    const body = await request.json();
    console.log('[API/users/displayname] Request body:', body);
    
    // Validate the display name
    if (!body.displayName || typeof body.displayName !== 'string') {
      console.log('[API/users/displayname] Invalid display name:', body.displayName);
      return NextResponse.json(
        { error: 'Display name is required and must be a string' },
        { status: 400 }
      );
    }
    
    const displayName = body.displayName.trim();
    
    if (displayName.length === 0) {
      console.log('[API/users/displayname] Empty display name');
      return NextResponse.json(
        { error: 'Display name cannot be empty' },
        { status: 400 }
      );
    }
    
    if (displayName.length > 50) {
      console.log('[API/users/displayname] Display name too long:', displayName.length);
      return NextResponse.json(
        { error: 'Display name must be 50 characters or less' },
        { status: 400 }
      );
    }
    
    // Update the user in the database
    console.log(`[API/users/displayname] Updating display name for user ${userId} to "${displayName}"`);
    try {
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { displayName },
        select: { id: true, displayName: true }
      });
      
      console.log('[API/users/displayname] Update successful:', updatedUser);
      
      // Return a simple success response with minimal data
      return NextResponse.json({ 
        success: true, 
        message: 'Display name updated successfully',
        user: { displayName: updatedUser.displayName } 
      });
      
    } catch (dbError) {
      console.error('[API/users/displayname] Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to update display name', reason: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[API/users/displayname] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', reason: error.message },
      { status: 500 }
    );
  }
} 