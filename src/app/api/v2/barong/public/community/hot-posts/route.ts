/**
 * Hot Posts API
 * Get posts sorted by hot score (Reddit-style algorithm) - 优化版
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

// 设置运行时配置 - 使用Node.js runtime以支持完整的数据库功能
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    if (!sql) {
      console.error('[hot-posts] Database connection not available');
      clearTimeout(timeoutId);
      return NextResponse.json({
        success: false,
        error: 'Database connection not available',
        message: '数据库连接不可用，请稍后重试'
      }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const timeRange = searchParams.get('timeRange') || '7d';
    const offset = (page - 1) * limit;

    // 简化时间范围计算
    const hours = {
      '1h': 1,
      '6h': 6,
      '24h': 24,
      '7d': 168,
      '30d': 720,
      'all': 8760
    }[timeRange] || 168;

    // 简化查询 - 移除复杂的JOIN和子查询
    const posts = await sql`
      SELECT 
        p.id,
        p.title,
        LEFT(p.content, 200) as content,
        p.user_id,
        p.category_id,
        p.upvote_count,
        p.downvote_count,
        p.vote_score,
        p.hot_score,
        p.view_count,
        p.comment_count,
        p.is_pinned,
        p.created_at,
        u.email as author_email,
        c.name as category_name,
        c.slug as category_slug
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.uid
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 
        p.status = 'published'
        AND p.created_at >= NOW() - INTERVAL '${hours} hours'
      ORDER BY p.hot_score DESC, p.created_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    ` as any[];

    clearTimeout(timeoutId);

    // 简化数据格式化 - 不查询用户投票状态
    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      userId: post.user_id,
      authorEmail: post.author_email,
      authorName: post.author_email?.split('@')[0] || 'Unknown',
      categoryId: post.category_id,
      categoryName: post.category_name,
      categorySlug: post.category_slug,
      upvoteCount: parseInt(post.upvote_count || '0'),
      downvoteCount: parseInt(post.downvote_count || '0'),
      voteScore: parseInt(post.vote_score || '0'),
      hotScore: parseFloat(post.hot_score || '0'),
      viewCount: parseInt(post.view_count || '0'),
      commentCount: parseInt(post.comment_count || '0'),
      isPinned: post.is_pinned || false,
      userVote: null, // 客户端单独查询
      createdAt: post.created_at
    }));

    return NextResponse.json({
      success: true,
      data: {
        posts: formattedPosts,
        total: formattedPosts.length,
        page,
        limit,
        hasMore: formattedPosts.length === limit
      }
    });

  } catch (error) {
    clearTimeout(timeoutId);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[hot-posts] Request timeout:', {
        message: errorMessage,
        timestamp: new Date().toISOString()
      });
      return NextResponse.json({
        success: false,
        error: 'Request timeout',
        message: '请求超时，请稍后重试'
      }, { status: 504 });
    }
    
    console.error('[hot-posts] Error fetching hot posts:', {
      message: errorMessage,
      stack: errorStack,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      message: '获取热门帖子失败，请稍后重试'
    }, { status: 500 });
  }
}
