import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

// 设置运行时配置 - 使用Node.js runtime以支持完整的数据库功能
export const maxDuration = 30;

// GET /api/v2/barong/public/community/tags - 获取标签列表（优化版）
export async function GET(request: NextRequest) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    if (!sql) {
      clearTimeout(timeoutId);
      return NextResponse.json({
        success: true,
        data: { tags: [], total: 0, page: 1, limit: 20, hasMore: false }
      });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'usage';
    const offset = (page - 1) * limit;

    // 简化查询
    let tags;
    if (search) {
      tags = await sql`
        SELECT 
          t.id,
          t.name,
          t.slug,
          t.description,
          t.color,
          t.use_count as usage_count,
          t.is_official,
          t.created_at
        FROM tags t
        WHERE t.name ILIKE ${'%' + search + '%'}
        ORDER BY t.use_count DESC
        LIMIT ${limit}
        OFFSET ${offset}
      ` as any[];
    } else {
      const orderBy = sortBy === 'name' ? 't.name ASC' : 
                      sortBy === 'created' ? 't.created_at DESC' : 
                      't.use_count DESC';
      
      tags = await sql`
        SELECT 
          t.id,
          t.name,
          t.slug,
          t.description,
          t.color,
          t.use_count as usage_count,
          t.is_official,
          t.created_at
        FROM tags t
        ORDER BY ${sql.unsafe(orderBy)}
        LIMIT ${limit}
        OFFSET ${offset}
      ` as any[];
    }

    clearTimeout(timeoutId);

    return NextResponse.json({
      success: true,
      data: {
        tags,
        total: tags.length,
        page,
        limit,
        hasMore: tags.length === limit
      }
    });

  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json({
        success: true,
        data: { tags: [], total: 0, page: 1, limit: 20, hasMore: false }
      });
    }
    
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取标签列表失败',
        error: error.message
      },
      { status: 500 }
    );
  }
}

// POST /api/v2/barong/public/community/tags - 创建标签（优化版）
export async function POST(request: NextRequest) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    if (!sql) {
      clearTimeout(timeoutId);
      return NextResponse.json(
        { success: false, message: 'Database not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { name, description, color = '#3b82f6' } = body;

    if (!name || name.trim().length === 0) {
      clearTimeout(timeoutId);
      return NextResponse.json(
        { success: false, message: '标签名称不能为空' },
        { status: 400 }
      );
    }

    if (name.length > 50) {
      clearTimeout(timeoutId);
      return NextResponse.json(
        { success: false, message: '标签名称不能超过50个字符' },
        { status: 400 }
      );
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // 检查是否存在
    const existing = await sql`
      SELECT id FROM tags WHERE name = ${name} OR slug = ${slug} LIMIT 1
    `;

    if (existing.length > 0) {
      clearTimeout(timeoutId);
      return NextResponse.json(
        { success: false, message: '标签已存在' },
        { status: 400 }
      );
    }

    // 创建标签
    const result = await sql`
      INSERT INTO tags (name, slug, description, color, use_count, created_at)
      VALUES (${name}, ${slug}, ${description || null}, ${color}, 0, NOW())
      RETURNING *
    `;

    clearTimeout(timeoutId);

    return NextResponse.json({
      success: true,
      data: result[0],
      message: '标签创建成功'
    });

  } catch (error: any) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { success: false, message: 'Request timeout' },
        { status: 504 }
      );
    }
    
    console.error('Error creating tag:', error);
    return NextResponse.json(
      {
        success: false,
        message: '创建标签失败',
        error: error.message
      },
      { status: 500 }
    );
  }
}
