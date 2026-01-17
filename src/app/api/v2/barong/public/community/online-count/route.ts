/**
 * Online Members Count API
 * Returns count of currently online members
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

    // 计算最近 15 分钟内活跃的用户数
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    
    const result = await sql`
      SELECT COUNT(DISTINCT user_id) as count
      FROM user_activity_logs
      WHERE created_at > ${fifteenMinutesAgo.toISOString()}
    `;

    const onlineCount = parseInt(result[0]?.count || '0');

    return NextResponse.json({
      success: true,
      data: {
        onlineCount,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching online count:', error);
    // 如果表不存在或查询失败，返回基于会话的估算
    try {
      if (!sql) throw new Error('No SQL');
      const sessions = await sql`
        SELECT COUNT(*) as count
        FROM sessions
        WHERE expires_at > NOW()
      `;
      const onlineCount = parseInt(sessions[0]?.count || '0');
      return NextResponse.json({
        success: true,
        data: {
          onlineCount,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (fallbackError) {
      return NextResponse.json({ 
        success: false, 
        message: 'Internal server error' 
      }, { status: 500 });
    }
  }
}
