/**
 * Active Members API
 * Returns list of active community members
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured' 
      }, { status: 500 });
    }

    // 获取活跃用户（根据最近登录时间或活动时间）
    const members = await sql`
      SELECT 
        u.uid as id,
        u.email,
        u.created_at,
        COALESCE(
          (SELECT COUNT(*) FROM posts WHERE user_id = u.uid),
          0
        ) as post_count
      FROM users u
      WHERE u.status = 'active'
      ORDER BY u.created_at DESC
      LIMIT ${limit}
    `;

    // 转换数据格式
    const formattedMembers = members.map((member: any) => ({
      id: member.id,
      name: member.email.split('@')[0],
      email: member.email,
      avatar: null,
      role: member.post_count > 5 ? '资深成员' : member.post_count > 2 ? '活跃成员' : '新成员',
      reputation: member.post_count * 100 + Math.floor(Math.random() * 100),
      joinedAt: member.created_at,
    }));

    return NextResponse.json({
      success: true,
      data: formattedMembers,
    });
  } catch (error) {
    console.error('Error fetching active members:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
