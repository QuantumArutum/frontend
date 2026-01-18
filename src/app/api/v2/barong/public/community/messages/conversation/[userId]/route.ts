import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/v2/barong/public/community/messages/conversation/[userId] - 获取会话消息
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId: otherUserId } = await params;
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('currentUserId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const beforeId = searchParams.get('before');

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: '请先登录',
        },
        { status: 401 }
      );
    }

    // 使用数据库函数获取消息
    const messages = await sql`
      SELECT * FROM get_conversation_messages(
        ${currentUserId},
        ${otherUserId},
        ${limit},
        ${beforeId ? parseInt(beforeId) : null}
      )
    `;

    // 反转消息顺序（从旧到新）
    const sortedMessages = messages.reverse().map((msg: any) => ({
      id: msg.id,
      senderId: msg.sender_id,
      receiverId: msg.receiver_id,
      content: msg.content,
      messageType: msg.message_type,
      isRead: msg.is_read,
      readAt: msg.read_at,
      isEdited: msg.is_edited,
      createdAt: msg.created_at,
      isSender: msg.sender_id === currentUserId,
    }));

    const hasMore = messages.length === limit;

    return NextResponse.json({
      success: true,
      data: {
        messages: sortedMessages,
        hasMore,
      },
    });
  } catch (error: any) {
    console.error('Error fetching conversation messages:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取消息失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
