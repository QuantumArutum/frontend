import { NextResponse } from 'next/server';

// 通知类型定义
interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'reply' | 'follow' | 'mention' | 'system';
  title: string;
  content: string;
  relatedId?: string;
  relatedType?: string;
  isRead: boolean;
  createdAt: string;
}

// 模拟通知数据库
const notifications: Notification[] = [];

// GET - 获取用户通知
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!userId) {
        return NextResponse.json({
            success: false,
            message: '用户ID不能为空'
        }, { status: 400 });
    }

    try {
        let userNotifications = notifications.filter(n => n.userId === userId);

        if (unreadOnly) {
            userNotifications = userNotifications.filter(n => !n.isRead);
        }

        const sortedNotifications = userNotifications
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(offset, offset + limit);

        const unreadCount = notifications.filter(n => n.userId === userId && !n.isRead).length;

        return NextResponse.json({
            success: true,
            data: {
                notifications: sortedNotifications,
                total: userNotifications.length,
                unreadCount,
                hasMore: offset + limit < userNotifications.length
            }
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: '获取通知失败'
        }, { status: 500 });
    }
}

// POST - 创建通知
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, type, title, content, relatedId, relatedType } = body;

        if (!userId || !type || !title) {
            return NextResponse.json({
                success: false,
                message: '缺少必要参数'
            }, { status: 400 });
        }

        const newNotification = {
            id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userId,
            type, // 'like', 'comment', 'reply', 'follow', 'mention', 'system'
            title,
            content: content || '',
            relatedId: relatedId || null,
            relatedType: relatedType || null, // 'post', 'comment', 'user'
            isRead: false,
            createdAt: new Date().toISOString()
        };

        notifications.unshift(newNotification);

        return NextResponse.json({
            success: true,
            data: newNotification,
            message: '通知创建成功'
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: '创建通知失败'
        }, { status: 500 });
    }
}

// PUT - 标记通知为已读
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { userId, notificationIds, markAll } = body;

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: '用户ID不能为空'
            }, { status: 400 });
        }

        let updatedCount = 0;

        if (markAll) {
            // 标记所有通知为已读
            notifications.forEach(n => {
                if (n.userId === userId && !n.isRead) {
                    n.isRead = true;
                    updatedCount++;
                }
            });
        } else if (notificationIds && Array.isArray(notificationIds)) {
            // 标记指定通知为已读
            notificationIds.forEach(id => {
                const notification = notifications.find(n => n.id === id && n.userId === userId);
                if (notification && !notification.isRead) {
                    notification.isRead = true;
                    updatedCount++;
                }
            });
        }

        return NextResponse.json({
            success: true,
            data: { updatedCount },
            message: `已标记 ${updatedCount} 条通知为已读`
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: '更新通知失败'
        }, { status: 500 });
    }
}

// DELETE - 删除通知
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (!notificationId || !userId) {
        return NextResponse.json({
            success: false,
            message: '缺少必要参数'
        }, { status: 400 });
    }

    try {
        const index = notifications.findIndex(
            n => n.id === notificationId && n.userId === userId
        );

        if (index === -1) {
            return NextResponse.json({
                success: false,
                message: '通知不存在'
            }, { status: 404 });
        }

        notifications.splice(index, 1);

        return NextResponse.json({
            success: true,
            message: '通知已删除'
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: '删除通知失败'
        }, { status: 500 });
    }
}
