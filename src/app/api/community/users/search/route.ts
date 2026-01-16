/**
 * User Search API - Search users by email for private messaging
 */

import { NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!query || query.length < 2) {
    return NextResponse.json({ 
      success: false, 
      message: '搜索关键词至少需要2个字符' 
    }, { status: 400 });
  }

  try {
    if (!sql) {
      return NextResponse.json({
        success: true,
        data: { users: [] }
      });
    }

    // 搜索用户（通过邮箱模糊匹配）
    const users = await sql`
      SELECT uid, email, 
             COALESCE(
               CASE WHEN email LIKE '%@%' THEN SPLIT_PART(email, '@', 1) ELSE email END,
               'User'
             ) as name
      FROM users 
      WHERE email ILIKE ${'%' + query + '%'}
      AND state = 'active'
      LIMIT ${limit}
    `;

    return NextResponse.json({
      success: true,
      data: { 
        users: users.map(u => ({
          uid: u.uid,
          email: u.email,
          name: u.name || u.email?.split('@')[0] || 'User'
        }))
      }
    });
  } catch (error: any) {
    console.error('User search error:', error);
    return NextResponse.json({ 
      success: false, 
      message: '搜索用户失败: ' + error.message 
    }, { status: 500 });
  }
}
