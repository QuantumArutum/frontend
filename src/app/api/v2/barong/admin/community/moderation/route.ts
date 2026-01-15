/**
 * Content Moderation API
 * Production-grade implementation using communityService
 */

import { NextRequest, NextResponse } from 'next/server';
import { communityService } from '@/lib/communityService';

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
        }
      });
    }

    if (type === 'stats') {
      const stats = await communityService.getFullStats();
      return NextResponse.json({
        success: true,
        data: {
          total_reports: stats?.totalReports || 0,
          pending_reports: stats?.pendingReports || 0,
          total_bans: stats?.totalBans || 0,
          active_bans: stats?.activeBans || 0,
        }
      });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error: any) {
    console.error('Moderation GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create moderation action
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, moderator_id, target_type, target_id, reason, details } = body;

    const success = await communityService.createModerationLog(
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
