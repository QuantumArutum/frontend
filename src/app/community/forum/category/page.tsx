'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, Eye, ThumbsUp, Pin, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createExcerpt } from '@/lib/markdown-utils';
import '../../../../i18n';
import ParticlesBackground from '../../../../app/components/ParticlesBackground';
import CommunityNavbar from '../../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../../../components/EnhancedFooter';
import { barongAPI } from '@/api/client';

interface ForumPost {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  content: string;
  replies: number;
  views: number;
  likes: number;
  createdAt: string;
  lastReply: string | null;
  lastReplyBy: string | null;
  tags: string[];
  isPinned: boolean;
  isLocked: boolean;
}

interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  stats: {
    totalPosts: number;
    totalTopics: number;
    lastPost?: {
      title: string;
      author: string;
      time: string;
    };
  };
}

export default function ForumCategoryPage() {
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const categorySlug = searchParams?.get('slug') || '';

  const [category, setCategory] = useState<CategoryInfo | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('latest');

  const loadCategoryData = useCallback(async () => {
    if (!categorySlug) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await barongAPI.get(
        `/public/community/forum-category-posts?category=${categorySlug}&sortBy=${sortBy}&limit=20`
      );
      const data = response.data;
      if (data.success) {
        setCategory(data.data.category);
        setPosts(data.data.posts);
      }
    } catch (error) {
      console.error('Failed to load category data:', error);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, sortBy]);

  useEffect(() => {
    loadCategoryData();
  }, [loadCategoryData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('forum_category.time.just_now');
    if (minutes < 60) return t('forum_category.time.minutes_ago', { count: minutes });
    if (hours < 24) return t('forum_category.time.hours_ago', { count: hours });
    if (days < 7) return t('forum_category.time.days_ago', { count: days });
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <ParticlesBackground />
        <CommunityNavbar />
        <div className="text-center relative z-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <ParticlesBackground />
        <CommunityNavbar />
        <div className="text-center relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('forum_category.category_not_found')}
          </h1>
          <Link href="/community/forum" className="text-purple-400 hover:text-purple-300">
            {t('forum_category.back_to_forum')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 分类头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl">{category.icon}</div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{category.name}</h1>
                <p className="text-gray-300">{category.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {category.stats.totalPosts.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">{t('forum_category.stats.total_posts')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{category.stats.totalTopics}</div>
                <div className="text-sm text-gray-400">
                  {t('forum_category.stats.total_topics')}
                </div>
              </div>
              {category.stats.lastPost && (
                <div className="text-center">
                  <div className="text-sm text-gray-400 mb-1">
                    {t('forum_category.stats.latest_post')}
                  </div>
                  <div className="text-sm text-white font-medium truncate">
                    {category.stats.lastPost.title}
                  </div>
                  <div className="text-xs text-gray-400">
                    {t('forum_category.by')} {category.stats.lastPost.author} ·{' '}
                    {category.stats.lastPost.time}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* 筛选和排序 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
            >
              <option value="latest">{t('forum_category.sort.latest')}</option>
              <option value="popular">{t('forum_category.sort.popular')}</option>
              <option value="pinned">{t('forum_category.sort.pinned')}</option>
            </select>
          </div>
          <Link href={`/community/forum/category/new?slug=${categorySlug}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-cyan-600 transition-all"
            >
              {t('forum_category.new_topic')}
            </motion.button>
          </Link>
        </motion.div>

        {/* 帖子列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {posts.length === 0 ? (
            <div className="text-center py-12 text-gray-400">{t('forum_category.no_posts')}</div>
          ) : (
            posts.map((post) => (
              <motion.div
                key={post.id}
                whileHover={{ scale: 1.01 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {post.isPinned && (
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Pin className="h-3 w-3" />
                          {t('forum_category.pinned')}
                        </span>
                      )}
                      {post.isLocked && (
                        <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          {t('forum_category.locked')}
                        </span>
                      )}
                    </div>
                    <Link href={`/community/posts?id=${post.id}`}>
                      <h3 className="text-xl font-bold text-white mb-2 hover:text-purple-400 transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-gray-300 mb-3 line-clamp-2">
                      {createExcerpt(post.content, 120)}
                    </p>
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-2xl">{post.authorAvatar}</span>
                      <span className="text-white font-medium">{post.author}</span>
                      <span className="text-gray-400">· {formatDate(post.createdAt)}</span>
                    </div>
                    {post.tags.length > 0 && (
                      <div className="flex gap-2">
                        {post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-white/20 text-white px-2 py-1 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {post.replies}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-4 w-4" />
                        {post.likes}
                      </span>
                    </div>
                    {post.lastReply && post.lastReplyBy && (
                      <div className="text-xs text-gray-400">
                        {t('forum_category.last_reply')}: {post.lastReplyBy} ·{' '}
                        {formatDate(post.lastReply)}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* 分页 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center mt-8"
        >
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              {t('forum_category.pagination.prev')}
            </button>
            <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">1</button>
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              2
            </button>
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              3
            </button>
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              {t('forum_category.pagination.next')}
            </button>
          </div>
        </motion.div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
