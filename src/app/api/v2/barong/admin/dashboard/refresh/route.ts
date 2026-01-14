/**
 * Refresh Dashboard Stats API
 * POST /api/v2/barong/admin/dashboard/refresh
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  return NextResponse.json({
    success: true,
    message: 'Dashboard stats refreshed',
    timestamp: new Date().toISOString(),
  });
}
