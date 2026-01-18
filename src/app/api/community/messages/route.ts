/**
 * Private Messages API - Production PostgreSQL Implementation
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/database';

// 消息类型定义
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  attachments?: string[];
}

interface Conversation {
  id: string;
  participants: string[];
  participantInfo: Record<string, { name: string; avatar?: string }>;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

// GET - 获取用户的会话列表或特定会话的消息
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const conversationId = searchParams.get('conversationId');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  if (!userId) {
    return NextResponse.json({ success: false, message: '用户ID不能为空' }, { status: 400 });
  }

  try {
    if (!sql) {
      // 返回空数据，数据库未连接
      return NextResponse.json({
        success: true,
        data: conversationId
          ? { messages: [], total: 0, hasMore: false }
          : { conversations: [], totalUnread: 0 },
      });
    }

    if (conversationId) {
      // 获取特定会话的消息
      const messages = await sql`
        SELECT pm.id, pm.conversation_id as "conversationId", pm.sender_id as "senderId", 
               COALESCE(u.email, pm.sender_id) as "senderName", pm.receiver_id as "receiverId",
               pm.content, pm.is_read as "isRead", pm.created_at as "createdAt"
        FROM private_messages pm
        LEFT JOIN users u ON pm.sender_id = u.uid
        WHERE pm.conversation_id = ${conversationId}
        ORDER BY pm.created_at ASC
        LIMIT ${limit} OFFSET ${offset}
      `;

      const [countResult] = await sql`
        SELECT COUNT(*) as total FROM private_messages WHERE conversation_id = ${conversationId}
      `;

      return NextResponse.json({
        success: true,
        data: {
          messages,
          total: Number(countResult?.total || 0),
          hasMore: offset + limit < Number(countResult?.total || 0),
        },
      });
    } else {
      // 获取用户的会话列表
      const conversationsData = await sql`
        SELECT DISTINCT c.id, c.participant1_id, c.participant2_id, c.created_at, c.updated_at,
               u1.email as participant1_email, u2.email as participant2_email
        FROM conversations c
        LEFT JOIN users u1 ON c.participant1_id = u1.uid
        LEFT JOIN users u2 ON c.participant2_id = u2.uid
        WHERE c.participant1_id = ${userId} OR c.participant2_id = ${userId}
        ORDER BY c.updated_at DESC
      `;

      const sqlQuery = sql!; // TypeScript non-null assertion since we checked above
      const conversations = await Promise.all(
        conversationsData.map(async (c: any) => {
          const otherUserId = c.participant1_id === userId ? c.participant2_id : c.participant1_id;
          const otherUserEmail =
            c.participant1_id === userId ? c.participant2_email : c.participant1_email;

          // 获取最后一条消息
          const [lastMsg] = await sqlQuery`
            SELECT pm.id, pm.conversation_id as "conversationId", pm.sender_id as "senderId",
                   COALESCE(u.email, pm.sender_id) as "senderName", pm.receiver_id as "receiverId",
                   pm.content, pm.is_read as "isRead", pm.created_at as "createdAt"
            FROM private_messages pm
            LEFT JOIN users u ON pm.sender_id = u.uid
            WHERE pm.conversation_id = ${c.id}
            ORDER BY pm.created_at DESC LIMIT 1
          `;

          // 获取未读消息数
          const [unreadResult] = await sqlQuery`
            SELECT COUNT(*) as count FROM private_messages 
            WHERE conversation_id = ${c.id} AND receiver_id = ${userId} AND is_read = false
          `;

          return {
            id: c.id,
            participants: [c.participant1_id, c.participant2_id],
            participantInfo: {
              [c.participant1_id]: {
                name: c.participant1_email || c.participant1_id,
                avatar: c.participant1_email?.[0]?.toUpperCase(),
              },
              [c.participant2_id]: {
                name: c.participant2_email || c.participant2_id,
                avatar: c.participant2_email?.[0]?.toUpperCase(),
              },
            },
            lastMessage: lastMsg || undefined,
            unreadCount: Number(unreadResult?.count || 0),
            createdAt: c.created_at,
            updatedAt: c.updated_at,
          };
        })
      );

      // 计算总未读数
      const [totalUnreadResult] = await sql`
        SELECT COUNT(*) as total FROM private_messages WHERE receiver_id = ${userId} AND is_read = false
      `;

      return NextResponse.json({
        success: true,
        data: {
          conversations,
          totalUnread: Number(totalUnreadResult?.total || 0),
        },
      });
    }
  } catch (error: any) {
    console.error('Messages GET error:', error);
    return NextResponse.json(
      { success: false, message: '获取消息失败: ' + error.message },
      { status: 500 }
    );
  }
}

// POST - 发送私信
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { senderId, senderName, receiverId, content } = body;

    if (!senderId || !receiverId || !content) {
      return NextResponse.json({ success: false, message: '缺少必要参数' }, { status: 400 });
    }

    if (!sql) {
      return NextResponse.json({ success: false, message: '数据库未连接' }, { status: 500 });
    }

    // 查找或创建会话
    let [conversation] = await sql`
      SELECT * FROM conversations 
      WHERE (participant1_id = ${senderId} AND participant2_id = ${receiverId})
         OR (participant1_id = ${receiverId} AND participant2_id = ${senderId})
      LIMIT 1
    `;

    if (!conversation) {
      [conversation] = await sql`
        INSERT INTO conversations (participant1_id, participant2_id)
        VALUES (${senderId}, ${receiverId})
        RETURNING *
      `;
    }

    // 创建消息
    const [newMessage] = await sql`
      INSERT INTO private_messages (conversation_id, sender_id, receiver_id, content)
      VALUES (${conversation.id}, ${senderId}, ${receiverId}, ${content})
      RETURNING id, conversation_id as "conversationId", sender_id as "senderId", 
                receiver_id as "receiverId", content, is_read as "isRead", created_at as "createdAt"
    `;

    // 更新会话时间
    await sql`UPDATE conversations SET updated_at = NOW() WHERE id = ${conversation.id}`;

    return NextResponse.json({
      success: true,
      data: { message: { ...newMessage, senderName }, conversation },
      message: '消息发送成功',
    });
  } catch (error: any) {
    console.error('Messages POST error:', error);
    return NextResponse.json(
      { success: false, message: '发送消息失败: ' + error.message },
      { status: 500 }
    );
  }
}

// PUT - 标记消息为已读
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, conversationId, messageIds } = body;

    if (!userId) {
      return NextResponse.json({ success: false, message: '用户ID不能为空' }, { status: 400 });
    }

    if (!sql) {
      return NextResponse.json({ success: false, message: '数据库未连接' }, { status: 500 });
    }

    let updatedCount = 0;

    if (conversationId) {
      await sql`
        UPDATE private_messages SET is_read = true 
        WHERE conversation_id = ${conversationId} AND receiver_id = ${userId} AND is_read = false
      `;
      // Neon doesn't return affected row count directly, so we query it
      const [countResult] = await sql`
        SELECT COUNT(*) as count FROM private_messages 
        WHERE conversation_id = ${conversationId} AND receiver_id = ${userId} AND is_read = true
      `;
      updatedCount = Number(countResult?.count || 0);
    } else if (messageIds && Array.isArray(messageIds) && messageIds.length > 0) {
      await sql`
        UPDATE private_messages SET is_read = true 
        WHERE id = ANY(${messageIds}) AND receiver_id = ${userId} AND is_read = false
      `;
      updatedCount = messageIds.length;
    }

    return NextResponse.json({
      success: true,
      data: { updatedCount },
      message: `已标记 ${updatedCount} 条消息为已读`,
    });
  } catch (error: any) {
    console.error('Messages PUT error:', error);
    return NextResponse.json(
      { success: false, message: '更新消息失败: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE - 删除会话
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversationId');
  const userId = searchParams.get('userId');

  if (!conversationId || !userId) {
    return NextResponse.json({ success: false, message: '缺少必要参数' }, { status: 400 });
  }

  try {
    if (!sql) {
      return NextResponse.json({ success: false, message: '数据库未连接' }, { status: 500 });
    }

    // 验证用户是会话参与者
    const [conversation] = await sql`
      SELECT * FROM conversations 
      WHERE id = ${conversationId} AND (participant1_id = ${userId} OR participant2_id = ${userId})
    `;

    if (!conversation) {
      return NextResponse.json({ success: false, message: '会话不存在' }, { status: 404 });
    }

    // 删除会话中的所有消息
    await sql`DELETE FROM private_messages WHERE conversation_id = ${conversationId}`;

    // 删除会话
    await sql`DELETE FROM conversations WHERE id = ${conversationId}`;

    return NextResponse.json({ success: true, message: '会话已删除' });
  } catch (error: any) {
    console.error('Messages DELETE error:', error);
    return NextResponse.json(
      { success: false, message: '删除会话失败: ' + error.message },
      { status: 500 }
    );
  }
}
