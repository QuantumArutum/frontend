import { NextResponse } from 'next/server';

// 获取单个帖子
export async function GET(
    request: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    const { postId } = await params;

    // 这里应该从数据库查询
    // 暂时返回模拟数据
    const mockPost = {
        id: postId,
        title: "Quantaureum 主网即将上线",
        content: "经过团队的不懈努力，Quantaureum 主网预计将在下月正式上线。\n\n主要特性包括：\n- 后量子密码学安全\n- 高性能 PoS 共识\n- EVM 兼容性\n- 跨链桥接\n\n期待社区的支持！",
        category: "general",
        userId: "user_1",
        userName: "QuantumDev",
        userAvatar: null,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        updatedAt: new Date(Date.now() - 3600000).toISOString(),
        isPinned: true,
        isLocked: false
    };

    return NextResponse.json({
        success: true,
        data: mockPost
    });
}
