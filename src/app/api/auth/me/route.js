import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    console.log('[API/me] Checking authentication status');
    
    // Get the token from cookies
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      console.log('[API/me] No cookies found');
      return NextResponse.json(
        { message: 'Not authenticated', reason: 'no_cookies' },
        { status: 401 }
      );
    }

    // Parse cookies
    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(cookie => {
        const [name, value] = cookie.split('=');
        return [name, value];
      })
    );

    const token = cookies.auth_token;
    if (!token) {
      console.log('[API/me] No auth_token cookie found');
      return NextResponse.json(
        { message: 'Not authenticated', reason: 'no_token', cookies: Object.keys(cookies) },
        { status: 401 }
      );
    }

    console.log('[API/me] Auth token found, verifying...');
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('[API/me] Token verified for user ID:', decoded.id);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        console.log('[API/me] Token expired');
        return NextResponse.json(
          { message: 'Token expired', reason: 'token_expired' },
          { status: 401 }
        );
      }
      console.error('[API/me] Invalid token:', error.message);
      return NextResponse.json(
        { message: 'Invalid token', reason: 'invalid_token' },
        { status: 401 }
      );
    }

    // Get user from database
    console.log('[API/me] Fetching user details from database');
    try {
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
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
        },
      });

      if (!user) {
        console.log('[API/me] User not found in database');
        return NextResponse.json(
          { message: 'User not found', reason: 'user_not_found' },
          { status: 404 }
        );
      }

      console.log('[API/me] User data retrieved:', {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        hasProfileImage: !!user.profileImageUrl
      });

      // Transform roles array to a more usable format
      const allRoles = [user.role, ...user.roles.map(r => r.role)];
      const uniqueRoles = [...new Set(allRoles)];
      
      // Create a modified user object with the transformed roles
      const userData = {
        ...user,
        allRoles: uniqueRoles,
      };

      console.log('[API/me] User authenticated successfully:', user.username);
      return NextResponse.json({ user: userData }, { status: 200 });
    } catch (dbError) {
      console.error('[API/me] Database error fetching user:', dbError);
      return NextResponse.json(
        { message: 'Database error', error: dbError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[API/me] Error fetching user:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
} 