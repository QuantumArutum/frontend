'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, Eye, ThumbsUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../../../i18n';
import ParticlesBackground from '../../../../app/components/ParticlesBackground';
import CommunityNavbar from '../../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../../../components/EnhancedFooter';

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
  lastReply: string;
  lastReplyBy: string;
  tags: string[];
  isPinned: boolean;
  isLocked: boolean;
}

export default function ForumCategoryPage() {
  const params = useParams();
  const { t } = useTranslation();
  const categoryId = (params?.category as string) || '';

  const categoryData: Record<string, { name: string; description: string; icon: string; color: string; stats: { totalPosts: number; totalTopics: number; lastPost: { title: string; author: string; time: string } } }> = {
    general: {
      name: t('forum_category.categories.general.name'),
      description: t('forum_category.categories.general.description'),
      icon: '💬',
      color: 'from-blue-500 to-cyan-500',
      stats: { totalPosts: 45230, totalTopics: 1250, lastPost: { title: t('forum_category.sample_posts.general'), author: 'CryptoExpert', time: t('forum_category.time.minutes_ago', { count: 5 }) } }
    },
    technical: {
      name: t('forum_category.categories.technical.name'),
      description: t('forum_category.categories.technical.description'),
      icon: '⚙️',
      color: 'from-purple-500 to-pink-500',
      stats: { totalPosts: 38900, totalTopics: 890, lastPost: { title: t('forum_category.sample_posts.technical'), author: 'QuantumDev', time: t('forum_category.time.minutes_ago', { count: 12 }) } }
    },
    defi: {
      name: t('forum_category.categories.defi.name'),
      description: t('forum_category.categories.defi.description'),
      icon: '📊',
      color: 'from-green-500 to-emerald-500',
      stats: { totalPosts: 28500, totalTopics: 567, lastPost: { title: t('forum_category.sample_posts.defi'), author: 'DeFiMaster', time: t('forum_category.time.minutes_ago', { count: 8 }) } }
    },
    trading: {
      name: t('forum_category.categories.trading.name'),
      description: t('forum_category.categories.trading.description'),
      icon: '📈',
      color: 'from-orange-500 to-red-500',
      stats: { totalPosts: 32100, totalTopics: 678, lastPost: { title: t('forum_category.sample_posts.trading'), author: 'TradeKing', time: t('forum_category.time.minutes_ago', { count: 3 }) } }
    },
    governance: {
      name: t('forum_category.categories.governance.name'),
      description: t('forum_category.categories.governance.description'),
      icon: '🏛️',
      color: 'from-indigo-500 to-purple-500',
      stats: { totalPosts: 15600, totalTopics: 234, lastPost: { title: t('forum_category.sample_posts.governance'), author: 'Governor', time: t('forum_category.time.minutes_ago', { count: 15 }) } }
    },
    events: {
      name: t('forum_category.categories.events.name'),
      description: t('forum_category.categories.events.description'),
      icon: '🎉',
      color: 'from-yellow-500 to-orange-500',
      stats: { totalPosts: 8900, totalTopics: 156, lastPost: { title: t('forum_category.sample_posts.events'), author: 'EventTeam', time: t('forum_category.time.hours_ago', { count: 1 }) } }
    }
  };

  const category = categoryData[categoryId];
  
  const [posts] = useState<ForumPost[]>([
    {
      id: '1',
      title: t('forum_category.sample_post_titles.post1'),
      author: 'QuantumTeam',
      authorAvatar: '👨‍💻',
      content: t('forum_category.sample_post_contents.post1'),
      replies: 234,
      views: 5678,
      likes: 445,
      createdAt: t('forum_category.time.hours_ago', { count: 2 }),
      lastReply: t('forum_category.time.minutes_ago', { count: 2 }),
      lastReplyBy: 'CryptoFan',
      tags: [t('forum_category.tags.update'), t('forum_category.tags.wallet'), t('forum_category.tags.new_feature')],
      isPinned: true,
      isLocked: false
    },
    {
      id: '2',
      title: t('forum_category.sample_post_titles.post2'),
      author: 'SecurityExpert',
      authorAvatar: '🛡️',
      content: t('forum_category.sample_post_contents.post2'),
      replies: 156,
      views: 3421,
      likes: 289,
      createdAt: t('forum_category.time.hours_ago', { count: 5 }),
      lastReply: t('forum_category.time.minutes_ago', { count: 15 }),
      lastReplyBy: 'QuantumDev',
      tags: [t('forum_category.tags.security'), t('forum_category.tags.quantum_key'), t('forum_category.tags.tutorial')],
      isPinned: false,
      isLocked: false
    },
    {
      id: '3',
      title: t('forum_category.sample_post_titles.post3'),
      author: 'EconAnalyst',
      authorAvatar: '📊',
      content: t('forum_category.sample_post_contents.post3'),
      replies: 89,
      views: 2156,
      likes: 167,
      createdAt: t('forum_category.time.days_ago', { count: 1 }),
      lastReply: t('forum_category.time.hours_ago', { count: 1 }),
      lastReplyBy: 'TokenHolder',
      tags: [t('forum_category.tags.tokenomics'), t('forum_category.tags.analysis'), 'QAU'],
      isPinned: false,
      isLocked: false
    }
  ]);

  const [sortBy, setSortBy] = useState('latest');
  const [filterBy, setFilterBy] = useState('all');

  if (!category) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <ParticlesBackground />
        <CommunityNavbar />
        <div className="text-center relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">{t('forum_category.category_not_found')}</h1>
          <Link href="/community" className="text-purple-400 hover:text-purple-300">{t('forum_category.back_to_community')}</Link>
        </div>
      </div>
    );
  }

  const filteredPosts = posts.filter(post => {
    if (filterBy === 'pinned') return post.isPinned;
    if (filterBy === 'unlocked') return !post.isLocked;
    return true;
  });

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10 container mx-auto px-4 py-8">

        {/* 分类头部 */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
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
                <div className="text-2xl font-bold text-white">{category.stats.totalPosts.toLocaleString()}</div>
                <div className="text-sm text-gray-400">{t('forum_category.stats.total_posts')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{category.stats.totalTopics}</div>
                <div className="text-sm text-gray-400">{t('forum_category.stats.total_topics')}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">{t('forum_category.stats.latest_post')}</div>
                <div className="text-sm text-white font-medium truncate">{category.stats.lastPost.title}</div>
                <div className="text-xs text-gray-400">{t('forum_category.by')} {category.stats.lastPost.author} · {category.stats.lastPost.time}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 筛选和排序 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
              <option value="all">{t('forum_category.filters.all')}</option>
              <option value="pinned">{t('forum_category.filters.pinned')}</option>
              <option value="unlocked">{t('forum_category.filters.unlocked')}</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
              <option value="latest">{t('forum_category.sort.latest')}</option>
              <option value="popular">{t('forum_category.sort.popular')}</option>
              <option value="views">{t('forum_category.sort.views')}</option>
            </select>
          </div>
          <Link href={`/community/forum/${categoryId}/new`}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-cyan-600 transition-all">
              {t('forum_category.new_topic')}
            </motion.button>
          </Link>
        </motion.div>

        {/* 帖子列表 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {filteredPosts.map((post) => (
            <motion.div key={post.id} whileHover={{ scale: 1.01 }} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {post.isPinned && <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">{t('forum_category.pinned')}</span>}
                    {post.isLocked && <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">{t('forum_category.locked')}</span>}
                  </div>
                  <Link href={`/community/post/${post.id}`}>
                    <h3 className="text-xl font-bold text-white mb-2 hover:text-purple-400 transition-colors">{post.title}</h3>
                  </Link>
                  <p className="text-gray-300 mb-3 line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-2xl">{post.authorAvatar}</span>
                    <span className="text-white font-medium">{post.author}</span>
                    <span className="text-gray-400">· {post.createdAt}</span>
                  </div>
                  <div className="flex gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="bg-white/20 text-white px-2 py-1 rounded-full text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" />{post.replies}</span>
                    <span className="flex items-center gap-1"><Eye className="h-4 w-4" />{post.views}</span>
                    <span className="flex items-center gap-1"><ThumbsUp className="h-4 w-4" />{post.likes}</span>
                  </div>
                  <div className="text-xs text-gray-400">{t('forum_category.last_reply')}: {post.lastReplyBy} · {post.lastReply}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 分页 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mt-8">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">{t('forum_category.pagination.prev')}</button>
            <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">1</button>
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">2</button>
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">3</button>
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">{t('forum_category.pagination.next')}</button>
          </div>
        </motion.div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
