/**
 * Public Community Stats API
 * GET /api/v2/barong/public/community/stats
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET() {
  try {
    if (!sql) {
      return NextResponse.json({
        success: true,
        data: {
          totalMembers: 0,
          totalPosts: 0,
          activeToday: 0,
          totalTopics: 0,
        },
      });
    }

    // 获取总用户数
    const [usersCount] = await sql`SELECT COUNT(*) as total FROM users WHERE status = 'active'`;

    // 获取总帖子数
    const [postsCount] = await sql`SELECT COUNT(*) as total FROM posts`;

    // 获取今日活跃用户数（基于最近24小时的活动）
    const [activeToday] = await sql`
      SELECT COUNT(DISTINCT user_id) as total 
      FROM posts 
      WHERE created_at > NOW() - INTERVAL '24 hours'
    `;

    // 获取分类数（作为话题数）
    const [topicsCount] =
      await sql`SELECT COUNT(*) as total FROM categories WHERE is_active = true`;

    return NextResponse.json({
      success: true,
      data: {
        totalMembers: parseInt(usersCount?.total || '0'),
        totalPosts: parseInt(postsCount?.total || '0'),
        activeToday: parseInt(activeToday?.total || '0'),
        totalTopics: parseInt(topicsCount?.total || '0'),
      },
    });
  } catch (error) {
    console.error('Get community stats error:', error);
    return NextResponse.json({
      success: true,
      data: {
        totalMembers: 0,
        totalPosts: 0,
        activeToday: 0,
        totalTopics: 0,
      },
    });
  }
}
