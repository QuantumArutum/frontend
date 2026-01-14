/**
 * Upload Avatar API
 * POST /api/v2/barong/resource/users/avatar
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const authResult = requireAuth(request);
  if ('error' in authResult) return authResult.error;

  // In demo mode, just acknowledge the upload
  return NextResponse.json({
    success: true,
    message: 'Avatar uploaded (demo mode)',
    data: {
      avatar_url: '/images/default-avatar.png',
    },
  });
}
