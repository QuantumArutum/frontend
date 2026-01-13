import { NextResponse } from 'next/server';

// 类型定义
interface Follow {
    id: string;
    followerId: string;
    followerName: string;
    followerAvatar: string | null;
    followingId: string;
    followingName: string;
    followingAvatar: string | null;
    createdAt: string;
}

interface FollowUser {
    id: string;
    name: string;
    avatar: string | null;
    followedAt: string;
}

// 模拟关注关系数据库
const follows: Follow[] = [];

// GET - 获取用户的关注/粉丝列表
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type'); // 'followers' | 'following'
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
        return NextResponse.json({
            success: false,
            message: '用户ID不能为空'
        }, { status: 400 });
    }

    try {
        let result: FollowUser[] = [];

        if (type === 'followers') {
            // 获取粉丝列表
            result = follows
                .filter(f => f.followingId === userId)
                .map(f => ({
                    id: f.followerId,
                    name: f.followerName,
                    avatar: f.followerAvatar,
                    followedAt: f.createdAt
                }));
        } else if (type === 'following') {
            // 获取关注列表
            result = follows
                .filter(f => f.followerId === userId)
                .map(f => ({
                    id: f.followingId,
                    name: f.followingName,
                    avatar: f.followingAvatar,
                    followedAt: f.createdAt
                }));
        }

        const paginatedResult = result.slice(offset, offset + limit);

        return NextResponse.json({
            success: true,
            data: {
                users: paginatedResult,
                total: result.length,
                hasMore: offset + limit < result.length
            }
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: '获取数据失败'
        }, { status: 500 });
    }
}

// POST - 关注/取消关注用户
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { followerId, followerName, followerAvatar, followingId, followingName, followingAvatar } = body;

        if (!followerId || !followingId) {
            return NextResponse.json({
                success: false,
                message: '缺少必要参数'
            }, { status: 400 });
        }

        if (followerId === followingId) {
            return NextResponse.json({
                success: false,
                message: '不能关注自己'
            }, { status: 400 });
        }

        // 检查是否已关注
        const existingIndex = follows.findIndex(
            f => f.followerId === followerId && f.followingId === followingId
        );

        if (existingIndex >= 0) {
            // 取消关注
            follows.splice(existingIndex, 1);
            return NextResponse.json({
                success: true,
                data: { action: 'unfollowed' },
                message: '已取消关注'
            });
        } else {
            // 添加关注
            const newFollow = {
                id: `follow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                followerId,
                followerName: followerName || 'Anonymous',
                followerAvatar: followerAvatar || null,
                followingId,
                followingName: followingName || 'Anonymous',
                followingAvatar: followingAvatar || null,
                createdAt: new Date().toISOString()
            };

            follows.push(newFollow);

            return NextResponse.json({
                success: true,
                data: { action: 'followed' },
                message: '关注成功'
            });
        }
    } catch {
        return NextResponse.json({
            success: false,
            message: '操作失败'
        }, { status: 500 });
    }
}

// 检查是否已关注
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { followerId, followingId } = body;

        if (!followerId || !followingId) {
            return NextResponse.json({
                success: false,
                message: '缺少必要参数'
            }, { status: 400 });
        }

        const isFollowing = follows.some(
            f => f.followerId === followerId && f.followingId === followingId
        );

        // 获取关注/粉丝数量
        const followersCount = follows.filter(f => f.followingId === followingId).length;
        const followingCount = follows.filter(f => f.followerId === followingId).length;

        return NextResponse.json({
            success: true,
            data: {
                isFollowing,
                followersCount,
                followingCount
            }
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: '查询失败'
        }, { status: 500 });
    }
}
