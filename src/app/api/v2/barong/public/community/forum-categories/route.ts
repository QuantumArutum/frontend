import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

// 设置运行时配置
export const runtime = 'edge';
export const maxDuration = 10;

/**
 * GET /api/v2/barong/public/community/forum-categories
 * 获取论坛分类及统计信息（优化版）
 */
export async function GET(request: NextRequest) {
  try {
    // 检查数据库连接
    if (!sql) {
      return NextResponse.json({
        success: true,
        data: getDefaultCategories()
      });
    }

    // 使用超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
      // 简化查询，移除复杂的子查询
      const categories = await sql`
        SELECT 
          c.id,
          c.name,
          c.slug,
          c.description,
          c.icon,
          c.color,
          c.sort_order as display_order,
          COALESCE(COUNT(DISTINCT p.id), 0) as posts_count
        FROM categories c
        LEFT JOIN posts p ON p.category_id = c.id AND p.status = 'published'
        WHERE c.is_active = true
        GROUP BY c.id, c.name, c.slug, c.description, c.icon, c.color, c.sort_order
        ORDER BY c.sort_order ASC, c.name ASC
        LIMIT 20
      ` as any[];

      clearTimeout(timeoutId);

      // 格式化数据
      const formattedCategories = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        icon: cat.icon || '📁',
        color: cat.color || '#6366f1',
        posts: parseInt(cat.posts_count) || 0,
        topics: parseInt(cat.posts_count) || 0,
        lastPost: null // 移除复杂查询以提高性能
      }));

      return NextResponse.json({
        success: true,
        data: formattedCategories.length > 0 ? formattedCategories : getDefaultCategories()
      });

    } catch (queryError) {
      clearTimeout(timeoutId);
      
      if (queryError instanceof Error && queryError.name === 'AbortError') {
        console.error('Query timeout');
        return NextResponse.json({
          success: true,
          data: getDefaultCategories()
        });
      }
      throw queryError;
    }

  } catch (error) {
    console.error('Error fetching forum categories:', error);
    
    // 返回默认分类而不是错误
    return NextResponse.json({
      success: true,
      data: getDefaultCategories()
    });
  }
}

/**
 * 获取默认分类（当数据库不可用时）
 */
function getDefaultCategories() {
  return [
    {
      id: 1,
      name: '综合讨论',
      slug: 'general',
      description: '社区综合讨论区',
      icon: '💬',
      color: '#6366f1',
      posts: 0,
      topics: 0,
      lastPost: null
    },
    {
      id: 2,
      name: '公告',
      slug: 'announcements',
      description: '官方公告和重要通知',
      icon: '📢',
      color: '#f59e0b',
      posts: 0,
      topics: 0,
      lastPost: null
    },
    {
      id: 3,
      name: '技术交流',
      slug: 'technology',
      description: '技术讨论和开发交流',
      icon: '💻',
      color: '#10b981',
      posts: 0,
      topics: 0,
      lastPost: null
    },
    {
      id: 4,
      name: 'DeFi & 交易',
      slug: 'trading',
      description: 'DeFi和交易相关讨论',
      icon: '📈',
      color: '#8b5cf6',
      posts: 0,
      topics: 0,
      lastPost: null
    },
    {
      id: 5,
      name: '治理',
      slug: 'governance',
      description: '社区治理和提案讨论',
      icon: '🏛️',
      color: '#ec4899',
      posts: 0,
      topics: 0,
      lastPost: null
    }
  ];
}
