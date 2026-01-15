/**
 * Community Rewards & Gamification API
 * Handles points, levels, badges, and achievements
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// Initialize rewards tables
async function ensureRewardsTables() {
  const db = getDb();
  
  // Points configuration
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_points_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL UNIQUE,
      points INTEGER NOT NULL,
      daily_limit INTEGER,
      description TEXT,
      is_active INTEGER DEFAULT 1
    )
  `);

  // Level configuration
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_levels (
      level INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      min_points INTEGER NOT NULL,
      icon TEXT,
      color TEXT,
      perks TEXT
    )
  `);

  // Badges
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      category TEXT DEFAULT 'achievement',
      requirement_type TEXT,
      requirement_value INTEGER,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User badges
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_user_badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      badge_id INTEGER NOT NULL,
      awarded_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, badge_id)
    )
  `);

  // User points history
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_points_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      action TEXT NOT NULL,
      points INTEGER NOT NULL,
      description TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Daily check-in
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_checkin (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      checkin_date TEXT NOT NULL,
      streak INTEGER DEFAULT 1,
      points_earned INTEGER,
      UNIQUE(user_id, checkin_date)
    )
  `);

  // Seed default data
  const existingConfig = db.prepare(`SELECT COUNT(*) as count FROM community_points_config`).get() as any;
  if (existingConfig.count === 0) {
    const defaultConfig = [
      ['post_create', 10, 5, 'Create a new post'],
      ['comment_create', 5, 20, 'Post a comment'],
      ['like_give', 1, 50, 'Like a post or comment'],
      ['like_receive', 2, null, 'Receive a like'],
      ['daily_checkin', 5, 1, 'Daily check-in'],
      ['streak_bonus', 10, 1, 'Consecutive check-in bonus'],
      ['first_post', 50, 1, 'First post bonus'],
      ['verified_user', 100, 1, 'Account verification bonus']
    ];
    const stmt = db.prepare(`INSERT INTO community_points_config (action, points, daily_limit, description) VALUES (?, ?, ?, ?)`);
    defaultConfig.forEach(c => stmt.run(...c));
  }

  const existingLevels = db.prepare(`SELECT COUNT(*) as count FROM community_levels`).get() as any;
  if (existingLevels.count === 0) {
    const defaultLevels = [
      [1, 'Newcomer', 0, '🌱', '#95a5a6', '[]'],
      [2, 'Member', 100, '🌿', '#27ae60', '["can_upload_images"]'],
      [3, 'Active', 500, '🌳', '#2ecc71', '["can_create_polls"]'],
      [4, 'Contributor', 1500, '⭐', '#f1c40f', '["priority_support"]'],
      [5, 'Expert', 5000, '🌟', '#e67e22', '["custom_title"]'],
      [6, 'Master', 15000, '💎', '#9b59b6', '["moderator_candidate"]'],
      [7, 'Legend', 50000, '👑', '#e74c3c', '["vip_access"]']
    ];
    const stmt = db.prepare(`INSERT INTO community_levels (level, name, min_points, icon, color, perks) VALUES (?, ?, ?, ?, ?, ?)`);
    defaultLevels.forEach(l => stmt.run(...l));
  }

  const existingBadges = db.prepare(`SELECT COUNT(*) as count FROM community_badges`).get() as any;
  if (existingBadges.count === 0) {
    const defaultBadges = [
      ['First Post', 'Published your first post', '📝', 'milestone', 'post_count', 1],
      ['Prolific Writer', 'Published 10 posts', '✍️', 'milestone', 'post_count', 10],
      ['Commentator', 'Left 50 comments', '💬', 'milestone', 'comment_count', 50],
      ['Popular', 'Received 100 likes', '❤️', 'social', 'like_received', 100],
      ['Early Adopter', 'Joined in the first month', '🚀', 'special', null, null],
      ['Verified', 'Completed KYC verification', '✅', 'special', null, null],
      ['Streak Master', '30 day check-in streak', '🔥', 'achievement', 'checkin_streak', 30],
      ['Helpful', 'Answers marked as helpful 10 times', '🤝', 'social', 'helpful_count', 10]
    ];
    const stmt = db.prepare(`INSERT INTO community_badges (name, description, icon, category, requirement_type, requirement_value) VALUES (?, ?, ?, ?, ?, ?)`);
    defaultBadges.forEach(b => stmt.run(...b));
  }
}

// GET - Get rewards configuration
export async function GET(request: NextRequest) {
  try {
    await ensureRewardsTables();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    if (type === 'points') {
      const config = db.prepare(`SELECT * FROM community_points_config ORDER BY action`).all();
      return NextResponse.json({ success: true, data: config });
    }

    if (type === 'levels') {
      const levels = db.prepare(`SELECT * FROM community_levels ORDER BY level`).all();
      return NextResponse.json({ success: true, data: levels });
    }

    if (type === 'badges') {
      const badges = db.prepare(`SELECT * FROM community_badges ORDER BY category, name`).all();
      return NextResponse.json({ success: true, data: badges });
    }

    if (type === 'user_badges') {
      const userId = searchParams.get('user_id');
      if (userId) {
        const badges = db.prepare(`
          SELECT b.*, ub.awarded_at 
          FROM community_user_badges ub
          JOIN community_badges b ON ub.badge_id = b.id
          WHERE ub.user_id = ?
          ORDER BY ub.awarded_at DESC
        `).all(userId);
        return NextResponse.json({ success: true, data: badges });
      }
    }

    if (type === 'leaderboard') {
      const period = searchParams.get('period') || 'all';
      let dateFilter = '';
      if (period === 'week') dateFilter = `AND created_at >= datetime('now', '-7 days')`;
      if (period === 'month') dateFilter = `AND created_at >= datetime('now', '-30 days')`;

      const leaderboard = db.prepare(`
        SELECT user_id, SUM(points) as total_points
        FROM community_points_history
        WHERE 1=1 ${dateFilter}
        GROUP BY user_id
        ORDER BY total_points DESC
        LIMIT 50
      `).all();
      return NextResponse.json({ success: true, data: leaderboard });
    }

    // Return all config
    const points = db.prepare(`SELECT * FROM community_points_config ORDER BY action`).all();
    const levels = db.prepare(`SELECT * FROM community_levels ORDER BY level`).all();
    const badges = db.prepare(`SELECT * FROM community_badges ORDER BY category, name`).all();

    return NextResponse.json({ success: true, data: { points, levels, badges } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create or update rewards config
export async function POST(request: NextRequest) {
  try {
    await ensureRewardsTables();
    const db = getDb();
    const body = await request.json();
    const { type } = body;

    if (type === 'points') {
      const { action, points, daily_limit, description, is_active } = body;
      db.prepare(`
        INSERT INTO community_points_config (action, points, daily_limit, description, is_active)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(action) DO UPDATE SET points = ?, daily_limit = ?, description = ?, is_active = ?
      `).run(action, points, daily_limit, description, is_active ? 1 : 0, points, daily_limit, description, is_active ? 1 : 0);
      return NextResponse.json({ success: true });
    }

    if (type === 'level') {
      const { level, name, min_points, icon, color, perks } = body;
      db.prepare(`
        INSERT INTO community_levels (level, name, min_points, icon, color, perks)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(level) DO UPDATE SET name = ?, min_points = ?, icon = ?, color = ?, perks = ?
      `).run(level, name, min_points, icon, color, JSON.stringify(perks || []), name, min_points, icon, color, JSON.stringify(perks || []));
      return NextResponse.json({ success: true });
    }

    if (type === 'badge') {
      const { name, description, icon, category, requirement_type, requirement_value, is_active } = body;
      db.prepare(`
        INSERT INTO community_badges (name, description, icon, category, requirement_type, requirement_value, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(name, description, icon, category, requirement_type, requirement_value, is_active ? 1 : 0);
      return NextResponse.json({ success: true });
    }

    if (type === 'award_badge') {
      const { user_id, badge_id } = body;
      db.prepare(`
        INSERT OR IGNORE INTO community_user_badges (user_id, badge_id) VALUES (?, ?)
      `).run(user_id, badge_id);
      return NextResponse.json({ success: true });
    }

    if (type === 'add_points') {
      const { user_id, action, points, description } = body;
      db.prepare(`
        INSERT INTO community_points_history (user_id, action, points, description) VALUES (?, ?, ?, ?)
      `).run(user_id, action, points, description);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update config
export async function PUT(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { type, id } = body;

    if (type === 'points') {
      const { points, daily_limit, description, is_active } = body;
      db.prepare(`
        UPDATE community_points_config SET points = ?, daily_limit = ?, description = ?, is_active = ? WHERE id = ?
      `).run(points, daily_limit, description, is_active ? 1 : 0, id);
      return NextResponse.json({ success: true });
    }

    if (type === 'badge') {
      const { name, description, icon, category, requirement_type, requirement_value, is_active } = body;
      db.prepare(`
        UPDATE community_badges SET name = ?, description = ?, icon = ?, category = ?, requirement_type = ?, requirement_value = ?, is_active = ? WHERE id = ?
      `).run(name, description, icon, category, requirement_type, requirement_value, is_active ? 1 : 0, id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (type === 'badge' && id) {
      db.prepare(`DELETE FROM community_badges WHERE id = ?`).run(id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
