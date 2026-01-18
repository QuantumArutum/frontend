/**
 * Edit Post API
 * Edit an existing post
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { postId, title, content, categorySlug, currentUserId, editReason } = body;

    // 验证参数
    if (!postId || !title || !content || !currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Post ID, title, content, and user ID are required',
        },
        { status: 400 }
      );
    }

    // 验证标题长度
    if (title.length < 1 || title.length > 200) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title must be between 1 and 200 characters',
        },
        { status: 400 }
      );
    }

    // 验证内容长度
    if (content.length < 10 || content.length > 50000) {
      return NextResponse.json(
        {
          success: false,
          message: 'Content must be between 10 and 50000 characters',
        },
        { status: 400 }
      );
    }

    // 验证帖子存在且属于当前用户
    const postCheck = await sql`
      SELECT id, user_id FROM posts 
      WHERE id = ${postId} AND status != 'deleted'
    `;

    if (postCheck.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Post not found',
        },
        { status: 404 }
      );
    }

    if (postCheck[0].user_id !== currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: 'You can only edit your own posts',
        },
        { status: 403 }
      );
    }

    // 获取分类ID
    let categoryId = postCheck[0].category_id;
    if (categorySlug) {
      const categoryResult = await sql`
        SELECT id FROM categories WHERE slug = ${categorySlug} AND is_active = true
      `;
      if (categoryResult.length > 0) {
        categoryId = categoryResult[0].id;
      }
    }

    // 确保必要字段存在
    try {
      await sql`
        ALTER TABLE posts ADD COLUMN IF NOT EXISTS edited_at TIMESTAMP
      `;
      await sql`
        ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_edited BOOLEAN DEFAULT FALSE
      `;
      await sql`
        ALTER TABLE posts ADD COLUMN IF NOT EXISTS edit_reason TEXT
      `;
    } catch (e) {
      console.error('Error adding edit columns:', e);
    }

    // 更新帖子
    await sql`
      UPDATE posts 
      SET 
        title = ${title},
        content = ${content},
        category_id = ${categoryId},
        edited_at = NOW(),
        is_edited = true,
        edit_reason = ${editReason || null},
        updated_at = NOW()
      WHERE id = ${postId}
    `;

    return NextResponse.json({
      success: true,
      message: 'Post updated successfully',
    });
  } catch (error) {
    console.error('Error editing post:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
