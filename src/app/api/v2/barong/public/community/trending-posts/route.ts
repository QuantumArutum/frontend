/**
 * Trending Posts API
 * Returns trending/hot posts based on engagement metrics
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');
  const type = searchParams.get('type') || 'all'; // all, trending, new

  try {
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured' 
      }, { status: 500 });
    }

    let posts;

    if (type === 'trending') {
      // 按照点赞数和评论数的综合得分排序
      posts = await sql`
        SELECT 
          p.id,
          p.title,
          p.user_id,
          p.created_at,
          p.is_pinned,
          u.email,
          COALESCE(
            (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id),
            0
          ) as comment_count,
          COALESCE(
            (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id),
            0
          ) as like_count,
          COALESCE(p.view_count, 0) as view_count
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.uid
        WHERE p.created_at > NOW() - INTERVAL '7 days'
        ORDER BY 
          (COALESCE((SELECT COUNT(*) FROM post_likes WHERE post_id = p.id), 0) * 2 + 
           COALESCE((SELECT COUNT(*) FROM post_comments WHERE post_id = p.id), 0)) DESC,
          p.created_at DESC
        LIMIT ${limit}
      `;
    } else if (type === 'new') {
      // 按照创建时间排序
      posts = await sql`
        SELECT 
          p.id,
          p.title,
          p.user_id,
          p.created_at,
          p.is_pinned,
          u.email,
          COALESCE(
            (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id),
            0
          ) as comment_count,
          COALESCE(
            (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id),
            0
          ) as like_count,
          COALESCE(p.view_count, 0) as view_count
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.uid
        ORDER BY p.created_at DESC
        LIMIT ${limit}
      `;
    } else {
      // 默认：置顶帖子优先，然后按照综合得分排序
      posts = await sql`
        SELECT 
          p.id,
          p.title,
          p.user_id,
          p.created_at,
          p.is_pinned,
          u.email,
          COALESCE(
            (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id),
            0
          ) as comment_count,
          COALESCE(
            (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id),
            0
          ) as like_count,
          COALESCE(p.view_count, 0) as view_count
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.uid
        ORDER BY 
          p.is_pinned DESC,
          (COALESCE((SELECT COUNT(*) FROM post_likes WHERE post_id = p.id), 0) * 2 + 
           COALESCE((SELECT COUNT(*) FROM post_comments WHERE post_id = p.id), 0)) DESC,
          p.created_at DESC
        LIMIT ${limit}
      `;
    }

    // 格式化数据
    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      userId: post.user_id,
      userName: post.email ? post.email.split('@')[0] : 'Unknown',
      createdAt: post.created_at,
      isPinned: post.is_pinned || false,
      replies: parseInt(post.comment_count || '0'),
      views: parseInt(post.view_count || '0'),
      likes: parseInt(post.like_count || '0'),
    }));

    return NextResponse.json({
      success: true,
      data: formattedPosts,
    });
  } catch (error) {
    console.error('Error fetching trending posts:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
