/**
 * Community Tasks & Missions API
 * Production-grade implementation using communityService
 */

import { NextRequest, NextResponse } from 'next/server';
import { communityService } from '@/lib/communityService';

// GET - List tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active =
      searchParams.get('active') === 'true'
        ? true
        : searchParams.get('active') === 'false'
          ? false
          : undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await communityService.getTasks(active, page, limit);

    return NextResponse.json({
      success: true,
      data: {
        tasks: result.tasks,
        total: result.total,
        stats: {
          total: result.total,
          active: result.tasks.filter((t) => t.is_active).length,
          daily: result.tasks.filter((t) => t.task_type === 'daily').length,
          weekly: result.tasks.filter((t) => t.task_type === 'weekly').length,
          once: result.tasks.filter((t) => t.task_type === 'once').length,
        },
      },
    });
  } catch (error: any) {
    console.error('Tasks GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create task or complete task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create') {
      const {
        title,
        description,
        task_type,
        reward_points,
        reward_tokens,
        requirements,
        max_completions,
        is_active,
        start_date,
        end_date,
      } = body;
      const task = await communityService.createTask({
        title,
        description,
        task_type,
        reward_points,
        reward_tokens,
        requirements,
        max_completions,
        is_active,
        start_date,
        end_date,
      });
      return NextResponse.json({ success: true, data: task });
    }

    if (action === 'complete') {
      const { task_id, user_id } = body;
      const success = await communityService.completeTask(task_id, user_id);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Tasks POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update task
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const task = await communityService.updateTask(id, data);
    return NextResponse.json({ success: true, data: task });
  } catch (error: any) {
    console.error('Tasks PUT error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete task
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');

    if (id) {
      const success = await communityService.deleteTask(id);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 });
  } catch (error: any) {
    console.error('Tasks DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
