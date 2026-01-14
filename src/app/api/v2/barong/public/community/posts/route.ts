/**
 * Public Community Posts API
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const category = searchParams.get('category') || undefined;

  try {
    const result = await db.getPosts({ page, limit, category });
    return NextResponse.json({
      success: true,
      data: {
        posts: result.data?.posts || [],
        total: result.data?.total || 0,
        page,
        per_page: limit,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
