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
      return NextResponse.json(
        {
          success: false,
          message: 'Database not configured',
        },
        { status: 500 }
      );
    }

    if (!categorySlug) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category slug is required',
        },
        { status: 400 }
      );
    }

    // 获取分类信息
    const categoryResult = await sql`
      SELECT 
        id,
        name,
        slug,
        description
      FROM categories
      WHERE slug = ${categorySlug} AND is_active = true
      LIMIT 1
    `;

    if (categoryResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Category not found',
        },
        { status: 404 }
      );
    }

    const category = categoryResult[0];

    // 获取帖子总数
    const postCountResult = await sql`
      SELECT COUNT(*) as count
      FROM posts
      WHERE category_id = ${category.id}
    `;
    const totalPosts = parseInt(postCountResult[0]?.count || '0');

    // 获取帖子列表（简化查询）
    let posts;
    if (sortBy === 'popular') {
      posts = await sql`
        SELECT 
          p.id,
          p.title,
          p.content,
          p.user_id,
          p.created_at,
          COALESCE(p.is_pinned, false) as is_pinned,
          u.email as author_email,
          COALESCE(p.view_count, 0) as view_count,
          COALESCE(p.comment_count, 0) as comment_count,
          COALESCE(p.like_count, 0) as like_count
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.uid
        WHERE p.category_id = ${category.id} AND p.status = 'published'
        ORDER BY p.view_count DESC, p.created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    } else if (sortBy === 'pinned') {
      posts = await sql`
        SELECT 
          p.id,
          p.title,
          p.content,
          p.user_id,
          p.created_at,
          COALESCE(p.is_pinned, false) as is_pinned,
          u.email as author_email,
          COALESCE(p.view_count, 0) as view_count,
          COALESCE(p.comment_count, 0) as comment_count,
          COALESCE(p.like_count, 0) as like_count
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.uid
        WHERE p.category_id = ${category.id} AND p.status = 'published'
        ORDER BY p.is_pinned DESC NULLS LAST, p.created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    } else {
      posts = await sql`
        SELECT 
          p.id,
          p.title,
          p.content,
          p.user_id,
          p.created_at,
          COALESCE(p.is_pinned, false) as is_pinned,
          u.email as author_email,
          COALESCE(p.view_count, 0) as view_count,
          COALESCE(p.comment_count, 0) as comment_count,
          COALESCE(p.like_count, 0) as like_count
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.uid
        WHERE p.category_id = ${category.id} AND p.status = 'published'
        ORDER BY p.created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      `;
    }

    // 格式化帖子数据（直接使用表中的统计字段）
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
      lastReply: null,
      lastReplyBy: null,
      isPinned: post.is_pinned || false,
      isLocked: false,
      tags: [],
    }));

    // 获取总数
    const totalResult = await sql`
      SELECT COUNT(*) as total
      FROM posts
      WHERE category_id = ${category.id} AND status = 'published'
    `;

    return NextResponse.json({
      success: true,
      data: {
        category: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          icon: '💬',
          color: 'from-blue-500 to-cyan-500',
          stats: {
            totalPosts,
            totalTopics: totalPosts,
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
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
