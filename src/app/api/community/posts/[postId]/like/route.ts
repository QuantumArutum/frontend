import { NextResponse } from 'next/server';

// 类型定义
interface Like {
    id: string;
    postId: string;
    userId: string;
    type: 'like' | 'dislike';
    createdAt: string;
    updatedAt: string;
}

// 模拟点赞数据库
const likes: Like[] = [];

// POST - 点赞/取消点赞
export async function POST(
    request: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    try {
        const { postId } = await params;
        const body = await request.json();
        const { userId, type } = body; // type: 'like' | 'dislike'

        if (!userId) {
            return NextResponse.json({
                success: false,
                message: '用户ID不能为空'
            }, { status: 400 });
        }

        // 查找现有点赞
        const existingIndex = likes.findIndex(
            l => l.postId === postId && l.userId === userId
        );

        if (existingIndex >= 0) {
            // 如果点击相同类型，取消点赞
            if (likes[existingIndex].type === type) {
                likes.splice(existingIndex, 1);
                return NextResponse.json({
                    success: true,
                    data: { action: 'removed', type },
                    message: '已取消'
                });
            } else {
                // 切换点赞类型
                likes[existingIndex].type = type;
                likes[existingIndex].updatedAt = new Date().toISOString();
                return NextResponse.json({
                    success: true,
                    data: { action: 'updated', type },
                    message: '已更新'
                });
            }
        } else {
            // 新增点赞
            const newLike = {
                id: `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                postId,
                userId,
                type,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            likes.push(newLike);

            return NextResponse.json({
                success: true,
                data: { action: 'added', type },
                message: '操作成功'
            });
        }
    } catch {
        return NextResponse.json({
            success: false,
            message: '操作失败'
        }, { status: 500 });
    }
}

// GET - 获取点赞统计
export async function GET(
    request: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    const { postId } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    try {
        const likeCount = likes.filter(l => l.postId === postId && l.type === 'like').length;
        const dislikeCount = likes.filter(l => l.postId === postId && l.type === 'dislike').length;

        let userLike = null;
        if (userId) {
            const found = likes.find(l => l.postId === postId && l.userId === userId);
            userLike = found ? found.type : null;
        }

        return NextResponse.json({
            success: true,
            data: {
                likeCount,
                dislikeCount,
                userLike
            }
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: '获取统计失败'
        }, { status: 500 });
    }
}
