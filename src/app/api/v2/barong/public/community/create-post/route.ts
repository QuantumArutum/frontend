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
    const { title, content, categorySlug, currentUserId, tags = [], isDraft = false } = body;

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

    // 处理标签
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        try {
          // 查找或创建标签
          let tagResult = await sql`
            SELECT id FROM tags WHERE name = ${tagName}
          `;
          
          let tagId;
          if (tagResult.length === 0) {
            // 创建新标签
            const newTag = await sql`
              INSERT INTO tags (name, slug, use_count, created_at)
              VALUES (${tagName}, ${tagName.toLowerCase().replace(/\s+/g, '-')}, 1, NOW())
              RETURNING id
            `;
            tagId = newTag[0].id;
          } else {
            tagId = tagResult[0].id;
            // 更新使用次数
            await sql`
              UPDATE tags SET use_count = use_count + 1 WHERE id = ${tagId}
            `;
          }
          
          // 关联帖子和标签
          await sql`
            INSERT INTO post_tags (post_id, tag_id, created_at)
            VALUES (${postId}, ${tagId}, NOW())
            ON CONFLICT (post_id, tag_id) DO NOTHING
          `;
        } catch (tagError) {
          console.error('Error processing tag:', tagName, tagError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: isDraft ? 'Draft saved successfully' : 'Post created successfully',
      data: {
        postId,
        isDraft,
        tagsAdded: tags.length
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
