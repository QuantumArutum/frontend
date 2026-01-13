'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ children, columns = 4 }) => {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {children}
    </div>
  );
};

interface StatItemProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'cyan' | 'pink' | 'red';
  subtitle?: string;
  delay?: number;
}

const colorMap = {
  blue: {
    bg: 'from-blue-500 to-cyan-500',
    text: 'text-blue-400',
    border: 'border-blue-500/20',
  },
  green: {
    bg: 'from-green-500 to-emerald-500',
    text: 'text-green-400',
    border: 'border-green-500/20',
  },
  purple: {
    bg: 'from-purple-500 to-pink-500',
    text: 'text-purple-400',
    border: 'border-purple-500/20',
  },
  orange: {
    bg: 'from-orange-500 to-red-500',
    text: 'text-orange-400',
    border: 'border-orange-500/20',
  },
  cyan: {
    bg: 'from-cyan-500 to-blue-500',
    text: 'text-cyan-400',
    border: 'border-cyan-500/20',
  },
  pink: {
    bg: 'from-pink-500 to-rose-500',
    text: 'text-pink-400',
    border: 'border-pink-500/20',
  },
  red: {
    bg: 'from-red-500 to-rose-500',
    text: 'text-red-400',
    border: 'border-red-500/20',
  },
};

export const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  subtitle,
  delay = 0,
}) => {
  const colors = colorMap[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`
        bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 
        border ${colors.border} hover:border-opacity-50 transition-all duration-300
      `}
    >
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${
            trend.isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {trend.isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
      {subtitle && <div className="text-gray-500 text-xs mt-1">{subtitle}</div>}
    </motion.div>
  );
};

// 进度统计
interface ProgressStatProps {
  label: string;
  value: number;
  max: number;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  showPercentage?: boolean;
  formatValue?: (value: number) => string;
}

export const ProgressStat: React.FC<ProgressStatProps> = ({
  label,
  value,
  max,
  color = 'blue',
  showPercentage = true,
  formatValue,
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const gradients = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    orange: 'from-orange-500 to-red-500',
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className="text-white font-medium">
          {formatValue ? formatValue(value) : value} / {formatValue ? formatValue(max) : max}
        </span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${gradients[color]} rounded-full`}
        />
      </div>
      {showPercentage && (
        <div className="text-right mt-1">
          <span className="text-gray-500 text-xs">{percentage.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
};

export default StatsGrid;
