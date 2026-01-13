'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'error' | 'outline' | 'destructive' | 'secondary';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: LucideIcon;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-gray-700/50 text-gray-300 border-gray-600',
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  warning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  danger: 'bg-red-500/20 text-red-400 border-red-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  outline: 'bg-transparent text-gray-300 border-gray-500',
  destructive: 'bg-red-500/20 text-red-400 border-red-500/30',
  secondary: 'bg-gray-600/50 text-gray-300 border-gray-500',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-gray-400',
  success: 'bg-green-400',
  warning: 'bg-yellow-400',
  danger: 'bg-red-400',
  info: 'bg-blue-400',
  purple: 'bg-purple-400',
  error: 'bg-red-400',
  outline: 'bg-gray-400',
  destructive: 'bg-red-400',
  secondary: 'bg-gray-400',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  dot = false,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `.trim()}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {children}
    </span>
  );
};

// 状态指示器
interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'busy' | 'away';
  label?: string;
  showLabel?: boolean;
}

const statusStyles = {
  online: { color: 'bg-green-500', label: '在线' },
  offline: { color: 'bg-gray-500', label: '离线' },
  busy: { color: 'bg-red-500', label: '忙碌' },
  away: { color: 'bg-yellow-500', label: '离开' },
};

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  label,
  showLabel = true,
}) => {
  const { color, label: defaultLabel } = statusStyles[status];
  
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${color} animate-pulse`} />
      {showLabel && (
        <span className="text-sm text-gray-400">{label || defaultLabel}</span>
      )}
    </span>
  );
};

export default Badge;
