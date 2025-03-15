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
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        email: true,
        displayName: true,
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

    console.log('[API/me] User authenticated successfully:', user.username);
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('[API/me] Error fetching user:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
} 