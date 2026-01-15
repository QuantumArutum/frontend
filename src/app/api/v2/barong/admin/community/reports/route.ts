/**
 * Community Reports Management API
 * Handles user reports for posts and comments
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// Initialize reports table
async function ensureReportsTable() {
  const db = getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_reports (
      id TEXT PRIMARY KEY,
      reporter_id TEXT NOT NULL,
      reporter_email TEXT,
      target_type TEXT NOT NULL CHECK(target_type IN ('post', 'comment', 'user')),
      target_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'reviewing', 'resolved', 'dismissed')),
      resolved_by TEXT,
      resolved_at TEXT,
      resolution_note TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// GET - List reports
export async function GET(request: NextRequest) {
  try {
    await ensureReportsTable();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const targetType = searchParams.get('target_type');
    const offset = (page - 1) * limit;

    let whereClause = '1=1';
    if (status) whereClause += ` AND status = '${status}'`;
    if (targetType) whereClause += ` AND target_type = '${targetType}'`;

    const reports = db.prepare(`
      SELECT r.*, 
        CASE 
          WHEN r.target_type = 'post' THEN (SELECT title FROM community_posts WHERE id = r.target_id)
          WHEN r.target_type = 'comment' THEN (SELECT SUBSTR(content, 1, 50) FROM community_comments WHERE id = r.target_id)
          ELSE NULL
        END as target_preview
      FROM community_reports r
      WHERE ${whereClause}
      ORDER BY 
        CASE status WHEN 'pending' THEN 0 WHEN 'reviewing' THEN 1 ELSE 2 END,
        created_at DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    const total = db.prepare(`SELECT COUNT(*) as count FROM community_reports WHERE ${whereClause}`).get() as any;

    // Stats
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'reviewing' THEN 1 ELSE 0 END) as reviewing,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'dismissed' THEN 1 ELSE 0 END) as dismissed
      FROM community_reports
    `).get();

    return NextResponse.json({
      success: true,
      data: {
        reports,
        stats,
        page,
        per_page: limit,
        total: total.count
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create report (usually from user side, but admin can also create)
export async function POST(request: NextRequest) {
  try {
    await ensureReportsTable();
    const db = getDb();
    const body = await request.json();
    
    const id = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    db.prepare(`
      INSERT INTO community_reports (id, reporter_id, reporter_email, target_type, target_id, reason, description)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(id, body.reporter_id, body.reporter_email, body.target_type, body.target_id, body.reason, body.description || null);

    return NextResponse.json({ success: true, data: { id } });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update report status
export async function PUT(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { id, status, resolved_by, resolution_note } = body;

    const resolved_at = ['resolved', 'dismissed'].includes(status) ? new Date().toISOString() : null;

    db.prepare(`
      UPDATE community_reports 
      SET status = ?, resolved_by = ?, resolved_at = ?, resolution_note = ?
      WHERE id = ?
    `).run(status, resolved_by, resolved_at, resolution_note, id);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
