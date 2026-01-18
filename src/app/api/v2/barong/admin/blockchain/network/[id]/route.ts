/**
 * Single Blockchain Network API
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { id } = await params;
  const body = await request.json();

  try {
    const result = await db.updateBlockchainNetwork(id, body);
    if (!result.success)
      return NextResponse.json({ success: false, message: result.error }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Network updated' });
  } catch (error) {
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
    const result = await db.deleteBlockchainNetwork(id);
    if (!result.success)
      return NextResponse.json({ success: false, message: result.error }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Network deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
