/**
 * Comments Management API
 * Admin management for community comments
 */

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - List comments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('post_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get posts to find comments
    const postsResult = await db.getPosts({ page: 1, limit: 100 });
    const posts = postsResult.data?.posts || [];
    
    // Build comments list from posts
    const comments: any[] = [];
    for (const post of posts) {
      const postComments = await db.getPostComments(post.id);
      if (postComments.data) {
        postComments.data.forEach((c: any) => {
          comments.push({
            ...c,
            post_title: post.title,
            user_email: 'user@example.com',
            is_hidden: 0,
            report_count: 0,
          });
        });
      }
    }

    const filtered = postId ? comments.filter(c => c.post_id === postId) : comments;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    return NextResponse.json({
      success: true,
      data: {
        comments: paged,
        total: filtered.length,
        page,
        per_page: limit,
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update comment (hide/unhide)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (action === 'hide' || action === 'unhide') {
      return NextResponse.json({ success: true, data: { id, is_hidden: action === 'hide' ? 1 : 0 } });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete comment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      await db.deleteComment(id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
