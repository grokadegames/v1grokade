import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dxow1rafl',
  api_key: process.env.CLOUDINARY_API_KEY || '189369456186199',
  api_secret: process.env.CLOUDINARY_API_SECRET || '31EANFqVf28WcdN3p7IE2_q-wtw'
});

// Upload a profile image
export async function POST(request) {
  try {
    console.log('[API/profile-image] Processing image upload request');
    
    const user = await authenticateUser(request);
    if (!user) {
      console.log('[API/profile-image] Authentication failed');
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    
    console.log(`[API/profile-image] Authenticated user: ${user.id} (${user.username})`);
    
    // Get the image data from request
    const formData = await request.formData();
    const file = formData.get('image');
    
    if (!file) {
      console.log('[API/profile-image] No image file found in request');
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }
    
    console.log(`[API/profile-image] Image file received: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);
    
    // Convert the file to a buffer for Cloudinary upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Create a unique ID for the image based on the user ID
    const publicId = `user_profile_${user.id}_${Date.now()}`;
    console.log(`[API/profile-image] Uploading to Cloudinary with public ID: ${publicId}`);
    
    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          public_id: publicId,
          folder: 'user_profiles',
          overwrite: true,
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'auto' },
            { radius: 'max' }, // Make image perfectly circular
            { quality: 'auto:good' } // Automatically optimize quality
          ],
        },
        (error, result) => {
          if (error) {
            console.error('[API/profile-image] Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('[API/profile-image] Cloudinary upload successful');
            resolve(result);
          }
        }
      ).end(buffer);
    });
    
    const uploadResult = await uploadPromise;
    console.log(`[API/profile-image] Image uploaded to: ${uploadResult.secure_url}`);
    
    // Update the user's profile with the new image URL
    console.log(`[API/profile-image] Updating user profile with new image URL`);
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        profileImageUrl: uploadResult.secure_url,
        updatedAt: new Date()
      }
    });
    
    console.log('[API/profile-image] User profile updated successfully');
    return NextResponse.json({
      success: true,
      message: 'Profile image uploaded successfully',
      imageUrl: uploadResult.secure_url
    });
    
  } catch (error) {
    console.error('[API/profile-image] Error uploading profile image:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile image', message: error.message },
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