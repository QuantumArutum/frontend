import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// POST /api/v2/barong/public/community/messages/mark-read - 标记消息已读
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentUserId, conversationUserId, messageIds } = body;

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: '请先登录',
        },
        { status: 401 }
      );
    }

    if (!conversationUserId) {
      return NextResponse.json(
        {
          success: false,
          message: '会话用户ID不能为空',
        },
        { status: 400 }
      );
    }

    let markedCount = 0;

    if (messageIds && messageIds.length > 0) {
      // 标记指定消息为已读
      const result = await sql`
        UPDATE direct_messages
        SET is_read = TRUE, read_at = CURRENT_TIMESTAMP
        WHERE id = ANY(${messageIds})
          AND receiver_id = ${currentUserId}
          AND sender_id = ${conversationUserId}
          AND is_read = FALSE
        RETURNING id
      `;
      markedCount = result.length;
    } else {
      // 标记整个会话为已读
      const result = await sql`
        SELECT mark_conversation_as_read(${currentUserId}, ${conversationUserId}) as count
      `;
      markedCount = parseInt(result[0]?.count || '0');
    }

    return NextResponse.json({
      success: true,
      data: {
        markedCount,
      },
      message: `已标记 ${markedCount} 条消息为已读`,
    });
  } catch (error: any) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json(
      {
        success: false,
        message: '标记已读失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
