/**
 * Community Activities & Events API
 * Handles events, polls, AMAs, and campaigns
 */

import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

// Initialize activities tables
async function ensureActivitiesTables() {
  const db = getDb();
  
  // Events/Activities
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT NOT NULL CHECK(type IN ('event', 'ama', 'campaign', 'contest', 'airdrop')),
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft', 'scheduled', 'active', 'ended', 'cancelled')),
      start_time TEXT,
      end_time TEXT,
      banner_url TEXT,
      rules TEXT,
      rewards TEXT,
      participant_count INTEGER DEFAULT 0,
      max_participants INTEGER,
      created_by TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Event participants
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_event_participants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      user_email TEXT,
      status TEXT DEFAULT 'registered',
      score INTEGER DEFAULT 0,
      rank INTEGER,
      reward_claimed INTEGER DEFAULT 0,
      joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(event_id, user_id)
    )
  `);

  // Polls
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_polls (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      options TEXT NOT NULL,
      status TEXT DEFAULT 'active' CHECK(status IN ('draft', 'active', 'ended')),
      allow_multiple INTEGER DEFAULT 0,
      end_time TEXT,
      total_votes INTEGER DEFAULT 0,
      created_by TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Poll votes
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_poll_votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      option_index INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(poll_id, user_id, option_index)
    )
  `);

  // Announcements
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT DEFAULT 'info' CHECK(type IN ('info', 'warning', 'success', 'urgent')),
      is_pinned INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      start_time TEXT,
      end_time TEXT,
      target_audience TEXT DEFAULT 'all',
      view_count INTEGER DEFAULT 0,
      created_by TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// GET
export async function GET(request: NextRequest) {
  try {
    await ensureActivitiesTables();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'events';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    if (type === 'events') {
      const status = searchParams.get('status');
      const eventType = searchParams.get('event_type');
      
      let whereClause = '1=1';
      if (status) whereClause += ` AND status = '${status}'`;
      if (eventType) whereClause += ` AND type = '${eventType}'`;

      const events = db.prepare(`
        SELECT * FROM community_events WHERE ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?
      `).all(limit, offset);
      const total = db.prepare(`SELECT COUNT(*) as count FROM community_events WHERE ${whereClause}`).get() as any;

      return NextResponse.json({ success: true, data: { events, total: total.count, page, per_page: limit } });
    }

    if (type === 'event_participants') {
      const eventId = searchParams.get('event_id');
      if (!eventId) return NextResponse.json({ success: false, message: 'event_id required' }, { status: 400 });
      
      const participants = db.prepare(`
        SELECT * FROM community_event_participants WHERE event_id = ? ORDER BY score DESC, joined_at
      `).all(eventId);
      return NextResponse.json({ success: true, data: participants });
    }

    if (type === 'polls') {
      const polls = db.prepare(`
        SELECT * FROM community_polls ORDER BY created_at DESC LIMIT ? OFFSET ?
      `).all(limit, offset);
      const total = db.prepare(`SELECT COUNT(*) as count FROM community_polls`).get() as any;
      return NextResponse.json({ success: true, data: { polls, total: total.count, page, per_page: limit } });
    }

    if (type === 'poll_results') {
      const pollId = searchParams.get('poll_id');
      if (!pollId) return NextResponse.json({ success: false, message: 'poll_id required' }, { status: 400 });
      
      const poll = db.prepare(`SELECT * FROM community_polls WHERE id = ?`).get(pollId);
      const votes = db.prepare(`
        SELECT option_index, COUNT(*) as count FROM community_poll_votes WHERE poll_id = ? GROUP BY option_index
      `).all(pollId);
      return NextResponse.json({ success: true, data: { poll, votes } });
    }

    if (type === 'announcements') {
      const activeOnly = searchParams.get('active') !== 'false';
      const whereClause = activeOnly ? 'is_active = 1' : '1=1';
      
      const announcements = db.prepare(`
        SELECT * FROM community_announcements WHERE ${whereClause} ORDER BY is_pinned DESC, created_at DESC LIMIT ? OFFSET ?
      `).all(limit, offset);
      const total = db.prepare(`SELECT COUNT(*) as count FROM community_announcements WHERE ${whereClause}`).get() as any;
      return NextResponse.json({ success: true, data: { announcements, total: total.count, page, per_page: limit } });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST
export async function POST(request: NextRequest) {
  try {
    await ensureActivitiesTables();
    const db = getDb();
    const body = await request.json();
    const { type } = body;

    if (type === 'event') {
      const id = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const { title, description, event_type, status, start_time, end_time, banner_url, rules, rewards, max_participants, created_by } = body;
      
      db.prepare(`
        INSERT INTO community_events (id, title, description, type, status, start_time, end_time, banner_url, rules, rewards, max_participants, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, title, description, event_type, status || 'draft', start_time, end_time, banner_url, rules, JSON.stringify(rewards || []), max_participants, created_by);
      
      return NextResponse.json({ success: true, data: { id } });
    }

    if (type === 'poll') {
      const id = `poll_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const { title, description, options, allow_multiple, end_time, created_by } = body;
      
      db.prepare(`
        INSERT INTO community_polls (id, title, description, options, allow_multiple, end_time, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(id, title, description, JSON.stringify(options), allow_multiple ? 1 : 0, end_time, created_by);
      
      return NextResponse.json({ success: true, data: { id } });
    }

    if (type === 'announcement') {
      const { title, content, announcement_type, is_pinned, start_time, end_time, target_audience, created_by } = body;
      
      db.prepare(`
        INSERT INTO community_announcements (title, content, type, is_pinned, start_time, end_time, target_audience, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(title, content, announcement_type || 'info', is_pinned ? 1 : 0, start_time, end_time, target_audience || 'all', created_by);
      
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT
export async function PUT(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { type, id } = body;

    if (type === 'event') {
      const { title, description, event_type, status, start_time, end_time, banner_url, rules, rewards, max_participants } = body;
      db.prepare(`
        UPDATE community_events 
        SET title = ?, description = ?, type = ?, status = ?, start_time = ?, end_time = ?, banner_url = ?, rules = ?, rewards = ?, max_participants = ?, updated_at = ?
        WHERE id = ?
      `).run(title, description, event_type, status, start_time, end_time, banner_url, rules, JSON.stringify(rewards || []), max_participants, new Date().toISOString(), id);
      return NextResponse.json({ success: true });
    }

    if (type === 'poll') {
      const { status } = body;
      db.prepare(`UPDATE community_polls SET status = ? WHERE id = ?`).run(status, id);
      return NextResponse.json({ success: true });
    }

    if (type === 'announcement') {
      const { title, content, announcement_type, is_pinned, is_active, start_time, end_time, target_audience } = body;
      db.prepare(`
        UPDATE community_announcements 
        SET title = ?, content = ?, type = ?, is_pinned = ?, is_active = ?, start_time = ?, end_time = ?, target_audience = ?
        WHERE id = ?
      `).run(title, content, announcement_type, is_pinned ? 1 : 0, is_active ? 1 : 0, start_time, end_time, target_audience, id);
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

    if (type === 'event' && id) {
      db.prepare(`DELETE FROM community_events WHERE id = ?`).run(id);
      db.prepare(`DELETE FROM community_event_participants WHERE event_id = ?`).run(id);
    }
    if (type === 'poll' && id) {
      db.prepare(`DELETE FROM community_polls WHERE id = ?`).run(id);
      db.prepare(`DELETE FROM community_poll_votes WHERE poll_id = ?`).run(id);
    }
    if (type === 'announcement' && id) {
      db.prepare(`DELETE FROM community_announcements WHERE id = ?`).run(id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
