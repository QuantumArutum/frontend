'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronRight, Search, Star, MessageSquare } from 'lucide-react';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import { useTranslation } from 'react-i18next';
import '../../../i18n';
import { barongAPI } from '@/api/client';

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

export default function MembersPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('reputation');
  const [filterRole, setFilterRole] = useState('all');
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMembers: 0,
    onlineMembers: 0,
    newToday: 0,
    validators: 0,
  });

  const loadMembers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await barongAPI.get(
        `/public/community/members?limit=50&sortBy=${sortBy}&search=${searchQuery}`
      );
      const data = response.data;
      if (data.success) {
        setMembers(data.data.members);
      }
    } catch (error) {
      console.error('Failed to load members:', error);
    } finally {
      setLoading(false);
    }
  }, [sortBy, searchQuery]);

  const loadStats = useCallback(async () => {
    try {
      const response = await barongAPI.get('/public/community/members-stats');
      const data = response.data;
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }, []);

  useEffect(() => {
    loadMembers();
    loadStats();
  }, [loadMembers, loadStats]);

  const filteredMembers = members.filter(
    (m) => filterRole === 'all' || m.roleKey.toLowerCase().includes(filterRole.toLowerCase())
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
              <Link href="/community" className="hover:text-white">
                {t('nav.community')}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{t('community_page.members.title')}</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {t('community_page.members.title')}
            </h1>
            <p className="text-gray-400">
              {String(t('community_page.members.discover')).replace(
                '{{count}}',
                stats.totalMembers.toLocaleString()
              )}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white">
                {stats.totalMembers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">{t('community_page.members.stats.total')}</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-green-400">
                {stats.onlineMembers.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                {t('community_page.members.stats.online')}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-purple-400">
                {stats.newToday.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                {t('community_page.members.stats.new_today')}
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-orange-400">
                {stats.validators.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                {t('community_page.members.stats.validators')}
              </div>
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
                    <p className="text-sm text-gray-400">
                      {t(`community_page.members.roles.${member.roleKey}`)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-white">{member.reputation.toLocaleString()}</span>
                    <span className="text-gray-500">
                      {t('community_page.members.stats_label.reputation')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span className="text-white">{member.posts}</span>
                    <span className="text-gray-500">
                      {t('community_page.members.stats_label.posts')}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-3">
                  {t('community_page.members.last_active')}:{' '}
                  {t(`community_page.members.time.${member.lastActiveKey}`)}
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
