import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST - Subscribe to newsletter
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, name } = body;
    
    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' }, 
        { status: 400 }
      );
    }
    
    // If DATABASE_URL is not available, return success without updating
    if (!process.env.DATABASE_URL) {
      console.log('[API/newsletter] No database URL, simulating subscription');
      return NextResponse.json({
        success: true,
        message: 'Subscription successful (simulated)',
        data: { email }
      });
    }
    
    // Check if email already exists
    const existingSubscriber = await prisma.subscriber.findUnique({
      where: { email }
    });
    
    if (existingSubscriber) {
      // If already subscribed, just update the status to active
      if (existingSubscriber.status === 'unsubscribed') {
        const updatedSubscriber = await prisma.subscriber.update({
          where: { email },
          data: { status: 'active' }
        });
        
        return NextResponse.json({
          success: true,
          message: 'Subscription reactivated',
          data: updatedSubscriber
        });
      }
      
      // If already active, just return success
      return NextResponse.json({
        success: true,
        message: 'Already subscribed',
        data: existingSubscriber
      });
    }
    
    // Create new subscriber
    const subscriber = await prisma.subscriber.create({
      data: {
        email,
        name: name || null,
        status: 'active'
      }
    });
    
    return NextResponse.json({
      success: true,
      message: 'Subscription successful',
      data: subscriber
    });
    
  } catch (error) {
    console.error('Error in newsletter subscription:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

// GET - List all subscribers (admin only, to be protected in the future)
export async function GET(request) {
  try {
    // If DATABASE_URL is not available, return dummy data
    if (!process.env.DATABASE_URL) {
      return NextResponse.json({
        success: true,
        subscribers: Array(5).fill(0).map((_, i) => ({
          id: `subscriber-${i}`,
          email: `subscriber${i}@example.com`,
          status: 'active',
          createdAt: new Date().toISOString()
        }))
      });
    }
    
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({
      success: true,
      count: subscribers.length,
      subscribers
    });
    
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error.message 
      }, 
      { status: 500 }
    );
  }
} 