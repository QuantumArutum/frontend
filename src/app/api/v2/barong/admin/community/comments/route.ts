/**
 * Comments Management API
 * Independent comment management for admin
 */

import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

// GET - List all comments with filters
export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const postId = searchParams.get('post_id');
    const userId = searchParams.get('user_id');
    const status = searchParams.get('status'); // all, reported, hidden
    const q = searchParams.get('q');
    const offset = (page - 1) * limit;

    let whereClause = '1=1';
    const params: any[] = [];

    if (postId) {
      whereClause += ' AND c.post_id = ?';
      params.push(postId);
    }
    if (userId) {
      whereClause += ' AND c.user_id = ?';
      params.push(userId);
    }
    if (status === 'hidden') {
      whereClause += ' AND c.is_hidden = 1';
    }
    if (q) {
      whereClause += ' AND c.content LIKE ?';
      params.push(`%${q}%`);
    }

    const comments = db.prepare(`
      SELECT c.*, 
        p.title as post_title,
        u.email as user_email,
        (SELECT COUNT(*) FROM community_reports WHERE target_type = 'comment' AND target_id = c.id AND status = 'pending') as report_count
      FROM community_comments c
      LEFT JOIN community_posts p ON c.post_id = p.id
      LEFT JOIN users u ON c.user_id = u.uid
      WHERE ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset);

    const total = db.prepare(`SELECT COUNT(*) as count FROM community_comments c WHERE ${whereClause}`).get(...params) as any;

    // Stats
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_hidden = 1 THEN 1 ELSE 0 END) as hidden,
        (SELECT COUNT(*) FROM community_reports WHERE target_type = 'comment' AND status = 'pending') as reported
      FROM community_comments
    `).get();

    return NextResponse.json({
      success: true,
      data: { comments, stats, page, per_page: limit, total: total.count }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update comment (hide/unhide, edit)
export async function PUT(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { id, action, content } = body;

    if (action === 'hide') {
      db.prepare(`UPDATE community_comments SET is_hidden = 1 WHERE id = ?`).run(id);
    } else if (action === 'unhide') {
      db.prepare(`UPDATE community_comments SET is_hidden = 0 WHERE id = ?`).run(id);
    } else if (action === 'edit' && content) {
      db.prepare(`UPDATE community_comments SET content = ?, updated_at = ? WHERE id = ?`).run(content, new Date().toISOString(), id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete comment
export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const batch = searchParams.get('batch'); // comma-separated IDs

    if (batch) {
      const ids = batch.split(',');
      const placeholders = ids.map(() => '?').join(',');
      db.prepare(`DELETE FROM community_comments WHERE id IN (${placeholders})`).run(...ids);
      // Update comment counts
      db.exec(`UPDATE community_posts SET comment_count = (SELECT COUNT(*) FROM community_comments WHERE post_id = community_posts.id)`);
    } else if (id) {
      const comment = db.prepare(`SELECT post_id FROM community_comments WHERE id = ?`).get(id) as any;
      db.prepare(`DELETE FROM community_comments WHERE id = ?`).run(id);
      if (comment) {
        db.prepare(`UPDATE community_posts SET comment_count = comment_count - 1 WHERE id = ?`).run(comment.post_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
