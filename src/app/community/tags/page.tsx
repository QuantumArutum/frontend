'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp, Tag as TagIcon } from 'lucide-react';
import { barongAPI } from '@/api/client';
import { message } from 'antd';
import TagList from '@/components/community/TagList';
import TagCloud from '@/components/community/TagCloud';

export default function TagsPage() {
  const router = useRouter();
  const [tags, setTags] = useState<any[]>([]);
  const [trendingTags, setTrendingTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'usage' | 'name' | 'created'>('usage');
  const [filterOfficial, setFilterOfficial] = useState<'all' | 'official' | 'community'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'cloud'>('grid');

  // 加载标签
  useEffect(() => {
    loadTags();
    loadTrendingTags();
  }, [sortBy, filterOfficial]);

  const loadTags = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: 1,
        limit: 100,
        sortBy,
      };

      if (filterOfficial === 'official') {
        params.official = 'true';
      } else if (filterOfficial === 'community') {
        params.official = 'false';
      }

      if (searchQuery) {
        params.search = searchQuery;
      }

      const response = await barongAPI.get('/public/community/tags', { params });

      if (response.data.success) {
        setTags(response.data.data.tags);
      }
    } catch (error) {
      console.error('Error loading tags:', error);
      message.error('加载标签失败');
    } finally {
      setLoading(false);
    }
  };

  const loadTrendingTags = async () => {
    try {
      const response = await barongAPI.get('/public/community/tags/trending', {
        params: { timeRange: '7d', limit: 20 },
      });

      if (response.data.success) {
        setTrendingTags(response.data.data.tags);
      }
    } catch (error) {
      console.error('Error loading trending tags:', error);
    }
  };

  const handleSearch = () => {
    loadTags();
  };

  const handleTagClick = (tag: any) => {
    router.push(`/community/tags/${tag.slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <TagIcon className="w-8 h-8" />
            标签广场
          </h1>
          <p className="text-gray-400">
            浏览和订阅感兴趣的标签，发现更多精彩内容
          </p>
        </div>

        {/* 热门标签云 */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-bold">热门标签</h2>
            <span className="text-sm text-gray-400">(最近7天)</span>
          </div>
          <TagCloud
            tags={trendingTags}
            maxTags={30}
            onTagClick={handleTagClick}
          />
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="搜索标签..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                搜索
              </button>
            </div>

            {/* 筛选选项 */}
            <div className="flex gap-2">
              {/* 排序 */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="usage">按使用次数</option>
                <option value="name">按名称</option>
                <option value="created">按创建时间</option>
              </select>

              {/* 类型筛选 */}
              <select
                value={filterOfficial}
                onChange={(e) => setFilterOfficial(e.target.value as any)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">全部标签</option>
                <option value="official">官方标签</option>
                <option value="community">社区标签</option>
              </select>

              {/* 视图模式 */}
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as any)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="grid">网格视图</option>
                <option value="list">列表视图</option>
                <option value="cloud">云视图</option>
              </select>
            </div>
          </div>
        </div>

        {/* 标签列表 */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">
            所有标签 ({tags.length})
          </h2>

          {loading ? (
            <div className="text-center py-12 text-gray-400">
              加载中...
            </div>
          ) : viewMode === 'cloud' ? (
            <TagCloud
              tags={tags}
              maxTags={100}
              onTagClick={handleTagClick}
            />
          ) : (
            <TagList
              tags={tags}
              layout={viewMode === 'grid' ? 'grid' : 'vertical'}
              showStats={true}
              showSubscribe={true}
              onTagClick={handleTagClick}
            />
          )}
        </div>
      </div>
    </div>
  );
}
