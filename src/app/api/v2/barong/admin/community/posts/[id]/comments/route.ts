/**
 * Post Comments API
 * GET /api/v2/barong/admin/community/posts/[id]/comments
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { id } = await params;

  try {
    const result = await db.getPostComments(id);

    return NextResponse.json({
      success: true,
      data: result.data || [],
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
