import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { PERMISSIONS, hasPermission } from '@/lib/permissions';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { postId, reason, currentUserId } = body;

    // 验证必填字段
    if (!postId || !currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
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

    if (!hasPermission(userRole, PERMISSIONS.LOCK_POST, customPermissions)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: No permission to lock posts',
        },
        { status: 403 }
      );
    }

    // 检查帖子是否存在
    const post = await sql`
      SELECT id, title FROM posts WHERE id = ${postId}
    `;

    if (post.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Post not found',
        },
        { status: 404 }
      );
    }

    // 锁定帖子
    await sql`
      UPDATE posts 
      SET 
        is_locked = TRUE,
        locked_by = ${currentUserId},
        locked_at = NOW()
      WHERE id = ${postId}
    `;

    // 记录版主操作
    await sql`
      INSERT INTO mod_actions (
        moderator_id, action_type, target_type, target_id, reason, details
      )
      VALUES (
        ${currentUserId},
        'lock_post',
        'post',
        ${postId.toString()},
        ${reason || null},
        ${JSON.stringify({ postTitle: post[0].title })}
      )
    `;

    return NextResponse.json({
      success: true,
      message: 'Post locked successfully',
      data: {
        postId,
        lockedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Lock post error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to lock post',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// 解锁帖子
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
    const postId = searchParams.get('postId');
    const currentUserId = searchParams.get('currentUserId');
    const reason = searchParams.get('reason');

    if (!postId || !currentUserId) {
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

    if (!hasPermission(userRole, PERMISSIONS.LOCK_POST, customPermissions)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: No permission to unlock posts',
        },
        { status: 403 }
      );
    }

    // 解锁帖子
    await sql`
      UPDATE posts 
      SET 
        is_locked = FALSE,
        locked_by = NULL,
        locked_at = NULL
      WHERE id = ${parseInt(postId)}
    `;

    // 记录版主操作
    await sql`
      INSERT INTO mod_actions (
        moderator_id, action_type, target_type, target_id, reason
      )
      VALUES (
        ${currentUserId},
        'unlock_post',
        'post',
        ${postId},
        ${reason || null}
      )
    `;

    return NextResponse.json({
      success: true,
      message: 'Post unlocked successfully',
    });
  } catch (error: any) {
    console.error('Unlock post error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to unlock post',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
