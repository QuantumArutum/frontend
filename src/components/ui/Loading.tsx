'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text,
  fullScreen = false,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className={`${sizeStyles[size]} text-blue-500 animate-spin`} />
      {text && <p className="text-gray-400 text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

// 骨架屏
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = true,
}) => {
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={`
        bg-gray-700/50
        ${variantStyles[variant]}
        ${animation ? 'animate-pulse' : ''}
        ${className}
      `}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
      }}
    />
  );
};

// 页面加载状态
export const PageLoading: React.FC<{ text?: string }> = ({ text = '加载中...' }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/30 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
        </div>
        <p className="mt-4 text-gray-400">{text}</p>
      </motion.div>
    </div>
  );
};

// 卡片骨架屏
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <Skeleton variant="circular" width={48} height={48} animation={false} />
        <div className="flex-1">
          <Skeleton height={20} className="mb-2 w-3/4" animation={false} />
          <Skeleton height={16} className="w-1/2" animation={false} />
        </div>
      </div>
      <Skeleton height={100} className="mb-4" animation={false} />
      <div className="flex gap-2">
        <Skeleton height={36} className="flex-1" animation={false} />
        <Skeleton height={36} width={36} animation={false} />
      </div>
    </div>
  );
};

export default Loading;
