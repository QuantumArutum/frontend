import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

/**
 * GET /api/v2/barong/public/community/search
 * 全局搜索功能 - 搜索帖子、用户、标签
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // all, posts, users, tags
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          posts: [],
          users: [],
          tags: [],
          total: 0
        }
      });
    }

    const searchTerm = `%${query.trim()}%`;
    const results: any = {
      posts: [],
      users: [],
      tags: [],
      total: 0
    };

    // 搜索帖子
    if (type === 'all' || type === 'posts') {
      const posts = await sql`
        SELECT 
          p.id,
          p.title,
          p.content,
          p.created_at,
          p.view_count,
          p.comment_count,
          p.like_count,
          u.username,
          u.avatar,
          c.name as category_name,
          c.slug as category_slug
        FROM posts p
        LEFT JOIN users u ON p.user_id = u.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE 
          p.deleted_at IS NULL
          AND (
            p.title ILIKE ${searchTerm}
            OR p.content ILIKE ${searchTerm}
          )
        ORDER BY 
          CASE 
            WHEN p.title ILIKE ${searchTerm} THEN 1
            ELSE 2
          END,
          p.created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      ` as any[];

      results.posts = posts.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content.substring(0, 200) + (post.content.length > 200 ? '...' : ''),
        author: post.username || 'Unknown',
        authorAvatar: post.avatar,
        category: post.category_name,
        categorySlug: post.category_slug,
        views: parseInt(post.view_count) || 0,
        replies: parseInt(post.comment_count) || 0,
        likes: parseInt(post.like_count) || 0,
        createdAt: post.created_at,
        // 高亮搜索关键词
        highlightedTitle: highlightText(post.title, query),
        highlightedContent: highlightText(post.content.substring(0, 200), query)
      }));
    }

    // 搜索用户
    if (type === 'all' || type === 'users') {
      const users = await sql`
        SELECT 
          u.id,
          u.username,
          u.email,
          u.avatar,
          u.bio,
          u.created_at,
          COUNT(DISTINCT p.id) as posts_count,
          COUNT(DISTINCT f.id) as followers_count
        FROM users u
        LEFT JOIN posts p ON p.user_id = u.id AND p.deleted_at IS NULL
        LEFT JOIN follows f ON f.following_id = u.id
        WHERE 
          u.username ILIKE ${searchTerm}
          OR u.email ILIKE ${searchTerm}
          OR u.bio ILIKE ${searchTerm}
        GROUP BY u.id, u.username, u.email, u.avatar, u.bio, u.created_at
        ORDER BY 
          CASE 
            WHEN u.username ILIKE ${searchTerm} THEN 1
            ELSE 2
          END,
          u.created_at DESC
        LIMIT ${limit}
        OFFSET ${offset}
      ` as any[];

      results.users = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        postsCount: parseInt(user.posts_count) || 0,
        followersCount: parseInt(user.followers_count) || 0,
        joinedAt: user.created_at,
        highlightedUsername: highlightText(user.username, query)
      }));
    }

    // 搜索标签
    if (type === 'all' || type === 'tags') {
      const tags = await sql`
        SELECT 
          t.id,
          t.name,
          t.slug,
          t.description,
          t.color,
          t.use_count,
          t.is_official,
          COUNT(DISTINCT pt.post_id) as posts_count
        FROM tags t
        LEFT JOIN post_tags pt ON pt.tag_id = t.id
        WHERE 
          t.name ILIKE ${searchTerm}
          OR t.description ILIKE ${searchTerm}
        GROUP BY t.id, t.name, t.slug, t.description, t.color, t.use_count, t.is_official
        ORDER BY 
          CASE 
            WHEN t.name ILIKE ${searchTerm} THEN 1
            ELSE 2
          END,
          t.use_count DESC
        LIMIT ${limit}
        OFFSET ${offset}
      ` as any[];

      results.tags = tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        description: tag.description,
        color: tag.color,
        useCount: parseInt(tag.use_count) || 0,
        postsCount: parseInt(tag.posts_count) || 0,
        isOfficial: tag.is_official,
        highlightedName: highlightText(tag.name, query)
      }));
    }

    // 计算总数
    results.total = results.posts.length + results.users.length + results.tags.length;

    return NextResponse.json({
      success: true,
      data: results,
      query: query,
      type: type
    });

  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to search',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * 高亮搜索关键词
 */
function highlightText(text: string, query: string): string {
  if (!text || !query) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
