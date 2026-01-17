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

    // 获取用户统计数据
    const stats = await sql`
      SELECT 
        (SELECT COUNT(*) FROM posts WHERE user_id = ${user.uid}) as post_count,
        (SELECT COUNT(*) FROM post_comments WHERE user_id = ${user.uid}) as comment_count,
        (SELECT COUNT(*) FROM post_likes WHERE user_id = ${user.uid}) as like_count,
        (SELECT COUNT(*) FROM post_likes pl 
         JOIN posts p ON pl.post_id = p.id 
         WHERE p.user_id = ${user.uid}) as received_likes
    `;

    const userStats = stats[0];
    const postCount = parseInt(userStats.post_count || '0');
    const commentCount = parseInt(userStats.comment_count || '0');
    const likeCount = parseInt(userStats.like_count || '0');
    const receivedLikes = parseInt(userStats.received_likes || '0');

    // 计算声望值
    const reputation = postCount * 100 + commentCount * 10 + receivedLikes * 5;

    // 获取最近的帖子
    const recentPosts = await sql`
      SELECT 
        p.id,
        p.title,
        p.created_at,
        c.name as category_name,
        c.slug as category_slug,
        COALESCE(
          (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id),
          0
        ) as comment_count,
        COALESCE(
          (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id),
          0
        ) as like_count
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.user_id = ${user.uid}
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

    // 检查是否在线
    const onlineCheck = await sql`
      SELECT EXISTS(
        SELECT 1 FROM user_activity_logs
        WHERE user_id = ${user.uid}
        AND created_at > NOW() - INTERVAL '15 minutes'
      ) as is_online
    `;

    const isOnline = onlineCheck[0]?.is_online || false;

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
        likes: likeCount,
        receivedLikes,
        reputation,
        followers: 0, // TODO: 实现关注功能
        following: 0, // TODO: 实现关注功能
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
