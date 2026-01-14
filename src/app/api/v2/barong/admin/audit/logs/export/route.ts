/**
 * Export Audit Logs API
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const authResult = requireAdmin(request);
  if ('error' in authResult) return authResult.error;

  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'json';

  try {
    const result = await db.getAuditLogs({ page: 1, limit: 10000 });
    const logs = result.data?.logs || [];

    if (format === 'csv') {
      const csv = [
        'ID,Admin ID,Action,Target Type,Target ID,Created At',
        ...logs.map((log: any) => 
          `${log.id},${log.admin_id},${log.action},${log.target_type || ''},${log.target_id || ''},${log.created_at}`
        ),
      ].join('\n');

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=audit_logs.csv',
        },
      });
    }

    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
