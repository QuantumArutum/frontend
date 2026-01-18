/**
 * Create Post API
 * Create a new post in the community (优化版)
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

// 设置运行时配置 - 使用Node.js runtime以支持完整的数据库功能
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  // 超时控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    if (!sql) {
      console.error('[create-post] Database connection not available');
      clearTimeout(timeoutId);
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection not available',
          message: '数据库连接不可用，请稍后重试',
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { title, content, categorySlug, currentUserId, tags = [], isDraft = false } = body;

    // 验证参数
    if (!title || !content || !currentUserId) {
      clearTimeout(timeoutId);
      return NextResponse.json(
        {
          success: false,
          message: 'Title, content, and user ID are required',
        },
        { status: 400 }
      );
    }

    // 验证标题长度
    if (title.length < 1 || title.length > 200) {
      clearTimeout(timeoutId);
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
      clearTimeout(timeoutId);
      return NextResponse.json(
        {
          success: false,
          message: 'Content must be between 10 and 50000 characters',
        },
        { status: 400 }
      );
    }

    // 简化用户验证
    const userCheck = await sql`
      SELECT uid FROM users WHERE uid = ${currentUserId} LIMIT 1
    `;

    if (userCheck.length === 0) {
      clearTimeout(timeoutId);
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
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
    if (tags && tags.length > 0 && sql) {
      // 在后台处理标签，不等待完成
      const sqlInstance = sql; // 保存引用以便在回调中使用
      Promise.all(
        tags.slice(0, 5).map(async (tagName: string) => {
          try {
            const tagResult = await sqlInstance`
            SELECT id FROM tags WHERE name = ${tagName} LIMIT 1
          `;

            let tagId;
            if (tagResult.length === 0) {
              const newTag = await sqlInstance`
              INSERT INTO tags (name, slug, use_count, created_at)
              VALUES (${tagName}, ${tagName.toLowerCase().replace(/\s+/g, '-')}, 1, NOW())
              RETURNING id
            `;
              tagId = newTag[0].id;
            } else {
              tagId = tagResult[0].id;
              await sqlInstance`UPDATE tags SET use_count = use_count + 1 WHERE id = ${tagId}`;
            }

            await sqlInstance`
            INSERT INTO post_tags (post_id, tag_id, created_at)
            VALUES (${postId}, ${tagId}, NOW())
            ON CONFLICT (post_id, tag_id) DO NOTHING
          `;
          } catch (tagError) {
            console.error('Error processing tag:', tagName, tagError);
          }
        })
      ).catch((err) => console.error('Tag processing error:', err));
    }

    clearTimeout(timeoutId);

    return NextResponse.json({
      success: true,
      message: isDraft ? 'Draft saved successfully' : 'Post created successfully',
      data: {
        postId,
        isDraft,
        tagsAdded: tags.length,
      },
    });
  } catch (error) {
    clearTimeout(timeoutId);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';

    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[create-post] Request timeout:', {
        message: errorMessage,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Request timeout',
          message: '请求超时，请稍后重试',
        },
        { status: 504 }
      );
    }

    console.error('[create-post] Error:', {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: '创建帖子失败，请稍后重试',
      },
      { status: 500 }
    );
  }
}
