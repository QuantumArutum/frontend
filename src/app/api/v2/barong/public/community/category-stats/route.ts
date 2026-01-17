/**
 * Category Statistics API
 * Returns post count for each category
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

    // 获取每个分类的帖子数量
    const stats = await sql`
      SELECT 
        c.id,
        c.name,
        c.slug,
        COUNT(p.id) as post_count
      FROM categories c
      LEFT JOIN posts p ON c.id = p.category_id
      WHERE c.is_active = true
      GROUP BY c.id, c.name, c.slug
      ORDER BY c.sort_order ASC
    `;

    // 转换为易于使用的格式
    const categoryStats = stats.reduce((acc: any, stat: any) => {
      acc[stat.slug] = {
        id: stat.id,
        name: stat.name,
        postCount: parseInt(stat.post_count || '0'),
      };
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: categoryStats,
    });
  } catch (error) {
    console.error('Error fetching category stats:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
