/**
 * Community Members Statistics API
 * Returns overall member statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured' 
      }, { status: 500 });
    }

    // 获取统计数据
    const stats = await sql`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE status = 'active') as total_members,
        (SELECT COUNT(DISTINCT user_id) FROM user_activity_logs WHERE created_at > NOW() - INTERVAL '15 minutes') as online_members,
        (SELECT COUNT(*) FROM users WHERE status = 'active' AND created_at > NOW() - INTERVAL '1 day') as new_today,
        (SELECT COUNT(DISTINCT user_id) FROM posts WHERE user_id IN (
          SELECT uid FROM users WHERE status = 'active'
        )) as validators
    `;

    const result = stats[0];

    return NextResponse.json({
      success: true,
      data: {
        totalMembers: parseInt(result.total_members || '0'),
        onlineMembers: parseInt(result.online_members || '0'),
        newToday: parseInt(result.new_today || '0'),
        validators: parseInt(result.validators || '0'),
      },
    });
  } catch (error) {
    console.error('Error fetching member stats:', error);
    // 返回默认值作为后备
    return NextResponse.json({
      success: true,
      data: {
        totalMembers: 0,
        onlineMembers: 0,
        newToday: 0,
        validators: 0,
      },
    });
  }
}
