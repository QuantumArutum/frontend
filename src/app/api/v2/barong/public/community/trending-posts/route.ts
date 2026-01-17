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

    // 确保必要的表存在
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS post_comments (
          id SERIAL PRIMARY KEY,
          post_id INTEGER NOT NULL,
          user_id VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          parent_id INTEGER,
          like_count INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          status VARCHAR(50) DEFAULT 'active'
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS post_likes (
          id SERIAL PRIMARY KEY,
          post_id INTEGER NOT NULL,
          user_id VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(post_id, user_id)
        )
      `;
    } catch (e) {
      console.error('Error creating tables:', e);
    }

    let posts;

    if (type === 'trending') {
      // 按照点赞数和评论数的综合得分排序（最近7天）
      posts = await sql`
        SELECT 
          p.id,
          p.title,
          p.user_id,
          p.created_at,
          p.is_pinned,
          p.like_count,
          p.comment_count,
          p.view_count,
          u.email
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.uid
        WHERE p.status = 'published' 
          AND p.created_at > CURRENT_TIMESTAMP - INTERVAL '7 days'
        ORDER BY 
          (COALESCE(p.like_count, 0) * 2 + COALESCE(p.comment_count, 0)) DESC,
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
          p.like_count,
          p.comment_count,
          p.view_count,
          u.email
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.uid
        WHERE p.status = 'published'
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
          p.like_count,
          p.comment_count,
          p.view_count,
          u.email
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.uid
        WHERE p.status = 'published'
        ORDER BY 
          p.is_pinned DESC,
          (COALESCE(p.like_count, 0) * 2 + COALESCE(p.comment_count, 0)) DESC,
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
