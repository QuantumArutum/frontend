'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Users, Clock, TrendingUp, Search, Filter, ChevronRight } from 'lucide-react';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import { useTranslation } from 'react-i18next';
import '../../../i18n';
import { barongAPI } from '@/api/client';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  posts: number;
  topics: number;
  lastPost: {
    id: string;
    title: string;
    author: string;
    time: string;
  } | null;
  color: string;
}

export default function ForumPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('activity');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await barongAPI.get('/public/community/forum-categories');
      const data = response.data;
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <Link href="/community" className="hover:text-white">{t('community_page.forum.breadcrumb.community')}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{t('community_page.forum.breadcrumb.forum')}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('community_page.forum.title')}</h1>
          <p className="text-gray-400">{t('community_page.forum.subtitle')}</p>
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
                <div className="text-sm text-gray-400">{t('community_page.forum.stats.total_posts')}</div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">7.5K</div>
                <div className="text-sm text-gray-400">{t('community_page.forum.stats.topics')}</div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">125.8K</div>
                <div className="text-sm text-gray-400">{t('community_page.forum.stats.members')}</div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-orange-400" />
              <div>
                <div className="text-2xl font-bold text-white">85K</div>
                <div className="text-sm text-gray-400">{t('community_page.forum.stats.online_now')}</div>
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
              placeholder={t('community_page.forum.search_placeholder')}
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
              <option value="activity">{t('community_page.forum.sort.activity')}</option>
              <option value="posts">{t('community_page.forum.sort.posts')}</option>
              <option value="topics">{t('community_page.forum.sort.topics')}</option>
            </select>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-white mt-4">{t('common.loading')}</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              {t('community_page.forum.no_categories')}
            </div>
          ) : (
            filteredCategories.map((category) => (
            <Link
              key={category.id}
              href={`/community/forum/category?slug=${category.slug}`}
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
                      <span className="text-white font-medium">{category.posts.toLocaleString()}</span> {t('community_page.forum.posts')}
                    </div>
                    <div className="text-gray-400">
                      <span className="text-white font-medium">{category.topics.toLocaleString()}</span> {t('community_page.forum.topics_label')}
                    </div>
                    <div className="text-gray-400 flex-1 text-right">
                      {category.lastPost ? (
                        <>
                          {t('community_page.forum.latest')}: <span className="text-cyan-400">{category.lastPost.title}</span>
                          <span className="text-gray-500"> by {category.lastPost.author} · {new Date(category.lastPost.time).toLocaleString()}</span>
                        </>
                      ) : (
                        <span className="text-gray-500">{t('community_page.forum.no_posts')}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )))}
        </div>
      </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
