import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const commentId = searchParams.get('commentId');
  const currentUserId = searchParams.get('currentUserId');

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

    if (!commentId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Comment ID is required',
        },
        { status: 400 }
      );
    }

    // 获取子评论列表
    const repliesResult = await sql`
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
      WHERE c.parent_id = ${commentId}
        AND (c.is_deleted IS NULL OR c.is_deleted = FALSE)
        AND c.status = 'active'
      ORDER BY c.created_at ASC
    `;

    // 获取每个回复的用户资料和点赞状态
    const replies = await Promise.all(
      repliesResult.map(async (reply: any) => {
        // 获取用户显示名称
        let displayName = reply.user_email?.split('@')[0] || 'Unknown';
        if (sql) {
          try {
            const profileResult = await sql`
              SELECT display_name FROM user_profiles WHERE user_id = ${reply.user_id}
            `;
            if (profileResult.length > 0 && profileResult[0].display_name) {
              displayName = profileResult[0].display_name;
            }
          } catch (e) {
            // 使用默认值
          }
        }

        // 检查当前用户是否已点赞此回复
        let isLiked = false;
        if (currentUserId && sql) {
          try {
            const likeResult = await sql`
              SELECT id FROM comment_likes 
              WHERE comment_id = ${reply.id} AND user_id = ${currentUserId}
            `;
            isLiked = likeResult.length > 0;
          } catch (e) {
            console.error('Error checking reply like status:', e);
          }
        }

        // 获取子评论数量（递归）
        let replyCount = 0;
        if (sql) {
          try {
            const replyCountResult = await sql`
              SELECT COUNT(*) as count 
              FROM post_comments 
              WHERE parent_id = ${reply.id} 
                AND (is_deleted IS NULL OR is_deleted = FALSE)
                AND status = 'active'
            `;
            replyCount = parseInt(replyCountResult[0]?.count || '0');
          } catch (e) {
            console.error('Error counting nested replies:', e);
          }
        }

        return {
          id: reply.id,
          postId: reply.post_id,
          userId: reply.user_id,
          userName: displayName,
          userAvatar: reply.user_email?.[0]?.toUpperCase() || 'U',
          userRole: 'member',
          content: reply.content,
          likeCount: parseInt(reply.like_count || '0'),
          isLiked,
          replyCount,
          parentId: reply.parent_id,
          replyToUserId: reply.reply_to_user_id,
          replyToUserName: reply.reply_to_user_name,
          depth: reply.depth || 0,
          isEdited: reply.is_edited || false,
          editedAt: reply.edited_at,
          createdAt: reply.created_at,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        replies,
      },
    });
  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
