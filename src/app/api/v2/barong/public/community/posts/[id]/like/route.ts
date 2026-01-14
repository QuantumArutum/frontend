/**
 * Post Like API
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAuth(request);
  if ('error' in authResult) return authResult.error;

  const { id } = await params;

  try {
    const result = await db.togglePostLike(id, authResult.user.uid);
    return NextResponse.json({ 
      success: true, 
      message: result.data?.liked ? 'Post liked' : 'Post unliked',
      data: result.data,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
