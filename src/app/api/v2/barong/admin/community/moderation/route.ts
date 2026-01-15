/**
 * Content Moderation API
 * Handles content review queue and sensitive word filtering
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// Initialize moderation tables
async function ensureModerationTables() {
  const db = getDb();
  
  // Sensitive words table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS moderation_sensitive_words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT NOT NULL UNIQUE,
      level TEXT DEFAULT 'warning' CHECK(level IN ('warning', 'block', 'review')),
      category TEXT DEFAULT 'general',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Moderation queue
  await db.exec(`
    CREATE TABLE IF NOT EXISTS moderation_queue (
      id TEXT PRIMARY KEY,
      content_type TEXT NOT NULL CHECK(content_type IN ('post', 'comment')),
      content_id TEXT NOT NULL,
      content_preview TEXT,
      author_id TEXT,
      author_email TEXT,
      reason TEXT,
      matched_words TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      reviewed_by TEXT,
      reviewed_at TEXT,
      review_note TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Moderation log
  await db.exec(`
    CREATE TABLE IF NOT EXISTS moderation_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      target_type TEXT,
      target_id TEXT,
      admin_id TEXT,
      admin_email TEXT,
      details TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// GET - Get moderation queue or sensitive words
export async function GET(request: NextRequest) {
  try {
    await ensureModerationTables();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'queue';

    if (type === 'words') {
      const words = db.prepare(`SELECT * FROM moderation_sensitive_words ORDER BY level, word`).all();
      return NextResponse.json({ success: true, data: words });
    }

    if (type === 'log') {
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '50');
      const offset = (page - 1) * limit;
      
      const logs = db.prepare(`
        SELECT * FROM moderation_log ORDER BY created_at DESC LIMIT ? OFFSET ?
      `).all(limit, offset);
      const total = db.prepare(`SELECT COUNT(*) as count FROM moderation_log`).get() as any;
      
      return NextResponse.json({ success: true, data: { logs, total: total.count, page, per_page: limit } });
    }

    // Default: queue
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || 'pending';
    const offset = (page - 1) * limit;

    const queue = db.prepare(`
      SELECT * FROM moderation_queue 
      WHERE status = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(status, limit, offset);

    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM moderation_queue
    `).get();

    const total = db.prepare(`SELECT COUNT(*) as count FROM moderation_queue WHERE status = ?`).get(status) as any;

    return NextResponse.json({
      success: true,
      data: { queue, stats, page, per_page: limit, total: total.count }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Add sensitive word or queue item
export async function POST(request: NextRequest) {
  try {
    await ensureModerationTables();
    const db = getDb();
    const body = await request.json();
    const { type } = body;

    if (type === 'word') {
      const { word, level, category } = body;
      db.prepare(`
        INSERT OR REPLACE INTO moderation_sensitive_words (word, level, category) VALUES (?, ?, ?)
      `).run(word.toLowerCase().trim(), level || 'warning', category || 'general');
      return NextResponse.json({ success: true });
    }

    if (type === 'queue') {
      const id = `mod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      db.prepare(`
        INSERT INTO moderation_queue (id, content_type, content_id, content_preview, author_id, author_email, reason, matched_words)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, body.content_type, body.content_id, body.content_preview, body.author_id, body.author_email, body.reason, body.matched_words);
      return NextResponse.json({ success: true, data: { id } });
    }

    if (type === 'log') {
      db.prepare(`
        INSERT INTO moderation_log (action, target_type, target_id, admin_id, admin_email, details)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(body.action, body.target_type, body.target_id, body.admin_id, body.admin_email, body.details);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Review queue item or update word
export async function PUT(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { type, id, status, reviewed_by, review_note, level, category } = body;

    if (type === 'queue') {
      db.prepare(`
        UPDATE moderation_queue 
        SET status = ?, reviewed_by = ?, reviewed_at = ?, review_note = ?
        WHERE id = ?
      `).run(status, reviewed_by, new Date().toISOString(), review_note, id);

      // Log the action
      db.prepare(`
        INSERT INTO moderation_log (action, target_type, target_id, admin_id, admin_email, details)
        VALUES (?, 'moderation_queue', ?, ?, ?, ?)
      `).run(`content_${status}`, id, reviewed_by, reviewed_by, review_note);

      return NextResponse.json({ success: true });
    }

    if (type === 'word') {
      db.prepare(`UPDATE moderation_sensitive_words SET level = ?, category = ? WHERE id = ?`).run(level, category, id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Remove sensitive word
export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'word';

    if (type === 'word' && id) {
      db.prepare(`DELETE FROM moderation_sensitive_words WHERE id = ?`).run(id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
