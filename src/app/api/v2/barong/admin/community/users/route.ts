/**
 * Community Users Management API
 * Production-grade implementation using communityService
 */

import { NextRequest, NextResponse } from 'next/server';
import { communityService } from '@/lib/communityService';

// GET - Get user management data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'users';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;

    if (type === 'users') {
      const result = await communityService.getCommunityUsers({ page, limit, search, status });
      return NextResponse.json({
        success: true,
        data: {
          users: result.users,
          total: result.total,
          page,
          per_page: limit,
        },
      });
    }

    if (type === 'bans' || type === 'restrictions') {
      const active =
        searchParams.get('active') === 'true'
          ? true
          : searchParams.get('active') === 'false'
            ? false
            : undefined;
      const result = await communityService.getBans(active, page, limit);
      return NextResponse.json({
        success: true,
        data: {
          bans: result.bans,
          total: result.total,
          stats: {
            active_bans: result.bans.filter((b) => b.is_active).length,
          },
        },
      });
    }

    if (type === 'reputations') {
      const result = await communityService.getUserReputations(page, limit);
      return NextResponse.json({
        success: true,
        data: {
          users: result.users,
          total: result.total,
        },
      });
    }

    if (type === 'stats') {
      const stats = await communityService.getFullStats();
      return NextResponse.json({
        success: true,
        data: {
          total_users: stats?.totalUsers || 0,
          active_today: stats?.activeToday || 0,
          total_bans: stats?.totalBans || 0,
          active_bans: stats?.activeBans || 0,
        },
      });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    console.error('Users GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create ban or update reputation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, action } = body;

    if (type === 'ban' || action === 'ban') {
      const { user_id, banned_by, reason, ban_type, expires_at } = body;
      const ban = await communityService.createBan(
        user_id,
        banned_by,
        reason,
        ban_type,
        expires_at
      );
      return NextResponse.json({ success: true, data: ban });
    }

    if (type === 'reputation' || action === 'update_reputation') {
      const { user_id, points, reason } = body;
      const success = await communityService.updateUserReputation(user_id, points, reason);
      return NextResponse.json({ success });
    }

    if (type === 'badge' || action === 'award_badge') {
      const { user_id, badge_type, badge_name, badge_icon, description } = body;
      const badge = await communityService.awardBadge(
        user_id,
        badge_type,
        badge_name,
        badge_icon,
        description
      );
      return NextResponse.json({ success: true, data: badge });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    console.error('Users POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Revoke ban
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, id } = body;

    if (action === 'revoke_ban') {
      const success = await communityService.revokeBan(id);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Users PUT error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
