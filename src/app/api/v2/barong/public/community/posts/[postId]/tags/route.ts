import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// POST /api/v2/barong/public/community/posts/[postId]/tags - 为帖子添加标签
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId: postIdStr } = await params;
    const postId = parseInt(postIdStr);
    const body = await request.json();
    const { tags, currentUserId } = body;

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: '请先登录',
        },
        { status: 401 }
      );
    }

    if (!tags || !Array.isArray(tags) || tags.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: '标签不能为空',
        },
        { status: 400 }
      );
    }

    // 限制标签数量
    if (tags.length > 5) {
      return NextResponse.json(
        {
          success: false,
          message: '最多只能添加5个标签',
        },
        { status: 400 }
      );
    }

    // 验证帖子存在且用户是作者
    const postResult = await sql`
      SELECT author_id FROM posts WHERE id = ${postId}
    `;

    if (postResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: '帖子不存在',
        },
        { status: 404 }
      );
    }

    if (postResult[0].author_id !== currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: '只能为自己的帖子添加标签',
        },
        { status: 403 }
      );
    }

    // 使用数据库函数添加标签
    const result = await sql`
      SELECT add_tags_to_post(${postId}, ${tags})
    `;

    // 获取帖子的所有标签
    const postTags = await sql`
      SELECT t.id, t.name, t.slug, t.color, t.icon
      FROM tags t
      JOIN post_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = ${postId}
      ORDER BY t.usage_count DESC
    `;

    return NextResponse.json({
      success: true,
      data: { tags: postTags },
      message: '标签添加成功',
    });
  } catch (error: any) {
    console.error('Error adding tags to post:', error);
    return NextResponse.json(
      {
        success: false,
        message: '添加标签失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/v2/barong/public/community/posts/[postId]/tags/[tagId] - 移除帖子标签
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId: postIdStr } = await params;
    const postId = parseInt(postIdStr);
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('tagId');
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

    if (!tagId) {
      return NextResponse.json(
        {
          success: false,
          message: '标签ID不能为空',
        },
        { status: 400 }
      );
    }

    // 验证帖子存在且用户是作者
    const postResult = await sql`
      SELECT author_id FROM posts WHERE id = ${postId}
    `;

    if (postResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: '帖子不存在',
        },
        { status: 404 }
      );
    }

    if (postResult[0].author_id !== currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: '只能移除自己帖子的标签',
        },
        { status: 403 }
      );
    }

    // 删除标签关联
    await sql`
      DELETE FROM post_tags
      WHERE post_id = ${postId} AND tag_id = ${tagId}
    `;

    return NextResponse.json({
      success: true,
      message: '标签移除成功',
    });
  } catch (error: any) {
    console.error('Error removing tag from post:', error);
    return NextResponse.json(
      {
        success: false,
        message: '移除标签失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
