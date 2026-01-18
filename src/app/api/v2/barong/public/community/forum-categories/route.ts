import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

/**
 * GET /api/v2/barong/public/community/forum-categories
 * 获取论坛分类及统计信息
 */
export async function GET(request: NextRequest) {
  try {
    // 获取所有分类及其统计信息
    const categories = await sql`
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        c.icon,
        c.color,
        c.display_order,
        COUNT(DISTINCT p.id) as posts_count,
        COUNT(DISTINCT p.id) as topics_count,
        MAX(p.created_at) as last_post_time,
        (
          SELECT json_build_object(
            'id', p2.id,
            'title', p2.title,
            'author', u.username,
            'author_avatar', u.avatar,
            'created_at', p2.created_at
          )
          FROM posts p2
          JOIN users u ON p2.user_id = u.id
          WHERE p2.category_id = c.id
          ORDER BY p2.created_at DESC
          LIMIT 1
        ) as last_post
      FROM categories c
      LEFT JOIN posts p ON p.category_id = c.id AND p.deleted_at IS NULL
      WHERE c.deleted_at IS NULL
      GROUP BY c.id, c.name, c.slug, c.description, c.icon, c.color, c.display_order
      ORDER BY c.display_order ASC, c.name ASC
    ` as any[];

    // 格式化数据
    const formattedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon,
      color: cat.color,
      posts: parseInt(cat.posts_count) || 0,
      topics: parseInt(cat.topics_count) || 0,
      lastPost: cat.last_post || null
    }));

    return NextResponse.json({
      success: true,
      data: formattedCategories
    });

  } catch (error) {
    console.error('Error fetching forum categories:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch forum categories',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
