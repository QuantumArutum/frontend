import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import { PERMISSIONS, hasPermission } from '@/lib/permissions';

export async function POST(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      return NextResponse.json({
        success: false,
        message: 'Database not configured'
      }, { status: 500 });
    }

    const body = await request.json();
    const { postId, categoryId, reason, currentUserId } = body;

    // 验证必填字段
    if (!postId || !categoryId || !currentUserId) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    const sql = neon(databaseUrl);

    // 检查用户权限
    const moderator = await sql`
      SELECT role, permissions FROM moderators WHERE user_id = ${currentUserId}
    `;

    if (moderator.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized: Not a moderator'
      }, { status: 403 });
    }

    const userRole = moderator[0].role;
    const customPermissions = moderator[0].permissions;

    if (!hasPermission(userRole, PERMISSIONS.MOVE_POST, customPermissions)) {
      return NextResponse.json({
        success: false,
        message: 'Unauthorized: No permission to move posts'
      }, { status: 403 });
    }

    // 检查帖子是否存在
    const post = await sql`
      SELECT id, title, category_id FROM posts WHERE id = ${postId}
    `;

    if (post.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Post not found'
      }, { status: 404 });
    }

    const oldCategoryId = post[0].category_id;

    // 检查目标分类是否存在
    const category = await sql`
      SELECT id, name FROM forum_categories WHERE id = ${categoryId}
    `;

    if (category.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Target category not found'
      }, { status: 404 });
    }

    // 移动帖子
    await sql`
      UPDATE posts 
      SET category_id = ${categoryId}
      WHERE id = ${postId}
    `;

    // 记录版主操作
    await sql`
      INSERT INTO mod_actions (
        moderator_id, action_type, target_type, target_id, reason, details
      )
      VALUES (
        ${currentUserId},
        'move_post',
        'post',
        ${postId.toString()},
        ${reason || null},
        ${JSON.stringify({ 
          postTitle: post[0].title,
          oldCategoryId,
          newCategoryId: categoryId,
          newCategoryName: category[0].name
        })}
      )
    `;

    return NextResponse.json({
      success: true,
      message: 'Post moved successfully',
      data: {
        postId,
        oldCategoryId,
        newCategoryId: categoryId,
        newCategoryName: category[0].name
      }
    });

  } catch (error: any) {
    console.error('Move post error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to move post',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
