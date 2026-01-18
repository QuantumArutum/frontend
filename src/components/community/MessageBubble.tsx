'use client';

import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Message {
  id: number;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: string;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  isSender: boolean;
}

interface MessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
}

export default function MessageBubble({ message, showAvatar = true }: MessageBubbleProps) {
  const { content, isRead, createdAt, isSender } = message;

  const timeAgo = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: zhCN,
  });

  return (
    <div className={`flex items-end gap-2 mb-4 ${isSender ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* 头像 */}
      {showAvatar && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {isSender ? 'Me' : 'U'}
        </div>
      )}

      {/* 消息气泡 */}
      <div className={`flex flex-col max-w-[70%] ${isSender ? 'items-end' : 'items-start'}`}>
        <div
          className={`
            px-4 py-2 rounded-2xl
            ${
              isSender
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-gray-700 text-white rounded-bl-sm'
            }
          `}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        </div>

        {/* 时间和已读状态 */}
        <div
          className={`flex items-center gap-1 mt-1 text-xs text-gray-400 ${isSender ? 'flex-row-reverse' : 'flex-row'}`}
        >
          <span>{timeAgo}</span>
          {isSender && (
            <span>
              {isRead ? (
                <CheckCheck className="w-3 h-3 text-blue-400" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
