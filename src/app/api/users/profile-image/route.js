import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { uploadBuffer } from '@/utils/imagekit-server';

// Upload a profile image
export async function POST(request) {
  try {
    console.log('[API/profile-image] Starting profile image upload process');
    console.log('[API/profile-image] JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    // Get the token from cookies
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) {
      console.log('[API/profile-image] No cookies found');
      return NextResponse.json(
        { error: 'Authentication required', reason: 'no_cookies' },
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
    console.log('[API/profile-image] Auth token exists:', !!token);
    
    if (!token) {
      console.error('[API/profile-image] Authentication token is missing');
      return NextResponse.json(
        { error: 'Authentication required', reason: 'no_token' },
        { status: 401 }
      );
    }

    // Verify the token
    let user;
    try {
      console.log('[API/profile-image] Attempting to verify token...');
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('[API/profile-image] Token decoded successfully:', decoded);
      
      user = await prisma.user.findUnique({
        where: { id: decoded.id }
      });
      
      if (!user) {
        console.error('[API/profile-image] User not found with ID:', decoded.id);
        throw new Error('User not found');
      }
      
      console.log('[API/profile-image] User found:', user.username);
    } catch (error) {
      console.error('[API/profile-image] Token verification error:', error.message);
      console.error('[API/profile-image] Token verification error stack:', error.stack);
      return NextResponse.json(
        { error: 'Authentication failed', details: error.message },
        { status: 401 }
      );
    }

    // Parse the form data
    const formData = await request.formData();
    const image = formData.get('image');
    if (!image) {
      console.error('[API/profile-image] No image provided');
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Check file type
    const contentType = image.type;
    if (!contentType.startsWith('image/')) {
      console.error('[API/profile-image] Invalid file type:', contentType);
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Get file as buffer
    const buffer = Buffer.from(await image.arrayBuffer());
    
    // Create a unique public ID for the image
    const publicId = `user_profile_${user.id}_${Date.now()}`;
    
    console.log('[API/profile-image] Uploading image to ImageKit');
    
    // Upload to ImageKit with transformations
    const uploadResult = await uploadBuffer(buffer, publicId, {
      folder: 'user_profiles',
      useUniqueFileName: false
    });
    
    console.log(`[API/profile-image] Image uploaded to: ${uploadResult.url}`);
    
    // Update the user's profile with the new image URL
    console.log(`[API/profile-image] Updating user profile with new image URL`);
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        profileImageUrl: uploadResult.url,
        updatedAt: new Date()
      }
    });
    
    console.log('[API/profile-image] User profile updated successfully');
    return NextResponse.json({
      success: true,
      message: 'Profile image uploaded successfully',
      imageUrl: uploadResult.url
    });
    
  } catch (error) {
    console.error('[API/profile-image] Error uploading profile image:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile image', message: error.message },
      { status: 500 }
    );
  }
} 