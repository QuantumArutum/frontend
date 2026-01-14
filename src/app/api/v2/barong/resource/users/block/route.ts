/**
 * Block/Unblock User API
 * POST /api/v2/barong/resource/users/block
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

// In-memory blocked users storage
const blockedUsers = new Map<string, Set<string>>();

export async function POST(request: NextRequest) {
  const authResult = requireAuth(request);
  if ('error' in authResult) return authResult.error;

  const { user } = authResult;
  const { target_uid, action } = await request.json();

  if (!target_uid) {
    return NextResponse.json({ success: false, message: 'Target user ID required' }, { status: 400 });
  }

  if (!blockedUsers.has(user.uid)) {
    blockedUsers.set(user.uid, new Set());
  }

  const userBlocked = blockedUsers.get(user.uid)!;

  if (action === 'unblock') {
    userBlocked.delete(target_uid);
    return NextResponse.json({ success: true, message: 'User unblocked' });
  } else {
    userBlocked.add(target_uid);
    return NextResponse.json({ success: true, message: 'User blocked' });
  }
}
