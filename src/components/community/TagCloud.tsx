'use client';

import React, { useMemo } from 'react';
import TagBadge from './TagBadge';

interface Tag {
  id: number;
  name: string;
  slug: string;
  color?: string;
  icon?: string;
  usage_count: number;
  is_official?: boolean;
}

interface TagCloudProps {
  tags: Tag[];
  maxTags?: number;
  minSize?: number;
  maxSize?: number;
  onTagClick?: (tag: Tag) => void;
}

export default function TagCloud({
  tags,
  maxTags = 30,
  minSize = 12,
  maxSize = 24,
  onTagClick,
}: TagCloudProps) {
  // 计算标签大小
  const tagsWithSize = useMemo(() => {
    if (tags.length === 0) return [];

    // 找出最大和最小使用次数
    const counts = tags.map((tag) => tag.usage_count);
    const minCount = Math.min(...counts);
    const maxCount = Math.max(...counts);

    // 计算每个标签的大小
    return tags.slice(0, maxTags).map((tag) => {
      let size = minSize;
      if (maxCount > minCount) {
        const ratio = (tag.usage_count - minCount) / (maxCount - minCount);
        size = minSize + ratio * (maxSize - minSize);
      }
      return { ...tag, fontSize: Math.round(size) };
    });
  }, [tags, maxTags, minSize, maxSize]);

  if (tags.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        暂无标签
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3 items-center justify-center p-4">
      {tagsWithSize.map((tag) => (
        <div
          key={tag.id}
          style={{ fontSize: `${tag.fontSize}px` }}
          className="transition-all duration-200"
        >
          <TagBadge
            tag={tag}
            size={tag.fontSize > 18 ? 'large' : tag.fontSize > 14 ? 'medium' : 'small'}
            clickable={true}
            onClick={() => onTagClick?.(tag)}
            showIcon={false}
            showCount={true}
          />
        </div>
      ))}
    </div>
  );
}
