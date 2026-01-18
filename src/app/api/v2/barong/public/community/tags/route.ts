import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';
import { withCache, generateCacheKey, CacheTTL } from '@/lib/cache';

// 设置运行时配置 - 使用Node.js runtime以支持完整的数据库功能
export const maxDuration = 30;

// GET /api/v2/barong/public/community/tags - 获取标签列表（优化版 + 缓存）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'usage';
    const offset = (page - 1) * limit;

    // 生成缓存键
    const cacheKey = generateCacheKey('tags', { page, limit, search, sortBy });

    // 使用缓存包装数据获取逻辑
    const result = await withCache(
      cacheKey,
      CacheTTL.FIVE_MINUTES, // 标签列表缓存5分钟
      async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        try {
          if (!sql) {
            console.error('[tags] Database connection not available');
            clearTimeout(timeoutId);
            throw new Error('Database connection not available');
          }

          // 简化查询 - 使用安全的条件查询替代sql.unsafe()
          let tags;
          if (search) {
            tags = (await sql`
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
            `) as any[];
          } else {
            // 使用条件查询替代动态SQL，避免SQL注入风险
            if (sortBy === 'name') {
              tags = (await sql`
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
                ORDER BY t.name ASC
                LIMIT ${limit}
                OFFSET ${offset}
              `) as any[];
            } else if (sortBy === 'created') {
              tags = (await sql`
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
                ORDER BY t.created_at DESC
                LIMIT ${limit}
                OFFSET ${offset}
              `) as any[];
            } else {
              // 默认按使用次数排序
              tags = (await sql`
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
                ORDER BY t.use_count DESC
                LIMIT ${limit}
                OFFSET ${offset}
              `) as any[];
            }
          }

          clearTimeout(timeoutId);

          return {
            tags,
            total: tags.length,
            page,
            limit,
            hasMore: tags.length === limit,
          };
        } catch (queryError) {
          clearTimeout(timeoutId);

          if (queryError instanceof Error && queryError.name === 'AbortError') {
            console.error('[tags] Request timeout');
            throw new Error('Request timeout');
          }
          throw queryError;
        }
      }
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';

    if (errorMessage === 'Request timeout') {
      return NextResponse.json(
        {
          success: false,
          error: 'Request timeout',
          message: '请求超时，请稍后重试',
        },
        { status: 504 }
      );
    }

    if (errorMessage === 'Database connection not available') {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection not available',
          message: '数据库连接不可用，请稍后重试',
        },
        { status: 503 }
      );
    }

    console.error('[tags] Error fetching tags:', {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: '获取标签列表失败，请稍后重试',
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
      return NextResponse.json({ success: false, message: '标签名称不能为空' }, { status: 400 });
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
      return NextResponse.json({ success: false, message: '标签已存在' }, { status: 400 });
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
      message: '标签创建成功',
    });
  } catch (error: any) {
    clearTimeout(timeoutId);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';

    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[tags-create] Request timeout:', {
        message: errorMessage,
        timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
        {
          success: false,
          error: 'Request timeout',
          message: '请求超时，请稍后重试',
        },
        { status: 504 }
      );
    }

    console.error('[tags-create] Error creating tag:', {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        message: '创建标签失败，请稍后重试',
      },
      { status: 500 }
    );
  }
}
