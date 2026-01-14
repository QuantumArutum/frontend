/**
 * Public Launch Status API
 */

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const result = await db.getLaunchConfig();
    const data = result.data || {
      pre_launch_enabled: false,
      maintenance_mode: false,
      countdown_message: '',
      maintenance_message: '',
    };
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
