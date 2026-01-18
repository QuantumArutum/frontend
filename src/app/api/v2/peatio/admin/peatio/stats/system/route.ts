/**
 * System Stats API (Peatio)
 * GET /api/v2/peatio/admin/peatio/stats/system
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  try {
    const usersResult = await db.getUsers({ page: 1, limit: 1 });

    return NextResponse.json({
      success: true,
      data: {
        users_count: usersResult.data?.total || 0,
        orders_count: 0,
        trades_count: 0,
        server_uptime: process.uptime(),
        active_sessions: 1,
        total_api_calls_24h: 1250,
        error_rate_24h: 0.01,
        response_time_avg: 45,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
