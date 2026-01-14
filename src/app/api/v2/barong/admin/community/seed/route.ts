/**
 * Seed Community Data API
 * POST /api/v2/barong/admin/community/seed
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  // In demo mode, data is already seeded
  return NextResponse.json({
    success: true,
    message: 'Seeded sample posts (demo mode)',
  });
}
