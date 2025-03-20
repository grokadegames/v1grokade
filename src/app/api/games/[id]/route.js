import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  const { id } = params;
  
  console.log(`[API] Game by ID route called for ID: ${id}`);
  
  try {
    // Try to find the game in the database
    const game = await prisma.game.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            displayName: true,
            username: true,
          },
        },
        metrics: true,
      },
    });
    
    if (!game) {
      console.log(`[API] Game with ID ${id} not found in database`);
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }
    
    const formattedGame = {
      id: game.id,
      title: game.title,
      creator: game.author?.displayName || game.author?.username || 'Unknown Creator',
      description: game.description || 'No description available',
      playUrl: game.playUrl || '#',
      image: game.imageUrl,
      imageUrl: game.imageUrl,
      galleryImage1: game.galleryImage1 || null,
      galleryImage2: game.galleryImage2 || null,
      galleryImage3: game.galleryImage3 || null,
      galleryImage4: game.galleryImage4 || null,
      createdAt: game.createdAt,
      updatedAt: game.updatedAt,
      isLive: true,
      featured: game.featured || false,
      plays: game.metrics?.plays || 0,
      views: game.metrics?.views || 0,
      likes: game.metrics?.likes || 0,
      dislikes: game.metrics?.dislikes || 0,
      tags: game.tagcategory || '',
      xaccount: game.xaccount || ''
    };
    
    console.log(`[API] Successfully fetched game with ID ${id}`);
    return NextResponse.json({ game: formattedGame }, { status: 200 });
  } catch (error) {
    console.error(`[API] Error fetching game with ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch game', details: error.message },
      { status: 500 }
    );
  }
} 