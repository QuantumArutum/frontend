import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/v2/barong/public/community/messages/conversations - 获取会话列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('currentUserId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const archived = searchParams.get('archived') === 'true';

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: '请先登录',
        },
        { status: 401 }
      );
    }

    const offset = (page - 1) * limit;

    // 使用数据库函数获取会话列表
    const conversations = await sql`
      SELECT * FROM get_user_conversations(
        ${currentUserId},
        ${limit},
        ${offset},
        ${archived}
      )
    `;

    // 获取每个会话的对方用户信息
    const conversationsWithUsers = await Promise.all(
      conversations.map(async (conv: any) => {
        // 这里简化处理，实际应该从 users 表获取用户信息
        return {
          id: conv.conversation_id,
          otherUserId: conv.other_user_id,
          otherUserName: conv.other_user_id, // 简化处理
          lastMessageContent: conv.last_message_content,
          lastMessageAt: conv.last_message_at,
          unreadCount: parseInt(conv.unread_count || '0'),
          isPinned: conv.is_pinned,
          isArchived: conv.is_archived,
        };
      })
    );

    // 获取总未读数
    const unreadResult = await sql`
      SELECT get_user_unread_count(${currentUserId}) as total_unread
    `;

    const totalUnread = parseInt(unreadResult[0]?.total_unread || '0');

    // 获取总会话数
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM conversations c
      WHERE (c.user1_id = ${currentUserId} OR c.user2_id = ${currentUserId})
        AND CASE 
          WHEN c.user1_id = ${currentUserId} THEN c.user1_archived = ${archived} AND c.user1_deleted = FALSE
          ELSE c.user2_archived = ${archived} AND c.user2_deleted = FALSE
        END
    `;

    const total = parseInt(countResult[0]?.total || '0');
    const hasMore = offset + conversations.length < total;

    return NextResponse.json({
      success: true,
      data: {
        conversations: conversationsWithUsers,
        total,
        totalUnread,
        page,
        limit,
        hasMore,
      },
    });
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取会话列表失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
