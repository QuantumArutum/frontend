/**
 * Notifications API
 * Get user notifications
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const unreadOnly = searchParams.get('unreadOnly') === 'true';
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    if (!sql) {
      return NextResponse.json(
        {
          success: false,
          message: 'Database not configured',
        },
        { status: 500 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'User ID is required',
        },
        { status: 400 }
      );
    }

    // 确保通知表存在
    if (sql) {
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            type VARCHAR(50) NOT NULL,
            title TEXT NOT NULL,
            content TEXT,
            link TEXT,
            actor_id VARCHAR(255),
            actor_name VARCHAR(255),
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;

        // 创建索引（如果不存在）
        await sql`CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read)`;
        await sql`CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at)`;
      } catch (e) {
        console.error('Error creating notifications table:', e);
      }
    }

    // 获取通知列表
    const notifications = await sql`
      SELECT 
        n.id,
        n.user_id,
        n.type,
        n.title,
        n.content,
        n.link,
        n.actor_id,
        n.actor_name,
        n.is_read,
        n.created_at
      FROM notifications n
      WHERE 
        n.user_id = ${userId}
        ${unreadOnly ? sql`AND n.is_read = FALSE` : sql``}
      ORDER BY n.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    // 获取未读数量
    const unreadCountResult = await sql`
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = ${userId} AND is_read = FALSE
    `;
    const unreadCount = parseInt(unreadCountResult[0]?.count || '0');

    // 获取总数
    const totalResult = await sql`
      SELECT COUNT(*) as count
      FROM notifications
      WHERE user_id = ${userId}
    `;
    const total = parseInt(totalResult[0]?.count || '0');

    return NextResponse.json({
      success: true,
      data: {
        notifications: notifications.map((n: any) => ({
          id: n.id,
          userId: n.user_id,
          type: n.type,
          title: n.title,
          content: n.content,
          link: n.link,
          actorId: n.actor_id,
          actorName: n.actor_name,
          isRead: n.is_read,
          createdAt: n.created_at,
        })),
        unreadCount,
        total,
        hasMore: offset + notifications.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// 标记通知为已读
export async function PUT(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json(
        {
          success: false,
          message: 'Database not configured',
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { notificationId, userId, markAllAsRead } = body;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'User ID is required',
        },
        { status: 400 }
      );
    }

    if (markAllAsRead) {
      // 标记所有通知为已读
      await sql`
        UPDATE notifications
        SET is_read = TRUE
        WHERE user_id = ${userId} AND is_read = FALSE
      `;

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read',
      });
    } else if (notificationId) {
      // 标记单个通知为已读
      await sql`
        UPDATE notifications
        SET is_read = TRUE
        WHERE id = ${notificationId} AND user_id = ${userId}
      `;

      return NextResponse.json({
        success: true,
        message: 'Notification marked as read',
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Notification ID or markAllAsRead flag is required',
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// 删除通知
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const notificationId = searchParams.get('notificationId');
  const userId = searchParams.get('userId');

  try {
    if (!sql) {
      return NextResponse.json(
        {
          success: false,
          message: 'Database not configured',
        },
        { status: 500 }
      );
    }

    if (!notificationId || !userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Notification ID and User ID are required',
        },
        { status: 400 }
      );
    }

    await sql`
      DELETE FROM notifications
      WHERE id = ${notificationId} AND user_id = ${userId}
    `;

    return NextResponse.json({
      success: true,
      message: 'Notification deleted',
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
