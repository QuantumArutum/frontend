/**
 * Approve User KYC API
 * POST /api/v2/barong/admin/users/[uid]/kyc/approve
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { uid } = await params;

  try {
    const result = await db.updateUser(uid, { level: 3 });
    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'User verified',
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
