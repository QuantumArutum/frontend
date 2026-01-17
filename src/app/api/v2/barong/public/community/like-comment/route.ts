/**
 * Like Comment API
 * Toggle like status for a comment
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
    const { commentId, currentUserId } = body;

    // 验证参数
    if (!commentId || !currentUserId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Comment ID and user ID are required' 
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

    // 验证评论存在
    const commentCheck = await sql`
      SELECT id, like_count FROM post_comments 
      WHERE id = ${commentId} AND status = 'active'
    `;

    if (commentCheck.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Comment not found' 
      }, { status: 404 });
    }

    // 确保 comment_likes 表存在
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS comment_likes (
          id SERIAL PRIMARY KEY,
          comment_id INTEGER NOT NULL,
          user_id VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(comment_id, user_id)
        )
      `;
    } catch (e) {
      console.error('Error creating comment_likes table:', e);
    }

    // 检查是否已点赞
    const likeCheck = await sql`
      SELECT id FROM comment_likes 
      WHERE comment_id = ${commentId} AND user_id = ${currentUserId}
    `;

    let isLiked = false;
    let likeCount = parseInt(commentCheck[0].like_count || '0');

    if (likeCheck.length > 0) {
      // 已点赞，取消点赞
      await sql`
        DELETE FROM comment_likes 
        WHERE comment_id = ${commentId} AND user_id = ${currentUserId}
      `;

      await sql`
        UPDATE post_comments 
        SET like_count = GREATEST(like_count - 1, 0)
        WHERE id = ${commentId}
      `;

      isLiked = false;
      likeCount = Math.max(likeCount - 1, 0);
    } else {
      // 未点赞，添加点赞
      await sql`
        INSERT INTO comment_likes (comment_id, user_id)
        VALUES (${commentId}, ${currentUserId})
      `;

      await sql`
        UPDATE post_comments 
        SET like_count = like_count + 1 
        WHERE id = ${commentId}
      `;

      isLiked = true;
      likeCount = likeCount + 1;

      // 创建点赞评论通知（异步，不阻塞响应）
      try {
        // 获取评论作者ID和帖子信息
        const commentInfo = await sql`
          SELECT pc.user_id, pc.post_id, pc.content, p.title
          FROM post_comments pc
          JOIN posts p ON pc.post_id = p.id
          WHERE pc.id = ${commentId}
        `;
        
        if (commentInfo.length > 0) {
          const commentAuthorId = commentInfo[0].user_id;
          const postId = commentInfo[0].post_id;
          const postTitle = commentInfo[0].title;
          const commentContent = commentInfo[0].content;
          const commentPreview = commentContent.length > 30 
            ? commentContent.substring(0, 30) + '...' 
            : commentContent;
          
          // 只有当点赞者不是评论作者时才创建通知
          if (commentAuthorId !== currentUserId) {
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
                ${commentAuthorId}, 
                'like', 
                '新点赞', 
                ${`${displayName} 赞了你在 "${postTitle}" 中的评论: "${commentPreview}"`}, 
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
        console.error('Error creating comment like notification:', notificationError);
      }
    }

    return NextResponse.json({
      success: true,
      message: isLiked ? 'Comment liked' : 'Comment unliked',
      data: {
        isLiked,
        likeCount,
      },
    });
  } catch (error) {
    console.error('Error toggling comment like:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
