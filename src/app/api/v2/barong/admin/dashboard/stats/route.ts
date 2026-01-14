/**
 * Dashboard Stats API
 * GET /api/v2/barong/admin/dashboard/stats
 */

import { NextRequest, NextResponse } from 'next/server';
import { dbQuery, sql } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Use real database if configured
    if (sql) {
      const stats = await dbQuery.getDashboardStats();
      if (stats) {
        return NextResponse.json({
          success: true,
          data: stats,
        });
      }
    }

    // Fallback to demo data if database not configured
    const stats = {
      overview: {
        total_users: 0,
        active_users: 0,
        total_posts: 0,
        total_comments: 0,
        total_staked: 0,
        active_stakes: 0,
        staking_pools: 0,
      },
      ico: {
        total_raised: 0,
        total_tokens_sold: 0,
        total_orders: 0,
      },
      growth: {
        new_users_this_week: 0,
        new_users_last_week: 0,
        user_growth_percent: 0,
        new_posts_this_week: 0,
      },
      recent: {
        users: [],
        posts: [],
        purchases: [],
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
