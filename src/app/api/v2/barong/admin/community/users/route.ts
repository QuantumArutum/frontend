/**
 * Community User Management API
 * Handles user bans, mutes, and community-specific user data
 */

import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

// Initialize community user tables
async function ensureCommunityUserTables() {
  const db = getDb();
  
  // User bans/mutes
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_user_restrictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      user_email TEXT,
      type TEXT NOT NULL CHECK(type IN ('ban', 'mute', 'warning')),
      reason TEXT,
      duration_hours INTEGER,
      expires_at TEXT,
      issued_by TEXT,
      issued_by_email TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User community stats
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_user_stats (
      user_id TEXT PRIMARY KEY,
      post_count INTEGER DEFAULT 0,
      comment_count INTEGER DEFAULT 0,
      like_received INTEGER DEFAULT 0,
      like_given INTEGER DEFAULT 0,
      report_count INTEGER DEFAULT 0,
      warning_count INTEGER DEFAULT 0,
      reputation INTEGER DEFAULT 0,
      last_active TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Moderators
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_moderators (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL UNIQUE,
      user_email TEXT,
      role TEXT DEFAULT 'moderator' CHECK(role IN ('moderator', 'senior_moderator', 'admin')),
      permissions TEXT,
      appointed_by TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// GET - List restricted users or moderators
export async function GET(request: NextRequest) {
  try {
    await ensureCommunityUserTables();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'restrictions';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    if (type === 'moderators') {
      const moderators = db.prepare(`
        SELECT * FROM community_moderators WHERE is_active = 1 ORDER BY role, created_at
      `).all();
      return NextResponse.json({ success: true, data: moderators });
    }

    if (type === 'stats') {
      const userId = searchParams.get('user_id');
      if (userId) {
        const stats = db.prepare(`SELECT * FROM community_user_stats WHERE user_id = ?`).get(userId);
        return NextResponse.json({ success: true, data: stats || {} });
      }
      const topUsers = db.prepare(`
        SELECT * FROM community_user_stats ORDER BY reputation DESC LIMIT 20
      `).all();
      return NextResponse.json({ success: true, data: topUsers });
    }

    // Default: restrictions
    const activeOnly = searchParams.get('active') !== 'false';
    const restrictionType = searchParams.get('restriction_type');

    let whereClause = activeOnly ? 'is_active = 1' : '1=1';
    if (restrictionType) whereClause += ` AND type = '${restrictionType}'`;

    const restrictions = db.prepare(`
      SELECT * FROM community_user_restrictions 
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    const total = db.prepare(`SELECT COUNT(*) as count FROM community_user_restrictions WHERE ${whereClause}`).get() as any;

    const stats = db.prepare(`
      SELECT 
        SUM(CASE WHEN type = 'ban' AND is_active = 1 THEN 1 ELSE 0 END) as active_bans,
        SUM(CASE WHEN type = 'mute' AND is_active = 1 THEN 1 ELSE 0 END) as active_mutes,
        SUM(CASE WHEN type = 'warning' THEN 1 ELSE 0 END) as total_warnings
      FROM community_user_restrictions
    `).get();

    return NextResponse.json({
      success: true,
      data: { restrictions, stats, page, per_page: limit, total: total.count }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create restriction or moderator
export async function POST(request: NextRequest) {
  try {
    await ensureCommunityUserTables();
    const db = getDb();
    const body = await request.json();
    const { type } = body;

    if (type === 'restriction') {
      const { user_id, user_email, restriction_type, reason, duration_hours, issued_by, issued_by_email } = body;
      
      const expires_at = duration_hours 
        ? new Date(Date.now() + duration_hours * 60 * 60 * 1000).toISOString()
        : null;

      db.prepare(`
        INSERT INTO community_user_restrictions (user_id, user_email, type, reason, duration_hours, expires_at, issued_by, issued_by_email)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(user_id, user_email, restriction_type, reason, duration_hours, expires_at, issued_by, issued_by_email);

      // Update warning count if it's a warning
      if (restriction_type === 'warning') {
        db.prepare(`
          INSERT INTO community_user_stats (user_id, warning_count) VALUES (?, 1)
          ON CONFLICT(user_id) DO UPDATE SET warning_count = warning_count + 1
        `).run(user_id);
      }

      return NextResponse.json({ success: true });
    }

    if (type === 'moderator') {
      const { user_id, user_email, role, permissions, appointed_by } = body;
      db.prepare(`
        INSERT OR REPLACE INTO community_moderators (user_id, user_email, role, permissions, appointed_by)
        VALUES (?, ?, ?, ?, ?)
      `).run(user_id, user_email, role || 'moderator', JSON.stringify(permissions || []), appointed_by);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update restriction or moderator
export async function PUT(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { type, id } = body;

    if (type === 'restriction') {
      const { is_active } = body;
      db.prepare(`UPDATE community_user_restrictions SET is_active = ? WHERE id = ?`).run(is_active ? 1 : 0, id);
      return NextResponse.json({ success: true });
    }

    if (type === 'moderator') {
      const { role, permissions, is_active } = body;
      db.prepare(`
        UPDATE community_moderators SET role = ?, permissions = ?, is_active = ? WHERE id = ?
      `).run(role, JSON.stringify(permissions || []), is_active ? 1 : 0, id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Remove moderator
export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'moderator';

    if (type === 'moderator' && id) {
      db.prepare(`DELETE FROM community_moderators WHERE id = ?`).run(id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
