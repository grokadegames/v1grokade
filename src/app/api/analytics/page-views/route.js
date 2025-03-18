import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// POST - Record a page view
export async function POST(request) {
  try {
    const body = await request.json();
    const { path, userId, userAgent, referer } = body;
    
    if (!path) {
      return NextResponse.json(
        { error: 'Missing required field: path' }, 
        { status: 400 }
      );
    }
    
    // Record page view in database
    try {
      const pageView = await prisma.pageView.create({
        data: {
          path,
          userId,
          userAgent,
          referer,
        }
      });
      
      return NextResponse.json({
        success: true,
        message: 'Page view recorded',
        pageView
      });
    } catch (dbError) {
      console.error('Database error recording page view:', dbError);
      return NextResponse.json(
        { 
          error: 'Database error', 
          message: dbError.message,
          stack: process.env.NODE_ENV === 'development' ? dbError.stack : undefined
        }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error recording page view:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error.message 
      }, 
      { status: 500 }
    );
  }
}

// GET - Retrieve page view analytics
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week'; // day, week, month, all
    const path = searchParams.get('path'); // optional path filter
    
    try {
      // Calculate start date based on period
      let startDate = new Date();
      switch (period) {
        case 'day':
          startDate.setDate(startDate.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'all':
          startDate = new Date(0); // Beginning of time
          break;
      }
      
      // Build query conditions
      let where = {
        timestamp: {
          gte: startDate
        }
      };
      
      // Add path filter if provided
      if (path) {
        where.path = path;
      }
      
      // Get total page views
      const totalPageViews = await prisma.pageView.count({
        where
      });
      
      // Get unique visitors (by userAgent if userId is null)
      const uniqueVisitorsByUserId = await prisma.pageView.groupBy({
        by: ['userId'],
        where: {
          ...where,
          userId: {
            not: null
          }
        },
        _count: {
          userId: true
        }
      });
      
      const uniqueVisitorsByUserAgent = await prisma.pageView.groupBy({
        by: ['userAgent'],
        where: {
          ...where,
          userId: null,
          userAgent: {
            not: null
          }
        },
        _count: {
          userAgent: true
        }
      });
      
      // Count unique visitors
      const uniqueVisitors = uniqueVisitorsByUserId.length + uniqueVisitorsByUserAgent.length;
      
      // Get top pages
      const topPages = await prisma.pageView.groupBy({
        by: ['path'],
        where,
        _count: {
          path: true
        },
        orderBy: {
          _count: {
            path: 'desc'
          }
        },
        take: 10
      });
      
      // Get traffic over time (grouped by day)
      const trafficByDay = await prisma.$queryRaw`
        SELECT 
          DATE(timestamp) as date, 
          COUNT(*) as views
        FROM page_views
        WHERE timestamp >= ${startDate}
        GROUP BY DATE(timestamp)
        ORDER BY date
      `;
      
      return NextResponse.json({
        success: true,
        analytics: {
          period,
          totalPageViews,
          uniqueVisitors,
          topPages: topPages.map(page => ({
            path: page.path,
            views: page._count.path
          })),
          trafficByDay
        }
      });
      
    } catch (dbError) {
      console.error('Database error fetching analytics:', dbError);
      return NextResponse.json(
        { 
          error: 'Database error', 
          message: dbError.message,
          stack: process.env.NODE_ENV === 'development' ? dbError.stack : undefined
        }, 
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error.message 
      }, 
      { status: 500 }
    );
  }
} 