/**
 * Community Search API
 * Search posts, users, and tags
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const type = searchParams.get('type') || 'all'; // all, posts, users, tags
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured' 
      }, { status: 500 });
    }

    if (!query.trim()) {
      return NextResponse.json({ 
        success: false, 
        message: 'Search query is required' 
      }, { status: 400 });
    }

    const searchPattern = `%${query.toLowerCase()}%`;
    const results: any = {
      posts: [],
      users: [],
      tags: [],
    };

    // 搜索帖子
    if (type === 'all' || type === 'posts') {
      const posts = await sql`
        SELECT 
          p.id,
          p.title,
          p.content,
          p.user_id,
          p.created_at,
          p.comment_count,
          p.like_count,
          p.view_count,
          p.status,
          u.email as author_email,
          c.name as category_name,
          c.slug as category_slug
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.uid
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 
          p.status = 'published' AND (
            LOWER(p.title) LIKE ${searchPattern} OR
            LOWER(p.content) LIKE ${searchPattern}
          )
        ORDER BY 
          CASE 
            WHEN LOWER(p.title) LIKE ${searchPattern} THEN 1
            ELSE 2
          END,
          p.created_at DESC
        LIMIT ${type === 'posts' ? limit : 5}
        OFFSET ${type === 'posts' ? offset : 0}
      `;

      results.posts = posts.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content.substring(0, 200) + (post.content.length > 200 ? '...' : ''),
        category: post.category_name,
        categorySlug: post.category_slug,
        userId: post.user_id,
        userName: post.author_email ? post.author_email.split('@')[0] : 'Unknown',
        userAvatar: post.author_email ? post.author_email[0].toUpperCase() : 'U',
        createdAt: post.created_at,
        commentCount: parseInt(post.comment_count || '0'),
        likeCount: parseInt(post.like_count || '0'),
        viewCount: parseInt(post.view_count || '0'),
      }));
    }

    // 搜索用户
    if (type === 'all' || type === 'users') {
      const users = await sql`
        SELECT 
          u.uid as id,
          u.email,
          u.created_at,
          up.display_name
        FROM users u
        LEFT JOIN user_profiles up ON u.uid = up.user_id
        WHERE 
          u.status = 'active' AND (
            LOWER(u.email) LIKE ${searchPattern} OR
            LOWER(up.display_name) LIKE ${searchPattern}
          )
        ORDER BY u.created_at DESC
        LIMIT ${type === 'users' ? limit : 5}
        OFFSET ${type === 'users' ? offset : 0}
      `;

      results.users = users.map((user: any) => ({
        id: user.id,
        username: user.display_name || user.email.split('@')[0],
        email: user.email,
        avatar: user.email[0].toUpperCase(),
        joinedAt: user.created_at,
      }));
    }

    // 搜索标签（如果实现了标签功能）
    if (type === 'all' || type === 'tags') {
      // TODO: 实现标签搜索
      results.tags = [];
    }

    // 记录搜索日志（用于优化搜索）
    if (sql) {
      try {
        // 确保表存在
        await sql`
          CREATE TABLE IF NOT EXISTS search_logs (
            id SERIAL PRIMARY KEY,
            query TEXT NOT NULL,
            results_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        
        await sql`
          INSERT INTO search_logs (query, results_count, created_at)
          VALUES (
            ${query},
            ${results.posts.length + results.users.length + results.tags.length},
            CURRENT_TIMESTAMP
          )
        `;
      } catch (logError) {
        // 忽略日志错误，不影响搜索结果
        console.error('Failed to log search:', logError);
      }
    }

    // 获取总数
    let total = 0;
    if (type === 'posts') {
      const countResult = await sql`
        SELECT COUNT(*) as total
        FROM posts
        WHERE 
          status = 'published' AND (
            LOWER(title) LIKE ${searchPattern} OR
            LOWER(content) LIKE ${searchPattern}
          )
      `;
      total = parseInt(countResult[0]?.total || '0');
    } else if (type === 'users') {
      const countResult = await sql`
        SELECT COUNT(*) as total
        FROM users u
        LEFT JOIN user_profiles up ON u.uid = up.user_id
        WHERE 
          u.status = 'active' AND (
            LOWER(u.email) LIKE ${searchPattern} OR
            LOWER(up.display_name) LIKE ${searchPattern}
          )
      `;
      total = parseInt(countResult[0]?.total || '0');
    } else {
      total = results.posts.length + results.users.length + results.tags.length;
    }

    return NextResponse.json({
      success: true,
      data: {
        query,
        results,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      },
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
