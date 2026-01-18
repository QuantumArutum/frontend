'use client';

import React, { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { barongAPI } from '@/api/client';
import { message } from 'antd';

interface TagSubscribeButtonProps {
  tagSlug: string;
  isSubscribed: boolean;
  onSubscribeChange?: (subscribed: boolean) => void;
  size?: 'small' | 'medium' | 'large';
}

export default function TagSubscribeButton({
  tagSlug,
  isSubscribed: initialIsSubscribed,
  onSubscribeChange,
  size = 'medium',
}: TagSubscribeButtonProps) {
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const [isLoading, setIsLoading] = useState(false);

  // 尺寸配置
  const sizeConfig = {
    small: {
      padding: 'px-2 py-1',
      text: 'text-xs',
      icon: 'w-3 h-3',
    },
    medium: {
      padding: 'px-3 py-1.5',
      text: 'text-sm',
      icon: 'w-4 h-4',
    },
    large: {
      padding: 'px-4 py-2',
      text: 'text-base',
      icon: 'w-5 h-5',
    },
  };

  const config = sizeConfig[size];

  const handleToggleSubscribe = async () => {
    // 检查登录状态
    const token = localStorage.getItem('auth_token');
    const userInfoStr = localStorage.getItem('user_info');

    if (!token || !userInfoStr) {
      message.warning('请先登录');
      return;
    }

    const userInfo = JSON.parse(userInfoStr);
    const currentUserId = userInfo.id || userInfo.uid || userInfo.email;

    if (isLoading) return;

    setIsLoading(true);

    try {
      if (isSubscribed) {
        // 取消订阅
        const response = await barongAPI.delete(`/public/community/tags/${tagSlug}/subscribe`, {
          params: { currentUserId },
        });

        if (response.data.success) {
          setIsSubscribed(false);
          message.success('取消订阅成功');
          onSubscribeChange?.(false);
        } else {
          message.error(response.data.message || '取消订阅失败');
        }
      } else {
        // 订阅
        const response = await barongAPI.post(`/public/community/tags/${tagSlug}/subscribe`, {
          currentUserId,
          notifyNewPosts: true,
        });

        if (response.data.success) {
          setIsSubscribed(true);
          message.success('订阅成功');
          onSubscribeChange?.(true);
        } else {
          message.error(response.data.message || '订阅失败');
        }
      }
    } catch (error: any) {
      console.error('Error toggling subscription:', error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('操作失败，请重试');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleToggleSubscribe}
      disabled={isLoading}
      className={`
        ${config.padding} ${config.text}
        flex items-center gap-1.5 rounded-lg
        transition-all duration-200
        ${
          isSubscribed
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {isSubscribed ? (
        <>
          <Bell className={config.icon} />
          <span>已订阅</span>
        </>
      ) : (
        <>
          <BellOff className={config.icon} />
          <span>订阅</span>
        </>
      )}
    </motion.button>
  );
}
