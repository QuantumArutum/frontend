import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { PERMISSIONS, hasPermission } from '@/lib/permissions';

export async function DELETE(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      return NextResponse.json(
        {
          success: false,
          message: 'Database not configured',
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get('commentId');
    const currentUserId = searchParams.get('currentUserId');
    const reason = searchParams.get('reason');

    if (!commentId || !currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required parameters',
        },
        { status: 400 }
      );
    }

    const sql = neon(databaseUrl);

    // 检查用户权限
    const moderator = await sql`
      SELECT role, permissions FROM moderators WHERE user_id = ${currentUserId}
    `;

    if (moderator.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: Not a moderator',
        },
        { status: 403 }
      );
    }

    const userRole = moderator[0].role;
    const customPermissions = moderator[0].permissions;

    if (!hasPermission(userRole, PERMISSIONS.DELETE_COMMENT, customPermissions)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: No permission to delete comments',
        },
        { status: 403 }
      );
    }

    // 检查评论是否存在
    const comment = await sql`
      SELECT id, post_id, user_id, content FROM post_comments 
      WHERE id = ${parseInt(commentId)}
    `;

    if (comment.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Comment not found',
        },
        { status: 404 }
      );
    }

    // 软删除评论（标记为已删除）
    await sql`
      UPDATE post_comments 
      SET 
        is_deleted = TRUE,
        deleted_at = NOW(),
        status = 'deleted'
      WHERE id = ${parseInt(commentId)}
    `;

    // 更新帖子评论数
    await sql`
      UPDATE posts 
      SET comment_count = GREATEST(comment_count - 1, 0)
      WHERE id = ${comment[0].post_id}
    `;

    // 记录版主操作
    await sql`
      INSERT INTO mod_actions (
        moderator_id, action_type, target_type, target_id, reason, details
      )
      VALUES (
        ${currentUserId},
        'delete_comment',
        'comment',
        ${commentId},
        ${reason || null},
        ${JSON.stringify({
          postId: comment[0].post_id,
          commentUserId: comment[0].user_id,
          contentPreview: comment[0].content.substring(0, 100),
        })}
      )
    `;

    // 通知评论作者（如果不是自己删除的）
    if (comment[0].user_id !== currentUserId) {
      try {
        await sql`
          INSERT INTO notifications (
            user_id, type, title, content, link, created_at
          )
          VALUES (
            ${comment[0].user_id},
            'system',
            '您的评论已被删除',
            ${reason ? `您的评论已被版主删除。原因：${reason}` : '您的评论已被版主删除。'},
            ${`/community/posts?id=${comment[0].post_id}`},
            NOW()
          )
        `;
      } catch (notifError) {
        console.error('Failed to create deletion notification:', notifError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete comment error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete comment',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
