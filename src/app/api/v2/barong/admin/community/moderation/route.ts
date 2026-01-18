/**
 * Content Moderation API
 * Production-grade implementation using communityService
 */

import { NextRequest, NextResponse } from 'next/server';
import { communityService, type ModAction } from '@/lib/communityService';

// Type assertion for methods that TypeScript can't infer due to object size
const service = communityService as typeof communityService & {
  getModerationQueue: (
    page?: number,
    limit?: number
  ) => Promise<{ queue: ModAction[]; pending: number; approved: number; rejected: number }>;
  updateModerationQueueItem: (
    id: string,
    status: string,
    reviewedBy: string,
    reviewNote?: string
  ) => Promise<boolean>;
  getSensitiveWords: () => Promise<string[]>;
  addSensitiveWord: (word: string, level: string, category: string) => Promise<boolean>;
  deleteSensitiveWord: (id: number) => Promise<boolean>;
};

// GET - Get moderation data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'logs';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (type === 'logs') {
      const result = await communityService.getModerationLogs(page, limit);
      return NextResponse.json({
        success: true,
        data: {
          logs: result.logs,
          total: result.total,
        },
      });
    }

    if (type === 'queue') {
      // Get moderation queue - content pending review
      const result = await service.getModerationQueue(page, limit);
      return NextResponse.json({
        success: true,
        data: {
          queue: result.queue || [],
          stats: {
            pending: result.pending || 0,
            approved: result.approved || 0,
            rejected: result.rejected || 0,
          },
        },
      });
    }

    if (type === 'words') {
      // Get sensitive words list
      const words = await service.getSensitiveWords();
      return NextResponse.json({
        success: true,
        data: words || [],
      });
    }

    if (type === 'stats') {
      const stats = await service.getFullStats();
      return NextResponse.json({
        success: true,
        data: {
          total_reports: stats?.totalReports || 0,
          pending_reports: stats?.pendingReports || 0,
          total_bans: stats?.totalBans || 0,
          active_bans: stats?.activeBans || 0,
        },
      });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    console.error('Moderation GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create moderation action or add sensitive word
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type } = body;

    if (type === 'word') {
      // Add sensitive word
      const { word, level, category } = body;
      const success = await service.addSensitiveWord(
        word,
        level || 'review',
        category || 'general'
      );
      return NextResponse.json({ success });
    }

    // Default: create moderation log
    const { action, moderator_id, target_type, target_id, reason, details } = body;
    const success = await service.createModerationLog(
      moderator_id,
      action,
      target_type,
      target_id,
      reason,
      details
    );

    return NextResponse.json({ success });
  } catch (error: any) {
    console.error('Moderation POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update moderation queue item
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id, status, reviewed_by, review_note } = body;

    if (type === 'queue') {
      const success = await service.updateModerationQueueItem(id, status, reviewed_by, review_note);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ success: false, message: 'Invalid type' }, { status: 400 });
  } catch (error: any) {
    console.error('Moderation PUT error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete sensitive word
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (type === 'word' && id) {
      const success = await service.deleteSensitiveWord(parseInt(id));
      return NextResponse.json({ success });
    }

    return NextResponse.json({ success: false, message: 'Invalid parameters' }, { status: 400 });
  } catch (error: any) {
    console.error('Moderation DELETE error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
