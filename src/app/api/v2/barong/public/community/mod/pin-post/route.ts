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
    const { postId, pinType, reason, currentUserId } = body;

    // 验证必填字段
    if (!postId || !pinType || !currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // 验证 pinType
    if (!['global', 'category'].includes(pinType)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid pin type',
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

    if (!hasPermission(userRole, PERMISSIONS.PIN_POST, customPermissions)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: No permission to pin posts',
        },
        { status: 403 }
      );
    }

    // 检查帖子是否存在
    const post = await sql`
      SELECT id, title, category_id FROM posts WHERE id = ${postId}
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

    // 置顶帖子
    await sql`
      UPDATE posts 
      SET 
        is_pinned = TRUE,
        pin_type = ${pinType},
        pinned_at = NOW(),
        pinned_by = ${currentUserId}
      WHERE id = ${postId}
    `;

    // 记录版主操作
    await sql`
      INSERT INTO mod_actions (
        moderator_id, action_type, target_type, target_id, reason, details
      )
      VALUES (
        ${currentUserId},
        'pin_post',
        'post',
        ${postId.toString()},
        ${reason || null},
        ${JSON.stringify({ pinType, postTitle: post[0].title })}
      )
    `;

    return NextResponse.json({
      success: true,
      message: 'Post pinned successfully',
      data: {
        postId,
        pinType,
        pinnedAt: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error('Pin post error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to pin post',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// 取消置顶
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

    if (!hasPermission(userRole, PERMISSIONS.PIN_POST, customPermissions)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: No permission to unpin posts',
        },
        { status: 403 }
      );
    }

    // 取消置顶
    await sql`
      UPDATE posts 
      SET 
        is_pinned = FALSE,
        pin_type = NULL,
        pinned_at = NULL,
        pinned_by = NULL
      WHERE id = ${parseInt(postId)}
    `;

    // 记录版主操作
    await sql`
      INSERT INTO mod_actions (
        moderator_id, action_type, target_type, target_id, reason
      )
      VALUES (
        ${currentUserId},
        'unpin_post',
        'post',
        ${postId},
        ${reason || null}
      )
    `;

    return NextResponse.json({
      success: true,
      message: 'Post unpinned successfully',
    });
  } catch (error: any) {
    console.error('Unpin post error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to unpin post',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
