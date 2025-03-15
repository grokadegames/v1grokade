import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    console.log('[API/update-password] Password update request received');
    
    // Get request data
    const { username, newPassword, currentPassword } = await request.json();
    
    if (!username || !newPassword) {
      console.error('[API/update-password] Missing required fields');
      return NextResponse.json(
        { message: 'Username and new password are required' },
        { status: 400 }
      );
    }
    
    console.log(`[API/update-password] Updating password for user: ${username}`);
    
    // Find the user
    const user = await prisma.user.findUnique({
      where: { username },
    });
    
    if (!user) {
      console.error(`[API/update-password] User not found: ${username}`);
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // If currentPassword is provided, verify it
    if (currentPassword) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      
      if (!isPasswordValid) {
        console.error(`[API/update-password] Invalid current password for user: ${username}`);
        return NextResponse.json(
          { message: 'Current password is incorrect' },
          { status: 401 }
        );
      }
    } else {
      // For admin operations or password reset flows, check if user has proper session/cookie
      // We'll only allow this when the user has a valid session
      const cookieStore = cookies();
      const authToken = cookieStore.get('authToken');
      
      if (!authToken) {
        console.error(`[API/update-password] No auth token provided for passwordless update`);
        return NextResponse.json(
          { message: 'Authentication required for password update' },
          { status: 401 }
        );
      }
      
      // Here you would validate the token further if needed
    }
    
    // Password validation
    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update the user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    
    console.log(`[API/update-password] Password updated successfully for: ${username}`);
    
    return NextResponse.json(
      { message: 'Password updated successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[API/update-password] Error updating password:', error);
    return NextResponse.json(
      { message: 'Failed to update password', error: error.message },
      { status: 500 }
    );
  }
} 