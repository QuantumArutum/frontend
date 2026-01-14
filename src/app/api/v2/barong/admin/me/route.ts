/**
 * Get Current Admin User API
 * GET /api/v2/barong/admin/me
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { user } = authResult;

  return NextResponse.json({
    success: true,
    data: {
      uid: user.uid,
      email: user.email,
      role: user.role,
      permissions: ['*'],
      created_at: new Date().toISOString(),
    },
  });
}
