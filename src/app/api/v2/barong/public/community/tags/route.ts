import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

// GET /api/v2/barong/public/community/tags - 获取标签列表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'usage'; // usage, name, created
    const official = searchParams.get('official'); // true, false, null

    const offset = (page - 1) * limit;

    // 构建查询条件
    let whereClause = 'WHERE t.is_active = TRUE';
    const params: any[] = [];
    let paramIndex = 1;

    if (search) {
      whereClause += ` AND (t.name ILIKE $${paramIndex} OR t.description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (official === 'true') {
      whereClause += ' AND t.is_official = TRUE';
    } else if (official === 'false') {
      whereClause += ' AND t.is_official = FALSE';
    }

    // 排序
    let orderBy = 't.usage_count DESC';
    if (sortBy === 'name') {
      orderBy = 't.name ASC';
    } else if (sortBy === 'created') {
      orderBy = 't.created_at DESC';
    }

    // 获取标签列表
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
        t.created_at,
        COUNT(DISTINCT pt.post_id) as post_count,
        COUNT(DISTINCT ts.user_id) as subscriber_count
      FROM tags t
      LEFT JOIN post_tags pt ON t.id = pt.tag_id
      LEFT JOIN tag_subscriptions ts ON t.id = ts.tag_id
      ${sql.unsafe(whereClause)}
      GROUP BY t.id
      ORDER BY ${sql.unsafe(orderBy)}
      LIMIT ${limit} OFFSET ${offset}
    `;

    // 获取总数
    const countResult = await sql`
      SELECT COUNT(*) as total
      FROM tags t
      ${sql.unsafe(whereClause)}
    `;

    const total = parseInt(countResult[0]?.total || '0');
    const hasMore = offset + tags.length < total;

    return NextResponse.json({
      success: true,
      data: {
        tags,
        total,
        page,
        limit,
        hasMore,
      },
    });
  } catch (error: any) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      {
        success: false,
        message: '获取标签列表失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/v2/barong/public/community/tags - 创建标签
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, color = '#3b82f6' } = body;

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: '标签名称不能为空',
        },
        { status: 400 }
      );
    }

    // 验证标签名称长度
    if (name.length > 50) {
      return NextResponse.json(
        {
          success: false,
          message: '标签名称不能超过50个字符',
        },
        { status: 400 }
      );
    }

    // 生成 slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // 检查标签是否已存在
    const existing = await sql`
      SELECT id FROM tags WHERE name = ${name} OR slug = ${slug}
    `;

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: '标签已存在',
        },
        { status: 400 }
      );
    }

    // 创建标签
    const result = await sql`
      INSERT INTO tags (name, slug, description, color)
      VALUES (${name}, ${slug}, ${description || null}, ${color})
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      data: result[0],
      message: '标签创建成功',
    });
  } catch (error: any) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      {
        success: false,
        message: '创建标签失败',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
