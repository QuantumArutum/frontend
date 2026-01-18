/**
 * Single User Management API
 * GET /api/v2/barong/admin/users/[uid] - Get user details
 * PUT /api/v2/barong/admin/users/[uid] - Update user
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { uid } = await params;

  try {
    const result = await db.getUserById(uid);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 404 });
    }

    const user = result.data;

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        uid: user.id || user.uid,
        email: user.email,
        role: user.role || 'user',
        level: user.level || 1,
        otp: user.totp_enabled || false,
        state: user.is_active ? 'active' : 'banned',
        created_at: user.created_at || user.createdAt,
        updated_at: user.updated_at || user.updatedAt,
        last_login: user.last_login_at,
        activity: {
          post_count: user.post_count || 0,
          comment_count: user.comment_count || 0,
          stake_count: user.stake_count || 0,
        },
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ uid: string }> }) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { uid } = await params;
  const body = await request.json();
  const { state, level, note } = body;

  try {
    const updates: any = {};

    if (state !== undefined) {
      updates.is_active = state === 'active';
    }
    if (level !== undefined) {
      updates.level = level;
    }

    const result = await db.updateUser(uid, updates);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.error }, { status: 404 });
    }

    // Log admin action
    await db.logAdminAction(
      state === 'banned' ? 'ban_user' : 'update_user',
      'user',
      uid,
      null,
      { state, level, note },
      authResult.user.uid
    );

    const user = result.data;

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: state === 'banned' ? 'User banned successfully' : 'User updated successfully',
      data: {
        uid: user.id || user.uid,
        email: user.email,
        role: user.role || 'user',
        level: user.level || 1,
        state: user.is_active ? 'active' : 'banned',
        updated_at: user.updated_at || user.updatedAt,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
