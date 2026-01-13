'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Search, Filter, Star, MessageSquare, Award, TrendingUp } from 'lucide-react';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';

interface Member {
  id: string;
  username: string;
  avatar: string;
  role: string;
  reputation: number;
  posts: number;
  joined: string;
  lastActive: string;
  badges: string[];
  isOnline: boolean;
}

const members: Member[] = [
  { id: '1', username: 'QuantumDev', avatar: 'Q', role: 'Core Developer', reputation: 9850, posts: 1234, joined: '2023-01', lastActive: '刚刚', badges: ['🏆', '⭐', '🔧'], isOnline: true },
  { id: '2', username: 'CryptoQueen', avatar: 'C', role: 'Community Leader', reputation: 8920, posts: 987, joined: '2023-02', lastActive: '5分钟前', badges: ['👑', '💎'], isOnline: true },
  { id: '3', username: 'BlockchainBob', avatar: 'B', role: 'Senior Member', reputation: 7650, posts: 756, joined: '2023-03', lastActive: '1小时前', badges: ['🎯', '📚'], isOnline: true },
  { id: '4', username: 'DeFiAlice', avatar: 'D', role: 'DeFi Expert', reputation: 6890, posts: 654, joined: '2023-04', lastActive: '2小时前', badges: ['💰', '📈'], isOnline: false },
  { id: '5', username: 'NodeMaster', avatar: 'N', role: 'Validator', reputation: 6540, posts: 543, joined: '2023-05', lastActive: '3小时前', badges: ['🔗', '⚡'], isOnline: true },
  { id: '6', username: 'SmartContract', avatar: 'S', role: 'Developer', reputation: 5890, posts: 432, joined: '2023-06', lastActive: '4小时前', badges: ['📜', '🔐'], isOnline: false },
  { id: '7', username: 'TokenTrader', avatar: 'T', role: 'Trader', reputation: 5430, posts: 321, joined: '2023-07', lastActive: '5小时前', badges: ['📊', '💹'], isOnline: true },
  { id: '8', username: 'GovernanceGuru', avatar: 'G', role: 'DAO Member', reputation: 4980, posts: 298, joined: '2023-08', lastActive: '6小时前', badges: ['🏛️', '🗳️'], isOnline: false },
];

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('reputation');
  const [filterRole, setFilterRole] = useState('all');

  const filteredMembers = members
    .filter(m => m.username.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(m => filterRole === 'all' || m.role.toLowerCase().includes(filterRole.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'reputation') return b.reputation - a.reputation;
      if (sortBy === 'posts') return b.posts - a.posts;
      return 0;
    });

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
            <span className="text-white">Members</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">社区成员</h1>
          <p className="text-gray-400">发现并连接 125,847 位社区成员</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-white">125,847</div>
            <div className="text-sm text-gray-400">总成员</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-green-400">85,341</div>
            <div className="text-sm text-gray-400">在线</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-purple-400">1,234</div>
            <div className="text-sm text-gray-400">今日新增</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-orange-400">156</div>
            <div className="text-sm text-gray-400">验证者</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索成员..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
          >
            <option value="reputation">声望排序</option>
            <option value="posts">帖子数排序</option>
          </select>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
          >
            <option value="all">所有角色</option>
            <option value="developer">开发者</option>
            <option value="leader">社区领袖</option>
            <option value="validator">验证者</option>
          </select>
        </div>

        {/* Members Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <Link
              key={member.id}
              href={`/community/user/${member.id}`}
              className="bg-white/5 rounded-xl border border-white/10 p-6 hover:border-cyan-500/50 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
                    {member.avatar}
                  </div>
                  {member.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#1a1a2e]" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      {member.username}
                    </h3>
                    <div className="flex gap-1">
                      {member.badges.map((badge, i) => (
                        <span key={i}>{badge}</span>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{member.role}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-white">{member.reputation.toLocaleString()}</span>
                  <span className="text-gray-500">声望</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span className="text-white">{member.posts}</span>
                  <span className="text-gray-500">帖子</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-3">
                最后活跃: {member.lastActive}
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
