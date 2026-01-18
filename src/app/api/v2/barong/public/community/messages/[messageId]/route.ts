import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// DELETE /api/v2/barong/public/community/messages/[messageId] - 删除消息
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ messageId: string }> }
) {
  try {
    const { messageId } = await params;
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

    // 获取消息信息
    const messageResult = await sql`
      SELECT * FROM direct_messages WHERE id = ${parseInt(messageId)}
    `;

    if (messageResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: '消息不存在',
        },
        { status: 404 }
      );
    }

    const message = messageResult[0];

    // 标记消息为已删除（软删除）
    if (message.sender_id === currentUserId) {
      await sql`
        UPDATE direct_messages
        SET is_deleted_by_sender = TRUE
        WHERE id = ${parseInt(messageId)}
      `;
    } else if (message.receiver_id === currentUserId) {
      await sql`
        UPDATE direct_messages
        SET is_deleted_by_receiver = TRUE
        WHERE id = ${parseInt(messageId)}
      `;
    } else {
      return NextResponse.json(
        {
          success: false,
          message: '无权删除此消息',
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '消息删除成功',
    });
  } catch (error: any) {
    console.error('Error deleting message:', error);
    return NextResponse.json(
      {
        success: false,
        message: '删除消息失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
