/**
 * Upload KYC Document API
 * POST /api/v2/barong/resource/documents
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const authResult = requireAuth(request);
  if ('error' in authResult) return authResult.error;

  // In demo mode, just acknowledge the upload
  // In production, handle file upload to cloud storage
  return NextResponse.json({
    success: true,
    message: 'Document uploaded (demo mode)',
  });
}
