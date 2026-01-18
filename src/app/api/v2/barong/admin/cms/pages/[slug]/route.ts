/**
 * Single Page Management API
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { slug } = await params;

  try {
    const result = await db.getPageBySlug(slug);
    if (!result.success)
      return NextResponse.json({ success: false, message: result.error }, { status: 404 });
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { slug } = await params;
  const body = await request.json();

  try {
    const result = await db.updatePage(slug, body);
    if (!result.success)
      return NextResponse.json({ success: false, message: result.error }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Page updated', data: result.data });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { slug } = await params;

  try {
    const result = await db.deletePage(slug);
    if (!result.success)
      return NextResponse.json({ success: false, message: result.error }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Page deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
