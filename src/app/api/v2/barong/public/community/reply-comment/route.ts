import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function POST(request: NextRequest) {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      console.error('Database URL not configured');
      return NextResponse.json({
        success: false,
        message: 'Database not configured'
      }, { status: 500 });
    }

    const body = await request.json();
    console.log('Reply comment request:', { 
      postId: body.postId, 
      parentId: body.parentId, 
      currentUserId: body.currentUserId,
      contentLength: body.content?.length 
    });

    const { postId, parentId, replyToUserId, replyToUserName, content, currentUserId, currentUserName, mentions } = body;

    // 验证必填字段
    if (!postId || !parentId || !content || !currentUserId) {
      console.error('Missing required fields:', { postId, parentId, content: !!content, currentUserId });
      return NextResponse.json({
        success: false,
        message: 'Missing required fields',
        details: { postId: !!postId, parentId: !!parentId, content: !!content, currentUserId: !!currentUserId }
      }, { status: 400 });
    }

    // 验证内容长度
    if (content.length < 1 || content.length > 1000) {
      console.error('Invalid content length:', content.length);
      return NextResponse.json({
        success: false,
        message: 'Content must be between 1 and 1000 characters'
      }, { status: 400 });
    }

    const sql = neon(databaseUrl);

    // 获取父评论的深度（使用COALESCE处理NULL值）
    console.log('Fetching parent comment:', parentId);
    const parentComment = await sql`
      SELECT COALESCE(depth, 0) as depth FROM post_comments WHERE id = ${parentId}
    `;

    if (parentComment.length === 0) {
      console.error('Parent comment not found:', parentId);
      return NextResponse.json({
        success: false,
        message: 'Parent comment not found'
      }, { status: 404 });
    }

    const parentDepth = parentComment[0].depth || 0;
    const newDepth = Math.min(parentDepth + 1, 3); // 最多3层
    console.log('Comment depth:', { parentDepth, newDepth });

    // 插入回复评论
    console.log('Inserting reply comment:', {
      postId,
      currentUserId,
      currentUserName,
      parentId,
      replyToUserId,
      replyToUserName,
      newDepth
    });

    let commentId: number;
    let createdAt: string;

    try {
      const result = await sql`
        INSERT INTO post_comments (
          post_id, user_id, user_name, content, 
          parent_id, reply_to_user_id, reply_to_user_name, depth,
          created_at, status
        )
        VALUES (
          ${postId}, ${currentUserId}, ${currentUserName || currentUserId}, ${content},
          ${parentId}, ${replyToUserId || null}, ${replyToUserName || null}, ${newDepth},
          NOW(), 'active'
        )
        RETURNING id, created_at
      `;

      commentId = result[0].id;
      createdAt = result[0].created_at;
      console.log('Reply comment created:', commentId);

      // 更新帖子评论数
      await sql`
        UPDATE posts 
        SET comment_count = comment_count + 1 
        WHERE id = ${postId}
      `;
      console.log('Post comment count updated');
    } catch (insertError: any) {
      console.error('Database insert error:', {
        message: insertError.message,
        code: insertError.code,
        detail: insertError.detail,
        hint: insertError.hint,
        position: insertError.position
      });
      throw insertError;
    }

    // 保存 @提及
    if (mentions && mentions.length > 0) {
      for (const mention of mentions) {
        await sql`
          INSERT INTO comment_mentions (comment_id, mentioned_user_id, mentioned_user_name)
          VALUES (${commentId}, ${mention.userId}, ${mention.userName})
        `;

        // 创建 @提及通知
        try {
          await sql`
            INSERT INTO notifications (user_id, type, title, content, link, actor_id, actor_name, created_at)
            VALUES (
              ${mention.userId},
              'mention',
              '有人在评论中提到了你',
              ${`${currentUserName} 在评论中提到了你`},
              ${`/community/posts?id=${postId}`},
              ${currentUserId},
              ${currentUserName},
              NOW()
            )
          `;
        } catch (notifError) {
          console.error('Failed to create mention notification:', notifError);
        }
      }
    }

    // 创建回复通知（如果回复的不是自己）
    if (replyToUserId && replyToUserId !== currentUserId) {
      try {
        await sql`
          INSERT INTO notifications (user_id, type, title, content, link, actor_id, actor_name, created_at)
          VALUES (
            ${replyToUserId},
            'reply',
            '有人回复了你的评论',
            ${`${currentUserName} 回复了你的评论`},
            ${`/community/posts?id=${postId}`},
            ${currentUserId},
            ${currentUserName},
            NOW()
          )
        `;
      } catch (notifError) {
        console.error('Failed to create reply notification:', notifError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Reply posted successfully',
      data: {
        comment: {
          id: commentId,
          postId,
          userId: currentUserId,
          userName: currentUserName,
          content,
          parentId,
          replyToUserId,
          replyToUserName,
          depth: newDepth,
          likeCount: 0,
          isLiked: false,
          createdAt: createdAt
        }
      }
    });

  } catch (error: any) {
    console.error('Reply comment error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      code: error.code,
      detail: error.detail
    });
    return NextResponse.json({
      success: false,
      message: 'Failed to post reply',
      error: error instanceof Error ? error.message : 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? {
        code: error.code,
        detail: error.detail
      } : undefined
    }, { status: 500 });
  }
}
