/**
 * Public Banners API
 * GET /api/v2/barong/public/cms/banners
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.getBanners(true); // only active
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Get public banners error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
