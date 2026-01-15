/**
 * Community Analytics API
 * Production-grade implementation using communityService
 */

import { NextRequest, NextResponse } from 'next/server';
import { communityService } from '@/lib/communityService';

// GET - Analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    const days = parseInt(searchParams.get('days') || '30');

    if (type === 'overview') {
      const stats = await communityService.getFullStats();
      return NextResponse.json({
        success: true,
        data: {
          totals: {
            posts: stats?.totalPosts || 0,
            comments: stats?.totalComments || 0,
            users: stats?.totalUsers || 0,
            activeUsers: stats?.activeToday || 0,
          },
          growth: {
            postsThisWeek: stats?.postsThisWeek || 0,
            commentsThisWeek: stats?.commentsThisWeek || 0,
            newUsersThisWeek: stats?.newUsersThisWeek || 0,
            engagementRate: stats?.engagementRate || 0,
          },
          reports: {
            total: stats?.totalReports || 0,
            pending: stats?.pendingReports || 0,
          },
          bans: {
            total: stats?.totalBans || 0,
            active: stats?.activeBans || 0,
          },
          events: {
            total: stats?.totalEvents || 0,
            upcoming: stats?.upcomingEvents || 0,
          },
          announcements: {
            total: stats?.totalAnnouncements || 0,
            active: stats?.activeAnnouncements || 0,
          },
          topCategories: stats?.topCategories || [],
        }
      });
    }

    if (type === 'trends' || type === 'full') {
      const analytics = await communityService.getAnalytics(days);
      return NextResponse.json({
        success: true,
        data: analytics
      });
    }

    if (type === 'top_content') {
      const analytics = await communityService.getAnalytics(days);
      return NextResponse.json({
        success: true,
        data: {
          topPosters: analytics?.leaderboards?.topPosters || [],
          topCommenters: analytics?.leaderboards?.topCommenters || [],
          categoryStats: analytics?.categoryStats || [],
        }
      });
    }

    if (type === 'engagement') {
      const stats = await communityService.getFullStats();
      const totalPosts = stats?.totalPosts || 1;
      const totalComments = stats?.totalComments || 0;
      const totalUsers = stats?.totalUsers || 1;
      
      return NextResponse.json({
        success: true,
        data: {
          avgPostsPerUser: Math.round((totalPosts / totalUsers) * 100) / 100,
          avgCommentsPerPost: Math.round((totalComments / totalPosts) * 100) / 100,
          engagementRate: stats?.engagementRate || 0,
        }
      });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    console.error('Analytics GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
