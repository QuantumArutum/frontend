import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/v2/barong/public/community/tags/trending - 获取热门标签
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d'; // 1h, 24h, 7d, 30d
    const limit = parseInt(searchParams.get('limit') || '20');

    // 构建时间范围条件
    const intervals: Record<string, string> = {
      '1h': '1 hour',
      '24h': '24 hours',
      '7d': '7 days',
      '30d': '30 days',
    };
    const interval = intervals[timeRange] || '7 days';

    // 获取热门标签
    const tags = await sql`
      SELECT 
        t.id,
        t.name,
        t.slug,
        t.description,
        t.color,
        t.icon,
        t.usage_count,
        t.is_official,
        COUNT(DISTINCT pt.post_id) as recent_post_count,
        COUNT(DISTINCT ts.user_id) as subscriber_count
      FROM tags t
      LEFT JOIN post_tags pt ON t.id = pt.tag_id 
        AND pt.created_at >= NOW() - INTERVAL ${interval}
      LEFT JOIN tag_subscriptions ts ON t.id = ts.tag_id
      WHERE t.is_active = TRUE
      GROUP BY t.id
      ORDER BY recent_post_count DESC, t.usage_count DESC
      LIMIT ${limit}
    `;

    return NextResponse.json({
      success: true,
      data: { tags },
    });
  } catch (error: any) {
    console.error('Error fetching trending tags:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取热门标签失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
