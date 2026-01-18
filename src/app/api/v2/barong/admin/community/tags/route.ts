/**
 * Tags & Topics Management API
 * Production-grade implementation using communityService
 */

import { NextRequest, NextResponse } from 'next/server';
import { communityService } from '@/lib/communityService';

// GET - List tags
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('post_id');

    if (postId) {
      const tags = await communityService.getPostTags(parseInt(postId));
      return NextResponse.json({ success: true, data: tags });
    }

    const tags = await communityService.getTags();
    return NextResponse.json({
      success: true,
      data: {
        tags,
        stats: {
          total: tags.length,
        },
      },
    });
  } catch (error: any) {
    console.error('Tags GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create tag or add tag to post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, name, slug, post_id, tag_id } = body;

    if (action === 'create') {
      const tagSlug = slug || name.toLowerCase().replace(/\s+/g, '-');
      const tag = await communityService.createTag(name, tagSlug);
      return NextResponse.json({ success: true, data: tag });
    }

    if (action === 'add_to_post' && post_id && tag_id) {
      const success = await communityService.addTagToPost(post_id, tag_id);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Tags POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete tag
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    if (id) {
      const success = await communityService.deleteTag(id);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 });
  } catch (error: any) {
    console.error('Tags DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
