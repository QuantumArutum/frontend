/**
 * Comment Voting API
 * Handle upvote/downvote for comments
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    if (!sql) {
      return NextResponse.json({
        success: false,
        message: 'Database not configured',
      }, { status: 500 });
    }

    const body = await request.json();
    const { commentId, voteType, currentUserId } = body;

    if (!commentId || !currentUserId) {
      return NextResponse.json({
        success: false,
        message: 'Comment ID and user ID are required',
      }, { status: 400 });
    }

    if (voteType && !['upvote', 'downvote', 'remove'].includes(voteType)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid vote type',
      }, { status: 400 });
    }

    // 检查评论是否存在
    const commentResult = await sql`
      SELECT id, user_id FROM comments WHERE id = ${commentId}
    `;

    if (!commentResult || commentResult.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Comment not found',
      }, { status: 404 });
    }

    const comment = commentResult[0];

    // 不能给自己的评论投票
    if (comment.user_id === currentUserId) {
      return NextResponse.json({
        success: false,
        message: 'You cannot vote on your own comment',
      }, { status: 403 });
    }

    // 检查用户当前的投票状态
    const existingVoteResult = await sql`
      SELECT id, vote_type FROM comment_likes 
      WHERE comment_id = ${commentId} AND user_id = ${currentUserId}
    `;

    const existingVote = existingVoteResult.length > 0 ? existingVoteResult[0] : null;
    const oldVoteType = existingVote?.vote_type || null;

    // 处理投票逻辑
    if (voteType === 'remove') {
      if (existingVote) {
        await sql`
          DELETE FROM comment_likes 
          WHERE comment_id = ${commentId} AND user_id = ${currentUserId}
        `;

        if (oldVoteType === 'upvote') {
          await sql`
            UPDATE comments 
            SET upvote_count = GREATEST(upvote_count - 1, 0)
            WHERE id = ${commentId}
          `;
        } else if (oldVoteType === 'downvote') {
          await sql`
            UPDATE comments 
            SET downvote_count = GREATEST(downvote_count - 1, 0)
            WHERE id = ${commentId}
          `;
        }

        await sql`
          INSERT INTO vote_history (user_id, target_type, target_id, old_vote, new_vote)
          VALUES (${currentUserId}, 'comment', ${commentId}, ${oldVoteType}, NULL)
        `;
      }
    } else {
      if (existingVote) {
        if (oldVoteType === voteType) {
          await sql`
            DELETE FROM comment_likes 
            WHERE comment_id = ${commentId} AND user_id = ${currentUserId}
          `;

          if (voteType === 'upvote') {
            await sql`
              UPDATE comments 
              SET upvote_count = GREATEST(upvote_count - 1, 0)
              WHERE id = ${commentId}
            `;
          } else {
            await sql`
              UPDATE comments 
              SET downvote_count = GREATEST(downvote_count - 1, 0)
              WHERE id = ${commentId}
            `;
          }

          await sql`
            INSERT INTO vote_history (user_id, target_type, target_id, old_vote, new_vote)
            VALUES (${currentUserId}, 'comment', ${commentId}, ${oldVoteType}, NULL)
          `;
        } else {
          await sql`
            UPDATE comment_likes 
            SET vote_type = ${voteType}, updated_at = CURRENT_TIMESTAMP
            WHERE comment_id = ${commentId} AND user_id = ${currentUserId}
          `;

          if (oldVoteType === 'upvote' && voteType === 'downvote') {
            await sql`
              UPDATE comments 
              SET upvote_count = GREATEST(upvote_count - 1, 0),
                  downvote_count = downvote_count + 1
              WHERE id = ${commentId}
            `;
          } else if (oldVoteType === 'downvote' && voteType === 'upvote') {
            await sql`
              UPDATE comments 
              SET downvote_count = GREATEST(downvote_count - 1, 0),
                  upvote_count = upvote_count + 1
              WHERE id = ${commentId}
            `;
          }

          await sql`
            INSERT INTO vote_history (user_id, target_type, target_id, old_vote, new_vote)
            VALUES (${currentUserId}, 'comment', ${commentId}, ${oldVoteType}, ${voteType})
          `;
        }
      } else {
        await sql`
          INSERT INTO comment_likes (comment_id, user_id, vote_type)
          VALUES (${commentId}, ${currentUserId}, ${voteType})
        `;

        if (voteType === 'upvote') {
          await sql`
            UPDATE comments 
            SET upvote_count = upvote_count + 1
            WHERE id = ${commentId}
          `;
        } else {
          await sql`
            UPDATE comments 
            SET downvote_count = downvote_count + 1
            WHERE id = ${commentId}
          `;
        }

        await sql`
          INSERT INTO vote_history (user_id, target_type, target_id, old_vote, new_vote)
          VALUES (${currentUserId}, 'comment', ${commentId}, NULL, ${voteType})
        `;
      }
    }

    // 获取更新后的评论信息
    const updatedCommentResult = await sql`
      SELECT upvote_count, downvote_count, vote_score, controversy_score
      FROM comments WHERE id = ${commentId}
    `;

    const updatedComment = updatedCommentResult[0];

    // 获取用户当前的投票状态
    const currentVoteResult = await sql`
      SELECT vote_type FROM comment_likes 
      WHERE comment_id = ${commentId} AND user_id = ${currentUserId}
    `;

    const userVote = currentVoteResult.length > 0 ? currentVoteResult[0].vote_type : null;

    return NextResponse.json({
      success: true,
      message: 'Vote updated successfully',
      data: {
        upvoteCount: parseInt(updatedComment.upvote_count || '0'),
        downvoteCount: parseInt(updatedComment.downvote_count || '0'),
        voteScore: parseInt(updatedComment.vote_score || '0'),
        controversyScore: parseFloat(updatedComment.controversy_score || '0'),
        userVote,
      },
    });
  } catch (error) {
    console.error('Error voting on comment:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}
