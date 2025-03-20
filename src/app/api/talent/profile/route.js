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
    
    const profile = await prisma.talentProfile.findUnique({
      where: { userId: user.id }
    });
    
    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error fetching talent profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch talent profile' },
      { status: 500 }
    );
  }
}

// Create or update profile
export async function POST(request) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    // Check if user has APPLICANT role
    const hasApplicantRole = user.roles.some(r => r.role === 'APPLICANT') || user.role === 'APPLICANT';
    if (!hasApplicantRole) {
      return NextResponse.json(
        { error: 'You must activate your work profile first' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.hourlyRate || !data.location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Format xaccount to ensure consistent storage
    let xaccount = data.xaccount || '';
    if (xaccount && !xaccount.startsWith('@')) {
      xaccount = '@' + xaccount;
    }
    
    // Create or update profile
    const profile = await prisma.talentProfile.upsert({
      where: { userId: user.id },
      update: {
        title: data.title,
        description: data.description || '',
        skills: data.skills || [],
        hourlyRate: data.hourlyRate,
        location: data.location,
        xaccount: xaccount,
        isActive: true,
        updatedAt: new Date()
      },
      create: {
        userId: user.id,
        title: data.title,
        description: data.description || '',
        skills: data.skills || [],
        hourlyRate: data.hourlyRate,
        location: data.location,
        xaccount: xaccount,
        isActive: true
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Profile saved successfully',
      profile
    });
  } catch (error) {
    console.error('Error saving talent profile:', error);
    return NextResponse.json(
      { error: 'Failed to save talent profile' },
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