/**
 * Follow/Unfollow User API
 * Handles user follow and unfollow actions
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured' 
      }, { status: 500 });
    }

    // 确保表存在
    await sql`
      CREATE TABLE IF NOT EXISTS user_follows (
        id SERIAL PRIMARY KEY,
        follower_id VARCHAR(255) NOT NULL,
        following_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(follower_id, following_id)
      )
    `;

    // 获取当前用户（从 cookie 或 header 中）
    // TODO: 实现真实的认证检查
    // 暂时返回未认证错误，等待实现认证系统
    return NextResponse.json({ 
      success: false, 
      message: 'Authentication required. Please login first.' 
    }, { status: 401 });

    /* 
    // 以下代码等待认证系统实现后启用
    const { userId } = await request.json();

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
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }

    const currentUserId = currentUserResult[0].uid;

    // 不能关注自己
    if (currentUserId === userId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Cannot follow yourself' 
      }, { status: 400 });
    }

    // 检查目标用户是否存在
    const targetUserResult = await sql`
      SELECT uid FROM users WHERE uid = ${userId} AND status = 'active'
    `;

    if (targetUserResult.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Target user not found' 
      }, { status: 404 });
    }

    // 检查是否已经关注
    const existingFollow = await sql`
      SELECT id FROM user_follows 
      WHERE follower_id = ${currentUserId} AND following_id = ${userId}
    `;

    if (existingFollow.length > 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Already following this user' 
      }, { status: 400 });
    }

    // 创建关注关系
    await sql`
      INSERT INTO user_follows (follower_id, following_id)
      VALUES (${currentUserId}, ${userId})
    `;

    // TODO: 创建通知

    return NextResponse.json({
      success: true,
      message: 'Successfully followed user',
    });
    */
  } catch (error) {
    console.error('Error following user:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured' 
      }, { status: 500 });
    }

    // 获取当前用户（从 cookie 或 header 中）
    // TODO: 实现真实的认证检查
    // 暂时返回未认证错误，等待实现认证系统
    return NextResponse.json({ 
      success: false, 
      message: 'Authentication required. Please login first.' 
    }, { status: 401 });

    /*
    // 以下代码等待认证系统实现后启用
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
        success: false, 
        message: 'User not found' 
      }, { status: 404 });
    }

    const currentUserId = currentUserResult[0].uid;

    // 删除关注关系
    const result = await sql`
      DELETE FROM user_follows 
      WHERE follower_id = ${currentUserId} AND following_id = ${userId}
    `;

    if (result.count === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Not following this user' 
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unfollowed user',
    });
    */
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
