/**
 * Controversial Posts API
 * Get posts with high controversy scores
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const timeRange = searchParams.get('timeRange') || 'all';
    const currentUserId = searchParams.get('currentUserId');
    const offset = (page - 1) * limit;

    // 计算时间范围
    let timeFilter = '';
    if (timeRange !== 'all') {
      const hours =
        {
          '1h': 1,
          '6h': 6,
          '24h': 24,
          '7d': 168,
          '30d': 720,
        }[timeRange] || 0;

      if (hours > 0) {
        timeFilter = `AND p.created_at >= NOW() - INTERVAL '${hours} hours'`;
      }
    }

    // 获取争议帖子
    const postsResult = (await sql.unsafe(`
      SELECT 
        p.*,
        u.email as author_email,
        c.name as category_name,
        c.slug as category_slug
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.uid
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = 'published'
        AND p.is_controversial = TRUE
        ${timeFilter}
      ORDER BY p.controversy_score DESC, p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `)) as unknown as any[];

    // 获取总数
    const countResult = (await sql.unsafe(`
      SELECT COUNT(*) as total
      FROM posts p
      WHERE p.status = 'published'
        AND p.is_controversial = TRUE
        ${timeFilter}
    `)) as unknown as any[];

    const total = parseInt(countResult[0]?.total || '0');

    // 获取用户投票状态
    const posts = await Promise.all(
      postsResult.map(async (post: any) => {
        let userVote = null;
        if (currentUserId && sql) {
          const voteResult = await sql`
            SELECT vote_type FROM post_likes 
            WHERE post_id = ${post.id} AND user_id = ${currentUserId}
          `;
          userVote = voteResult.length > 0 ? voteResult[0].vote_type : null;
        }

        // 计算赞踩比例
        const totalVotes =
          parseInt(post.upvote_count || '0') + parseInt(post.downvote_count || '0');
        const upvoteRatio =
          totalVotes > 0
            ? ((parseInt(post.upvote_count || '0') / totalVotes) * 100).toFixed(1)
            : '0';

        return {
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
          upvoteRatio: parseFloat(upvoteRatio),
          controversyScore: parseFloat(post.controversy_score || '0'),
          viewCount: parseInt(post.view_count || '0'),
          commentCount: parseInt(post.comment_count || '0'),
          isPinned: post.is_pinned || false,
          isLocked: post.is_locked || false,
          userVote,
          createdAt: post.created_at,
          updatedAt: post.updated_at,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: {
        posts,
        total,
        page,
        limit,
        hasMore: offset + posts.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching controversial posts:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
