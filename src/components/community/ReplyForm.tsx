'use client';

import React, { useState } from 'react';
import { Send, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReplyFormProps {
  postId: number;
  parentId: number;
  replyToUserId: string;
  replyToUserName: string;
  currentUserId: string;
  currentUserName: string;
  onSubmit: (content: string) => Promise<void>;
  onCancel: () => void;
}

export default function ReplyForm({
  postId,
  parentId,
  replyToUserId,
  replyToUserName,
  currentUserId,
  currentUserName,
  onSubmit,
  onCancel,
}: ReplyFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const maxLength = 1000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('回复内容不能为空');
      return;
    }

    if (content.length > maxLength) {
      setError(`回复内容不能超过 ${maxLength} 字符`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(content);
      setContent('');
      onCancel(); // 提交成功后关闭表单
    } catch (err) {
      setError(err instanceof Error ? err.message : '回复失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-3 mb-2"
    >
      <form onSubmit={handleSubmit} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        {/* 回复提示 */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">
            回复 <span className="text-blue-400">@{replyToUserName}</span>
          </span>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 输入框 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="输入你的回复..."
          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          maxLength={maxLength}
          disabled={loading}
        />

        {/* 错误提示 */}
        {error && (
          <div className="mt-2 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* 底部操作栏 */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-gray-500">
            {content.length}/{maxLength}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
              disabled={loading}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  发送中...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  发送
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
