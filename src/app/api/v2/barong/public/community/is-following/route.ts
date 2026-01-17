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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const currentUserId = searchParams.get('currentUserId');

    if (!userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'userId is required' 
      }, { status: 400 });
    }

    // 如果没有登录，返回 false
    if (!currentUserId) {
      return NextResponse.json({
        success: true,
        data: { isFollowing: false }
      });
    }

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
      success: true, 
      data: { isFollowing: false }
    });
  }
}
