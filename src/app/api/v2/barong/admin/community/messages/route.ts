/**
 * Private Messages & Conversations API
 * Admin management for user messaging system
 */

import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

// Initialize messages tables
async function ensureMessagesTables() {
  const db = getDb();
  
  // Conversations
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_conversations (
      id TEXT PRIMARY KEY,
      type TEXT DEFAULT 'direct',
      title TEXT,
      participant_ids TEXT NOT NULL,
      last_message_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Messages
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_messages (
      id TEXT PRIMARY KEY,
      conversation_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      content TEXT NOT NULL,
      type TEXT DEFAULT 'text',
      is_read INTEGER DEFAULT 0,
      is_deleted INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Message reports
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_message_reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message_id TEXT NOT NULL,
      reporter_id TEXT NOT NULL,
      reason TEXT,
      status TEXT DEFAULT 'pending',
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Blocked users
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_blocked_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      blocked_user_id TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, blocked_user_id)
    )
  `);
}

// GET - List conversations/messages
export async function GET(request: NextRequest) {
  try {
    await ensureMessagesTables();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type') || 'conversations';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const userId = searchParams.get('user_id');
    const conversationId = searchParams.get('conversation_id');
    const status = searchParams.get('status');
    const offset = (page - 1) * limit;

    if (type === 'conversations') {
      let whereClause = '1=1';
      const params: any[] = [];

      if (userId) {
        whereClause += ` AND participant_ids LIKE ?`;
        params.push(`%${userId}%`);
      }

      const conversations = db.prepare(`
        SELECT c.*, 
          (SELECT COUNT(*) FROM community_messages WHERE conversation_id = c.id AND is_deleted = 0) as message_count,
          (SELECT content FROM community_messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
        FROM community_conversations c
        WHERE ${whereClause}
        ORDER BY c.last_message_at DESC
        LIMIT ? OFFSET ?
      `).all(...params, limit, offset);

      const total = db.prepare(`SELECT COUNT(*) as count FROM community_conversations WHERE ${whereClause}`).get(...params) as any;

      return NextResponse.json({
        success: true,
        data: { conversations, page, per_page: limit, total: total.count }
      });
    }

    if (type === 'messages' && conversationId) {
      const messages = db.prepare(`
        SELECT m.*, u.email as sender_email
        FROM community_messages m
        LEFT JOIN users u ON m.sender_id = u.uid
        WHERE m.conversation_id = ? AND m.is_deleted = 0
        ORDER BY m.created_at DESC
        LIMIT ? OFFSET ?
      `).all(conversationId, limit, offset);

      return NextResponse.json({ success: true, data: { messages } });
    }

    if (type === 'reports') {
      let whereClause = '1=1';
      if (status) {
        whereClause += ` AND mr.status = '${status}'`;
      }

      const reports = db.prepare(`
        SELECT mr.*, m.content as message_content, m.sender_id,
          u1.email as reporter_email, u2.email as sender_email
        FROM community_message_reports mr
        JOIN community_messages m ON mr.message_id = m.id
        LEFT JOIN users u1 ON mr.reporter_id = u1.uid
        LEFT JOIN users u2 ON m.sender_id = u2.uid
        WHERE ${whereClause}
        ORDER BY mr.created_at DESC
        LIMIT ? OFFSET ?
      `).all(limit, offset);

      const stats = db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending
        FROM community_message_reports
      `).get();

      return NextResponse.json({ success: true, data: { reports, stats } });
    }

    if (type === 'stats') {
      const stats = db.prepare(`
        SELECT 
          (SELECT COUNT(*) FROM community_conversations) as total_conversations,
          (SELECT COUNT(*) FROM community_messages WHERE is_deleted = 0) as total_messages,
          (SELECT COUNT(*) FROM community_messages WHERE DATE(created_at) = DATE('now')) as today_messages,
          (SELECT COUNT(*) FROM community_message_reports WHERE status = 'pending') as pending_reports,
          (SELECT COUNT(*) FROM community_blocked_users) as blocked_pairs
      `).get();

      return NextResponse.json({ success: true, data: stats });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}


// POST - Admin actions
export async function POST(request: NextRequest) {
  try {
    await ensureMessagesTables();
    const db = getDb();
    const body = await request.json();
    const { action } = body;

    if (action === 'send_system_message') {
      const { user_ids, content, title } = body;
      const now = new Date().toISOString();
      
      for (const userId of user_ids) {
        const convId = `system_${userId}_${Date.now()}`;
        db.prepare(`
          INSERT INTO community_conversations (id, type, title, participant_ids, last_message_at)
          VALUES (?, 'system', ?, ?, ?)
        `).run(convId, title || 'System Message', JSON.stringify(['system', userId]), now);
        
        const msgId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        db.prepare(`
          INSERT INTO community_messages (id, conversation_id, sender_id, content, type)
          VALUES (?, ?, 'system', ?, 'system')
        `).run(msgId, convId, content);
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'resolve_report') {
      const { report_id, status, action_taken } = body;
      db.prepare(`UPDATE community_message_reports SET status = ? WHERE id = ?`).run(status, report_id);
      
      if (action_taken === 'delete_message') {
        const report = db.prepare(`SELECT message_id FROM community_message_reports WHERE id = ?`).get(report_id) as any;
        if (report) {
          db.prepare(`UPDATE community_messages SET is_deleted = 1 WHERE id = ?`).run(report.message_id);
        }
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'block_user') {
      const { user_id, blocked_user_id } = body;
      db.prepare(`INSERT OR IGNORE INTO community_blocked_users (user_id, blocked_user_id) VALUES (?, ?)`).run(user_id, blocked_user_id);
      return NextResponse.json({ success: true });
    }

    if (action === 'unblock_user') {
      const { user_id, blocked_user_id } = body;
      db.prepare(`DELETE FROM community_blocked_users WHERE user_id = ? AND blocked_user_id = ?`).run(user_id, blocked_user_id);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update message/conversation
export async function PUT(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { type, id } = body;

    if (type === 'message') {
      const { is_deleted } = body;
      if (is_deleted !== undefined) {
        db.prepare(`UPDATE community_messages SET is_deleted = ? WHERE id = ?`).run(is_deleted ? 1 : 0, id);
      }
    }

    if (type === 'conversation') {
      const { title } = body;
      if (title) {
        db.prepare(`UPDATE community_conversations SET title = ? WHERE id = ?`).run(title, id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete message/conversation
export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (type === 'message' && id) {
      db.prepare(`UPDATE community_messages SET is_deleted = 1 WHERE id = ?`).run(id);
    }

    if (type === 'conversation' && id) {
      db.prepare(`UPDATE community_messages SET is_deleted = 1 WHERE conversation_id = ?`).run(id);
      db.prepare(`DELETE FROM community_conversations WHERE id = ?`).run(id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
