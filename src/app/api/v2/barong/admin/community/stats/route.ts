/**
 * Community Stats API
 * GET /api/v2/barong/admin/community/stats
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  try {
    const result = await db.getCommunityStats();

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Get community stats error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
