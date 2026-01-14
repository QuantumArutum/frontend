/**
 * User KYC Documents API
 * GET /api/v2/barong/admin/users/[uid]/documents
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { uid } = await params;

  // Demo mode - return empty documents
  return NextResponse.json({
    success: true,
    data: [],
  });
}
