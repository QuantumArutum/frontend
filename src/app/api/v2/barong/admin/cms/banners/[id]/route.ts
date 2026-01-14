/**
 * Single Banner Management API
 * PUT /api/v2/barong/admin/cms/banners/[id]
 * DELETE /api/v2/barong/admin/cms/banners/[id]
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
  const body = await request.json();

  try {
    const result = await db.updateBanner(id, body);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Banner updated' });
  } catch (error) {
    console.error('Update banner error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { id } = await params;

  try {
    const result = await db.deleteBanner(id);
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Banner deleted' });
  } catch (error) {
    console.error('Delete banner error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
