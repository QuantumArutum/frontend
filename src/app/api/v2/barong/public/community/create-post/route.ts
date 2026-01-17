/**
 * Create Post API
 * Create a new post in the community
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured' 
      }, { status: 500 });
    }

    const body = await request.json();
    const { title, content, categorySlug, currentUserId, isDraft = false } = body;

    // 验证参数
    if (!title || !content || !currentUserId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Title, content, and user ID are required' 
      }, { status: 400 });
    }

    // 验证标题长度
    if (title.length < 1 || title.length > 200) {
      return NextResponse.json({ 
        success: false, 
        message: 'Title must be between 1 and 200 characters' 
      }, { status: 400 });
    }

    // 验证内容长度
    if (content.length < 10 || content.length > 50000) {
      return NextResponse.json({ 
        success: false, 
        message: 'Content must be between 10 and 50000 characters' 
      }, { status: 400 });
    }

    // 验证用户存在
    const userCheck = await sql`
      SELECT uid FROM users WHERE uid = ${currentUserId} AND status = 'active'
    `;

    if (userCheck.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }

    // 获取分类ID
    let categoryId = 1; // 默认分类
    if (categorySlug) {
      const categoryResult = await sql`
        SELECT id FROM categories WHERE slug = ${categorySlug} AND is_active = true
      `;
      if (categoryResult.length > 0) {
        categoryId = categoryResult[0].id;
      }
    }

    // 确保 posts 表存在必要字段
    try {
      await sql`
        ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_draft BOOLEAN DEFAULT FALSE
      `;
    } catch (e) {
      console.error('Error adding is_draft column:', e);
    }

    // 插入帖子
    const postResult = await sql`
      INSERT INTO posts (
        title, content, user_id, category_id, 
        view_count, like_count, comment_count,
        is_pinned, is_draft, status, created_at, updated_at
      )
      VALUES (
        ${title}, ${content}, ${currentUserId}, ${categoryId},
        0, 0, 0,
        false, ${isDraft}, ${isDraft ? 'draft' : 'published'}, NOW(), NOW()
      )
      RETURNING id
    `;

    const postId = postResult[0].id;

    return NextResponse.json({
      success: true,
      message: isDraft ? 'Draft saved successfully' : 'Post created successfully',
      data: {
        postId,
        isDraft,
      },
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
