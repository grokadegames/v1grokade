import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

// Helper function to verify authentication and admin role
async function verifyAdmin(request) {
  // Get the token from cookies
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) {
    return { authorized: false, error: 'No cookies found' };
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
    return { authorized: false, error: 'No auth token found' };
  }

  // Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return { authorized: false, error: 'Invalid token' };
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      role: true,
      roles: true,
    },
  });

  if (!user) {
    return { authorized: false, error: 'User not found' };
  }

  // Check if user is an admin
  if (user.role !== 'ADMIN') {
    return { authorized: false, error: 'Not authorized' };
  }

  return { authorized: true, user };
}

// POST: Add a role to a user
export async function POST(request) {
  try {
    // Check if user is authorized (admin only)
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }
    
    const { userId, role } = await request.json();
    
    if (!userId || !role) {
      return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 });
    }
    
    // Validate that the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Add the role to the user
    // Using upsert to handle the case where the role already exists
    const userRole = await prisma.userRoles.upsert({
      where: {
        userId_role: { userId, role }
      },
      update: {},
      create: {
        userId,
        role,
      },
    });
    
    return NextResponse.json({
      message: `Role ${role} added to user successfully`,
      userRole,
    });
  } catch (error) {
    console.error('Error adding user role:', error);
    return NextResponse.json({ error: 'Failed to add role to user' }, { status: 500 });
  }
}

// DELETE: Remove a role from a user
export async function DELETE(request) {
  try {
    // Check if user is authorized (admin only)
    const auth = await verifyAdmin(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');
    
    if (!userId || !role) {
      return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 });
    }
    
    // Cannot remove BASIC role
    if (role === 'BASIC') {
      return NextResponse.json({ error: 'Cannot remove BASIC role' }, { status: 400 });
    }
    
    // Remove the role from the user
    await prisma.userRoles.delete({
      where: {
        userId_role: { userId, role }
      },
    });
    
    return NextResponse.json({
      message: `Role ${role} removed from user successfully`,
    });
  } catch (error) {
    console.error('Error removing user role:', error);
    return NextResponse.json({ error: 'Failed to remove role from user' }, { status: 500 });
  }
}

// GET: Get all roles for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Get the user with their roles
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: true,
      },
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Return the user's roles
    return NextResponse.json({
      primaryRole: user.role,
      additionalRoles: user.roles.map(r => r.role),
    });
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return NextResponse.json({ error: 'Failed to fetch user roles' }, { status: 500 });
  }
} 