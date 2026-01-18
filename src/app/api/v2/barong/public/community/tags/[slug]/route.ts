import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/v2/barong/public/community/tags/[slug] - 获取标签详情
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('currentUserId');

    // 获取标签详情
    const tagResult = await sql`
      SELECT 
        t.id,
        t.name,
        t.slug,
        t.description,
        t.color,
        t.icon,
        t.usage_count,
        t.is_official,
        t.created_at,
        COUNT(DISTINCT pt.post_id) as post_count,
        COUNT(DISTINCT ts.user_id) as subscriber_count
      FROM tags t
      LEFT JOIN post_tags pt ON t.id = pt.tag_id
      LEFT JOIN tag_subscriptions ts ON t.id = ts.tag_id
      WHERE t.slug = ${slug} AND t.is_active = TRUE
      GROUP BY t.id
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

    const tag = tagResult[0];

    // 检查用户是否订阅
    let isSubscribed = false;
    if (currentUserId) {
      const subscriptionResult = await sql`
        SELECT id FROM tag_subscriptions
        WHERE tag_id = ${tag.id} AND user_id = ${currentUserId}
      `;
      isSubscribed = subscriptionResult.length > 0;
    }

    // 获取相关标签（经常一起使用的标签）
    const relatedTags = await sql`
      SELECT DISTINCT
        t2.id,
        t2.name,
        t2.slug,
        t2.color,
        t2.icon,
        t2.usage_count,
        COUNT(DISTINCT pt2.post_id) as common_posts
      FROM post_tags pt1
      JOIN post_tags pt2 ON pt1.post_id = pt2.post_id AND pt1.tag_id != pt2.tag_id
      JOIN tags t2 ON pt2.tag_id = t2.id
      WHERE pt1.tag_id = ${tag.id} AND t2.is_active = TRUE
      GROUP BY t2.id
      ORDER BY common_posts DESC, t2.usage_count DESC
      LIMIT 10
    `;

    return NextResponse.json({
      success: true,
      data: {
        tag,
        isSubscribed,
        relatedTags,
      },
    });
  } catch (error: any) {
    console.error('Error fetching tag detail:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取标签详情失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
