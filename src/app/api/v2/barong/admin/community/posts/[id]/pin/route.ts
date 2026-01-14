/**
 * Pin/Unpin Post API
 * PUT /api/v2/barong/admin/community/posts/[id]/pin
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { id } = await params;
  const { isPinned } = await request.json();

  try {
    const result = await db.updatePost(id, { is_pinned: isPinned });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: isPinned ? 'Post pinned' : 'Post unpinned',
    });
  } catch (error) {
    console.error('Pin post error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
