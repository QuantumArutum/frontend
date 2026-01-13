'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, Eye, ThumbsUp } from 'lucide-react';
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

const categoryData: Record<string, { name: string; description: string; icon: string; color: string; stats: { totalPosts: number; totalTopics: number; lastPost: { title: string; author: string; time: string } } }> = {
  general: {
    name: '综合讨论',
    description: '关于Quantaureum的一般性讨论，包括使用心得、经验分享等',
    icon: '💬',
    color: 'from-blue-500 to-cyan-500',
    stats: { totalPosts: 45230, totalTopics: 1250, lastPost: { title: '量子安全钱包使用心得', author: 'CryptoExpert', time: '5分钟前' } }
  },
  technical: {
    name: '技术交流',
    description: '技术问题讨论、代码分享、解决方案交流',
    icon: '⚙️',
    color: 'from-purple-500 to-pink-500',
    stats: { totalPosts: 38900, totalTopics: 890, lastPost: { title: '后量子算法性能优化', author: 'QuantumDev', time: '12分钟前' } }
  },
  defi: {
    name: 'DeFi讨论',
    description: 'DeFi协议、流动性挖矿、收益策略等讨论',
    icon: '📊',
    color: 'from-green-500 to-emerald-500',
    stats: { totalPosts: 28500, totalTopics: 567, lastPost: { title: '新流动性池上线讨论', author: 'DeFiMaster', time: '8分钟前' } }
  },
  trading: {
    name: '交易讨论',
    description: '市场分析、交易策略、价格讨论',
    icon: '📈',
    color: 'from-orange-500 to-red-500',
    stats: { totalPosts: 32100, totalTopics: 678, lastPost: { title: 'QAU价格走势分析', author: 'TradeKing', time: '3分钟前' } }
  },
  governance: {
    name: '社区治理',
    description: 'DAO治理、提案讨论、投票相关',
    icon: '🏛️',
    color: 'from-indigo-500 to-purple-500',
    stats: { totalPosts: 15600, totalTopics: 234, lastPost: { title: '新治理提案投票', author: 'Governor', time: '15分钟前' } }
  },
  events: {
    name: '活动专区',
    description: '线上线下活动信息发布、活动回顾',
    icon: '🎉',
    color: 'from-yellow-500 to-orange-500',
    stats: { totalPosts: 8900, totalTopics: 156, lastPost: { title: '下周AMA活动预告', author: 'EventTeam', time: '1小时前' } }
  }
};

export default function ForumCategoryPage() {
  const params = useParams();
  const categoryId = (params?.category as string) || '';
  const category = categoryData[categoryId];
  
  const [posts] = useState<ForumPost[]>([
    {
      id: '1',
      title: '🚀 量子安全钱包v2.0发布，新增多链支持',
      author: 'QuantumTeam',
      authorAvatar: '👨‍💻',
      content: '我们很高兴地宣布量子安全钱包v2.0正式发布！这次更新带来了多项重要功能...',
      replies: 234,
      views: 5678,
      likes: 445,
      createdAt: '2小时前',
      lastReply: '2分钟前',
      lastReplyBy: 'CryptoFan',
      tags: ['更新', '钱包', '新功能'],
      isPinned: true,
      isLocked: false
    },
    {
      id: '2',
      title: '💡 如何安全地存储量子密钥？',
      author: 'SecurityExpert',
      authorAvatar: '🛡️',
      content: '随着量子计算的发展，传统的加密方式面临挑战...',
      replies: 156,
      views: 3421,
      likes: 289,
      createdAt: '5小时前',
      lastReply: '15分钟前',
      lastReplyBy: 'QuantumDev',
      tags: ['安全', '量子密钥', '教程'],
      isPinned: false,
      isLocked: false
    },
    {
      id: '3',
      title: '📊 QAU代币经济学深度分析',
      author: 'EconAnalyst',
      authorAvatar: '📊',
      content: 'QAU代币作为Quantaureum生态的核心，其经济模型设计精妙...',
      replies: 89,
      views: 2156,
      likes: 167,
      createdAt: '1天前',
      lastReply: '1小时前',
      lastReplyBy: 'TokenHolder',
      tags: ['代币经济', '分析', 'QAU'],
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
          <h1 className="text-4xl font-bold text-white mb-4">分类不存在</h1>
          <Link href="/community" className="text-purple-400 hover:text-purple-300">返回社区首页</Link>
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
                <div className="text-sm text-gray-400">帖子总数</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{category.stats.totalTopics}</div>
                <div className="text-sm text-gray-400">主题数</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-1">最新帖子</div>
                <div className="text-sm text-white font-medium truncate">{category.stats.lastPost.title}</div>
                <div className="text-xs text-gray-400">由 {category.stats.lastPost.author} · {category.stats.lastPost.time}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 筛选和排序 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <select value={filterBy} onChange={(e) => setFilterBy(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
              <option value="all">全部帖子</option>
              <option value="pinned">置顶帖子</option>
              <option value="unlocked">未锁定帖子</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white">
              <option value="latest">最新发布</option>
              <option value="popular">最多回复</option>
              <option value="views">最多浏览</option>
            </select>
          </div>
          <Link href={`/community/forum/${categoryId}/new`}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-cyan-600 transition-all">
              发布新主题
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
                    {post.isPinned && <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-medium">置顶</span>}
                    {post.isLocked && <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-medium">已锁定</span>}
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
                  <div className="text-xs text-gray-400">最后回复: {post.lastReplyBy} · {post.lastReply}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 分页 */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mt-8">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">上一页</button>
            <button className="px-4 py-2 bg-purple-500 text-white rounded-lg">1</button>
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">2</button>
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">3</button>
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">下一页</button>
          </div>
        </motion.div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
