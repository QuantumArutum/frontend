/**
 * Community Members API
 * Returns list of community members with stats
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');
  const sortBy = searchParams.get('sortBy') || 'reputation'; // reputation, posts, joined
  const filterRole = searchParams.get('filterRole') || 'all';
  const search = searchParams.get('search') || '';

  try {
    if (!sql) {
      return NextResponse.json(
        {
          success: false,
          message: 'Database not configured',
        },
        { status: 500 }
      );
    }

    // 构建排序条件
    let orderByClause = 'reputation DESC';
    if (sortBy === 'posts') {
      orderByClause = 'post_count DESC';
    } else if (sortBy === 'joined') {
      orderByClause = 'u.created_at DESC';
    }

    // 获取成员列表
    const members = await sql`
      SELECT 
        u.uid as id,
        u.email,
        u.created_at as joined,
        COALESCE(
          (SELECT COUNT(*) FROM posts WHERE user_id = u.uid),
          0
        ) as post_count,
        COALESCE(
          (SELECT COUNT(*) FROM post_comments WHERE user_id = u.uid),
          0
        ) as comment_count,
        COALESCE(
          (SELECT COUNT(*) FROM post_likes WHERE user_id = u.uid),
          0
        ) as like_count,
        CASE 
          WHEN (SELECT COUNT(*) FROM posts WHERE user_id = u.uid) > 100 THEN 9000 + (SELECT COUNT(*) FROM posts WHERE user_id = u.uid) * 10
          WHEN (SELECT COUNT(*) FROM posts WHERE user_id = u.uid) > 50 THEN 7000 + (SELECT COUNT(*) FROM posts WHERE user_id = u.uid) * 10
          WHEN (SELECT COUNT(*) FROM posts WHERE user_id = u.uid) > 20 THEN 5000 + (SELECT COUNT(*) FROM posts WHERE user_id = u.uid) * 10
          WHEN (SELECT COUNT(*) FROM posts WHERE user_id = u.uid) > 10 THEN 3000 + (SELECT COUNT(*) FROM posts WHERE user_id = u.uid) * 10
          ELSE (SELECT COUNT(*) FROM posts WHERE user_id = u.uid) * 100
        END as reputation,
        EXISTS(
          SELECT 1 FROM user_activity_logs 
          WHERE user_id = u.uid 
          AND created_at > NOW() - INTERVAL '15 minutes'
        ) as is_online
      FROM users u
      WHERE u.status = 'active'
      ${search ? sql`AND u.email ILIKE ${'%' + search + '%'}` : sql``}
      ORDER BY ${sql.unsafe(orderByClause)}
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // 获取总数
    const totalResult = await sql`
      SELECT COUNT(*) as total
      FROM users
      WHERE status = 'active'
      ${search ? sql`AND email ILIKE ${'%' + search + '%'}` : sql``}
    `;

    // 格式化数据
    const formattedMembers = members.map((member: any) => {
      const postCount = parseInt(member.post_count || '0');
      const reputation = parseInt(member.reputation || '0');

      // 根据帖子数量和声望确定角色
      let roleKey = 'member';
      let badges: string[] = [];

      if (postCount > 100) {
        roleKey = 'core_developer';
        badges = ['🏆', '⭐', '🔧'];
      } else if (postCount > 50) {
        roleKey = 'community_leader';
        badges = ['👑', '💎'];
      } else if (postCount > 20) {
        roleKey = 'senior_member';
        badges = ['🎯', '📚'];
      } else if (postCount > 10) {
        roleKey = 'active_member';
        badges = ['💰', '📈'];
      } else if (postCount > 5) {
        roleKey = 'contributor';
        badges = ['🔗'];
      }

      return {
        id: member.id,
        username: member.email.split('@')[0],
        email: member.email,
        avatar: member.email[0].toUpperCase(),
        roleKey,
        reputation,
        posts: postCount,
        comments: parseInt(member.comment_count || '0'),
        likes: parseInt(member.like_count || '0'),
        joined: member.joined,
        isOnline: member.is_online,
        badges,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        members: formattedMembers,
        total: parseInt(totalResult[0]?.total || '0'),
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
