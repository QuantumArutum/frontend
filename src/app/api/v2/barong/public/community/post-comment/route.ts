/**
 * Post Comment API
 * Create a new comment on a post
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function POST(request: NextRequest) {
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
    const { postId, currentUserId, content } = body;

    // 验证参数
    if (!postId || !currentUserId || !content) {
      return NextResponse.json(
        {
          success: false,
          message: 'Post ID, user ID, and content are required',
        },
        { status: 400 }
      );
    }

    // 验证内容长度
    if (content.length > 1000) {
      return NextResponse.json(
        {
          success: false,
          message: 'Comment content must be less than 1000 characters',
        },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Comment content cannot be empty',
        },
        { status: 400 }
      );
    }

    // 验证用户存在
    const userCheck = await sql`
      SELECT uid FROM users WHERE uid = ${currentUserId} AND status = 'active'
    `;

    if (userCheck.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    // 验证帖子存在
    const postCheck = await sql`
      SELECT id FROM posts WHERE id = ${postId} AND status = 'published'
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

    // 确保评论表存在
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
    } catch (e) {
      console.error('Error creating post_comments table:', e);
    }

    // 插入评论
    const commentResult = await sql`
      INSERT INTO post_comments (post_id, user_id, content, parent_id, status)
      VALUES (${postId}, ${currentUserId}, ${content}, NULL, 'active')
      RETURNING id, post_id, user_id, content, like_count, created_at
    `;

    const newComment = commentResult[0];

    // 更新帖子的评论数
    await sql`
      UPDATE posts 
      SET comment_count = comment_count + 1 
      WHERE id = ${postId}
    `;

    // 获取用户信息
    const userResult = await sql`
      SELECT email FROM users WHERE uid = ${currentUserId}
    `;
    const userEmail = userResult[0]?.email || '';

    let displayName = userEmail.split('@')[0];
    if (sql) {
      try {
        const profileResult = await sql`
          SELECT display_name FROM user_profiles WHERE user_id = ${currentUserId}
        `;
        if (profileResult.length > 0 && profileResult[0].display_name) {
          displayName = profileResult[0].display_name;
        }
      } catch (e) {
        // 使用默认值
      }
    }

    // 创建评论通知（异步，不阻塞响应）
    try {
      // 获取帖子作者ID和标题
      const postInfo = await sql`
        SELECT user_id, title FROM posts WHERE id = ${postId}
      `;

      if (postInfo.length > 0) {
        const postAuthorId = postInfo[0].user_id;
        const postTitle = postInfo[0].title;

        // 只有当评论者不是帖子作者时才创建通知
        if (postAuthorId !== currentUserId) {
          await sql`
            INSERT INTO notifications (
              user_id, type, title, content, link, 
              actor_id, actor_name, is_read, created_at
            ) VALUES (
              ${postAuthorId}, 
              'comment', 
              '新评论', 
              ${`${displayName} 评论了你的帖子 "${postTitle}"`}, 
              ${`/community/posts?id=${postId}`},
              ${currentUserId}, 
              ${displayName}, 
              false, 
              NOW()
            )
          `;
        }
      }
    } catch (notificationError) {
      // 通知创建失败不影响主功能
      console.error('Error creating comment notification:', notificationError);
    }

    // 返回新创建的评论
    const comment = {
      id: newComment.id,
      postId: newComment.post_id,
      userId: newComment.user_id,
      userName: displayName,
      userAvatar: userEmail[0]?.toUpperCase() || 'U',
      userRole: 'member',
      content: newComment.content,
      likeCount: 0,
      isLiked: false,
      createdAt: newComment.created_at,
    };

    return NextResponse.json({
      success: true,
      message: 'Comment created successfully',
      data: comment,
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
