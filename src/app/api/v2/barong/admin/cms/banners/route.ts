/**
 * CMS Banners Management API
 * GET /api/v2/barong/admin/cms/banners
 * POST /api/v2/barong/admin/cms/banners
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  try {
    const result = await db.getBanners();
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Get banners error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  try {
    const body = await request.json();
    const result = await db.createBanner(body);
    return NextResponse.json({ success: true, message: 'Banner created', data: result.data });
  } catch (error) {
    console.error('Create banner error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
