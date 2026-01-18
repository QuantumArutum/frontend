/**
 * Post Comments API (Public read, Auth write)
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const result = await db.getPostComments(id);
    return NextResponse.json({ success: true, data: result.data || [] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = requireAuth(request);
  if ('error' in authResult) return authResult.error;

  const { id } = await params;
  const { content } = await request.json();

  if (!content) {
    return NextResponse.json({ success: false, message: 'Content is required' }, { status: 400 });
  }

  try {
    const result = await db.createComment({
      post_id: id,
      user_id: authResult.user.uid,
      content,
    });
    return NextResponse.json({ success: true, message: 'Comment added', data: result.data });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
