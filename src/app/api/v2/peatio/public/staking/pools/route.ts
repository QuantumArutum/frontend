/**
 * Public Staking Pools API
 * GET /api/v2/peatio/public/staking/pools
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.getStakingPools();

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 });
    }

    // Filter only active pools for public API
    const activePools = result.data?.filter((pool: any) => pool.is_active) || [];

    return NextResponse.json({
      success: true,
      data: activePools,
    });
  } catch (error) {
    console.error('Get public staking pools error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
