/**
 * Check Follow Status API
 * Checks if current user is following a specific user
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

    // 获取当前用户（从 cookie 或 header 中）
    // TODO: 实现真实的认证检查
    // 暂时返回未关注状态
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'userId is required' 
      }, { status: 400 });
    }

    // 未登录用户默认未关注
    return NextResponse.json({
      success: true,
      data: { isFollowing: false }
    });

    /*
    // 以下代码等待认证系统实现后启用
    // 获取当前用户的 uid
    const currentUserResult = await sql`
      SELECT uid FROM users WHERE email = ${session.user.email} AND status = 'active'
    `;

    if (currentUserResult.length === 0) {
      return NextResponse.json({ 
        success: true,
        data: { isFollowing: false }
      });
    }

    const currentUserId = currentUserResult[0].uid;

    // 检查是否关注
    const followResult = await sql`
      SELECT id FROM user_follows 
      WHERE follower_id = ${currentUserId} AND following_id = ${userId}
    `;

    return NextResponse.json({
      success: true,
      data: {
        isFollowing: followResult.length > 0
      }
    });
    */
  } catch (error) {
    console.error('Error checking follow status:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
