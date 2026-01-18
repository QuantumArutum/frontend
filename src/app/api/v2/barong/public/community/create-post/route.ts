/**
 * Create Post API
 * Create a new post in the community (优化版)
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

// 设置运行时配置
export const runtime = 'edge';
export const maxDuration = 10;

export async function POST(request: NextRequest) {
  // 超时控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    if (!sql) {
      clearTimeout(timeoutId);
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured' 
      }, { status: 500 });
    }

    const body = await request.json();
    const { title, content, categorySlug, currentUserId, tags = [], isDraft = false } = body;

    // 验证参数
    if (!title || !content || !currentUserId) {
      clearTimeout(timeoutId);
      return NextResponse.json({ 
        success: false, 
        message: 'Title, content, and user ID are required' 
      }, { status: 400 });
    }

    // 验证标题长度
    if (title.length < 1 || title.length > 200) {
      clearTimeout(timeoutId);
      return NextResponse.json({ 
        success: false, 
        message: 'Title must be between 1 and 200 characters' 
      }, { status: 400 });
    }

    // 验证内容长度
    if (content.length < 10 || content.length > 50000) {
      clearTimeout(timeoutId);
      return NextResponse.json({ 
        success: false, 
        message: 'Content must be between 10 and 50000 characters' 
      }, { status: 400 });
    }

    // 简化用户验证
    const userCheck = await sql`
      SELECT uid FROM users WHERE uid = ${currentUserId} LIMIT 1
    `;

    if (userCheck.length === 0) {
      clearTimeout(timeoutId);
      return NextResponse.json({ 
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }

    // 获取分类ID（使用默认值避免额外查询）
    let categoryId = 1; // 默认分类
    if (categorySlug && categorySlug !== 'general') {
      try {
        const categoryResult = await sql`
          SELECT id FROM categories WHERE slug = ${categorySlug} AND is_active = true LIMIT 1
        `;
        if (categoryResult.length > 0) {
          categoryId = categoryResult[0].id;
        }
      } catch (e) {
        console.error('Category lookup error:', e);
      }
    }

    // 插入帖子（简化版）
    const postResult = await sql`
      INSERT INTO posts (
        title, content, user_id, category_id, 
        view_count, like_count, comment_count,
        is_pinned, status, created_at, updated_at
      )
      VALUES (
        ${title}, ${content}, ${currentUserId}, ${categoryId},
        0, 0, 0,
        false, ${isDraft ? 'draft' : 'published'}, NOW(), NOW()
      )
      RETURNING id
    `;

    const postId = postResult[0].id;

    // 异步处理标签（不阻塞响应）
    if (tags && tags.length > 0) {
      // 在后台处理标签，不等待完成
      Promise.all(tags.slice(0, 5).map(async (tagName: string) => {
        try {
          let tagResult = await sql`
            SELECT id FROM tags WHERE name = ${tagName} LIMIT 1
          `;
          
          let tagId;
          if (tagResult.length === 0) {
            const newTag = await sql`
              INSERT INTO tags (name, slug, use_count, created_at)
              VALUES (${tagName}, ${tagName.toLowerCase().replace(/\s+/g, '-')}, 1, NOW())
              RETURNING id
            `;
            tagId = newTag[0].id;
          } else {
            tagId = tagResult[0].id;
            await sql`UPDATE tags SET use_count = use_count + 1 WHERE id = ${tagId}`;
          }
          
          await sql`
            INSERT INTO post_tags (post_id, tag_id, created_at)
            VALUES (${postId}, ${tagId}, NOW())
            ON CONFLICT (post_id, tag_id) DO NOTHING
          `;
        } catch (tagError) {
          console.error('Error processing tag:', tagName, tagError);
        }
      })).catch(err => console.error('Tag processing error:', err));
    }

    clearTimeout(timeoutId);

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
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({ 
        success: false, 
        message: 'Request timeout' 
      }, { status: 504 });
    }
    
    console.error('Error creating post:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
