/**
 * Forum Category Posts API
 * Returns posts for a specific forum category
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categorySlug = searchParams.get('category');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');
  const sortBy = searchParams.get('sortBy') || 'latest'; // latest, popular, pinned

  try {
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured' 
      }, { status: 500 });
    }

    if (!categorySlug) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category slug is required' 
      }, { status: 400 });
    }

    // 获取分类信息
    const categoryResult = await sql`
      SELECT 
        c.id,
        c.name,
        c.slug,
        c.description,
        c.icon,
        c.color,
        COUNT(DISTINCT p.id) as post_count,
        COUNT(DISTINCT p.id) as topic_count
      FROM categories c
      LEFT JOIN posts p ON c.id = p.category_id
      WHERE c.slug = ${categorySlug} AND c.is_active = true
      GROUP BY c.id, c.name, c.slug, c.description, c.icon, c.color
    `;

    if (categoryResult.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Category not found' 
      }, { status: 404 });
    }

    const category = categoryResult[0];

    // 构建排序条件
    let orderByClause = 'p.created_at DESC';
    if (sortBy === 'popular') {
      orderByClause = `(
        COALESCE((SELECT COUNT(*) FROM post_likes WHERE post_id = p.id), 0) * 2 + 
        COALESCE((SELECT COUNT(*) FROM post_comments WHERE post_id = p.id), 0)
      ) DESC, p.created_at DESC`;
    } else if (sortBy === 'pinned') {
      orderByClause = 'p.is_pinned DESC, p.created_at DESC';
    }

    // 获取帖子列表
    const posts = await sql`
      SELECT 
        p.id,
        p.title,
        p.content,
        p.user_id,
        p.created_at,
        p.is_pinned,
        p.is_locked,
        u.email as author_email,
        COALESCE(
          (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id),
          0
        ) as comment_count,
        COALESCE(
          (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id),
          0
        ) as like_count,
        COALESCE(p.view_count, 0) as view_count,
        (
          SELECT json_build_object(
            'author', u2.email,
            'created_at', pc.created_at
          )
          FROM post_comments pc
          LEFT JOIN users u2 ON pc.user_id = u2.uid
          WHERE pc.post_id = p.id
          ORDER BY pc.created_at DESC
          LIMIT 1
        ) as last_reply
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.uid
      WHERE p.category_id = ${category.id}
      ORDER BY ${sql.unsafe(orderByClause)}
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // 格式化帖子数据
    const formattedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title,
      author: post.author_email ? post.author_email.split('@')[0] : 'Unknown',
      authorAvatar: post.author_email ? post.author_email[0].toUpperCase() : 'U',
      content: post.content.substring(0, 200) + (post.content.length > 200 ? '...' : ''),
      replies: parseInt(post.comment_count || '0'),
      views: parseInt(post.view_count || '0'),
      likes: parseInt(post.like_count || '0'),
      createdAt: post.created_at,
      lastReply: post.last_reply ? post.last_reply.created_at : null,
      lastReplyBy: post.last_reply ? post.last_reply.author.split('@')[0] : null,
      isPinned: post.is_pinned || false,
      isLocked: post.is_locked || false,
      tags: [], // TODO: 实现标签功能
    }));

    // 获取总数
    const totalResult = await sql`
      SELECT COUNT(*) as total
      FROM posts
      WHERE category_id = ${category.id}
    `;

    return NextResponse.json({
      success: true,
      data: {
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          icon: category.icon || '💬',
          color: category.color || 'from-blue-500 to-cyan-500',
          stats: {
            totalPosts: parseInt(category.post_count || '0'),
            totalTopics: parseInt(category.topic_count || '0'),
          },
        },
        posts: formattedPosts,
        pagination: {
          total: parseInt(totalResult[0]?.total || '0'),
          limit,
          offset,
          hasMore: offset + limit < parseInt(totalResult[0]?.total || '0'),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching forum category posts:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
