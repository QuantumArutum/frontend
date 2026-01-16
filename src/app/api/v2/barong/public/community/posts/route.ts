/**
 * Public Community Posts API
 * Provides public access to community posts with proper field transformation
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Transform database fields to camelCase for frontend compatibility
function transformPost(post: any) {
  if (!post) return null;
  return {
    id: post.id?.toString() || `post_${post.id}`,
    title: post.title || '',
    content: post.content || '',
    category: post.category_id,
    userId: post.user_id,
    userName: post.author_email?.split('@')[0] || 'Anonymous',
    userAvatar: post.user_avatar || null,
    createdAt: post.created_at ? new Date(post.created_at).toISOString() : new Date().toISOString(),
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
    const rawPosts = result.data?.posts || [];
    const posts = rawPosts.map(transformPost).filter(Boolean);
    
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
    console.error('Error fetching posts:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
