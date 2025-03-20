import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    // Get query parameters for filtering/pagination
    const { searchParams } = new URL(request.url);
    const skillFilter = searchParams.get('skill');
    const featured = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    // Build the query
    const query = {
      where: {
        isActive: true,
        ...(featured ? { featured: true } : {}),
        ...(skillFilter ? {
          skills: { has: skillFilter }
        } : {})
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            profileImageUrl: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    };
    
    // Execute query
    const profiles = await prisma.talentProfile.findMany(query);
    const total = await prisma.talentProfile.count({ where: query.where });
    
    // Transform response to match talent card format
    const formattedProfiles = profiles.map(profile => ({
      id: profile.id,
      initials: getInitials(profile.user.displayName),
      name: profile.user.displayName,
      title: profile.title,
      description: profile.description || '',
      rating: profile.rating,
      reviews: profile.reviewCount,
      skills: profile.skills,
      rate: profile.hourlyRate,
      location: profile.location,
      xaccount: profile.xaccount,
      featured: profile.featured,
      profileImageUrl: profile.user.profileImageUrl,
      vibeCodingExpert: profile.description ? true : false // Set to true if description exists
    }));
    
    return NextResponse.json({
      profiles: formattedProfiles,
      total,
      offset,
      limit
    });
  } catch (error) {
    console.error('Error fetching talent profiles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch talent profiles' },
      { status: 500 }
    );
  }
}

// Helper to get initials from name
function getInitials(name) {
  if (!name) return 'NA';
  
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
} 