'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, User, FileText, Calendar, MessageSquare, Heart, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createExcerpt } from '@/lib/markdown-utils';
import '../../../i18n';
import ParticlesBackground from '../../../app/components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../../components/EnhancedFooter';
import { barongAPI } from '@/api/client';

interface SearchResult {
  posts: Array<{
    id: number;
    title: string;
    content: string;
    category: string;
    categorySlug: string;
    userId: string;
    userName: string;
    userAvatar: string;
    createdAt: string;
    commentCount: number;
    likeCount: number;
    viewCount: number;
  }>;
  users: Array<{
    id: string;
    username: string;
    email: string;
    avatar: string;
    joinedAt: string;
  }>;
  tags: Array<any>;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();

  const query = searchParams?.get('q') || '';
  const type = searchParams?.get('type') || 'all';

  const [searchQuery, setSearchQuery] = useState(query);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResult>({
    posts: [],
    users: [],
    tags: [],
  });
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'posts' | 'users' | 'tags'>(type as any);

  useEffect(() => {
    if (query) {
      performSearch(query, type);
    }
  }, [query, type]);

  const performSearch = async (q: string, searchType: string = 'all') => {
    if (!q.trim()) return;

    try {
      setLoading(true);
      const response = await barongAPI.get(`/public/community/search?q=${encodeURIComponent(q)}&type=${searchType}&limit=20`);
      
      if (response.data.success) {
        setResults(response.data.data.results);
        setTotal(response.data.data.pagination.total);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/community/search?q=${encodeURIComponent(searchQuery)}&type=${activeTab}`);
    }
  };

  const handleTabChange = (tab: 'all' | 'posts' | 'users' | 'tags') => {
    setActiveTab(tab);
    if (query) {
      router.push(`/community/search?q=${encodeURIComponent(query)}&type=${tab}`);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <mark key={i} className="bg-yellow-500/30 text-yellow-200">{part}</mark> : 
        part
    );
  };

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10 w-full h-full">
        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* 搜索框 */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索帖子、用户..."
                  className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl hover:from-purple-600 hover:to-cyan-600 transition-all"
                >
                  搜索
                </button>
              </div>
            </form>
          </div>

          {/* 搜索结果标题 */}
          {query && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white mb-2">
                搜索结果: "{query}"
              </h1>
              <p className="text-white/60">
                找到 {total} 个结果
              </p>
            </div>
          )}

          {/* 标签页 */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            <button
              onClick={() => handleTabChange('all')}
              className={`px-6 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => handleTabChange('posts')}
              className={`px-6 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'posts'
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              帖子 ({results.posts.length})
            </button>
            <button
              onClick={() => handleTabChange('users')}
              className={`px-6 py-2 rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'users'
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              用户 ({results.users.length})
            </button>
          </div>

          {/* 加载状态 */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/70">搜索中...</p>
            </div>
          )}

          {/* 搜索结果 */}
          {!loading && query && (
            <div className="space-y-6">
              {/* 帖子结果 */}
              {(activeTab === 'all' || activeTab === 'posts') && results.posts.length > 0 && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    帖子
                  </h2>
                  <div className="space-y-4">
                    {results.posts.map((post) => (
                      <Link
                        key={post.id}
                        href={`/community/posts?id=${post.id}`}
                        className="block p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                            {post.userAvatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-white mb-1">
                              {highlightText(post.title, query)}
                            </h3>
                            <p className="text-white/70 text-sm mb-2 line-clamp-2">
                              {highlightText(createExcerpt(post.content, 120), query)}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-white/50">
                              <span className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                {post.userName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(post.createdAt)}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-4 h-4" />
                                {post.commentCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart className="w-4 h-4" />
                                {post.likeCount}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {post.viewCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 用户结果 */}
              {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5" />
                    用户
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.users.map((user) => (
                      <Link
                        key={user.id}
                        href={`/community/user/${user.username}`}
                        className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {user.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-semibold">
                            {highlightText(user.username, query)}
                          </h3>
                          <p className="text-white/50 text-sm">
                            加入于 {formatDate(user.joinedAt)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 无结果 */}
              {results.posts.length === 0 && results.users.length === 0 && (
                <div className="text-center py-12 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                  <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    没有找到相关结果
                  </h3>
                  <p className="text-white/60">
                    试试其他关键词或浏览社区内容
                  </p>
                  <Link
                    href="/community"
                    className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all"
                  >
                    返回社区
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* 初始状态 */}
          {!loading && !query && (
            <div className="text-center py-12 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
              <Search className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                开始搜索
              </h3>
              <p className="text-white/60">
                输入关键词搜索帖子、用户等内容
              </p>
            </div>
          )}
        </main>
      </div>
      <EnhancedFooter />
    </div>
  );
}
