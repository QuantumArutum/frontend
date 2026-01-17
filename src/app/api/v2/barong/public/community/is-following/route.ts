/**
 * Check Follow Status API
 * Checks if current user is following a specific user
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured' 
      }, { status: 500 });
    }

    // 获取当前用户 session
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ 
        success: true,
        data: { isFollowing: false }
      });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'userId is required' 
      }, { status: 400 });
    }

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
  } catch (error) {
    console.error('Error checking follow status:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
