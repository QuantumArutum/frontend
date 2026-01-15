/**
 * Tags & Topics Management API
 * Handles tags, topics, and post tagging
 */

import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

// Initialize tags tables
async function ensureTagsTables() {
  const db = getDb();
  
  // Tags table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      color TEXT DEFAULT '#1890ff',
      icon TEXT,
      type TEXT DEFAULT 'tag',
      parent_id INTEGER,
      post_count INTEGER DEFAULT 0,
      follower_count INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Post-Tag relationship
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_post_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id TEXT NOT NULL,
      tag_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(post_id, tag_id)
    )
  `);

  // User-Tag follows
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_tag_follows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      tag_id INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, tag_id)
    )
  `);

  // Trending tags cache
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_trending_tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tag_id INTEGER NOT NULL,
      score REAL DEFAULT 0,
      period TEXT DEFAULT 'daily',
      calculated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// GET - List tags/topics
export async function GET(request: NextRequest) {
  try {
    await ensureTagsTables();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type') || 'all'; // all, tag, topic, trending, featured
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const q = searchParams.get('q');
    const offset = (page - 1) * limit;

    if (type === 'trending') {
      const trending = db.prepare(`
        SELECT t.*, tt.score
        FROM community_tags t
        JOIN community_trending_tags tt ON t.id = tt.tag_id
        WHERE tt.period = 'daily' AND t.is_active = 1
        ORDER BY tt.score DESC
        LIMIT 20
      `).all();
      return NextResponse.json({ success: true, data: trending });
    }

    if (type === 'featured') {
      const featured = db.prepare(`
        SELECT * FROM community_tags WHERE is_featured = 1 AND is_active = 1 ORDER BY post_count DESC
      `).all();
      return NextResponse.json({ success: true, data: featured });
    }

    let whereClause = 'is_active = 1';
    const params: any[] = [];

    if (type === 'tag') {
      whereClause += ` AND type = 'tag'`;
    } else if (type === 'topic') {
      whereClause += ` AND type = 'topic'`;
    }

    if (q) {
      whereClause += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${q}%`, `%${q}%`);
    }

    const tags = db.prepare(`
      SELECT * FROM community_tags WHERE ${whereClause} ORDER BY post_count DESC LIMIT ? OFFSET ?
    `).all(...params, limit, offset);

    const total = db.prepare(`SELECT COUNT(*) as count FROM community_tags WHERE ${whereClause}`).get(...params) as any;

    // Stats
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN type = 'tag' THEN 1 ELSE 0 END) as tags,
        SUM(CASE WHEN type = 'topic' THEN 1 ELSE 0 END) as topics,
        SUM(CASE WHEN is_featured = 1 THEN 1 ELSE 0 END) as featured
      FROM community_tags WHERE is_active = 1
    `).get();

    return NextResponse.json({
      success: true,
      data: { tags, stats, page, per_page: limit, total: total.count }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create tag/topic
export async function POST(request: NextRequest) {
  try {
    await ensureTagsTables();
    const db = getDb();
    const body = await request.json();
    const { action } = body;

    if (action === 'create') {
      const { name, slug, description, color, icon, type, parent_id, is_featured } = body;
      const finalSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const result = db.prepare(`
        INSERT INTO community_tags (name, slug, description, color, icon, type, parent_id, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(name, finalSlug, description, color || '#1890ff', icon, type || 'tag', parent_id, is_featured ? 1 : 0);
      
      return NextResponse.json({ success: true, data: { id: result.lastInsertRowid } });
    }

    if (action === 'add_to_post') {
      const { post_id, tag_ids } = body;
      const stmt = db.prepare(`INSERT OR IGNORE INTO community_post_tags (post_id, tag_id) VALUES (?, ?)`);
      for (const tagId of tag_ids) {
        stmt.run(post_id, tagId);
        db.prepare(`UPDATE community_tags SET post_count = post_count + 1 WHERE id = ?`).run(tagId);
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'follow') {
      const { user_id, tag_id } = body;
      db.prepare(`INSERT OR IGNORE INTO community_tag_follows (user_id, tag_id) VALUES (?, ?)`).run(user_id, tag_id);
      db.prepare(`UPDATE community_tags SET follower_count = follower_count + 1 WHERE id = ?`).run(tag_id);
      return NextResponse.json({ success: true });
    }

    if (action === 'unfollow') {
      const { user_id, tag_id } = body;
      const result = db.prepare(`DELETE FROM community_tag_follows WHERE user_id = ? AND tag_id = ?`).run(user_id, tag_id);
      if (result.changes > 0) {
        db.prepare(`UPDATE community_tags SET follower_count = MAX(0, follower_count - 1) WHERE id = ?`).run(tag_id);
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'calculate_trending') {
      // Calculate trending based on recent post activity
      db.prepare(`DELETE FROM community_trending_tags WHERE period = 'daily'`).run();
      const trending = db.prepare(`
        SELECT tag_id, COUNT(*) as score
        FROM community_post_tags pt
        JOIN community_posts p ON pt.post_id = p.id
        WHERE p.created_at >= datetime('now', '-7 days')
        GROUP BY tag_id
        ORDER BY score DESC
        LIMIT 50
      `).all();
      
      const stmt = db.prepare(`INSERT INTO community_trending_tags (tag_id, score, period) VALUES (?, ?, 'daily')`);
      for (const t of trending as any[]) {
        stmt.run(t.tag_id, t.score);
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update tag/topic
export async function PUT(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { id, name, slug, description, color, icon, type, parent_id, is_featured, is_active } = body;

    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (slug !== undefined) { updates.push('slug = ?'); params.push(slug); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (color !== undefined) { updates.push('color = ?'); params.push(color); }
    if (icon !== undefined) { updates.push('icon = ?'); params.push(icon); }
    if (type !== undefined) { updates.push('type = ?'); params.push(type); }
    if (parent_id !== undefined) { updates.push('parent_id = ?'); params.push(parent_id); }
    if (is_featured !== undefined) { updates.push('is_featured = ?'); params.push(is_featured ? 1 : 0); }
    if (is_active !== undefined) { updates.push('is_active = ?'); params.push(is_active ? 1 : 0); }

    updates.push('updated_at = ?');
    params.push(new Date().toISOString());
    params.push(id);

    db.prepare(`UPDATE community_tags SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete tag
export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const postId = searchParams.get('post_id');
    const tagId = searchParams.get('tag_id');

    if (postId && tagId) {
      // Remove tag from post
      db.prepare(`DELETE FROM community_post_tags WHERE post_id = ? AND tag_id = ?`).run(postId, tagId);
      db.prepare(`UPDATE community_tags SET post_count = MAX(0, post_count - 1) WHERE id = ?`).run(tagId);
    } else if (id) {
      // Delete tag entirely
      db.prepare(`DELETE FROM community_post_tags WHERE tag_id = ?`).run(id);
      db.prepare(`DELETE FROM community_tag_follows WHERE tag_id = ?`).run(id);
      db.prepare(`DELETE FROM community_trending_tags WHERE tag_id = ?`).run(id);
      db.prepare(`DELETE FROM community_tags WHERE id = ?`).run(id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
