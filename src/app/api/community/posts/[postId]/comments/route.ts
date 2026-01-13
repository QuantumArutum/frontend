import { NextResponse } from 'next/server';

// 类型定义
interface Comment {
    id: string;
    postId: string;
    content: string;
    userId: string;
    userName: string;
    userAvatar: string | null;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
}

// 模拟评论数据库
const comments: Comment[] = [];

// GET - 获取帖子的评论
export async function GET(
    request: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    const { postId } = await params;

    try {
        const postComments = comments
            .filter(c => c.postId === postId)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json({
            success: true,
            data: postComments
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: '获取评论失败'
        }, { status: 500 });
    }
}

// POST - 添加评论
export async function POST(
    request: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    try {
        const { postId } = await params;
        const body = await request.json();
        const { content, userId, userName, userAvatar, parentId } = body;

        if (!content || !userId) {
            return NextResponse.json({
                success: false,
                message: '内容和用户ID不能为空'
            }, { status: 400 });
        }

        const newComment = {
            id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            postId,
            content,
            userId,
            userName: userName || 'Anonymous',
            userAvatar: userAvatar || null,
            parentId: parentId || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        comments.unshift(newComment);

        return NextResponse.json({
            success: true,
            data: newComment,
            message: '评论添加成功'
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: '添加评论失败'
        }, { status: 500 });
    }
}
