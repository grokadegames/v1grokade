import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma-fix';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dxow1rafl',
  api_key: '189369456186199',
  api_secret: '31EANFqVf28WcdN3p7IE2_q-wtw'
});

export async function POST(request) {
  try {
    console.log('[API] Game submission endpoint called');
    
    // Check if we have a session - allow both authenticated and unauthenticated submissions
    const session = await getServerSession(authOptions);
    
    // Parse the request body
    const formData = await request.formData();
    console.log('[API] Form data received:', Object.fromEntries(formData.entries()));
    
    // Extract game details
    const title = formData.get('title');
    const description = formData.get('description');
    const creatorName = formData.get('creatorName');
    const handle = formData.get('handle');
    const email = formData.get('email');
    const playUrl = formData.get('officialPageUrl');
    const thumbnail = formData.get('thumbnail');
    const galleryImages = [];
    
    // Get gallery images if they exist
    for (let i = 0; i < 4; i++) {
      const galleryImage = formData.get(`galleryImages[${i}]`);
      if (galleryImage) {
        galleryImages.push(galleryImage);
      }
    }
    
    // Validate required fields
    if (!title || !description || !playUrl) {
      console.error('[API] Missing required fields in game submission');
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Generate a URL-friendly ID from the title
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    console.log('[API] Generated game ID:', id);
    
    // Check if a game with this ID already exists
    const existingGame = await prisma.game.findUnique({
      where: { id }
    });
    
    if (existingGame) {
      console.error('[API] Game ID already exists:', id);
      return NextResponse.json(
        { success: false, message: 'A game with this title already exists' },
        { status: 409 }
      );
    }
    
    // Upload thumbnail to Cloudinary if provided
    let thumbnailUrl = null;
    if (thumbnail) {
      console.log('[API] Uploading thumbnail image to Cloudinary');
      const arrayBuffer = await thumbnail.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            public_id: `game_thumbnail_${id}`,
            folder: 'games',
            overwrite: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        
        uploadStream.end(buffer);
      });
      
      thumbnailUrl = uploadResult.secure_url;
      console.log('[API] Thumbnail uploaded successfully:', thumbnailUrl);
    }
    
    // Upload gallery images to Cloudinary if provided
    const galleryUrls = [];
    for (let i = 0; i < galleryImages.length; i++) {
      const image = galleryImages[i];
      if (image) {
        console.log(`[API] Uploading gallery image ${i+1} to Cloudinary`);
        const arrayBuffer = await image.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              public_id: `game_gallery_${id}_${i+1}`,
              folder: 'games',
              overwrite: true,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          
          uploadStream.end(buffer);
        });
        
        galleryUrls.push(uploadResult.secure_url);
        console.log(`[API] Gallery image ${i+1} uploaded successfully:`, uploadResult.secure_url);
      }
    }
    
    // Create the game with BETA stage
    const newGame = await prisma.game.create({
      data: {
        id,
        title,
        description,
        playUrl,
        imageUrl: thumbnailUrl,
        stage: 'BETA', // Set stage to BETA for new submissions
        // Gallery images
        galleryImage1: galleryUrls[0] || null,
        galleryImage2: galleryUrls[1] || null,
        galleryImage3: galleryUrls[2] || null,
        galleryImage4: galleryUrls[3] || null,
        // Store game tags if provided
        tagcategory: formData.get('gameTags') || null,
        // X handle
        xaccount: handle,
        // If user is authenticated, associate with their account
        ...(session?.user?.id && { authorId: session.user.id }),
        // Use creatorName as author if not authenticated
        ...(creatorName && !session?.user?.id && { 
          author: { 
            create: { 
              displayName: creatorName,
              email,
              username: email.split('@')[0] + Date.now().toString().slice(-4),
              password: Math.random().toString(36).slice(-10)
            } 
          }
        }),
      }
    });
    
    // Create game metrics record
    await prisma.gameMetrics.create({
      data: {
        gameId: newGame.id,
        views: 0,
        plays: 0,
        likes: 0,
        dislikes: 0
      }
    });
    
    console.log('[API] Game created successfully:', newGame.id);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Game submitted successfully',
        game: { 
          id: newGame.id, 
          title: newGame.title,
          imageUrl: thumbnailUrl
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API] Error submitting game:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to submit game',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 