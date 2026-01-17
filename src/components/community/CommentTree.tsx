'use client';

import React, { useState } from 'react';
import CommentItem from './CommentItem';
import ReplyForm from './ReplyForm';
import { AnimatePresence } from 'framer-motion';

interface Comment {
  id: number;
  postId: number;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  likeCount: number;
  isLiked: boolean;
  replyCount?: number;
  parentId?: number;
  replyToUserId?: string;
  replyToUserName?: string;
  depth?: number;
  isEdited?: boolean;
  editedAt?: string;
  createdAt: string;
}

interface CommentTreeProps {
  comments: Comment[];
  currentUserId?: string;
  currentUserName?: string;
  onLike: (commentId: number) => void;
  onReply: (postId: number, parentId: number, replyToUserId: string, replyToUserName: string, content: string) => Promise<void>;
  onEdit?: (commentId: number) => void;
  onDelete?: (commentId: number) => void;
  onLoadReplies?: (commentId: number) => Promise<Comment[]>;
}

export default function CommentTree({
  comments,
  currentUserId,
  currentUserName,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onLoadReplies,
}: CommentTreeProps) {
  const [replyingTo, setReplyingTo] = useState<{ id: number; userId: string; userName: string } | null>(null);
  const [loadedReplies, setLoadedReplies] = useState<Record<number, Comment[]>>({});
  const [loadingReplies, setLoadingReplies] = useState<Record<number, boolean>>({});

  // 处理回复提交
  const handleReplySubmit = async (content: string) => {
    if (!replyingTo || !currentUserId || !currentUserName) return;

    const comment = comments.find(c => c.id === replyingTo.id);
    if (!comment) return;

    await onReply(
      comment.postId,
      replyingTo.id,
      replyingTo.userId,
      replyingTo.userName,
      content
    );

    setReplyingTo(null);
  };

  // 加载子评论
  const handleLoadReplies = async (commentId: number) => {
    if (loadedReplies[commentId]) {
      // 如果已加载，则切换显示/隐藏
      setLoadedReplies(prev => {
        const newState = { ...prev };
        delete newState[commentId];
        return newState;
      });
      return;
    }

    if (!onLoadReplies) return;

    setLoadingReplies(prev => ({ ...prev, [commentId]: true }));

    try {
      const replies = await onLoadReplies(commentId);
      setLoadedReplies(prev => ({ ...prev, [commentId]: replies }));
    } catch (error) {
      console.error('Failed to load replies:', error);
    } finally {
      setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
    }
  };

  // 渲染单个评论及其子评论
  const renderComment = (comment: Comment) => {
    const replies = loadedReplies[comment.id] || [];
    const isLoading = loadingReplies[comment.id];
    const showReplies = replies.length > 0;

    return (
      <div key={comment.id}>
        <CommentItem
          comment={comment}
          currentUserId={currentUserId}
          onLike={onLike}
          onReply={(id, userName) => setReplyingTo({ id, userId: comment.userId, userName })}
          onEdit={onEdit}
          onDelete={onDelete}
          onLoadReplies={comment.replyCount && comment.replyCount > 0 ? handleLoadReplies : undefined}
          showReplies={showReplies}
        >
          {/* 子评论 */}
          {showReplies && (
            <div className="space-y-0">
              {replies.map(reply => renderComment(reply))}
            </div>
          )}

          {/* 加载中状态 */}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
              加载回复中...
            </div>
          )}
        </CommentItem>

        {/* 回复表单 */}
        <AnimatePresence>
          {replyingTo && replyingTo.id === comment.id && currentUserId && currentUserName && (
            <div className={`${comment.depth && comment.depth > 0 ? `ml-${Math.min(comment.depth * 8, 24)}` : ''}`}>
              <ReplyForm
                postId={comment.postId}
                parentId={comment.id}
                replyToUserId={replyingTo.userId}
                replyToUserName={replyingTo.userName}
                currentUserId={currentUserId}
                currentUserName={currentUserName}
                onSubmit={handleReplySubmit}
                onCancel={() => setReplyingTo(null)}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-0">
      {comments.map(comment => renderComment(comment))}
    </div>
  );
}
