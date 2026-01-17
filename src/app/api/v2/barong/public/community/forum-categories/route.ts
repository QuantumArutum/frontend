/**
 * Forum Categories API
 * Returns forum categories with statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured' 
      }, { status: 500 });
    }

    // 获取所有分类及其统计信息
    const categories = await sql`
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        c.icon,
        c.color,
        c.sort_order,
        COUNT(DISTINCT p.id) as post_count,
        COUNT(DISTINCT p.id) as topic_count,
        (
          SELECT json_build_object(
            'id', p2.id,
            'title', p2.title,
            'author', u.email,
            'created_at', p2.created_at
          )
          FROM posts p2
          LEFT JOIN users u ON p2.user_id = u.uid
          WHERE p2.category_id = c.id
          ORDER BY p2.created_at DESC
          LIMIT 1
        ) as last_post
      FROM categories c
      LEFT JOIN posts p ON c.id = p.category_id
      WHERE c.is_active = true
      GROUP BY c.id, c.name, c.slug, c.description, c.icon, c.color, c.sort_order
      ORDER BY c.sort_order ASC
    `;

    // 格式化数据
    const formattedCategories = categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      icon: cat.icon || '💬',
      color: cat.color || 'from-blue-500 to-cyan-500',
      posts: parseInt(cat.post_count || '0'),
      topics: parseInt(cat.topic_count || '0'),
      lastPost: cat.last_post ? {
        id: cat.last_post.id,
        title: cat.last_post.title,
        author: cat.last_post.author ? cat.last_post.author.split('@')[0] : 'Unknown',
        time: cat.last_post.created_at,
      } : null,
    }));

    return NextResponse.json({
      success: true,
      data: formattedCategories,
    });
  } catch (error) {
    console.error('Error fetching forum categories:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
