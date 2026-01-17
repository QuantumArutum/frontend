/**
 * User Profile API
 * Returns user profile with statistics and recent activity
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const userId = searchParams.get('userId');

  try {
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured' 
      }, { status: 500 });
    }

    if (!username && !userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Username or userId is required' 
      }, { status: 400 });
    }

    // 查找用户
    let user;
    if (userId) {
      const result = await sql`
        SELECT uid, email, created_at, status
        FROM users
        WHERE uid = ${userId} AND status = 'active'
      `;
      user = result[0];
    } else {
      const result = await sql`
        SELECT uid, email, created_at, status
        FROM users
        WHERE email LIKE ${username + '%'} AND status = 'active'
        LIMIT 1
      `;
      user = result[0];
    }

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }

    // 获取用户统计数据（简化查询）
    const postCountResult = await sql`
      SELECT COUNT(*) as count FROM posts WHERE user_id = ${user.uid} AND status = 'published'
    `;
    const postCount = parseInt(postCountResult[0]?.count || '0');

    // 尝试获取评论数，如果表不存在则默认为0
    let commentCount = 0;
    try {
      const commentCountResult = await sql`
        SELECT COUNT(*) as count FROM post_comments WHERE user_id = ${user.uid}
      `;
      commentCount = parseInt(commentCountResult[0]?.count || '0');
    } catch (e) {
      // 如果表不存在，默认为0
      commentCount = 0;
    }

    // 计算获赞数（从posts表的like_count字段汇总）
    const receivedLikesResult = await sql`
      SELECT COALESCE(SUM(like_count), 0) as total FROM posts WHERE user_id = ${user.uid} AND status = 'published'
    `;
    const receivedLikes = parseInt(receivedLikesResult[0]?.total || '0');

    // 计算声望值
    const reputation = postCount * 100 + commentCount * 10 + receivedLikes * 5;

    // 获取关注者和关注中数量
    let followersCount = 0;
    let followingCount = 0;
    try {
      const followersResult = await sql`
        SELECT COUNT(*) as count FROM user_follows WHERE following_id = ${user.uid}
      `;
      followersCount = parseInt(followersResult[0]?.count || '0');

      const followingResult = await sql`
        SELECT COUNT(*) as count FROM user_follows WHERE follower_id = ${user.uid}
      `;
      followingCount = parseInt(followingResult[0]?.count || '0');
    } catch (e) {
      // 如果表不存在，默认为0
      followersCount = 0;
      followingCount = 0;
    }

    // 获取最近的帖子（简化查询，直接使用表中的统计字段）
    const recentPosts = await sql`
      SELECT 
        p.id,
        p.title,
        p.created_at,
        p.comment_count,
        p.like_count,
        c.name as category_name,
        c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.user_id = ${user.uid} AND p.status = 'published'
      ORDER BY p.created_at DESC
      LIMIT 10
    `;

    // 确定用户角色和徽章
    let roleKey = 'member';
    const badges: any[] = [];

    if (postCount > 100) {
      roleKey = 'core_developer';
      badges.push({ name: 'Quantum Pioneer', color: 'from-purple-500 to-pink-500', icon: '🚀' });
      badges.push({ name: 'Prolific Writer', color: 'from-blue-500 to-cyan-500', icon: '✍️' });
    } else if (postCount > 50) {
      roleKey = 'community_leader';
      badges.push({ name: 'Community Leader', color: 'from-orange-500 to-red-500', icon: '👑' });
    } else if (postCount > 20) {
      roleKey = 'senior_member';
      badges.push({ name: 'Active Contributor', color: 'from-green-500 to-emerald-500', icon: '⭐' });
    } else if (postCount > 10) {
      roleKey = 'active_member';
      badges.push({ name: 'Rising Star', color: 'from-yellow-500 to-orange-500', icon: '🌟' });
    }

    if (receivedLikes > 500) {
      badges.push({ name: 'Knowledge Sharer', color: 'from-blue-500 to-cyan-500', icon: '📚' });
    }

    if (commentCount > 100) {
      badges.push({ name: 'Discussion Expert', color: 'from-indigo-500 to-purple-500', icon: '💬' });
    }

    // 检查是否在线（简化查询，如果表不存在则跳过）
    let isOnline = false;
    try {
      const onlineCheck = await sql`
        SELECT EXISTS(
          SELECT 1 FROM user_activity_logs
          WHERE user_id = ${user.uid}
          AND created_at > NOW() - INTERVAL '15 minutes'
        ) as is_online
      `;
      isOnline = onlineCheck[0]?.is_online || false;
    } catch (e) {
      // 如果表不存在，默认为离线
      isOnline = false;
    }

    // 格式化响应数据
    const profile = {
      id: user.uid,
      username: user.email.split('@')[0],
      email: user.email,
      avatar: user.email[0].toUpperCase(),
      roleKey,
      title: getRoleTitle(roleKey),
      bio: `Member since ${new Date(user.created_at).toLocaleDateString()}`,
      location: null, // TODO: 添加用户资料表
      website: null, // TODO: 添加用户资料表
      joinedAt: user.created_at,
      isOnline,
      stats: {
        posts: postCount,
        comments: commentCount,
        likes: 0, // 用户点赞数（暂不统计）
        receivedLikes,
        reputation,
        followers: followersCount,
        following: followingCount,
      },
      badges,
      recentPosts: recentPosts.map((post: any) => ({
        id: post.id,
        title: post.title,
        category: post.category_name,
        categorySlug: post.category_slug,
        replies: parseInt(post.comment_count || '0'),
        likes: parseInt(post.like_count || '0'),
        createdAt: post.created_at,
      })),
    };

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

function getRoleTitle(roleKey: string): string {
  const titles: Record<string, string> = {
    core_developer: 'Core Developer',
    community_leader: 'Community Leader',
    senior_member: 'Senior Member',
    active_member: 'Active Member',
    member: 'Member',
  };
  return titles[roleKey] || 'Member';
}
