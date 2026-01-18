'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { barongAPI } from '@/api/client';
import { message } from 'antd';

interface VoteButtonsProps {
  targetId: number;
  targetType: 'post' | 'comment';
  upvoteCount: number;
  downvoteCount: number;
  userVote: 'upvote' | 'downvote' | null;
  isControversial?: boolean;
  onVoteChange?: (data: {
    upvoteCount: number;
    downvoteCount: number;
    voteScore: number;
    userVote: 'upvote' | 'downvote' | null;
  }) => void;
  size?: 'small' | 'medium' | 'large';
  layout?: 'vertical' | 'horizontal';
  showScore?: boolean;
}

export default function VoteButtons({
  targetId,
  targetType,
  upvoteCount: initialUpvoteCount,
  downvoteCount: initialDownvoteCount,
  userVote: initialUserVote,
  isControversial = false,
  onVoteChange,
  size = 'medium',
  layout = 'vertical',
  showScore = true,
}: VoteButtonsProps) {
  const [upvoteCount, setUpvoteCount] = useState(initialUpvoteCount);
  const [downvoteCount, setDownvoteCount] = useState(initialDownvoteCount);
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(initialUserVote);
  const [isVoting, setIsVoting] = useState(false);

  const voteScore = upvoteCount - downvoteCount;

  // 尺寸配置
  const sizeConfig = {
    small: {
      button: 'w-6 h-6',
      icon: 'w-4 h-4',
      text: 'text-xs',
    },
    medium: {
      button: 'w-8 h-8',
      icon: 'w-5 h-5',
      text: 'text-sm',
    },
    large: {
      button: 'w-10 h-10',
      icon: 'w-6 h-6',
      text: 'text-base',
    },
  };

  const config = sizeConfig[size];

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    // 检查登录状态
    const token = localStorage.getItem('auth_token');
    const userInfoStr = localStorage.getItem('user_info');

    if (!token || !userInfoStr) {
      message.warning('请先登录');
      return;
    }

    const userInfo = JSON.parse(userInfoStr);
    const currentUserId = userInfo.id || userInfo.uid || userInfo.email;

    if (isVoting) return;

    setIsVoting(true);

    try {
      // 如果点击的是当前投票类型，则取消投票
      const newVoteType = userVote === voteType ? 'remove' : voteType;

      const endpoint = targetType === 'post' 
        ? '/public/community/vote-post'
        : '/public/community/vote-comment';

      const response = await barongAPI.post(endpoint, {
        [targetType === 'post' ? 'postId' : 'commentId']: targetId,
        voteType: newVoteType,
        currentUserId,
      });

      if (response.data.success) {
        const { upvoteCount: newUpvoteCount, downvoteCount: newDownvoteCount, voteScore: newVoteScore, userVote: newUserVote } = response.data.data;

        setUpvoteCount(newUpvoteCount);
        setDownvoteCount(newDownvoteCount);
        setUserVote(newUserVote);

        // 通知父组件
        if (onVoteChange) {
          onVoteChange({
            upvoteCount: newUpvoteCount,
            downvoteCount: newDownvoteCount,
            voteScore: newVoteScore,
            userVote: newUserVote,
          });
        }

        // 显示提示
        if (newUserVote === 'upvote') {
          message.success('已赞同');
        } else if (newUserVote === 'downvote') {
          message.success('已反对');
        } else {
          message.info('已取消投票');
        }
      } else {
        message.error(response.data.message || '投票失败');
      }
    } catch (error: any) {
      console.error('Error voting:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('投票失败，请重试');
      }
    } finally {
      setIsVoting(false);
    }
  };

  // 垂直布局
  if (layout === 'vertical') {
    return (
      <div className="flex flex-col items-center gap-1">
        {/* 赞同按钮 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleVote('upvote')}
          disabled={isVoting}
          className={`
            ${config.button}
            flex items-center justify-center rounded-lg
            transition-all duration-200
            ${userVote === 'upvote'
              ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
            }
            ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title="赞同"
        >
          <ChevronUp className={config.icon} />
        </motion.button>

        {/* 分数显示 */}
        {showScore && (
          <div className={`
            ${config.text} font-bold
            ${voteScore > 0 ? 'text-green-400' : voteScore < 0 ? 'text-red-400' : 'text-gray-400'}
            ${isControversial ? 'text-yellow-400' : ''}
          `}>
            {voteScore > 0 ? '+' : ''}{voteScore}
          </div>
        )}

        {/* 反对按钮 */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleVote('downvote')}
          disabled={isVoting}
          className={`
            ${config.button}
            flex items-center justify-center rounded-lg
            transition-all duration-200
            ${userVote === 'downvote'
              ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
            }
            ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          title="反对"
        >
          <ChevronDown className={config.icon} />
        </motion.button>

        {/* 争议标记 */}
        {isControversial && (
          <div className="mt-1 text-xs text-yellow-400" title="有争议的内容">
            ⚠️
          </div>
        )}
      </div>
    );
  }

  // 水平布局
  return (
    <div className="flex items-center gap-2">
      {/* 赞同按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleVote('upvote')}
        disabled={isVoting}
        className={`
          flex items-center gap-1 px-3 py-1.5 rounded-lg
          transition-all duration-200
          ${userVote === 'upvote'
            ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
            : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
          }
          ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <ChevronUp className={config.icon} />
        <span className={config.text}>{upvoteCount}</span>
      </motion.button>

      {/* 分数显示 */}
      {showScore && (
        <div className={`
          ${config.text} font-bold px-2
          ${voteScore > 0 ? 'text-green-400' : voteScore < 0 ? 'text-red-400' : 'text-gray-400'}
          ${isControversial ? 'text-yellow-400' : ''}
        `}>
          {voteScore > 0 ? '+' : ''}{voteScore}
        </div>
      )}

      {/* 反对按钮 */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleVote('downvote')}
        disabled={isVoting}
        className={`
          flex items-center gap-1 px-3 py-1.5 rounded-lg
          transition-all duration-200
          ${userVote === 'downvote'
            ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
            : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
          }
          ${isVoting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <ChevronDown className={config.icon} />
        <span className={config.text}>{downvoteCount}</span>
      </motion.button>

      {/* 争议标记 */}
      {isControversial && (
        <div className="text-yellow-400 text-xs" title="有争议的内容">
          ⚠️ 争议
        </div>
      )}
    </div>
  );
}
