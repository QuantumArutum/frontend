/**
 * Public Community Posts API
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Transform database fields to camelCase for frontend
function transformPost(post: any) {
  return {
    id: post.id?.toString() || `post_${post.id}`,
    title: post.title,
    content: post.content,
    category: post.category_id,
    userId: post.user_id,
    userName: post.author_email?.split('@')[0] || 'Anonymous',
    userAvatar: post.user_avatar,
    createdAt: post.created_at,
    commentCount: post.comment_count || 0,
    likeCount: post.like_count || 0,
    viewCount: post.view_count || 0,
    isPinned: post.is_pinned || false,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const category = searchParams.get('category') || undefined;

  try {
    const result = await db.getPosts({ page, limit, category });
    const posts = (result.data?.posts || []).map(transformPost);
    return NextResponse.json({
      success: true,
      data: {
        posts,
        total: result.data?.total || 0,
        page,
        per_page: limit,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
