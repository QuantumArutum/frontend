/**
 * ICO Settings Management API
 * GET /api/v2/barong/admin/ico/settings - Get settings
 * POST /api/v2/barong/admin/ico/settings - Update settings
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  try {
    const result = await db.getIcoSettings();

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('Get ICO settings error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  try {
    const settings = await request.json();

    const result = await db.updateIcoSettings(settings);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Settings updated',
    });
  } catch (error) {
    console.error('Update ICO settings error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
