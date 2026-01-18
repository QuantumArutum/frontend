/**
 * Like Post API
 * Toggle like status for a post
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
    const { postId, currentUserId } = body;

    // 验证参数
    if (!postId || !currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Post ID and user ID are required',
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
      SELECT id, like_count FROM posts WHERE id = ${postId} AND status = 'published'
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

    // 检查是否已点赞
    const likeCheck = await sql`
      SELECT id FROM post_likes 
      WHERE post_id = ${postId} AND user_id = ${currentUserId}
    `;

    let isLiked = false;
    let likeCount = parseInt(postCheck[0].like_count || '0');

    if (likeCheck.length > 0) {
      // 已点赞，取消点赞
      await sql`
        DELETE FROM post_likes 
        WHERE post_id = ${postId} AND user_id = ${currentUserId}
      `;

      await sql`
        UPDATE posts 
        SET like_count = GREATEST(like_count - 1, 0)
        WHERE id = ${postId}
      `;

      isLiked = false;
      likeCount = Math.max(likeCount - 1, 0);
    } else {
      // 未点赞，添加点赞
      await sql`
        INSERT INTO post_likes (post_id, user_id)
        VALUES (${postId}, ${currentUserId})
      `;

      await sql`
        UPDATE posts 
        SET like_count = like_count + 1 
        WHERE id = ${postId}
      `;

      isLiked = true;
      likeCount = likeCount + 1;

      // 创建点赞通知（异步，不阻塞响应）
      try {
        // 获取帖子作者ID和标题
        const postInfo = await sql`
          SELECT user_id, title FROM posts WHERE id = ${postId}
        `;

        if (postInfo.length > 0) {
          const postAuthorId = postInfo[0].user_id;
          const postTitle = postInfo[0].title;

          // 只有当点赞者不是帖子作者时才创建通知
          if (postAuthorId !== currentUserId) {
            // 获取点赞者的显示名称
            const userResult = await sql`
              SELECT email FROM users WHERE uid = ${currentUserId}
            `;
            const userEmail = userResult[0]?.email || '';
            let displayName = userEmail.split('@')[0];

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

            await sql`
              INSERT INTO notifications (
                user_id, type, title, content, link, 
                actor_id, actor_name, is_read, created_at
              ) VALUES (
                ${postAuthorId}, 
                'like', 
                '新点赞', 
                ${`${displayName} 赞了你的帖子 "${postTitle}"`}, 
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
        console.error('Error creating like notification:', notificationError);
      }
    }

    return NextResponse.json({
      success: true,
      message: isLiked ? 'Post liked' : 'Post unliked',
      data: {
        isLiked,
        likeCount,
      },
    });
  } catch (error) {
    console.error('Error toggling post like:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
