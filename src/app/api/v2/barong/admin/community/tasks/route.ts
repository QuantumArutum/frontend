/**
 * Community Tasks & Missions API
 * Handles daily tasks, missions, and task rewards
 */

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// Demo data
const demoTasks = [
  { id: 1, name: '每日签到', description: '完成每日签到', type: 'daily', category: 'checkin', action_type: 'checkin', action_target: 1, reward_type: 'points', reward_amount: 5, icon: '📅', is_active: 1 },
  { id: 2, name: '发布帖子', description: '发布1篇帖子', type: 'daily', category: 'engagement', action_type: 'post_create', action_target: 1, reward_type: 'points', reward_amount: 10, icon: '📝', is_active: 1 },
  { id: 3, name: '发表评论', description: '发表3条评论', type: 'daily', category: 'engagement', action_type: 'comment_create', action_target: 3, reward_type: 'points', reward_amount: 5, icon: '💬', is_active: 1 },
  { id: 4, name: '点赞互动', description: '给5个帖子点赞', type: 'daily', category: 'engagement', action_type: 'like_give', action_target: 5, reward_type: 'points', reward_amount: 3, icon: '❤️', is_active: 1 },
  { id: 5, name: '首次发帖', description: '发布第一篇帖子', type: 'once', category: 'milestone', action_type: 'first_post', action_target: 1, reward_type: 'points', reward_amount: 100, icon: '🎉', is_active: 1 },
];

// GET - List tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';

    let tasks = [...demoTasks];
    if (type !== 'all') tasks = tasks.filter(t => t.type === type);

    return NextResponse.json({
      success: true,
      data: {
        tasks,
        stats: {
          total: demoTasks.length,
          daily: demoTasks.filter(t => t.type === 'daily').length,
          weekly: demoTasks.filter(t => t.type === 'weekly').length,
          once: demoTasks.filter(t => t.type === 'once').length,
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create') {
      const newTask = {
        id: Date.now(),
        ...body,
        is_active: 1,
      };
      return NextResponse.json({ success: true, data: newTask });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update task
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete task
export async function DELETE(request: NextRequest) {
  try {
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
