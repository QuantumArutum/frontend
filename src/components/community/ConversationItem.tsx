'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Pin, Archive } from 'lucide-react';

interface Conversation {
  id: number;
  otherUserId: string;
  otherUserName: string;
  lastMessageContent: string;
  lastMessageAt: string;
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
}

interface ConversationItemProps {
  conversation: Conversation;
  isActive?: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  conversation,
  isActive = false,
  onClick,
}: ConversationItemProps) {
  const { otherUserName, lastMessageContent, lastMessageAt, unreadCount, isPinned } = conversation;

  const timeAgo = lastMessageAt
    ? formatDistanceToNow(new Date(lastMessageAt), {
        addSuffix: true,
        locale: zhCN,
      })
    : '';

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center gap-3 p-4 cursor-pointer transition-colors
        ${
          isActive
            ? 'bg-gray-700 border-l-4 border-blue-500'
            : 'hover:bg-gray-800 border-l-4 border-transparent'
        }
      `}
    >
      {/* 头像 */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
        {otherUserName.charAt(0).toUpperCase()}
      </div>

      {/* 内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold ${unreadCount > 0 ? 'text-white' : 'text-gray-300'}`}>
              {otherUserName}
            </h3>
            {isPinned && <Pin className="w-3 h-3 text-blue-400" />}
          </div>
          {timeAgo && <span className="text-xs text-gray-400">{timeAgo}</span>}
        </div>

        <div className="flex items-center justify-between">
          <p
            className={`text-sm truncate ${unreadCount > 0 ? 'text-white font-medium' : 'text-gray-400'}`}
          >
            {lastMessageContent || '暂无消息'}
          </p>
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full flex-shrink-0">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
