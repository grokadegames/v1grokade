import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma-fix';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { GameStage } from '@prisma/client';
import { uploadBuffer } from '@/utils/imagekit-server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  // Wrap the entire function in a try-catch to ensure we always return a valid JSON response
  try {
    console.log('[API] Game submission endpoint called');
    
    // Check if we have a session - allow both authenticated and unauthenticated submissions
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (sessionError) {
      console.error('[API] Session error:', sessionError.message);
      return NextResponse.json(
        { success: false, message: 'Error getting session', error: sessionError.message },
        { status: 500 }
      );
    }
    
    // Parse the request body
    let formData;
    try {
      formData = await request.formData();
      console.log('[API] Form data received, fields:', Array.from(formData.keys()));
    } catch (formError) {
      console.error('[API] Form data parsing error:', formError.message);
      return NextResponse.json(
        { success: false, message: 'Error parsing form data', error: formError.message },
        { status: 400 }
      );
    }
    
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
    
    // Generate a UUID for the game ID instead of using the title
    const id = uuidv4();
    console.log('[API] Generated UUID game ID:', id);
    
    // Generate a slug from the title (for future URL use if needed)
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    console.log('[API] Generated slug from title:', slug);
    
    // Check if a game with this ID already exists
    try {
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
    } catch (dbError) {
      console.error('[API] Database error checking existing game:', dbError.message);
      return NextResponse.json(
        { success: false, message: 'Database error', error: dbError.message },
        { status: 500 }
      );
    }
    
    // Upload thumbnail to ImageKit if provided
    let thumbnailUrl = null;
    if (thumbnail) {
      try {
        console.log('[API] Uploading thumbnail image to ImageKit');
        console.log('[API] Thumbnail file type:', thumbnail.type);
        console.log('[API] Thumbnail file size:', thumbnail.size, 'bytes');
        
        const arrayBuffer = await thumbnail.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        console.log('[API] Converted thumbnail to buffer, size:', buffer.length);
        console.log('[API] ImageKit credentials:', {
          publicKey: process.env.IMAGEKIT_PUBLIC_KEY ? 'exists' : 'missing',
          privateKey: process.env.IMAGEKIT_PRIVATE_KEY ? 'exists' : 'missing',
          urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
        });
        
        const uploadResult = await uploadBuffer(buffer, `game_thumbnail_${id}`, {
          folder: 'games',
          useUniqueFileName: false,
        });
        
        thumbnailUrl = uploadResult.url;
        console.log('[API] Thumbnail uploaded successfully:', thumbnailUrl);
      } catch (uploadError) {
        console.error('[API] Thumbnail upload error:', uploadError.message);
        return NextResponse.json(
          { success: false, message: `Thumbnail upload failed: ${uploadError.message}` },
          { status: 500 }
        );
      }
    }
    
    // Upload gallery images to ImageKit if provided
    const galleryUrls = [];
    for (let i = 0; i < galleryImages.length; i++) {
      const image = galleryImages[i];
      if (image) {
        try {
          console.log(`[API] Uploading gallery image ${i+1} to ImageKit`);
          console.log(`[API] Gallery image ${i+1} type:`, image.type);
          console.log(`[API] Gallery image ${i+1} size:`, image.size, 'bytes');
          
          const arrayBuffer = await image.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          
          console.log(`[API] Converted gallery image ${i+1} to buffer, size:`, buffer.length);
          
          const uploadResult = await uploadBuffer(buffer, `game_gallery_${id}_${i+1}`, {
            folder: 'games',
            useUniqueFileName: false,
          });
          
          galleryUrls.push(uploadResult.url);
          console.log(`[API] Gallery image ${i+1} uploaded successfully:`, uploadResult.url);
        } catch (uploadError) {
          console.error(`[API] Gallery image ${i+1} upload error:`, uploadError.message);
          return NextResponse.json(
            { success: false, message: `Gallery image ${i+1} upload failed: ${uploadError.message}` },
            { status: 500 }
          );
        }
      }
    }
    
    // Create the game with BETA stage
    let newGame;
    try {
      newGame = await prisma.game.create({
        data: {
          id,
          title,
          description,
          playUrl,
          imageUrl: thumbnailUrl,
          stage: GameStage.BETA, // Set stage to BETA for new submissions
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
    } catch (dbError) {
      console.error('[API] Database error creating game:', dbError.message);
      return NextResponse.json(
        { success: false, message: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }
    
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
    // Catch-all error handler - ensures we always return valid JSON
    console.error('[API] Unexpected game submission error:', error.message);
    console.error('[API] Error stack:', error.stack);
    
    return NextResponse.json(
      { success: false, message: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
} 