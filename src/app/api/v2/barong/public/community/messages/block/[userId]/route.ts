import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// DELETE /api/v2/barong/public/community/messages/block/[userId] - 取消拉黑
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: blockedUserId } = await params;
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

    const result = await sql`
      DELETE FROM message_blacklist
      WHERE user_id = ${currentUserId} AND blocked_user_id = ${blockedUserId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: '该用户不在黑名单中',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '取消拉黑成功',
    });
  } catch (error: any) {
    console.error('Error unblocking user:', error);
    return NextResponse.json(
      {
        success: false,
        message: '取消拉黑失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
