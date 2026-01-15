/**
 * Community Reports API
 * Handles user reports for posts, comments, and users
 */

import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// Demo data
const demoReports: any[] = [];

// GET - List reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const targetType = searchParams.get('target_type');

    let reports = [...demoReports];
    if (status) reports = reports.filter(r => r.status === status);
    if (targetType) reports = reports.filter(r => r.target_type === targetType);

    return NextResponse.json({
      success: true,
      data: {
        reports,
        stats: {
          total: reports.length,
          pending: reports.filter(r => r.status === 'pending').length,
          resolved: reports.filter(r => r.status === 'resolved').length,
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST - Create report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newReport = {
      id: 'rpt_' + Date.now(),
      ...body,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    return NextResponse.json({ success: true, data: newReport });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT - Update report status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE - Delete report
export async function DELETE(request: NextRequest) {
  try {
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
