import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

/**
 * GET /api/v2/barong/public/community/user-activity
 * 获取用户活动历史
 * 
 * Query Parameters:
 * - userId: 用户ID（必需）
 * - type: 活动类型 (all | posts | comments | likes)，默认 all
 * - limit: 每页数量，默认 20
 * - offset: 偏移量，默认 0
 */
export async function GET(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({
        success: false,
        message: 'Database not configured'
      }, { status: 500 });
    }

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!userId) {
      return NextResponse.json({
        success: false,
        message: 'User ID is required'
      }, { status: 400 });
    }

    let activities: any[] = [];

    // 根据类型获取不同的活动
    if (type === 'all' || type === 'posts') {
      // 获取用户发布的帖子
      const postsResult = await sql`
        SELECT 
          p.id,
          'post' as type,
          p.title,
          p.content,
          p.category_id,
          c.name as category_name,
          c.slug as category_slug,
          p.view_count,
          p.like_count,
          p.comment_count,
          p.created_at
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.user_id = ${userId}
          AND p.status = 'published'
        ORDER BY p.created_at DESC
        LIMIT ${type === 'posts' ? limit : 10}
        OFFSET ${type === 'posts' ? offset : 0}
      `;
      
      activities.push(...postsResult.map((row: any) => ({
        ...row,
        content: row.content?.substring(0, 200) // 截取前200字符
      })));
    }

    if (type === 'all' || type === 'comments') {
      // 获取用户的评论（如果 post_comments 表存在）
      try {
        const commentsResult = await sql`
          SELECT 
            pc.id,
            'comment' as type,
            pc.content,
            pc.post_id,
            p.title as post_title,
            p.category_id,
            c.name as category_name,
            c.slug as category_slug,
            pc.created_at
          FROM post_comments pc
          LEFT JOIN posts p ON pc.post_id = p.id
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE pc.user_id = ${userId}
          ORDER BY pc.created_at DESC
          LIMIT ${type === 'comments' ? limit : 10}
          OFFSET ${type === 'comments' ? offset : 0}
        `;
        
        activities.push(...commentsResult.map((row: any) => ({
          ...row,
          content: row.content?.substring(0, 200)
        })));
      } catch (err) {
        console.log('post_comments table might not exist:', err);
      }
    }

    if (type === 'all' || type === 'likes') {
      // 获取用户点赞的帖子（如果 post_likes 表存在）
      try {
        const likesResult = await sql`
          SELECT 
            pl.id,
            'like' as type,
            pl.post_id,
            p.title as post_title,
            p.category_id,
            c.name as category_name,
            c.slug as category_slug,
            pl.created_at
          FROM post_likes pl
          LEFT JOIN posts p ON pl.post_id = p.id
          LEFT JOIN categories c ON p.category_id = c.id
          WHERE pl.user_id = ${userId}
          ORDER BY pl.created_at DESC
          LIMIT ${type === 'likes' ? limit : 10}
          OFFSET ${type === 'likes' ? offset : 0}
        `;
        
        activities.push(...likesResult);
      } catch (err) {
        console.log('post_likes table might not exist:', err);
      }
    }

    // 如果是 all 类型，按时间排序并限制数量
    if (type === 'all') {
      activities.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA;
      });
      activities = activities.slice(offset, offset + limit);
    }

    return NextResponse.json({
      success: true,
      data: {
        activities,
        total: activities.length,
        limit,
        offset
      }
    });

  } catch (error) {
    console.error('Failed to fetch user activity:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch user activity'
    }, { status: 500 });
  }
}
