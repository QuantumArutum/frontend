/**
 * Delete Staking Pool API
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { id } = await params;

  try {
    const result = await db.deleteStakingPool(id);
    if (!result.success)
      return NextResponse.json({ success: false, message: result.error }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Staking pool deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
