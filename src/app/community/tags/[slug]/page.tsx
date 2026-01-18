'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, Clock, ThumbsUp } from 'lucide-react';
import { barongAPI } from '@/api/client';
import { message } from 'antd';
import TagBadge from '@/components/community/TagBadge';
import TagSubscribeButton from '@/components/community/TagSubscribeButton';

export default function TagDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [slug, setSlug] = useState<string>('');
  const [tag, setTag] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [relatedTags, setRelatedTags] = useState<any[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'hot' | 'new' | 'top'>('hot');
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d' | 'all'>('all');

  // 解析 params
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  const loadTagDetail = useCallback(async () => {
    if (!slug) return;

    try {
      setLoading(true);
      const userInfoStr = localStorage.getItem('user_info');
      const currentUserId = userInfoStr
        ? JSON.parse(userInfoStr).id || JSON.parse(userInfoStr).uid || JSON.parse(userInfoStr).email
        : null;

      const response = await barongAPI.get(`/public/community/tags/${slug}`, {
        params: { currentUserId },
      });

      if (response.data.success) {
        setTag(response.data.data);
        setIsSubscribed(response.data.data.isSubscribed || false);
      }
    } catch (error) {
      console.error('Failed to load tag detail:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const loadPosts = useCallback(async () => {
    if (!tag) return;

    try {
      setLoadingPosts(true);
      const response = await barongAPI.get(`/public/community/tags/${slug}/posts`, {
        params: {
          page: 1,
          limit: 20,
          sortBy,
          timeRange,
        },
      });

      if (response.data.success) {
        setPosts(response.data.data.posts);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  }, [slug, tag, sortBy, timeRange]);

  useEffect(() => {
    if (slug) {
      loadTagDetail();
    }
  }, [slug, loadTagDetail]);

  useEffect(() => {
    if (tag) {
      loadPosts();
    }
  }, [tag, loadPosts]);

  const loadPosts = async () => {
    try {
      const userInfoStr = localStorage.getItem('user_info');
      const currentUserId = userInfoStr
        ? JSON.parse(userInfoStr).id || JSON.parse(userInfoStr).uid || JSON.parse(userInfoStr).email
        : null;

      const response = await barongAPI.get(`/public/community/tags/${slug}/posts`, {
        params: {
          page: 1,
          limit: 20,
          sortBy,
          timeRange,
          currentUserId,
        },
      });

      if (response.data.success) {
        setPosts(response.data.data.posts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      message.error('加载帖子失败');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-gray-400">加载中...</div>
      </div>
    );
  }

  if (!tag) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回
        </button>

        {/* 标签信息 */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <TagBadge tag={tag} size="large" clickable={false} showIcon={true} />
              {tag.is_official && (
                <span className="px-3 py-1 bg-blue-600 text-white text-sm rounded-full">
                  官方标签
                </span>
              )}
            </div>
            <TagSubscribeButton
              tagSlug={tag.slug}
              isSubscribed={isSubscribed}
              onSubscribeChange={setIsSubscribed}
              size="large"
            />
          </div>

          {tag.description && <p className="text-gray-300 mb-4">{tag.description}</p>}

          <div className="flex items-center gap-6 text-sm text-gray-400">
            <span>{tag.post_count} 个帖子</span>
            <span>{tag.subscriber_count} 人订阅</span>
            <span>{tag.usage_count} 次使用</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 主内容区 */}
          <div className="lg:col-span-3">
            {/* 排序和筛选 */}
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 mb-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy('hot')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      sortBy === 'hot'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    热门
                  </button>
                  <button
                    onClick={() => setSortBy('new')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      sortBy === 'new'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Clock className="w-4 h-4 inline mr-1" />
                    最新
                  </button>
                  <button
                    onClick={() => setSortBy('top')}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      sortBy === 'top'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4 inline mr-1" />
                    最赞
                  </button>
                </div>

                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="all">全部时间</option>
                  <option value="1h">最近1小时</option>
                  <option value="24h">最近24小时</option>
                  <option value="7d">最近7天</option>
                  <option value="30d">最近30天</option>
                </select>
              </div>
            </div>

            {/* 帖子列表 */}
            <div className="space-y-4">
              {posts.length === 0 ? (
                <div className="bg-gray-800 border border-gray-700 rounded-lg p-12 text-center text-gray-400">
                  暂无帖子
                </div>
              ) : (
                posts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => router.push(`/community/posts/${post.id}`)}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors cursor-pointer"
                  >
                    <h3 className="text-lg font-semibold mb-2 hover:text-blue-400">{post.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{post.author_name}</span>
                      <span>•</span>
                      <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{post.view_count} 浏览</span>
                      <span>•</span>
                      <span>{post.comment_count} 评论</span>
                      <span>•</span>
                      <span>{post.vote_score} 分</span>
                    </div>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((t: any) => (
                          <TagBadge key={t.id} tag={t} size="small" clickable={false} />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            {/* 相关标签 */}
            {relatedTags.length > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">相关标签</h3>
                <div className="flex flex-wrap gap-2">
                  {relatedTags.map((t) => (
                    <TagBadge key={t.id} tag={t} size="small" clickable={true} showCount={true} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
