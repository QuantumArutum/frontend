/**
 * User Management API
 * GET /api/v2/barong/admin/users - List users
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const search = searchParams.get('q') || searchParams.get('search') || undefined;
  const state = searchParams.get('state') || undefined;

  try {
    const result = await db.getUsers({ page, limit, search, state });

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 500 });
    }

    const { users, total } = result.data!;

    // Map to expected format
    const mappedUsers = users.map((u: any) => ({
      uid: u.id,
      email: u.email,
      role: u.role,
      level: u.level || 1,
      otp: u.totp_enabled || false,
      state: u.is_active ? 'active' : 'banned',
      created_at: u.created_at,
      updated_at: u.updated_at,
      last_login: u.last_login_at,
      post_count: u.post_count || 0,
      comment_count: u.comment_count || 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        users: mappedUsers,
        total,
        page,
        per_page: limit,
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
