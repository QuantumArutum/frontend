'use client';

import React from 'react';
import { TrendingUp, Clock, ThumbsUp, Star } from 'lucide-react';

interface CommentSortProps {
  currentSort: 'newest' | 'oldest' | 'hot' | 'best';
  onSortChange: (sort: 'newest' | 'oldest' | 'hot' | 'best') => void;
}

export default function CommentSort({ currentSort, onSortChange }: CommentSortProps) {
  const sortOptions = [
    { value: 'newest' as const, label: '最新', icon: Clock },
    { value: 'hot' as const, label: '最热', icon: TrendingUp },
    { value: 'best' as const, label: '最佳', icon: Star },
    { value: 'oldest' as const, label: '最早', icon: Clock },
  ];

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm text-gray-400">排序：</span>
      <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
        {sortOptions.map((option) => {
          const Icon = option.icon;
          const isActive = currentSort === option.value;
          
          return (
            <button
              key={option.value}
              onClick={() => onSortChange(option.value)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
