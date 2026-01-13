'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Search, Star, MessageSquare } from 'lucide-react';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

interface Member {
  id: string;
  username: string;
  avatar: string;
  roleKey: string;
  reputation: number;
  posts: number;
  joined: string;
  lastActiveKey: string;
  badges: string[];
  isOnline: boolean;
}

const membersData: Member[] = [
  { id: '1', username: 'QuantumDev', avatar: 'Q', roleKey: 'core_developer', reputation: 9850, posts: 1234, joined: '2023-01', lastActiveKey: 'just_now', badges: ['🏆', '⭐', '🔧'], isOnline: true },
  { id: '2', username: 'CryptoQueen', avatar: 'C', roleKey: 'community_leader', reputation: 8920, posts: 987, joined: '2023-02', lastActiveKey: '5_min', badges: ['👑', '💎'], isOnline: true },
  { id: '3', username: 'BlockchainBob', avatar: 'B', roleKey: 'senior_member', reputation: 7650, posts: 756, joined: '2023-03', lastActiveKey: '1_hour', badges: ['🎯', '📚'], isOnline: true },
  { id: '4', username: 'DeFiAlice', avatar: 'D', roleKey: 'defi_expert', reputation: 6890, posts: 654, joined: '2023-04', lastActiveKey: '2_hours', badges: ['💰', '📈'], isOnline: false },
  { id: '5', username: 'NodeMaster', avatar: 'N', roleKey: 'validator', reputation: 6540, posts: 543, joined: '2023-05', lastActiveKey: '3_hours', badges: ['🔗', '⚡'], isOnline: true },
  { id: '6', username: 'SmartContract', avatar: 'S', roleKey: 'developer', reputation: 5890, posts: 432, joined: '2023-06', lastActiveKey: '4_hours', badges: ['📜', '🔐'], isOnline: false },
  { id: '7', username: 'TokenTrader', avatar: 'T', roleKey: 'trader', reputation: 5430, posts: 321, joined: '2023-07', lastActiveKey: '5_hours', badges: ['📊', '💹'], isOnline: true },
  { id: '8', username: 'GovernanceGuru', avatar: 'G', roleKey: 'dao_member', reputation: 4980, posts: 298, joined: '2023-08', lastActiveKey: '6_hours', badges: ['🏛️', '🗳️'], isOnline: false },
];

export default function MembersPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('reputation');
  const [filterRole, setFilterRole] = useState('all');

  const filteredMembers = membersData
    .filter(m => m.username.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(m => filterRole === 'all' || m.roleKey.toLowerCase().includes(filterRole.toLowerCase()))
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
            <Link href="/community" className="hover:text-white">{t('nav.community')}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{t('community_page.members.title')}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('community_page.members.title')}</h1>
          <p className="text-gray-400">{String(t('community_page.members.discover')).replace('{{count}}', '125,847')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-white">125,847</div>
            <div className="text-sm text-gray-400">{t('community_page.members.stats.total')}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-green-400">85,341</div>
            <div className="text-sm text-gray-400">{t('community_page.members.stats.online')}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-purple-400">1,234</div>
            <div className="text-sm text-gray-400">{t('community_page.members.stats.new_today')}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="text-2xl font-bold text-orange-400">156</div>
            <div className="text-sm text-gray-400">{t('community_page.members.stats.validators')}</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('community_page.members.search')}
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
            <option value="reputation">{t('community_page.members.sort.reputation')}</option>
            <option value="posts">{t('community_page.members.sort.posts')}</option>
          </select>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
          >
            <option value="all">{t('community_page.members.filters.all')}</option>
            <option value="developer">{t('community_page.members.filters.developer')}</option>
            <option value="leader">{t('community_page.members.filters.leader')}</option>
            <option value="validator">{t('community_page.members.filters.validator')}</option>
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
                  <p className="text-sm text-gray-400">{t(`community_page.members.roles.${member.roleKey}`)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-white">{member.reputation.toLocaleString()}</span>
                  <span className="text-gray-500">{t('community_page.members.stats_label.reputation')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MessageSquare className="w-4 h-4 text-blue-400" />
                  <span className="text-white">{member.posts}</span>
                  <span className="text-gray-500">{t('community_page.members.stats_label.posts')}</span>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-3">
                {t('community_page.members.last_active')}: {t(`community_page.members.time.${member.lastActiveKey}`)}
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
