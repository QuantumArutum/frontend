/**
 * Comments Management API
 * Production-grade implementation using communityService
 */

import { NextRequest, NextResponse } from 'next/server';
import { communityService } from '@/lib/communityService';

// GET - List comments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('post_id');
    const userId = searchParams.get('user_id');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await communityService.getComments({
      post_id: postId ? parseInt(postId) : undefined,
      user_id: userId || undefined,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: {
        comments: result.comments,
        total: result.total,
        page,
        per_page: limit,
      },
    });
  } catch (error: any) {
    console.error('Comments GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create comment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { post_id, user_id, content, parent_id } = body;

    const comment = await communityService.createComment({
      post_id,
      user_id,
      content,
      parent_id,
    });

    return NextResponse.json({ success: true, data: comment });
  } catch (error: any) {
    console.error('Comments POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update comment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, content, post_id } = body;

    if (action === 'update' && content) {
      const comment = await communityService.updateComment(id, content);
      return NextResponse.json({ success: true, data: comment });
    }

    if (action === 'like') {
      const { user_id } = body;
      const success = await communityService.likeComment(id, user_id);
      return NextResponse.json({ success });
    }

    if (action === 'best_answer' && post_id) {
      const success = await communityService.markBestAnswer(id, post_id);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Comments PUT error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete comment
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    if (id) {
      const success = await communityService.deleteComment(id);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 });
  } catch (error: any) {
    console.error('Comments DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
