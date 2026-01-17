/**
 * Post Detail API
 * Returns complete post information with user details
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');
  const currentUserId = searchParams.get('currentUserId'); // 可选，用于判断是否已点赞

  try {
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured' 
      }, { status: 500 });
    }

    if (!postId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Post ID is required' 
      }, { status: 400 });
    }

    // 确保 post_likes 表存在
    try {
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
      console.error('Error creating post_likes table:', e);
    }

    // 获取帖子详情
    const postResult = await sql`
      SELECT 
        p.id,
        p.title,
        p.content,
        p.category_id,
        p.user_id,
        p.view_count,
        p.like_count,
        p.comment_count,
        p.is_pinned,
        p.status,
        p.created_at,
        p.updated_at,
        c.name as category_name,
        c.slug as category_slug,
        u.email as user_email
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.user_id = u.uid
      WHERE p.id = ${postId} AND p.status = 'published'
    `;

    if (postResult.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Post not found' 
      }, { status: 404 });
    }

    const post = postResult[0];

    // 获取用户资料（显示名称）
    let displayName = post.user_email?.split('@')[0] || 'Unknown';
    let userRole = 'member';
    
    try {
      const profileResult = await sql`
        SELECT display_name FROM user_profiles WHERE user_id = ${post.user_id}
      `;
      if (profileResult.length > 0 && profileResult[0].display_name) {
        displayName = profileResult[0].display_name;
      }
    } catch (e) {
      // 如果表不存在，使用默认值
    }

    // 检查当前用户是否已点赞
    let isLiked = false;
    if (currentUserId) {
      try {
        const likeResult = await sql`
          SELECT id FROM post_likes 
          WHERE post_id = ${postId} AND user_id = ${currentUserId}
        `;
        isLiked = likeResult.length > 0;
      } catch (e) {
        console.error('Error checking like status:', e);
      }
    }

    // 增加浏览量（简单实现，每次访问都增加）
    try {
      await sql`
        UPDATE posts 
        SET view_count = view_count + 1 
        WHERE id = ${postId}
      `;
    } catch (e) {
      console.error('Error updating view count:', e);
    }

    // 格式化响应
    const postDetail = {
      id: post.id,
      title: post.title,
      content: post.content,
      categoryId: post.category_id,
      categoryName: post.category_name,
      categorySlug: post.category_slug,
      userId: post.user_id,
      userName: displayName,
      userAvatar: post.user_email?.[0]?.toUpperCase() || 'U',
      userRole,
      viewCount: parseInt(post.view_count || '0') + 1, // 返回增加后的值
      likeCount: parseInt(post.like_count || '0'),
      commentCount: parseInt(post.comment_count || '0'),
      isPinned: post.is_pinned || false,
      isLiked,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
    };

    return NextResponse.json({
      success: true,
      data: postDetail,
    });
  } catch (error) {
    console.error('Error fetching post detail:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
