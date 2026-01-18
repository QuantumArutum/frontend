/**
 * Staking Pools Management API
 * GET /api/v2/peatio/admin/staking/pools - List pools
 * POST /api/v2/peatio/admin/staking/pools - Create pool
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  try {
    const result = await db.getStakingPools();

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Get staking pools error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  try {
    const { token_id, apy, duration_days, min_stake, is_active } = await request.json();

    if (!token_id || apy === undefined || duration_days === undefined || min_stake === undefined) {
      return NextResponse.json(
        { success: false, message: 'token_id, apy, duration_days, and min_stake are required' },
        { status: 400 }
      );
    }

    const result = await db.createStakingPool({
      token_id,
      apy,
      duration_days,
      min_stake,
      is_active: is_active !== undefined ? is_active : true,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Staking pool created',
      data: result.data,
    });
  } catch (error) {
    console.error('Create staking pool error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
