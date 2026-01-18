import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/v2/barong/public/community/tags/[slug]/posts - 获取标签下的帖子
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') || 'new'; // hot, new, top
    const timeRange = searchParams.get('timeRange') || 'all'; // 1h, 24h, 7d, 30d, all
    const currentUserId = searchParams.get('currentUserId');

    const offset = (page - 1) * limit;

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

    // 构建时间范围条件
    let timeCondition = '';
    if (timeRange !== 'all') {
      const intervals: Record<string, string> = {
        '1h': '1 hour',
        '24h': '24 hours',
        '7d': '7 days',
        '30d': '30 days',
      };
      const interval = intervals[timeRange];
      if (interval) {
        timeCondition = `AND p.created_at >= NOW() - INTERVAL '${interval}'`;
      }
    }

    // 排序
    let orderBy = 'p.created_at DESC';
    if (sortBy === 'hot') {
      orderBy = 'p.hot_score DESC, p.created_at DESC';
    } else if (sortBy === 'top') {
      orderBy = 'p.vote_score DESC, p.created_at DESC';
    }

    // 获取帖子列表
    const posts = await sql`
      SELECT 
        p.id,
        p.title,
        p.content,
        p.author_id,
        p.author_name,
        p.category,
        p.view_count,
        p.comment_count,
        p.like_count,
        p.upvote_count,
        p.downvote_count,
        p.vote_score,
        p.hot_score,
        p.is_pinned,
        p.is_locked,
        p.is_controversial,
        p.created_at,
        p.updated_at,
        ${currentUserId ? sql`
          (SELECT vote_type FROM post_likes 
           WHERE post_id = p.id AND user_id = ${currentUserId}) as user_vote
        ` : sql`NULL as user_vote`}
      FROM posts p
      JOIN post_tags pt ON p.id = pt.post_id
      WHERE pt.tag_id = ${tagId}
        ${sql.unsafe(timeCondition)}
      ORDER BY ${sql.unsafe(orderBy)}
      LIMIT ${limit} OFFSET ${offset}
    `;

    // 获取总数
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM posts p
      JOIN post_tags pt ON p.id = pt.post_id
      WHERE pt.tag_id = ${tagId}
        ${sql.unsafe(timeCondition)}
    `;

    const total = parseInt(countResult[0]?.total || '0');
    const hasMore = offset + posts.length < total;

    // 获取每个帖子的标签
    for (const post of posts) {
      const tags = await sql`
        SELECT t.id, t.name, t.slug, t.color, t.icon
        FROM tags t
        JOIN post_tags pt ON t.id = pt.tag_id
        WHERE pt.post_id = ${post.id}
        ORDER BY t.usage_count DESC
      `;
      post.tags = tags;
    }

    return NextResponse.json({
      success: true,
      data: {
        posts,
        total,
        page,
        limit,
        hasMore,
      },
    });
  } catch (error: any) {
    console.error('Error fetching tag posts:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取标签帖子失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
