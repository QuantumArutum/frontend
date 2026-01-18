/**
 * Follow/Unfollow User API
 * Handles user follow and unfollow actions
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

/**
 * 从请求中获取当前用户 ID
 * 这里使用简化的方案：从请求体中获取 currentUserId
 * 在生产环境中，应该从 JWT token 或 session 中获取
 */
async function getCurrentUserId(request: NextRequest): Promise<string | null> {
  try {
    // 方案1: 从请求体中获取（前端传递）
    const body = await request.json();
    return body.currentUserId || null;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json(
        {
          success: false,
          message: 'Database not configured',
        },
        { status: 500 }
      );
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

    const body = await request.json();
    const { userId, currentUserId } = body;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'userId is required',
        },
        { status: 400 }
      );
    }

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required. Please login first.',
        },
        { status: 401 }
      );
    }

    // 不能关注自己
    if (currentUserId === userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Cannot follow yourself',
        },
        { status: 400 }
      );
    }

    // 检查目标用户是否存在
    const targetUserResult = await sql`
      SELECT uid FROM users WHERE uid = ${userId} AND status = 'active'
    `;

    if (targetUserResult.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Target user not found',
        },
        { status: 404 }
      );
    }

    // 检查是否已经关注
    const existingFollow = await sql`
      SELECT id FROM user_follows 
      WHERE follower_id = ${currentUserId} AND following_id = ${userId}
    `;

    if (existingFollow.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Already following this user',
        },
        { status: 400 }
      );
    }

    // 创建关注关系
    await sql`
      INSERT INTO user_follows (follower_id, following_id)
      VALUES (${currentUserId}, ${userId})
    `;

    // 创建关注通知（异步，不阻塞响应）
    try {
      // 获取关注者的显示名称
      const userResult = await sql`
        SELECT email FROM users WHERE uid = ${currentUserId}
      `;
      const userEmail = userResult[0]?.email || '';
      let displayName = userEmail.split('@')[0];

      try {
        const profileResult = await sql`
          SELECT display_name FROM user_profiles WHERE user_id = ${currentUserId}
        `;
        if (profileResult.length > 0 && profileResult[0].display_name) {
          displayName = profileResult[0].display_name;
        }
      } catch (e) {
        // 使用默认值
      }

      // 获取被关注者的用户名（用于链接）
      const targetUserResult = await sql`
        SELECT email FROM users WHERE uid = ${userId}
      `;
      const targetUserEmail = targetUserResult[0]?.email || '';
      let targetUserName = targetUserEmail.split('@')[0];

      try {
        const targetProfileResult = await sql`
          SELECT display_name FROM user_profiles WHERE user_id = ${userId}
        `;
        if (targetProfileResult.length > 0 && targetProfileResult[0].display_name) {
          targetUserName = targetProfileResult[0].display_name;
        }
      } catch (e) {
        // 使用默认值
      }

      await sql`
        INSERT INTO notifications (
          user_id, type, title, content, link, 
          actor_id, actor_name, is_read, created_at
        ) VALUES (
          ${userId}, 
          'follow', 
          '新关注者', 
          ${`${displayName} 关注了你`}, 
          ${`/community/user/${targetUserName}`},
          ${currentUserId}, 
          ${displayName}, 
          false, 
          NOW()
        )
      `;
    } catch (notificationError) {
      // 通知创建失败不影响主功能
      console.error('Error creating follow notification:', notificationError);
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully followed user',
    });
  } catch (error) {
    console.error('Error following user:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json(
        {
          success: false,
          message: 'Database not configured',
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const currentUserId = searchParams.get('currentUserId');

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: 'userId is required',
        },
        { status: 400 }
      );
    }

    if (!currentUserId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Authentication required. Please login first.',
        },
        { status: 401 }
      );
    }

    // 删除关注关系
    const result = await sql`
      DELETE FROM user_follows 
      WHERE follower_id = ${currentUserId} AND following_id = ${userId}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Not following this user',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unfollowed user',
    });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
