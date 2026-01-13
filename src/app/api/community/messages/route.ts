import { NextResponse } from 'next/server';

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

// 模拟私信数据库
const messages: Message[] = [];
const conversations: Conversation[] = [];

// GET - 获取用户的会话列表或特定会话的消息
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const conversationId = searchParams.get('conversationId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
        return NextResponse.json({
            success: false,
            message: '用户ID不能为空'
        }, { status: 400 });
    }

    try {
        if (conversationId) {
            // 获取特定会话的消息
            const conversationMessages = messages
                .filter(m => m.conversationId === conversationId)
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .slice(offset, offset + limit);

            return NextResponse.json({
                success: true,
                data: {
                    messages: conversationMessages,
                    total: messages.filter(m => m.conversationId === conversationId).length,
                    hasMore: offset + limit < messages.filter(m => m.conversationId === conversationId).length
                }
            });
        } else {
            // 获取用户的会话列表
            const userConversations = conversations
                .filter(c => c.participants.includes(userId))
                .map(c => {
                    const lastMessage = messages
                        .filter(m => m.conversationId === c.id)
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

                    const unreadCount = messages.filter(
                        m => m.conversationId === c.id && m.receiverId === userId && !m.isRead
                    ).length;

                    return {
                        ...c,
                        lastMessage,
                        unreadCount
                    };
                })
                .sort((a, b) => {
                    const aTime = a.lastMessage?.createdAt || a.createdAt;
                    const bTime = b.lastMessage?.createdAt || b.createdAt;
                    return new Date(bTime).getTime() - new Date(aTime).getTime();
                });

            const totalUnread = messages.filter(
                m => m.receiverId === userId && !m.isRead
            ).length;

            return NextResponse.json({
                success: true,
                data: {
                    conversations: userConversations,
                    totalUnread
                }
            });
        }
    } catch {
        return NextResponse.json({
            success: false,
            message: '获取消息失败'
        }, { status: 500 });
    }
}

// POST - 发送私信
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { senderId, senderName, senderAvatar, receiverId, receiverName, receiverAvatar, content } = body;

        if (!senderId || !receiverId || !content) {
            return NextResponse.json({
                success: false,
                message: '缺少必要参数'
            }, { status: 400 });
        }

        // 查找或创建会话
        let conversation = conversations.find(c =>
            c.participants.includes(senderId) && c.participants.includes(receiverId)
        );

        if (!conversation) {
            const now = new Date().toISOString();
            conversation = {
                id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                participants: [senderId, receiverId],
                participantInfo: {
                    [senderId]: { name: senderName, avatar: senderAvatar },
                    [receiverId]: { name: receiverName, avatar: receiverAvatar }
                },
                unreadCount: 0,
                createdAt: now,
                updatedAt: now
            };
            conversations.push(conversation);
        }

        // 创建消息
        const newMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            conversationId: conversation.id,
            senderId,
            senderName,
            senderAvatar,
            receiverId,
            content,
            isRead: false,
            createdAt: new Date().toISOString()
        };

        messages.push(newMessage);

        return NextResponse.json({
            success: true,
            data: {
                message: newMessage,
                conversation
            },
            message: '消息发送成功'
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: '发送消息失败'
        }, { status: 500 });
    }
}

// PUT - 标记消息为已读
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { userId, conversationId, messageIds } = body;

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: '用户ID不能为空'
            }, { status: 400 });
        }

        let updatedCount = 0;

        if (conversationId) {
            // 标记会话中所有消息为已读
            messages.forEach(m => {
                if (m.conversationId === conversationId && m.receiverId === userId && !m.isRead) {
                    m.isRead = true;
                    updatedCount++;
                }
            });
        } else if (messageIds && Array.isArray(messageIds)) {
            // 标记指定消息为已读
            messageIds.forEach(id => {
                const message = messages.find(m => m.id === id && m.receiverId === userId);
                if (message && !message.isRead) {
                    message.isRead = true;
                    updatedCount++;
                }
            });
        }

        return NextResponse.json({
            success: true,
            data: { updatedCount },
            message: `已标记 ${updatedCount} 条消息为已读`
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: '更新消息失败'
        }, { status: 500 });
    }
}

// DELETE - 删除会话
export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    const userId = searchParams.get('userId');

    if (!conversationId || !userId) {
        return NextResponse.json({
            success: false,
            message: '缺少必要参数'
        }, { status: 400 });
    }

    try {
        const conversationIndex = conversations.findIndex(
            c => c.id === conversationId && c.participants.includes(userId)
        );

        if (conversationIndex === -1) {
            return NextResponse.json({
                success: false,
                message: '会话不存在'
            }, { status: 404 });
        }

        // 删除会话中的所有消息
        const messagesToDelete = messages.filter(m => m.conversationId === conversationId);
        messagesToDelete.forEach(m => {
            const index = messages.indexOf(m);
            if (index > -1) messages.splice(index, 1);
        });

        // 删除会话
        conversations.splice(conversationIndex, 1);

        return NextResponse.json({
            success: true,
            message: '会话已删除'
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: '删除会话失败'
        }, { status: 500 });
    }
}
