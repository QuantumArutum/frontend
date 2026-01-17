/**
 * Followers List API
 * Returns list of users that are following a specific user
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured' 
      }, { status: 500 });
    }

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'userId is required' 
      }, { status: 400 });
    }

    // 获取粉丝列表
    const followers = await sql`
      SELECT 
        u.uid,
        u.email,
        u.created_at,
        uf.created_at as followed_at,
        COALESCE(
          (SELECT COUNT(*) FROM posts WHERE user_id = u.uid AND status = 'published'),
          0
        ) as post_count
      FROM user_follows uf
      JOIN users u ON uf.follower_id = u.uid
      WHERE uf.following_id = ${userId} AND u.status = 'active'
      ORDER BY uf.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // 获取总数
    const totalResult = await sql`
      SELECT COUNT(*) as total
      FROM user_follows uf
      JOIN users u ON uf.follower_id = u.uid
      WHERE uf.following_id = ${userId} AND u.status = 'active'
    `;

    const formattedFollowers = followers.map((user: any) => ({
      id: user.uid,
      username: user.email.split('@')[0],
      email: user.email,
      avatar: user.email[0].toUpperCase(),
      postCount: parseInt(user.post_count || '0'),
      followedAt: user.followed_at,
      joinedAt: user.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: {
        followers: formattedFollowers,
        pagination: {
          total: parseInt(totalResult[0]?.total || '0'),
          limit,
          offset,
          hasMore: offset + limit < parseInt(totalResult[0]?.total || '0'),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching followers list:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
