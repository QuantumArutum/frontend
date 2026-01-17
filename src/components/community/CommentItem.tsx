'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Edit, Trash2, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface CommentItemProps {
  comment: {
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
    replyToUserName?: string;
    depth?: number;
    isEdited?: boolean;
    editedAt?: string;
    createdAt: string;
  };
  currentUserId?: string;
  onLike: (commentId: number) => void;
  onReply: (commentId: number, userName: string) => void;
  onEdit?: (commentId: number) => void;
  onDelete?: (commentId: number) => void;
  onLoadReplies?: (commentId: number) => void;
  showReplies?: boolean;
  children?: React.ReactNode;
}

export default function CommentItem({
  comment,
  currentUserId,
  onLike,
  onReply,
  onEdit,
  onDelete,
  onLoadReplies,
  showReplies = false,
  children,
}: CommentItemProps) {
  const [showMenu, setShowMenu] = useState(false);
  const isAuthor = currentUserId === comment.userId;
  const depth = comment.depth || 0;
  const maxDepth = 3;

  // 计算缩进 - 使用固定的类名
  const getIndentClass = () => {
    if (depth === 0) return '';
    if (depth === 1) return 'ml-8';
    if (depth === 2) return 'ml-16';
    return 'ml-24'; // depth >= 3
  };
  const indentClass = getIndentClass();

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className={`${indentClass}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-4 border-b border-white/5"
      >
        <div className="flex gap-3">
          {/* 用户头像 */}
          <Link href={`/community/user/${comment.userName}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-transform">
              {comment.userAvatar}
            </div>
          </Link>

          {/* 评论内容 */}
          <div className="flex-1 min-w-0">
            {/* 用户名和时间 */}
            <div className="flex items-center gap-2 mb-1">
              <Link href={`/community/user/${comment.userName}`}>
                <span className="font-medium text-white hover:text-blue-400 cursor-pointer">
                  {comment.userName}
                </span>
              </Link>
              {comment.replyToUserName && (
                <>
                  <span className="text-gray-500">回复</span>
                  <Link href={`/community/user/${comment.replyToUserName}`}>
                    <span className="font-medium text-blue-400 hover:text-blue-300 cursor-pointer">
                      @{comment.replyToUserName}
                    </span>
                  </Link>
                </>
              )}
              <span className="text-gray-500 text-sm">·</span>
              <span className="text-gray-500 text-sm">{formatTime(comment.createdAt)}</span>
              {comment.isEdited && (
                <>
                  <span className="text-gray-500 text-sm">·</span>
                  <span className="text-gray-500 text-sm">已编辑</span>
                </>
              )}
            </div>

            {/* 评论文本 */}
            <div className="text-gray-300 mb-3 whitespace-pre-wrap break-words">
              {comment.content}
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-4">
              {/* 点赞 */}
              <button
                onClick={() => onLike(comment.id)}
                className={`flex items-center gap-1 text-sm transition-colors ${
                  comment.isLiked
                    ? 'text-red-400 hover:text-red-300'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Heart className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} />
                <span>{comment.likeCount > 0 ? comment.likeCount : '点赞'}</span>
              </button>

              {/* 回复 */}
              {depth < maxDepth && (
                <button
                  onClick={() => onReply(comment.id, comment.userName)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>回复</span>
                </button>
              )}

              {/* 查看回复 */}
              {comment.replyCount && comment.replyCount > 0 && onLoadReplies && (
                <button
                  onClick={() => onLoadReplies(comment.id)}
                  className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{comment.replyCount} 条回复</span>
                </button>
              )}

              {/* 更多操作（编辑/删除） */}
              {isAuthor && (onEdit || onDelete) && (
                <div className="relative ml-auto">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  <AnimatePresence>
                    {showMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 mt-1 w-32 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10"
                      >
                        {onEdit && (
                          <button
                            onClick={() => {
                              onEdit(comment.id);
                              setShowMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2 rounded-t-lg"
                          >
                            <Edit className="w-4 h-4" />
                            编辑
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => {
                              onDelete(comment.id);
                              setShowMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2 rounded-b-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                            删除
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 子评论 */}
        {showReplies && children && (
          <div className="mt-2">
            {children}
          </div>
        )}
      </motion.div>
    </div>
  );
}
