'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, Tag as TagIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface Tag {
  id?: number;
  name: string;
  slug?: string;
  color?: string;
  icon?: string;
  usage_count?: number;
  is_official?: boolean;
}

interface TagBadgeProps {
  tag: Tag | string;
  size?: 'small' | 'medium' | 'large';
  clickable?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  onClick?: () => void;
  showIcon?: boolean;
  showCount?: boolean;
}

export default function TagBadge({
  tag,
  size = 'medium',
  clickable = true,
  removable = false,
  onRemove,
  onClick,
  showIcon = true,
  showCount = false,
}: TagBadgeProps) {
  const router = useRouter();

  // 处理字符串或对象类型的 tag
  const tagData = typeof tag === 'string' ? { name: tag } : tag;
  const { name, slug, color = '#3b82f6', icon, usage_count, is_official } = tagData;

  // 尺寸配置
  const sizeConfig = {
    small: {
      padding: 'px-2 py-0.5',
      text: 'text-xs',
      icon: 'w-3 h-3',
    },
    medium: {
      padding: 'px-3 py-1',
      text: 'text-sm',
      icon: 'w-4 h-4',
    },
    large: {
      padding: 'px-4 py-1.5',
      text: 'text-base',
      icon: 'w-5 h-5',
    },
  };

  const config = sizeConfig[size];

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (clickable && slug) {
      router.push(`/community/tags/${slug}`);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRemove) {
      onRemove();
    }
  };

  return (
    <motion.div
      whileHover={clickable ? { scale: 1.05 } : {}}
      whileTap={clickable ? { scale: 0.95 } : {}}
      onClick={handleClick}
      className={`
        inline-flex items-center gap-1.5 rounded-full
        ${config.padding} ${config.text}
        ${clickable ? 'cursor-pointer' : 'cursor-default'}
        transition-all duration-200
      `}
      style={{
        backgroundColor: `${color}20`,
        borderColor: color,
        borderWidth: '1px',
        color: color,
      }}
    >
      {/* 图标 */}
      {showIcon && (
        <>
          {icon ? <span className={config.icon}>{icon}</span> : <TagIcon className={config.icon} />}
        </>
      )}

      {/* 标签名称 */}
      <span className="font-medium">{name}</span>

      {/* 官方标记 */}
      {is_official && <span className="text-xs opacity-75">✓</span>}

      {/* 使用次数 */}
      {showCount && usage_count !== undefined && (
        <span className="text-xs opacity-75">{usage_count}</span>
      )}

      {/* 删除按钮 */}
      {removable && (
        <button
          onClick={handleRemove}
          className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </motion.div>
  );
}
