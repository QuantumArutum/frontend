import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// POST /api/v2/barong/public/community/messages/block - 拉黑用户
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentUserId, blockedUserId, reason } = body;

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: '请先登录',
        },
        { status: 401 }
      );
    }

    if (!blockedUserId) {
      return NextResponse.json(
        {
          success: false,
          message: '被拉黑用户ID不能为空',
        },
        { status: 400 }
      );
    }

    if (currentUserId === blockedUserId) {
      return NextResponse.json(
        {
          success: false,
          message: '不能拉黑自己',
        },
        { status: 400 }
      );
    }

    // 检查是否已经拉黑
    const existing = await sql`
      SELECT id FROM message_blacklist
      WHERE user_id = ${currentUserId} AND blocked_user_id = ${blockedUserId}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: '已经拉黑过该用户',
        },
        { status: 400 }
      );
    }

    // 添加到黑名单
    await sql`
      INSERT INTO message_blacklist (user_id, blocked_user_id, reason)
      VALUES (${currentUserId}, ${blockedUserId}, ${reason || null})
    `;

    return NextResponse.json({
      success: true,
      message: '拉黑成功',
    });
  } catch (error: any) {
    console.error('Error blocking user:', error);
    return NextResponse.json(
      {
        success: false,
        message: '拉黑失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET /api/v2/barong/public/community/messages/block - 获取黑名单列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('currentUserId');

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: '请先登录',
        },
        { status: 401 }
      );
    }

    const blacklist = await sql`
      SELECT 
        id,
        blocked_user_id,
        reason,
        created_at
      FROM message_blacklist
      WHERE user_id = ${currentUserId}
      ORDER BY created_at DESC
    `;

    return NextResponse.json({
      success: true,
      data: {
        blacklist: blacklist.map((item: any) => ({
          id: item.id,
          blockedUserId: item.blocked_user_id,
          reason: item.reason,
          createdAt: item.created_at,
        })),
      },
    });
  } catch (error: any) {
    console.error('Error fetching blacklist:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取黑名单失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
