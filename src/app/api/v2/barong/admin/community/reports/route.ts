/**
 * Community Reports API
 * Production-grade implementation using communityService
 */

import { NextRequest, NextResponse } from 'next/server';
import { communityService } from '@/lib/communityService';

// GET - List reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const result = await communityService.getReports(status, page, limit);

    return NextResponse.json({
      success: true,
      data: {
        reports: result.reports,
        total: result.total,
        page,
        per_page: limit,
        stats: {
          total: result.total,
          pending: result.reports.filter(r => r.status === 'pending').length,
          resolved: result.reports.filter(r => r.status === 'resolved').length,
          rejected: result.reports.filter(r => r.status === 'rejected').length,
        }
      }
    });
  } catch (error: any) {
    console.error('Reports GET error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reporter_id, reported_user_id, target_type, target_id, reason, description } = body;

    const report = await communityService.createReport({
      reporter_id,
      reported_user_id,
      target_type,
      target_id,
      reason,
      description
    });

    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    console.error('Reports POST error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update report status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, admin_notes, handled_by } = body;

    const success = await communityService.updateReportStatus(id, status, admin_notes || '', handled_by);

    return NextResponse.json({ success });
  } catch (error: any) {
    console.error('Reports PUT error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
