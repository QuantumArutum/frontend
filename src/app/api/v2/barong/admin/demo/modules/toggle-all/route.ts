/**
 * Toggle All Demo Modules API
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PUT(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  try {
    const { is_active } = await request.json();
    const result = await db.toggleAllDemoModules(is_active);
    return NextResponse.json({ success: true, message: is_active ? 'All modules enabled' : 'All modules disabled' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
