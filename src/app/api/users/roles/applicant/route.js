import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    // Authenticate user
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const cookies = Object.fromEntries(
      cookieHeader.split('; ').map(cookie => {
        const [name, value] = cookie.split('=');
        return [name, value];
      })
    );

    const token = cookies.auth_token;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add APPLICANT role
    await prisma.userRoles.upsert({
      where: {
        userId_role: {
          userId: decoded.id,
          role: 'APPLICANT'
        }
      },
      update: {},
      create: {
        userId: decoded.id,
        role: 'APPLICANT'
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      message: 'Work profile activated successfully' 
    });
  } catch (error) {
    console.error('Error activating work profile:', error);
    return NextResponse.json(
      { error: 'Failed to activate work profile' },
      { status: 500 }
    );
  }
} 