/**
 * Delete Account API
 * DELETE /api/v2/barong/resource/users/account
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function DELETE(request: NextRequest) {
  const authResult = requireAuth(request);
  if ('error' in authResult) return authResult.error;

  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'Password is required to delete account' },
        { status: 400 }
      );
    }

    // In demo mode, just acknowledge the request
    // In production, verify password and mark account for deletion

    return NextResponse.json({
      success: true,
      message: 'Account deletion request submitted. Your account will be deleted within 30 days.',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
