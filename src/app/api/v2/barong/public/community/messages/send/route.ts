import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// POST /api/v2/barong/public/community/messages/send - 发送私信
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentUserId, receiverId, content, messageType = 'text' } = body;

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: '请先登录',
        },
        { status: 401 }
      );
    }

    if (!receiverId) {
      return NextResponse.json(
        {
          success: false,
          message: '接收者ID不能为空',
        },
        { status: 400 }
      );
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: '消息内容不能为空',
        },
        { status: 400 }
      );
    }

    if (currentUserId === receiverId) {
      return NextResponse.json(
        {
          success: false,
          message: '不能给自己发送消息',
        },
        { status: 400 }
      );
    }

    // 检查是否被拉黑
    const blockedResult = await sql`
      SELECT is_user_blocked(${currentUserId}, ${receiverId}) as is_blocked
    `;

    if (blockedResult[0]?.is_blocked) {
      return NextResponse.json(
        {
          success: false,
          message: '无法发送消息，您已被对方拉黑',
        },
        { status: 403 }
      );
    }

    // 创建消息
    const messageResult = await sql`
      INSERT INTO direct_messages (sender_id, receiver_id, content, message_type)
      VALUES (${currentUserId}, ${receiverId}, ${content}, ${messageType})
      RETURNING *
    `;

    const message = messageResult[0];

    // 获取会话信息
    const user1Id = currentUserId < receiverId ? currentUserId : receiverId;
    const user2Id = currentUserId < receiverId ? receiverId : currentUserId;

    const conversationResult = await sql`
      SELECT * FROM conversations
      WHERE user1_id = ${user1Id} AND user2_id = ${user2Id}
    `;

    const conversation = conversationResult[0];

    // 创建通知
    await sql`
      INSERT INTO message_notifications (user_id, message_id, sender_id)
      VALUES (${receiverId}, ${message.id}, ${currentUserId})
    `;

    return NextResponse.json({
      success: true,
      data: {
        message: {
          id: message.id,
          senderId: message.sender_id,
          receiverId: message.receiver_id,
          content: message.content,
          messageType: message.message_type,
          isRead: message.is_read,
          createdAt: message.created_at,
        },
        conversation: conversation
          ? {
              id: conversation.id,
              otherUserId: receiverId,
              lastMessageAt: conversation.last_message_at,
              unreadCount:
                currentUserId === user1Id
                  ? conversation.user1_unread_count
                  : conversation.user2_unread_count,
            }
          : null,
      },
      message: '消息发送成功',
    });
  } catch (error: any) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      {
        success: false,
        message: '发送消息失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
