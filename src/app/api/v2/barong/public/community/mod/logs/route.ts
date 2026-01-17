import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { PERMISSIONS, hasPermission } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return NextResponse.json({
        success: false,
        message: 'Database not configured'
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('currentUserId');
    const moderatorId = searchParams.get('moderatorId');
    const actionType = searchParams.get('actionType');
    const targetType = searchParams.get('targetType');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!currentUserId) {
      return NextResponse.json({
        success: false,
        message: 'Missing currentUserId'
      }, { status: 400 });
    }

    const sql = neon(databaseUrl);

    // 检查用户权限
    const moderator = await sql`
      SELECT role, permissions FROM moderators WHERE user_id = ${currentUserId}
    `;

    if (moderator.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized: Not a moderator'
      }, { status: 403 });
    }

    const userRole = moderator[0].role;
    const customPermissions = moderator[0].permissions;

    if (!hasPermission(userRole, PERMISSIONS.VIEW_LOGS, customPermissions)) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized: No permission to view logs'
      }, { status: 403 });
    }

    // 构建查询条件
    const offset = (page - 1) * limit;
    let whereConditions = [];
    let params: any[] = [];

    if (moderatorId) {
      whereConditions.push(`moderator_id = $${params.length + 1}`);
      params.push(moderatorId);
    }

    if (actionType) {
      whereConditions.push(`action_type = $${params.length + 1}`);
      params.push(actionType);
    }

    if (targetType) {
      whereConditions.push(`target_type = $${params.length + 1}`);
      params.push(targetType);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // 获取日志列表
    const logs = await sql`
      SELECT 
        ma.*,
        m.role as moderator_role
      FROM mod_actions ma
      LEFT JOIN moderators m ON ma.moderator_id = m.user_id
      ${whereClause ? sql.unsafe(whereClause) : sql``}
      ORDER BY ma.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // 获取总数
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM mod_actions
      ${whereClause ? sql.unsafe(whereClause) : sql``}
    `;

    const total = parseInt(countResult[0].total);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasMore: page < totalPages
        }
      }
    });

  } catch (error: any) {
    console.error('Get logs error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to get logs',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
