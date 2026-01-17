/**
 * Delete Post API
 * Soft delete a post
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function DELETE(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({ 
        success: false, 
        message: 'Database not configured' 
      }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const currentUserId = searchParams.get('currentUserId');
    const deleteReason = searchParams.get('deleteReason');

    // 验证参数
    if (!postId || !currentUserId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Post ID and user ID are required' 
      }, { status: 400 });
    }

    // 验证帖子存在且属于当前用户
    const postCheck = await sql`
      SELECT id, user_id FROM posts 
      WHERE id = ${postId} AND status != 'deleted'
    `;

    if (postCheck.length === 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Post not found' 
      }, { status: 404 });
    }

    if (postCheck[0].user_id !== currentUserId) {
      return NextResponse.json({ 
        success: false, 
        message: 'You can only delete your own posts' 
      }, { status: 403 });
    }

    // 确保必要字段存在
    try {
      await sql`
        ALTER TABLE posts ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP
      `;
      await sql`
        ALTER TABLE posts ADD COLUMN IF NOT EXISTS delete_reason TEXT
      `;
    } catch (e) {
      console.error('Error adding delete columns:', e);
    }

    // 软删除帖子
    await sql`
      UPDATE posts 
      SET 
        status = 'deleted',
        deleted_at = NOW(),
        delete_reason = ${deleteReason || null}
      WHERE id = ${postId}
    `;

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
