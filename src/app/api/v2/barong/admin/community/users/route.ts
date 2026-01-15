/**
 * Community Users Management API
 * Handles user restrictions, moderators, and community roles
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Demo data
const demoRestrictions: any[] = [];
const demoModerators: any[] = [];

// GET - Get user management data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'restrictions';

    if (type === 'restrictions') {
      return NextResponse.json({
        success: true,
        data: {
          restrictions: demoRestrictions,
          stats: {
            active_bans: demoRestrictions.filter(r => r.type === 'ban' && r.is_active).length,
            active_mutes: demoRestrictions.filter(r => r.type === 'mute' && r.is_active).length,
          }
        }
      });
    }

    if (type === 'moderators') {
      return NextResponse.json({
        success: true,
        data: { moderators: demoModerators }
      });
    }

    if (type === 'stats') {
      const usersResult = await db.getUsers({ page: 1, limit: 1000 });
      return NextResponse.json({
        success: true,
        data: {
          total_users: usersResult.data?.total || 0,
          active_users: usersResult.data?.users?.filter((u: any) => u.is_active).length || 0,
          banned_users: demoRestrictions.filter(r => r.type === 'ban' && r.is_active).length,
        }
      });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create restriction or add moderator
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === 'restriction') {
      const newRestriction = {
        id: Date.now(),
        ...body,
        is_active: 1,
        created_at: new Date().toISOString()
      };
      return NextResponse.json({ success: true, data: newRestriction });
    }

    if (type === 'moderator') {
      const newMod = { id: Date.now(), ...body, created_at: new Date().toISOString() };
      return NextResponse.json({ success: true, data: newMod });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update restriction or moderator
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Remove restriction or moderator
export async function DELETE(request: NextRequest) {
  try {
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
