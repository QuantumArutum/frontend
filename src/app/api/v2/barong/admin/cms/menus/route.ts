/**
 * CMS Menus Management API
 * GET /api/v2/barong/admin/cms/menus
 * POST /api/v2/barong/admin/cms/menus
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  try {
    const result = await db.getMenus();
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Get menus error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  try {
    const body = await request.json();
    const result = await db.createMenu(body);
    return NextResponse.json({ success: true, message: 'Menu created', data: result.data });
  } catch (error) {
    console.error('Create menu error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
