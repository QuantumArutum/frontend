'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, MessageSquare, ThumbsUp, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../../i18n';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  category: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  commentCount: number;
  likeCount: number;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();
  const query = searchParams?.get('q') || '';

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/v2/barong/public/community/search?q=${encodeURIComponent(searchQuery)}&type=posts`);
      const data = await response.json();
      if (data.success) {
        setResults(data.data.results.posts || []);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/community/search?q=${encodeURIComponent(searchInput)}`);
    }
  };

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">{t('search_page.title')}</h1>
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={t('search_page.search_placeholder')}
              className="w-full pl-12 pr-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-white mt-4">{t('search_page.searching')}</p>
          </div>
        ) : query && results.length === 0 ? (
          <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-12 text-center">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">{t('search_page.no_results', { query })}</p>
            <p className="text-gray-500 mt-2">{t('search_page.try_different')}</p>
          </div>
        ) : query ? (
          <div>
            <p className="text-gray-400 mb-6">{t('search_page.found_results', { count: results.length })}</p>
            <div className="space-y-4">
              {results.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => router.push(`/community/post/${post.id}`)}
                  className="bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6 hover:border-blue-500/50 transition-all cursor-pointer"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{post.userName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.commentCount || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.likeCount || 0}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-12 text-center">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">{t('search_page.enter_keywords')}</p>
          </div>
        )}
      </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}

// Loading fallback component
function SearchLoading() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10">
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-white mt-4">{t('search_page.loading')}</p>
        </div>
      </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchLoading />}>
      <SearchContent />
    </Suspense>
  );
}

