'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Users, Clock, TrendingUp, Search, Filter, ChevronRight } from 'lucide-react';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  posts: number;
  topics: number;
  lastPost: {
    title: string;
    author: string;
    time: string;
  };
  color: string;
}

const categories: Category[] = [
  {
    id: 'general',
    name: 'General Discussion',
    description: '社区公告、新闻和一般性讨论',
    icon: '💬',
    posts: 15420,
    topics: 2340,
    lastPost: { title: 'Welcome to Quantaureum!', author: 'Admin', time: '5分钟前' },
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'technical',
    name: 'Technical',
    description: '技术讨论、开发问题和代码分享',
    icon: '⚙️',
    posts: 8930,
    topics: 1560,
    lastPost: { title: 'How to implement quantum signatures', author: 'QuantumDev', time: '12分钟前' },
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'defi',
    name: 'DeFi & Trading',
    description: '去中心化金融、交易策略和市场分析',
    icon: '📈',
    posts: 12650,
    topics: 1890,
    lastPost: { title: 'QAU/USDT price analysis', author: 'CryptoQueen', time: '23分钟前' },
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'governance',
    name: 'Governance',
    description: '社区治理、提案投票和决策讨论',
    icon: '🏛️',
    posts: 3420,
    topics: 456,
    lastPost: { title: 'Proposal #15: Fee reduction', author: 'GovernanceDAO', time: '1小时前' },
    color: 'from-orange-500 to-amber-500'
  },
  {
    id: 'support',
    name: 'Help & Support',
    description: '获取帮助、报告问题和寻求支持',
    icon: '🆘',
    posts: 5670,
    topics: 890,
    lastPost: { title: 'Wallet connection issue', author: 'NewUser123', time: '45分钟前' },
    color: 'from-red-500 to-rose-500'
  },
  {
    id: 'showcase',
    name: 'Project Showcase',
    description: '展示你的项目、dApp和创意',
    icon: '🚀',
    posts: 2340,
    topics: 345,
    lastPost: { title: 'My first quantum dApp', author: 'Builder', time: '2小时前' },
    color: 'from-indigo-500 to-violet-500'
  }
];

export default function ForumPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('activity');

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <Link href="/community" className="hover:text-white">Community</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Forum</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Community Forum</h1>
          <p className="text-gray-400">探索讨论、分享知识、连接社区</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">48.4K</div>
                <div className="text-sm text-gray-400">Total Posts</div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">7.5K</div>
                <div className="text-sm text-gray-400">Topics</div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">125.8K</div>
                <div className="text-sm text-gray-400">Members</div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-orange-400" />
              <div>
                <div className="text-2xl font-bold text-white">85K</div>
                <div className="text-sm text-gray-400">Online Now</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索分类..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
            >
              <option value="activity">最近活动</option>
              <option value="posts">帖子数量</option>
              <option value="topics">话题数量</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <Link
              key={category.id}
              href={`/community/forum/${category.id}`}
              className="block bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all overflow-hidden group"
            >
              <div className="flex items-stretch">
                <div className={`w-2 bg-gradient-to-b ${category.color}`} />
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{category.icon}</div>
                      <div>
                        <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-gray-400 mt-1">{category.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex items-center gap-6 mt-4 text-sm">
                    <div className="text-gray-400">
                      <span className="text-white font-medium">{category.posts.toLocaleString()}</span> 帖子
                    </div>
                    <div className="text-gray-400">
                      <span className="text-white font-medium">{category.topics.toLocaleString()}</span> 话题
                    </div>
                    <div className="text-gray-400 flex-1 text-right">
                      最新: <span className="text-cyan-400">{category.lastPost.title}</span>
                      <span className="text-gray-500"> by {category.lastPost.author} · {category.lastPost.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
