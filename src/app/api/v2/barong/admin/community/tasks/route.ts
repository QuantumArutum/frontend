/**
 * Community Tasks & Missions API
 * Handles daily tasks, missions, and task rewards
 */

import { NextRequest, NextResponse } from 'next/server';
import getDb from '@/lib/db';

// Initialize tasks tables
async function ensureTasksTables() {
  const db = getDb();
  
  // Task definitions
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      type TEXT DEFAULT 'daily',
      category TEXT DEFAULT 'engagement',
      action_type TEXT NOT NULL,
      action_target INTEGER DEFAULT 1,
      reward_type TEXT DEFAULT 'points',
      reward_amount INTEGER DEFAULT 10,
      icon TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      start_date TEXT,
      end_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User task progress
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_user_tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      task_id INTEGER NOT NULL,
      progress INTEGER DEFAULT 0,
      is_completed INTEGER DEFAULT 0,
      is_claimed INTEGER DEFAULT 0,
      completed_at TEXT,
      claimed_at TEXT,
      reset_date TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Task completion history
  await db.exec(`
    CREATE TABLE IF NOT EXISTS community_task_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      task_id INTEGER NOT NULL,
      reward_type TEXT,
      reward_amount INTEGER,
      completed_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default tasks
  const existingTasks = db.prepare(`SELECT COUNT(*) as count FROM community_tasks`).get() as any;
  if (existingTasks.count === 0) {
    const defaultTasks = [
      ['每日签到', '完成每日签到', 'daily', 'checkin', 'checkin', 1, 'points', 5, '📅', 1],
      ['发布帖子', '发布1篇帖子', 'daily', 'engagement', 'post_create', 1, 'points', 10, '📝', 2],
      ['发表评论', '发表3条评论', 'daily', 'engagement', 'comment_create', 3, 'points', 5, '💬', 3],
      ['点赞互动', '给5个帖子点赞', 'daily', 'engagement', 'like_give', 5, 'points', 3, '❤️', 4],
      ['浏览帖子', '浏览10篇帖子', 'daily', 'engagement', 'post_view', 10, 'points', 2, '👀', 5],
      ['分享内容', '分享1篇帖子', 'daily', 'social', 'share', 1, 'points', 5, '🔗', 6],
      ['完善资料', '完善个人资料', 'once', 'profile', 'profile_complete', 1, 'points', 50, '👤', 10],
      ['首次发帖', '发布第一篇帖子', 'once', 'milestone', 'first_post', 1, 'points', 100, '🎉', 11],
      ['活跃用户', '连续签到7天', 'weekly', 'streak', 'checkin_streak', 7, 'points', 50, '🔥', 20],
      ['社区达人', '累计发布50篇帖子', 'achievement', 'milestone', 'total_posts', 50, 'badge', 1, '🏆', 30],
    ];
    const stmt = db.prepare(`
      INSERT INTO community_tasks (name, description, type, category, action_type, action_target, reward_type, reward_amount, icon, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    defaultTasks.forEach(t => stmt.run(...t));
  }
}

// GET - List tasks
export async function GET(request: NextRequest) {
  try {
    await ensureTasksTables();
    const db = getDb();
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type') || 'all'; // all, daily, weekly, once, achievement
    const userId = searchParams.get('user_id');
    const category = searchParams.get('category');

    let whereClause = 'is_active = 1';
    const params: any[] = [];

    if (type !== 'all') {
      whereClause += ' AND type = ?';
      params.push(type);
    }
    if (category) {
      whereClause += ' AND category = ?';
      params.push(category);
    }

    const tasks = db.prepare(`
      SELECT * FROM community_tasks WHERE ${whereClause} ORDER BY sort_order, id
    `).all(...params);

    // If user_id provided, get their progress
    let userProgress: any[] = [];
    if (userId) {
      userProgress = db.prepare(`
        SELECT * FROM community_user_tasks WHERE user_id = ?
      `).all(userId) as any[];
    }

    // Stats
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN type = 'daily' THEN 1 ELSE 0 END) as daily,
        SUM(CASE WHEN type = 'weekly' THEN 1 ELSE 0 END) as weekly,
        SUM(CASE WHEN type = 'once' THEN 1 ELSE 0 END) as once,
        SUM(CASE WHEN type = 'achievement' THEN 1 ELSE 0 END) as achievements
      FROM community_tasks WHERE is_active = 1
    `).get();

    // Completion stats
    const completionStats = db.prepare(`
      SELECT 
        COUNT(DISTINCT user_id) as active_users,
        COUNT(*) as total_completions,
        SUM(CASE WHEN DATE(completed_at) = DATE('now') THEN 1 ELSE 0 END) as today_completions
      FROM community_task_history
    `).get();

    return NextResponse.json({
      success: true,
      data: { tasks, userProgress, stats, completionStats }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create task or update progress
export async function POST(request: NextRequest) {
  try {
    await ensureTasksTables();
    const db = getDb();
    const body = await request.json();
    const { action } = body;

    if (action === 'create') {
      const { name, description, type, category, action_type, action_target, reward_type, reward_amount, icon, sort_order, start_date, end_date } = body;
      
      const result = db.prepare(`
        INSERT INTO community_tasks (name, description, type, category, action_type, action_target, reward_type, reward_amount, icon, sort_order, start_date, end_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(name, description, type || 'daily', category || 'engagement', action_type, action_target || 1, reward_type || 'points', reward_amount || 10, icon, sort_order || 0, start_date, end_date);
      
      return NextResponse.json({ success: true, data: { id: result.lastInsertRowid } });
    }

    if (action === 'update_progress') {
      const { user_id, task_id, increment } = body;
      const today = new Date().toISOString().split('T')[0];
      
      // Get task info
      const task = db.prepare(`SELECT * FROM community_tasks WHERE id = ?`).get(task_id) as any;
      if (!task) {
        return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
      }

      // Get or create user task record
      let userTask = db.prepare(`
        SELECT * FROM community_user_tasks WHERE user_id = ? AND task_id = ? AND (reset_date IS NULL OR reset_date = ?)
      `).get(user_id, task_id, today) as any;

      if (!userTask) {
        db.prepare(`
          INSERT INTO community_user_tasks (user_id, task_id, progress, reset_date)
          VALUES (?, ?, 0, ?)
        `).run(user_id, task_id, task.type === 'daily' ? today : null);
        userTask = { progress: 0, is_completed: 0 };
      }

      if (userTask.is_completed) {
        return NextResponse.json({ success: true, message: 'Task already completed' });
      }

      const newProgress = Math.min(userTask.progress + (increment || 1), task.action_target);
      const isCompleted = newProgress >= task.action_target;

      db.prepare(`
        UPDATE community_user_tasks 
        SET progress = ?, is_completed = ?, completed_at = ?
        WHERE user_id = ? AND task_id = ? AND (reset_date IS NULL OR reset_date = ?)
      `).run(newProgress, isCompleted ? 1 : 0, isCompleted ? new Date().toISOString() : null, user_id, task_id, today);

      return NextResponse.json({ 
        success: true, 
        data: { progress: newProgress, target: task.action_target, is_completed: isCompleted }
      });
    }

    if (action === 'claim_reward') {
      const { user_id, task_id } = body;
      
      const userTask = db.prepare(`
        SELECT ut.*, t.reward_type, t.reward_amount, t.name as task_name
        FROM community_user_tasks ut
        JOIN community_tasks t ON ut.task_id = t.id
        WHERE ut.user_id = ? AND ut.task_id = ? AND ut.is_completed = 1 AND ut.is_claimed = 0
      `).get(user_id, task_id) as any;

      if (!userTask) {
        return NextResponse.json({ success: false, message: 'No claimable reward' }, { status: 400 });
      }

      // Mark as claimed
      db.prepare(`
        UPDATE community_user_tasks SET is_claimed = 1, claimed_at = ? WHERE id = ?
      `).run(new Date().toISOString(), userTask.id);

      // Record history
      db.prepare(`
        INSERT INTO community_task_history (user_id, task_id, reward_type, reward_amount)
        VALUES (?, ?, ?, ?)
      `).run(user_id, task_id, userTask.reward_type, userTask.reward_amount);

      // Award points if reward type is points
      if (userTask.reward_type === 'points') {
        db.prepare(`
          INSERT INTO community_points_history (user_id, action, points, description)
          VALUES (?, 'task_complete', ?, ?)
        `).run(user_id, userTask.reward_amount, `完成任务: ${userTask.task_name}`);
      }

      return NextResponse.json({ 
        success: true, 
        data: { reward_type: userTask.reward_type, reward_amount: userTask.reward_amount }
      });
    }

    if (action === 'reset_daily') {
      // Reset daily tasks for all users
      const today = new Date().toISOString().split('T')[0];
      db.prepare(`
        DELETE FROM community_user_tasks 
        WHERE task_id IN (SELECT id FROM community_tasks WHERE type = 'daily')
        AND reset_date < ?
      `).run(today);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update task
export async function PUT(request: NextRequest) {
  try {
    const db = getDb();
    const body = await request.json();
    const { id, name, description, type, category, action_type, action_target, reward_type, reward_amount, icon, sort_order, is_active, start_date, end_date } = body;

    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (description !== undefined) { updates.push('description = ?'); params.push(description); }
    if (type !== undefined) { updates.push('type = ?'); params.push(type); }
    if (category !== undefined) { updates.push('category = ?'); params.push(category); }
    if (action_type !== undefined) { updates.push('action_type = ?'); params.push(action_type); }
    if (action_target !== undefined) { updates.push('action_target = ?'); params.push(action_target); }
    if (reward_type !== undefined) { updates.push('reward_type = ?'); params.push(reward_type); }
    if (reward_amount !== undefined) { updates.push('reward_amount = ?'); params.push(reward_amount); }
    if (icon !== undefined) { updates.push('icon = ?'); params.push(icon); }
    if (sort_order !== undefined) { updates.push('sort_order = ?'); params.push(sort_order); }
    if (is_active !== undefined) { updates.push('is_active = ?'); params.push(is_active ? 1 : 0); }
    if (start_date !== undefined) { updates.push('start_date = ?'); params.push(start_date); }
    if (end_date !== undefined) { updates.push('end_date = ?'); params.push(end_date); }

    params.push(id);
    db.prepare(`UPDATE community_tasks SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete task
export async function DELETE(request: NextRequest) {
  try {
    const db = getDb();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      db.prepare(`DELETE FROM community_user_tasks WHERE task_id = ?`).run(id);
      db.prepare(`DELETE FROM community_task_history WHERE task_id = ?`).run(id);
      db.prepare(`DELETE FROM community_tasks WHERE id = ?`).run(id);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
