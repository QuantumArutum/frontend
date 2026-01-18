'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hover = false, onClick }) => {
  const baseClasses = 'bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50';
  const hoverClasses = hover
    ? 'hover:border-blue-500/50 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer'
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4 } : undefined}
      onClick={onClick}
      className={`${baseClasses} ${hoverClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
};

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-400',
  action,
  children,
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
      {children ? (
        children
      ) : (
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="p-2 rounded-xl bg-gray-700/50">
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
          )}
          <div>
            {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-400">{subtitle}</p>}
          </div>
        </div>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

// CardTitle 组件 - 兼容 shadcn/ui 风格
export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <h3 className={`text-lg font-semibold text-white ${className}`}>{children}</h3>;
};

// CardDescription 组件 - 兼容 shadcn/ui 风格
export const CardDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <p className={`text-sm text-gray-400 ${className}`}>{children}</p>;
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`p-6 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`px-6 py-4 border-t border-gray-700/50 ${className}`}>{children}</div>;
};

// 统计卡片
interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; isPositive: boolean };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'cyan' | 'pink';
}

const colorMap = {
  blue: 'from-blue-500 to-cyan-500',
  green: 'from-green-500 to-emerald-500',
  purple: 'from-purple-500 to-pink-500',
  orange: 'from-orange-500 to-red-500',
  cyan: 'from-cyan-500 to-blue-500',
  pink: 'from-pink-500 to-rose-500',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorMap[color]}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <span
            className={`text-sm font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{title}</div>
    </Card>
  );
};

export default Card;
