/**
 * Single Staking Pool Management API
 * PUT /api/v2/peatio/admin/staking/pools/[id] - Update pool
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
    const result = await db.updateStakingPool(id, body);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Staking pool updated',
      data: result.data,
    });
  } catch (error) {
    console.error('Update staking pool error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
