/**
 * Post Voting API
 * Handle upvote/downvote for posts
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
    const { postId, voteType, currentUserId } = body;

    // 验证参数
    if (!postId || !currentUserId) {
      return NextResponse.json({
        success: false,
        message: 'Post ID and user ID are required',
      }, { status: 400 });
    }

    if (voteType && !['upvote', 'downvote', 'remove'].includes(voteType)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid vote type. Must be upvote, downvote, or remove',
      }, { status: 400 });
    }

    // 检查帖子是否存在
    const postResult = await sql`
      SELECT id, user_id FROM posts WHERE id = ${postId}
    `;

    if (!postResult || postResult.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'Post not found',
      }, { status: 404 });
    }

    const post = postResult[0];

    // 不能给自己的帖子投票
    if (post.user_id === currentUserId) {
      return NextResponse.json({
        success: false,
        message: 'You cannot vote on your own post',
      }, { status: 403 });
    }

    // 检查用户当前的投票状态
    const existingVoteResult = await sql`
      SELECT id, vote_type FROM post_likes 
      WHERE post_id = ${postId} AND user_id = ${currentUserId}
    `;

    const existingVote = existingVoteResult.length > 0 ? existingVoteResult[0] : null;
    const oldVoteType = existingVote?.vote_type || null;

    // 处理投票逻辑
    if (voteType === 'remove') {
      // 移除投票
      if (existingVote) {
        await sql`
          DELETE FROM post_likes 
          WHERE post_id = ${postId} AND user_id = ${currentUserId}
        `;

        // 更新帖子的投票计数
        if (oldVoteType === 'upvote') {
          await sql`
            UPDATE posts 
            SET upvote_count = GREATEST(upvote_count - 1, 0)
            WHERE id = ${postId}
          `;
        } else if (oldVoteType === 'downvote') {
          await sql`
            UPDATE posts 
            SET downvote_count = GREATEST(downvote_count - 1, 0)
            WHERE id = ${postId}
          `;
        }

        // 记录投票历史
        await sql`
          INSERT INTO vote_history (user_id, target_type, target_id, old_vote, new_vote)
          VALUES (${currentUserId}, 'post', ${postId}, ${oldVoteType}, NULL)
        `;
      }
    } else {
      // 添加或更新投票
      if (existingVote) {
        // 如果投票类型相同，则移除投票
        if (oldVoteType === voteType) {
          await sql`
            DELETE FROM post_likes 
            WHERE post_id = ${postId} AND user_id = ${currentUserId}
          `;

          // 更新帖子的投票计数
          if (voteType === 'upvote') {
            await sql`
              UPDATE posts 
              SET upvote_count = GREATEST(upvote_count - 1, 0)
              WHERE id = ${postId}
            `;
          } else {
            await sql`
              UPDATE posts 
              SET downvote_count = GREATEST(downvote_count - 1, 0)
              WHERE id = ${postId}
            `;
          }

          // 记录投票历史
          await sql`
            INSERT INTO vote_history (user_id, target_type, target_id, old_vote, new_vote)
            VALUES (${currentUserId}, 'post', ${postId}, ${oldVoteType}, NULL)
          `;
        } else {
          // 更改投票类型
          await sql`
            UPDATE post_likes 
            SET vote_type = ${voteType}, updated_at = CURRENT_TIMESTAMP
            WHERE post_id = ${postId} AND user_id = ${currentUserId}
          `;

          // 更新帖子的投票计数
          if (oldVoteType === 'upvote' && voteType === 'downvote') {
            await sql`
              UPDATE posts 
              SET upvote_count = GREATEST(upvote_count - 1, 0),
                  downvote_count = downvote_count + 1
              WHERE id = ${postId}
            `;
          } else if (oldVoteType === 'downvote' && voteType === 'upvote') {
            await sql`
              UPDATE posts 
              SET downvote_count = GREATEST(downvote_count - 1, 0),
                  upvote_count = upvote_count + 1
              WHERE id = ${postId}
            `;
          }

          // 记录投票历史
          await sql`
            INSERT INTO vote_history (user_id, target_type, target_id, old_vote, new_vote)
            VALUES (${currentUserId}, 'post', ${postId}, ${oldVoteType}, ${voteType})
          `;
        }
      } else {
        // 新增投票
        await sql`
          INSERT INTO post_likes (post_id, user_id, vote_type)
          VALUES (${postId}, ${currentUserId}, ${voteType})
        `;

        // 更新帖子的投票计数
        if (voteType === 'upvote') {
          await sql`
            UPDATE posts 
            SET upvote_count = upvote_count + 1
            WHERE id = ${postId}
          `;
        } else {
          await sql`
            UPDATE posts 
            SET downvote_count = downvote_count + 1
            WHERE id = ${postId}
          `;
        }

        // 记录投票历史
        await sql`
          INSERT INTO vote_history (user_id, target_type, target_id, old_vote, new_vote)
          VALUES (${currentUserId}, 'post', ${postId}, NULL, ${voteType})
        `;
      }
    }

    // 获取更新后的帖子信息
    const updatedPostResult = await sql`
      SELECT 
        upvote_count,
        downvote_count,
        vote_score,
        hot_score,
        controversy_score,
        is_controversial
      FROM posts 
      WHERE id = ${postId}
    `;

    const updatedPost = updatedPostResult[0];

    // 获取用户当前的投票状态
    const currentVoteResult = await sql`
      SELECT vote_type FROM post_likes 
      WHERE post_id = ${postId} AND user_id = ${currentUserId}
    `;

    const userVote = currentVoteResult.length > 0 ? currentVoteResult[0].vote_type : null;

    return NextResponse.json({
      success: true,
      message: 'Vote updated successfully',
      data: {
        upvoteCount: parseInt(updatedPost.upvote_count || '0'),
        downvoteCount: parseInt(updatedPost.downvote_count || '0'),
        voteScore: parseInt(updatedPost.vote_score || '0'),
        hotScore: parseFloat(updatedPost.hot_score || '0'),
        controversyScore: parseFloat(updatedPost.controversy_score || '0'),
        isControversial: updatedPost.is_controversial || false,
        userVote,
      },
    });
  } catch (error) {
    console.error('Error voting on post:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
    }, { status: 500 });
  }
}
