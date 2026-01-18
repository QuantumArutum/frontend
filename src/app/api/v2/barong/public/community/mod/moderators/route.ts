import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { PERMISSIONS, hasPermission, ROLES } from '@/lib/permissions';

// 获取版主列表
export async function GET(request: NextRequest) {
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
    const currentUserId = searchParams.get('currentUserId');
    const categoryId = searchParams.get('categoryId');

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing currentUserId',
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

    if (!hasPermission(userRole, PERMISSIONS.MANAGE_MODERATORS, customPermissions)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: No permission to view moderators',
        },
        { status: 403 }
      );
    }

    // 获取版主列表
    let moderators;
    if (categoryId) {
      moderators = await sql`
        SELECT * FROM moderators 
        WHERE removed_at IS NULL 
        AND (category_id = ${parseInt(categoryId)} OR category_id IS NULL)
        ORDER BY appointed_at DESC
      `;
    } else {
      moderators = await sql`
        SELECT * FROM moderators 
        WHERE removed_at IS NULL
        ORDER BY appointed_at DESC
      `;
    }

    return NextResponse.json({
      success: true,
      data: { moderators },
    });
  } catch (error: any) {
    console.error('Get moderators error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to get moderators',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// 添加版主
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
    const { userId, role, categoryId, permissions, currentUserId } = body;

    // 验证必填字段
    if (!userId || !role || !currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // 验证角色
    if (![ROLES.ADMIN, ROLES.MODERATOR].includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid role',
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

    if (!hasPermission(userRole, PERMISSIONS.MANAGE_MODERATORS, customPermissions)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: No permission to add moderators',
        },
        { status: 403 }
      );
    }

    // 检查用户是否已经是版主
    const existingModerator = await sql`
      SELECT id FROM moderators WHERE user_id = ${userId} AND removed_at IS NULL
    `;

    if (existingModerator.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'User is already a moderator',
        },
        { status: 400 }
      );
    }

    // 添加版主
    await sql`
      INSERT INTO moderators (
        user_id, role, category_id, permissions, appointed_by
      )
      VALUES (
        ${userId},
        ${role},
        ${categoryId || null},
        ${permissions ? JSON.stringify(permissions) : null},
        ${currentUserId}
      )
    `;

    // 记录版主操作
    await sql`
      INSERT INTO mod_actions (
        moderator_id, action_type, target_type, target_id, details
      )
      VALUES (
        ${currentUserId},
        'add_moderator',
        'user',
        ${userId},
        ${JSON.stringify({ role, categoryId, permissions })}
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
          '您已成为版主',
          ${`恭喜！您已被任命为${role === ROLES.ADMIN ? '管理员' : '版主'}。`},
          '/community/mod',
          NOW()
        )
      `;
    } catch (notifError) {
      console.error('Failed to create moderator notification:', notifError);
    }

    return NextResponse.json({
      success: true,
      message: 'Moderator added successfully',
      data: {
        userId,
        role,
        categoryId,
      },
    });
  } catch (error: any) {
    console.error('Add moderator error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to add moderator',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// 移除版主
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

    // 不能移除自己
    if (userId === currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cannot remove yourself',
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

    if (!hasPermission(userRole, PERMISSIONS.MANAGE_MODERATORS, customPermissions)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: No permission to remove moderators',
        },
        { status: 403 }
      );
    }

    // 移除版主
    await sql`
      UPDATE moderators 
      SET removed_at = NOW()
      WHERE user_id = ${userId}
    `;

    // 记录版主操作
    await sql`
      INSERT INTO mod_actions (
        moderator_id, action_type, target_type, target_id, reason
      )
      VALUES (
        ${currentUserId},
        'remove_moderator',
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
          '版主权限已移除',
          ${reason ? `您的版主权限已被移除。原因：${reason}` : '您的版主权限已被移除。'},
          '/community',
          NOW()
        )
      `;
    } catch (notifError) {
      console.error('Failed to create removal notification:', notifError);
    }

    return NextResponse.json({
      success: true,
      message: 'Moderator removed successfully',
    });
  } catch (error: any) {
    console.error('Remove moderator error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to remove moderator',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// 更新版主权限
export async function PUT(request: NextRequest) {
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
    const { userId, permissions, currentUserId } = body;

    if (!userId || !permissions || !currentUserId) {
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

    if (!hasPermission(userRole, PERMISSIONS.MANAGE_MODERATORS, customPermissions)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized: No permission to update moderator permissions',
        },
        { status: 403 }
      );
    }

    // 更新权限
    await sql`
      UPDATE moderators 
      SET permissions = ${JSON.stringify(permissions)}
      WHERE user_id = ${userId}
    `;

    // 记录版主操作
    await sql`
      INSERT INTO mod_actions (
        moderator_id, action_type, target_type, target_id, details
      )
      VALUES (
        ${currentUserId},
        'update_moderator_permissions',
        'user',
        ${userId},
        ${JSON.stringify({ permissions })}
      )
    `;

    return NextResponse.json({
      success: true,
      message: 'Moderator permissions updated successfully',
    });
  } catch (error: any) {
    console.error('Update moderator permissions error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update moderator permissions',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
