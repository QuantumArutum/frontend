import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// POST /api/v2/barong/public/community/tags/[slug]/subscribe - 订阅标签
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { currentUserId, notifyNewPosts = true } = body;

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: '请先登录',
        },
        { status: 401 }
      );
    }

    // 获取标签ID
    const tagResult = await sql`
      SELECT id FROM tags WHERE slug = ${slug} AND is_active = TRUE
    `;

    if (tagResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: '标签不存在',
        },
        { status: 404 }
      );
    }

    const tagId = tagResult[0].id;

    // 检查是否已订阅
    const existing = await sql`
      SELECT id FROM tag_subscriptions
      WHERE tag_id = ${tagId} AND user_id = ${currentUserId}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: '已经订阅过该标签',
        },
        { status: 400 }
      );
    }

    // 创建订阅
    await sql`
      INSERT INTO tag_subscriptions (user_id, tag_id, notify_new_posts)
      VALUES (${currentUserId}, ${tagId}, ${notifyNewPosts})
    `;

    return NextResponse.json({
      success: true,
      message: '订阅成功',
    });
  } catch (error: any) {
    console.error('Error subscribing to tag:', error);
    return NextResponse.json(
      {
        success: false,
        message: '订阅失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/v2/barong/public/community/tags/[slug]/subscribe - 取消订阅
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('currentUserId');

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: '请先登录',
        },
        { status: 401 }
      );
    }

    // 获取标签ID
    const tagResult = await sql`
      SELECT id FROM tags WHERE slug = ${slug} AND is_active = TRUE
    `;

    if (tagResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: '标签不存在',
        },
        { status: 404 }
      );
    }

    const tagId = tagResult[0].id;

    // 删除订阅
    const result = await sql`
      DELETE FROM tag_subscriptions
      WHERE tag_id = ${tagId} AND user_id = ${currentUserId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: '未订阅该标签',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '取消订阅成功',
    });
  } catch (error: any) {
    console.error('Error unsubscribing from tag:', error);
    return NextResponse.json(
      {
        success: false,
        message: '取消订阅失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
