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
    const { userId, duration, reason, currentUserId } = body;

    // 验证必填字段
    if (!userId || !reason || !currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // 不能封禁自己
    if (userId === currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cannot ban yourself',
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

    if (!hasPermission(userRole, PERMISSIONS.BAN_USER, customPermissions)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: No permission to ban users',
        },
        { status: 403 }
      );
    }

    // 检查目标用户是否是版主（不能封禁版主）
    const targetModerator = await sql`
      SELECT role FROM moderators WHERE user_id = ${userId}
    `;

    if (targetModerator.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cannot ban a moderator',
        },
        { status: 403 }
      );
    }

    // 计算过期时间
    let expiresAt = null;
    if (duration && duration > 0) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + duration);
      expiresAt = now.toISOString();
    }

    // 封禁用户
    await sql`
      INSERT INTO user_bans (
        user_id, ban_type, reason, banned_by, expires_at, is_active
      )
      VALUES (
        ${userId},
        'ban',
        ${reason},
        ${currentUserId},
        ${expiresAt},
        TRUE
      )
    `;

    // 记录版主操作
    await sql`
      INSERT INTO mod_actions (
        moderator_id, action_type, target_type, target_id, reason, details
      )
      VALUES (
        ${currentUserId},
        'ban_user',
        'user',
        ${userId},
        ${reason},
        ${JSON.stringify({ duration, expiresAt })}
      )
    `;

    // 创建通知
    try {
      await sql`
        INSERT INTO notifications (
          user_id, type, title, content, link, created_at
        )
        VALUES (
          ${userId},
          'system',
          '您已被封禁',
          ${duration ? `您已被封禁 ${duration} 分钟。原因：${reason}` : `您已被永久封禁。原因：${reason}`},
          '/community/settings',
          NOW()
        )
      `;
    } catch (notifError) {
      console.error('Failed to create ban notification:', notifError);
    }

    return NextResponse.json({
      success: true,
      message: 'User banned successfully',
      data: {
        userId,
        duration,
        expiresAt,
        reason,
      },
    });
  } catch (error: any) {
    console.error('Ban user error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to ban user',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// 解除封禁
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
    const userId = searchParams.get('userId');
    const currentUserId = searchParams.get('currentUserId');
    const reason = searchParams.get('reason');

    if (!userId || !currentUserId) {
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

    if (!hasPermission(userRole, PERMISSIONS.BAN_USER, customPermissions)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: No permission to unban users',
        },
        { status: 403 }
      );
    }

    // 解除封禁
    await sql`
      UPDATE user_bans 
      SET is_active = FALSE
      WHERE user_id = ${userId} AND ban_type = 'ban' AND is_active = TRUE
    `;

    // 记录版主操作
    await sql`
      INSERT INTO mod_actions (
        moderator_id, action_type, target_type, target_id, reason
      )
      VALUES (
        ${currentUserId},
        'unban_user',
        'user',
        ${userId},
        ${reason || null}
      )
    `;

    // 创建通知
    try {
      await sql`
        INSERT INTO notifications (
          user_id, type, title, content, link, created_at
        )
        VALUES (
          ${userId},
          'system',
          '封禁已解除',
          '您的封禁已被解除，现在可以正常使用社区功能了。',
          '/community',
          NOW()
        )
      `;
    } catch (notifError) {
      console.error('Failed to create unban notification:', notifError);
    }

    return NextResponse.json({
      success: true,
      message: 'User unbanned successfully',
    });
  } catch (error: any) {
    console.error('Unban user error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to unban user',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
