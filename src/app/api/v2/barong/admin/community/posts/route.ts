/**
 * Community Posts Management API
 * GET /api/v2/barong/admin/community/posts - List posts
 * POST /api/v2/barong/admin/community/posts - Create post
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const category = searchParams.get('category') || undefined;
  const search = searchParams.get('q') || undefined;

  try {
    const result = await db.getPosts({ page, limit, category, search });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        posts: result.data!.posts,
        total: result.data!.total,
        page,
        per_page: limit,
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  try {
    const { title, content, category_id } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { success: false, message: 'Title and content are required' },
        { status: 400 }
      );
    }

    const result = await db.createPost({
      title,
      content,
      category_id: category_id || 1,
      user_id: authResult.user.uid,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Post created',
      data: result.data,
    });
  } catch (error) {
    console.error('Create post error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
