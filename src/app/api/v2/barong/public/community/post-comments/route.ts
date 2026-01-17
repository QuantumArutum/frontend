/**
 * Post Comments API
 * Returns comments for a specific post
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');
  const currentUserId = searchParams.get('currentUserId'); // 可选，用于判断是否已点赞
  const sort = searchParams.get('sort') || 'newest'; // newest, oldest, hot, best
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

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
      console.error('Error creating comment tables:', e);
    }

    // 获取评论总数
    const countResult = await sql`
      SELECT COUNT(*) as total 
      FROM post_comments 
      WHERE post_id = ${postId} 
        AND (parent_id IS NULL OR parent_id = 0) 
        AND (is_deleted IS NULL OR is_deleted = FALSE) 
        AND status = 'active'
    `;
    const total = parseInt(countResult[0]?.total || '0');

    // 根据排序方式构建查询
    let orderBy = 'c.created_at DESC'; // 默认最新
    if (sort === 'oldest') {
      orderBy = 'c.created_at ASC';
    } else if (sort === 'hot') {
      orderBy = 'c.like_count DESC, c.created_at DESC';
    } else if (sort === 'best') {
      // 综合算法：点赞数 + 时间衰减
      orderBy = '(c.like_count * 10 + EXTRACT(EPOCH FROM (NOW() - c.created_at)) / 3600) DESC';
    }

    // 获取评论列表（只获取一级评论，parent_id 为 NULL 或 0）
    const commentsResult = await sql`
      SELECT 
        c.id,
        c.post_id,
        c.user_id,
        c.content,
        c.like_count,
        c.created_at,
        c.parent_id,
        c.reply_to_user_id,
        c.reply_to_user_name,
        c.depth,
        c.is_edited,
        c.edited_at,
        u.email as user_email
      FROM post_comments c
      LEFT JOIN users u ON c.user_id = u.uid
      WHERE c.post_id = ${postId} 
        AND (c.parent_id IS NULL OR c.parent_id = 0)
        AND (c.is_deleted IS NULL OR c.is_deleted = FALSE)
        AND c.status = 'active'
      ORDER BY ${sql.unsafe(orderBy)}
      LIMIT ${limit} OFFSET ${offset}
    `;

    // 获取每个评论的用户资料、点赞状态和子评论数
    const comments = await Promise.all(
      commentsResult.map(async (comment: any) => {
        // 获取用户显示名称
        let displayName = comment.user_email?.split('@')[0] || 'Unknown';
        if (sql) {
          try {
            const profileResult = await sql`
              SELECT display_name FROM user_profiles WHERE user_id = ${comment.user_id}
            `;
            if (profileResult.length > 0 && profileResult[0].display_name) {
              displayName = profileResult[0].display_name;
            }
          } catch (e) {
            // 使用默认值
          }
        }

        // 检查当前用户是否已点赞此评论
        let isLiked = false;
        if (currentUserId && sql) {
          try {
            const likeResult = await sql`
              SELECT id FROM comment_likes 
              WHERE comment_id = ${comment.id} AND user_id = ${currentUserId}
            `;
            isLiked = likeResult.length > 0;
          } catch (e) {
            console.error('Error checking comment like status:', e);
          }
        }

        // 获取子评论数量
        let replyCount = 0;
        if (sql) {
          try {
            const replyCountResult = await sql`
              SELECT COUNT(*) as count 
              FROM post_comments 
              WHERE parent_id = ${comment.id} 
                AND (is_deleted IS NULL OR is_deleted = FALSE)
                AND status = 'active'
            `;
            replyCount = parseInt(replyCountResult[0]?.count || '0');
          } catch (e) {
            console.error('Error counting replies:', e);
          }
        }

        return {
          id: comment.id,
          postId: comment.post_id,
          userId: comment.user_id,
          userName: displayName,
          userAvatar: comment.user_email?.[0]?.toUpperCase() || 'U',
          userRole: 'member',
          content: comment.content,
          likeCount: parseInt(comment.like_count || '0'),
          isLiked,
          replyCount,
          parentId: comment.parent_id,
          replyToUserId: comment.reply_to_user_id,
          replyToUserName: comment.reply_to_user_name,
          depth: comment.depth || 0,
          isEdited: comment.is_edited || false,
          editedAt: comment.edited_at,
          createdAt: comment.created_at,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        comments,
        total,
        page,
        limit,
        hasMore: offset + comments.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
