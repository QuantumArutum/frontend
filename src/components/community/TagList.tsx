'use client';

import React from 'react';
import TagBadge from './TagBadge';
import TagSubscribeButton from './TagSubscribeButton';

interface Tag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  usage_count?: number;
  post_count?: number;
  subscriber_count?: number;
  is_official?: boolean;
}

interface TagListProps {
  tags: Tag[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  showStats?: boolean;
  showSubscribe?: boolean;
  onTagClick?: (tag: Tag) => void;
}

export default function TagList({
  tags,
  layout = 'vertical',
  showStats = true,
  showSubscribe = false,
  onTagClick,
}: TagListProps) {
  if (tags.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        暂无标签
      </div>
    );
  }

  // 水平布局
  if (layout === 'horizontal') {
    return (
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagBadge
            key={tag.id}
            tag={tag}
            size="medium"
            clickable={true}
            onClick={() => onTagClick?.(tag)}
            showIcon={true}
            showCount={showStats}
          />
        ))}
      </div>
    );
  }

  // 网格布局
  if (layout === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <TagBadge
                tag={tag}
                size="large"
                clickable={true}
                onClick={() => onTagClick?.(tag)}
                showIcon={true}
              />
              {showSubscribe && (
                <TagSubscribeButton
                  tagSlug={tag.slug}
                  isSubscribed={false}
                />
              )}
            </div>

            {tag.description && (
              <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                {tag.description}
              </p>
            )}

            {showStats && (
              <div className="flex items-center gap-4 text-xs text-gray-400">
                {tag.post_count !== undefined && (
                  <span>{tag.post_count} 帖子</span>
                )}
                {tag.subscriber_count !== undefined && (
                  <span>{tag.subscriber_count} 订阅</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // 垂直布局（默认）
  return (
    <div className="space-y-2">
      {tags.map((tag) => (
        <div
          key={tag.id}
          className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-lg p-3 hover:border-gray-600 transition-colors"
        >
          <div className="flex items-center gap-3 flex-1">
            <TagBadge
              tag={tag}
              size="medium"
              clickable={true}
              onClick={() => onTagClick?.(tag)}
              showIcon={true}
            />

            {showStats && (
              <div className="flex items-center gap-4 text-sm text-gray-400">
                {tag.post_count !== undefined && (
                  <span>{tag.post_count} 帖子</span>
                )}
                {tag.subscriber_count !== undefined && (
                  <span>{tag.subscriber_count} 订阅</span>
                )}
              </div>
            )}
          </div>

          {showSubscribe && (
            <TagSubscribeButton
              tagSlug={tag.slug}
              isSubscribed={false}
            />
          )}
        </div>
      ))}
    </div>
  );
}
