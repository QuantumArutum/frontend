/**
 * Audit Logs API
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const action = searchParams.get('action') || undefined;
  const admin_id = searchParams.get('admin_id') || undefined;

  try {
    const result = await db.getAuditLogs({ page, limit, action, admin_id });
    return NextResponse.json({
      success: true,
      data: {
        logs: result.data?.logs || [],
        total: result.data?.total || 0,
        page,
        per_page: limit,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
