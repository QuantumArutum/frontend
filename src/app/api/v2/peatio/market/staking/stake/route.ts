/**
 * Create Stake API
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  const authResult = requireAuth(request);
  if ('error' in authResult) return authResult.error;

  try {
    const { pool_id, amount } = await request.json();

    if (!pool_id || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Pool ID and valid amount are required' },
        { status: 400 }
      );
    }

    const result = await db.createStake({
      user_id: authResult.user.uid,
      pool_id,
      amount,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Stake created', data: result.data });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
