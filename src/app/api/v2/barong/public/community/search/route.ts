import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

// 设置运行时配置 - 使用Node.js runtime以支持完整的数据库功能
export const maxDuration = 30;

/**
 * GET /api/v2/barong/public/community/search
 * 全局搜索功能 - 搜索帖子、用户、标签（优化版）
 */
export async function GET(request: NextRequest) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    if (!sql) {
      console.error('[search] Database connection not available');
      clearTimeout(timeoutId);
      return NextResponse.json({
        success: false,
        error: 'Database connection not available',
        message: '数据库连接不可用，请稍后重试'
      }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query || query.trim().length === 0) {
      clearTimeout(timeoutId);
      return NextResponse.json({
        success: true,
        data: { posts: [], users: [], tags: [], total: 0 }
      });
    }

    const searchTerm = `%${query.trim().substring(0, 100)}%`;
    const results: any = {
      posts: [],
      users: [],
      tags: [],
      total: 0
    };

    // 搜索帖子（简化查询）
    if (type === 'all' || type === 'posts') {
      try {
        const posts = await sql`
          SELECT 
            p.id,
            p.title,
            LEFT(p.content, 200) as content,
            p.created_at,
            p.view_count,
            p.comment_count,
            p.like_count,
            u.username,
            c.name as category_name,
            c.slug as category_slug
          FROM posts p
          LEFT JOIN users u ON p.user_id = u.uid
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE 
            p.status = 'published'
            AND (p.title ILIKE ${searchTerm} OR p.content ILIKE ${searchTerm})
          ORDER BY p.created_at DESC
          LIMIT ${limit}
          OFFSET ${offset}
        ` as any[];

        results.posts = posts.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content + (post.content.length >= 200 ? '...' : ''),
          author: post.username || 'Unknown',
          category: post.category_name,
          categorySlug: post.category_slug,
          views: parseInt(post.view_count) || 0,
          replies: parseInt(post.comment_count) || 0,
          likes: parseInt(post.like_count) || 0,
          createdAt: post.created_at
        }));
      } catch (e) {
        console.error('Posts search error:', e);
      }
    }

    // 搜索用户（简化查询）
    if (type === 'all' || type === 'users') {
      try {
        const users = await sql`
          SELECT 
            u.id,
            u.username,
            u.email,
            u.created_at
          FROM users u
          WHERE u.username ILIKE ${searchTerm} OR u.email ILIKE ${searchTerm}
          ORDER BY u.created_at DESC
          LIMIT ${Math.min(limit, 10)}
          OFFSET ${offset}
        ` as any[];

        results.users = users.map(user => ({
          id: user.id,
          username: user.username,
          email: user.email,
          joinedAt: user.created_at
        }));
      } catch (e) {
        console.error('Users search error:', e);
      }
    }

    // 搜索标签（简化查询）
    if (type === 'all' || type === 'tags') {
      try {
        const tags = await sql`
          SELECT 
            t.id,
            t.name,
            t.slug,
            t.use_count
          FROM tags t
          WHERE t.name ILIKE ${searchTerm}
          ORDER BY t.use_count DESC
          LIMIT ${Math.min(limit, 10)}
          OFFSET ${offset}
        ` as any[];

        results.tags = tags.map(tag => ({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
          useCount: parseInt(tag.use_count) || 0
        }));
      } catch (e) {
        console.error('Tags search error:', e);
      }
    }

    results.total = results.posts.length + results.users.length + results.tags.length;

    clearTimeout(timeoutId);

    return NextResponse.json({
      success: true,
      data: results,
      query: query,
      type: type
    });

  } catch (error) {
    clearTimeout(timeoutId);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[search] Request timeout:', {
        message: errorMessage,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json({
        success: false,
        error: 'Request timeout',
        message: '搜索超时，请稍后重试'
      }, { status: 504 });
    }
    
    console.error('[search] Error searching:', {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        message: '搜索失败，请稍后重试'
      },
      { status: 500 }
    );
  }
}
