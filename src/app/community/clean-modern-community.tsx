'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserOutlined,
  LikeOutlined
} from '@ant-design/icons';
import {
  Users,
  MessageSquare,
  MessageCircle,
  TrendingUp,
  Award,
  Search,
  Plus,
  Star,
  Zap,
  Flame,
  Activity,
  Hash,
  Pin,
  ChevronRight,
  Bell,
  Bookmark,
} from 'lucide-react';
import CommunityNavbar from '../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import ParticlesBackground from '../components/ParticlesBackground';
import Link from 'next/link';
import { barongAPI } from '@/api/client';
import { useTranslation } from 'react-i18next';
import '../../i18n';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface Post {
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
  viewCount: number;
  isPinned?: boolean;
}

// Design tokens
const colors = {
  primary: '#F59E0B',
  secondary: '#8B5CF6',
  accent: { cyan: '#06B6D4', green: '#10B981' },
  background: { primary: '#0F172A', secondary: '#1E293B' },
  text: { primary: '#F8FAFC', secondary: '#CBD5E1', muted: '#64748B' },
  border: '#334155',
};

export default function CleanModernCommunity() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'new'>('all');
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalPosts: 0,
    activeToday: 0,
    totalTopics: 0,
  });
  const [activeMembers, setActiveMembers] = useState<any[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [categoryStats, setCategoryStats] = useState<any>({});
  const [trendingPosts, setTrendingPosts] = useState<any[]>([]);
  const [statsGrowth, setStatsGrowth] = useState({
    members: '+0%',
    posts: '+0%',
    activeToday: '+0%',
    topics: '+0%',
  });

  // 当 activeTab 变化时重新加载热门帖子
  useEffect(() => {
    loadTrendingPosts();
  }, [activeTab]);

  useEffect(() => {
    const checkAuth = () => {
      // 首先检查 localStorage
      const token = localStorage.getItem('auth_token');
      const userInfoStr = localStorage.getItem('user_info');
      
      if (token && userInfoStr) {
        try {
          const user = JSON.parse(userInfoStr);
          // 确保 user 有 name 字段，如果没有则从 email 生成
          if (!user.name && user.email) {
            user.name = user.email.split('@')[0];
            localStorage.setItem('user_info', JSON.stringify(user));
          }
          setUserInfo(user);
          setIsLoggedIn(true);
          return;
        } catch {
          // 继续检查 cookie
        }
      }
      
      // 检查 Google OAuth cookie (qau_user)
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return null;
      };
      
      const qauUserCookie = getCookie('qau_user');
      if (qauUserCookie) {
        try {
          const googleUser = JSON.parse(decodeURIComponent(qauUserCookie));
          // 转换 Google 用户信息格式并同步到 localStorage
          const user: UserInfo = {
            id: googleUser.email,
            email: googleUser.email,
            name: googleUser.name,
            avatar: googleUser.picture,
          };
          
          // 同步到 localStorage
          localStorage.setItem('user_info', JSON.stringify(user));
          localStorage.setItem('auth_token', 'google_oauth_session');
          
          setUserInfo(user);
          setIsLoggedIn(true);
          return;
        } catch (error) {
          console.error('Failed to parse Google user cookie:', error);
        }
      }
      
      setIsLoggedIn(false);
    };
    
    checkAuth();
    window.addEventListener('focus', checkAuth);
    return () => window.removeEventListener('focus', checkAuth);
  }, []);

  useEffect(() => { 
    loadPosts(); 
    loadStats(); 
    loadActiveMembers(); 
    loadOnlineCount();
    loadCategoryStats();
    loadTrendingPosts();
    loadStatsGrowth();
  }, []);

  const loadStats = async () => {
    try {
      const response = await barongAPI.get('/public/community/stats');
      const data = response.data;
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await barongAPI.get('/public/community/posts?limit=10');
      const data = response.data;
      if (data.success) setPosts(data.data.posts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadActiveMembers = async () => {
    try {
      const response = await barongAPI.get('/public/community/active-members?limit=4');
      const data = response.data;
      if (data.success) {
        setActiveMembers(data.data);
      }
    } catch (error) {
      console.error('Failed to load active members:', error);
      // 使用默认数据作为后备
      setActiveMembers([
        { name: 'QuantumDev', role: t('community_page.levels.core_developer'), reputation: 9850 },
        { name: 'CryptoQueen', role: t('community_page.levels.community_leader'), reputation: 8920 },
        { name: 'BlockchainBob', role: t('community_page.levels.senior_member'), reputation: 7650 },
        { name: 'DeFiAlice', role: t('community_page.levels.defi_expert'), reputation: 6890 },
      ]);
    }
  };

  const loadOnlineCount = async () => {
    try {
      const response = await barongAPI.get('/public/community/online-count');
      const data = response.data;
      if (data.success) {
        setOnlineCount(data.data.onlineCount);
      }
    } catch (error) {
      console.error('Failed to load online count:', error);
    }
  };

  const loadCategoryStats = async () => {
    try {
      const response = await barongAPI.get('/public/community/category-stats');
      const data = response.data;
      if (data.success) {
        setCategoryStats(data.data);
      }
    } catch (error) {
      console.error('Failed to load category stats:', error);
    }
  };

  const loadTrendingPosts = async () => {
    try {
      const response = await barongAPI.get(`/public/community/trending-posts?limit=4&type=${activeTab}`);
      const data = response.data;
      if (data.success) {
        setTrendingPosts(data.data);
      }
    } catch (error) {
      console.error('Failed to load trending posts:', error);
    }
  };

  const loadStatsGrowth = async () => {
    try {
      const response = await barongAPI.get('/public/community/stats-growth');
      const data = response.data;
      if (data.success) {
        setStatsGrowth(data.data);
      }
    } catch (error) {
      console.error('Failed to load stats growth:', error);
    }
  };

  const handleCategoryClick = (name: string) => {
    window.location.href = `/community/category/${encodeURIComponent(name)}`;
  };

  const handleTopicClick = (title: string) => {
    window.location.href = `/community/topic/${title.replace(/\s+/g, '-').toLowerCase()}`;
  };

  const handleUserClick = (name: string) => {
    window.location.href = `/community/user/${encodeURIComponent(name)}`;
  };

  const handleNewPost = () => {
    window.location.href = isLoggedIn ? '/community/create-post' : '/auth/login?redirect=/community/create-post';
  };

  const categories = [
    { 
      name: t('community_page.categories.general'), 
      description: t('community_page.categories.general_desc'), 
      icon: MessageSquare, 
      posts: categoryStats['general']?.postCount || 0, 
      color: colors.accent.cyan,
      slug: 'general'
    },
    { 
      name: t('community_page.categories.technical'), 
      description: t('community_page.categories.technical_desc'), 
      icon: Zap, 
      posts: categoryStats['technology']?.postCount || 0, 
      color: colors.secondary,
      slug: 'technology'
    },
    { 
      name: t('community_page.categories.defi'), 
      description: t('community_page.categories.defi_desc'), 
      icon: TrendingUp, 
      posts: categoryStats['trading']?.postCount || 0, 
      color: colors.accent.green,
      slug: 'trading'
    },
    { 
      name: t('community_page.categories.governance'), 
      description: t('community_page.categories.governance_desc'), 
      icon: Award, 
      posts: categoryStats['governance']?.postCount || 0, 
      color: colors.primary,
      slug: 'governance'
    },
  ];

  // 使用真实数据或后备数据
  const displayTrendingPosts = trendingPosts.length > 0 ? trendingPosts : [
    { title: 'Quantum Mainnet Launch Announcement', replies: 234, views: 5420, isPinned: true },
    { title: 'Post-Quantum Cryptography Implementation Guide', replies: 89, views: 2100, isPinned: false },
    { title: 'Governance Proposal #12: Fee Structure Update', replies: 156, views: 3200, isPinned: false },
    { title: 'Weekly Development Update - Week 52', replies: 67, views: 1800, isPinned: false },
  ];

  const activeUsers = activeMembers.length > 0 ? activeMembers : [
    { name: 'QuantumDev', role: t('community_page.levels.core_developer'), reputation: 9850, isOnline: true },
    { name: 'CryptoQueen', role: t('community_page.levels.community_leader'), reputation: 8920, isOnline: true },
    { name: 'BlockchainBob', role: t('community_page.levels.senior_member'), reputation: 7650, isOnline: false },
    { name: 'DeFiAlice', role: t('community_page.levels.defi_expert'), reputation: 6890, isOnline: true },
  ];

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar onlineCount={onlineCount} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ 
            fontFamily: "'Space Grotesk', sans-serif",
            background: `linear-gradient(135deg, ${colors.text.primary} 0%, ${colors.accent.cyan} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {t('community_page.title')}
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
            {t('community_page.subtitle')}
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: t('community_page.stats.members'), value: stats.totalMembers > 1000 ? `${(stats.totalMembers / 1000).toFixed(1)}K` : stats.totalMembers.toString(), icon: Users, color: colors.accent.cyan, change: statsGrowth.members },
            { label: t('community_page.stats.posts'), value: stats.totalPosts > 1000 ? `${(stats.totalPosts / 1000).toFixed(1)}K` : stats.totalPosts.toString(), icon: MessageSquare, color: colors.secondary, change: statsGrowth.posts },
            { label: t('community_page.stats.active_today'), value: stats.activeToday > 1000 ? `${(stats.activeToday / 1000).toFixed(1)}K` : stats.activeToday.toString(), icon: Activity, color: colors.accent.green, change: statsGrowth.activeToday },
            { label: t('community_page.stats.topics'), value: stats.totalTopics > 1000 ? `${(stats.totalTopics / 1000).toFixed(1)}K` : stats.totalTopics.toString(), icon: Hash, color: colors.primary, change: statsGrowth.topics }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl cursor-pointer group transition-all duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ background: `${stat.color}20` }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full" 
                  style={{ background: 'rgba(16, 185, 129, 0.1)', color: colors.accent.green }}>
                  {stat.change}
                </span>
              </div>
              <div className="text-2xl font-bold" style={{ color: colors.text.primary, fontFamily: "'Space Grotesk', sans-serif" }}>
                {stat.value}
              </div>
              <div className="text-sm" style={{ color: colors.text.muted }}>{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Search & New Post */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: colors.text.muted }} />
            <input
              type="text"
              placeholder={t('community_page.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl outline-none transition-all duration-200"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: colors.text.primary,
                fontFamily: "'DM Sans', sans-serif",
              }}
              onFocus={(e) => e.target.style.borderColor = colors.secondary}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNewPost}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200"
            style={{
              background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent.cyan} 100%)`,
              color: colors.text.primary,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <Plus className="w-5 h-5" />
            {t('community_page.new_post')}
          </motion.button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Categories & Posts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Categories */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold" style={{ color: colors.text.primary, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {t('community_page.categories.title')}
                </h2>
                <Link href="/community/forum/" className="text-sm flex items-center gap-1 transition-colors hover:opacity-80"
                  style={{ color: colors.secondary }}>
                  {t('community_page.categories.view_all')} <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat, i) => (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="p-5 rounded-2xl cursor-pointer group transition-all duration-200"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                      e.currentTarget.style.borderColor = `${cat.color}40`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                        style={{ background: `${cat.color}15` }}>
                        <cat.icon className="w-6 h-6" style={{ color: cat.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold mb-1 transition-colors group-hover:text-purple-300"
                          style={{ color: colors.text.primary, fontFamily: "'Space Grotesk', sans-serif" }}>
                          {cat.name}
                        </h3>
                        <p className="text-sm mb-2 line-clamp-1" style={{ color: colors.text.muted }}>
                          {cat.description}
                        </p>
                        <div className="text-xs" style={{ color: colors.text.muted }}>
                          {cat.posts.toLocaleString()} posts
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Recent Discussions (Real Data) */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold" style={{ color: colors.text.primary, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {t('community_page.hot_topics.title')}
                </h2>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">{t('common.loading')}</div>
                ) : posts.length > 0 ? (
                  posts.map((post) => (
                    <Link href={`/community/posts?id=${post.id}`} key={post.id} className="block">
                      <motion.div 
                        whileHover={{ y: -2 }}
                        className="p-5 rounded-2xl cursor-pointer transition-all duration-200 group"
                        style={{ 
                          background: 'rgba(255, 255, 255, 0.03)', 
                          border: '1px solid rgba(255, 255, 255, 0.06)' 
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-gray-400 line-clamp-2 mb-3 text-sm">
                              {post.content}
                            </p>
                          </div>
                          {post.isPinned && <Pin className="w-4 h-4 text-green-500" />}
                        </div>
                        
                        <div className="flex gap-4 text-sm text-gray-500 items-center">
                          <span className="flex items-center gap-1">
                            <UserOutlined /> {post.userName || post.userId}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" /> {post.commentCount || 0} Comments
                          </span>
                          <span className="flex items-center gap-1">
                            <LikeOutlined /> {post.likeCount || 0} Likes
                          </span>
                          <span className="text-xs ml-auto">
                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                      </motion.div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">No discussions yet. Be the first to post!</div>
                )}
              </div>
            </section>

            {/* Hot Topics */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5" style={{ color: colors.primary }} />
                  <h2 className="text-xl font-bold" style={{ color: colors.text.primary, fontFamily: "'Space Grotesk', sans-serif" }}>
                    {t('community_page.hot_topics.title')}
                  </h2>
                </div>
                <div className="flex gap-2">
                  {(['all', 'trending', 'new'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{
                        background: activeTab === tab ? `${colors.secondary}20` : 'transparent',
                        color: activeTab === tab ? colors.secondary : colors.text.muted,
                      }}
                    >
                      {t(`community_page.hot_topics.${tab}`)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {displayTrendingPosts.map((topic, i) => (
                  <motion.div
                    key={topic.id || i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => topic.id ? window.location.href = `/community/posts?id=${topic.id}` : handleTopicClick(topic.title)}
                    className="p-4 rounded-xl cursor-pointer group transition-all duration-200"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {topic.isPinned && (
                        <Pin className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: colors.accent.green }} />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium mb-2 line-clamp-2 transition-colors group-hover:text-purple-300"
                          style={{ color: colors.text.primary }}>
                          {topic.title}
                        </h4>
                        <div className="flex items-center gap-4 text-xs" style={{ color: colors.text.muted }}>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5" />
                            {topic.replies}
                          </span>
                          <span className="flex items-center gap-1">
                            <Activity className="w-3.5 h-3.5" />
                            {topic.views.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: colors.text.muted }} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Active Members */}
            <div className="p-5 rounded-2xl" style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5" style={{ color: colors.accent.green }} />
                <h3 className="font-semibold" style={{ color: colors.text.primary, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {t('community_page.active_members.title')}
                </h3>
              </div>

              <div className="space-y-3">
                {activeUsers.map((user, i) => (
                  <div
                    key={i}
                    onClick={() => handleUserClick(user.name)}
                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors hover:bg-white/5"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{
                          background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent.cyan} 100%)`,
                          color: colors.text.primary
                        }}>
                        {user.name[0]}
                      </div>
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2`}
                        style={{
                          borderColor: colors.background.primary,
                          background: user.isOnline ? colors.accent.green : colors.text.muted
                        }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate" style={{ color: colors.text.primary }}>
                        {user.name}
                      </div>
                      <div className="text-xs truncate" style={{ color: colors.text.muted }}>
                        {user.role || user.level}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs" style={{ color: colors.primary }}>
                      <Star className="w-3.5 h-3.5" />
                      {user.reputation.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <a href="/community/members" className="flex items-center justify-center gap-1 mt-4 py-2 text-sm transition-colors hover:opacity-80"
                style={{ color: colors.secondary }}>
                {t('community_page.active_members.view_all')} <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Links */}
            <div className="p-5 rounded-2xl" style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <h3 className="font-semibold mb-4" style={{ color: colors.text.primary, fontFamily: "'Space Grotesk', sans-serif" }}>
                {t('community_page.quick_links.title')}
              </h3>
              <div className="space-y-2">
                {[
                  { name: t('community_page.quick_links.guidelines'), href: '/community/guidelines' },
                  { name: t('community_page.quick_links.faq'), href: '/community/faq' },
                  { name: t('community_page.quick_links.bug_bounty'), href: '/community/bug-bounty' },
                  { name: t('community_page.quick_links.partners'), href: '/community/partners' },
                ].map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-2 p-2 rounded-lg text-sm transition-colors hover:bg-white/5"
                    style={{ color: colors.text.secondary }}
                  >
                    <ChevronRight className="w-4 h-4" style={{ color: colors.secondary }} />
                    {link.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Community Stats */}
            <div className="p-5 rounded-2xl" style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <h3 className="font-semibold mb-4" style={{ color: colors.text.primary, fontFamily: "'Space Grotesk', sans-serif" }}>
                {t('community_page.community_stats.title')}
              </h3>
              <div className="space-y-3">
                {[
                  { label: t('community_page.community_stats.total_posts'), value: stats.totalPosts.toLocaleString() },
                  { label: t('community_page.community_stats.total_members'), value: stats.totalMembers.toLocaleString() },
                  { label: t('community_page.community_stats.online_now'), value: stats.activeToday.toLocaleString() },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span style={{ color: colors.text.muted }}>{stat.label}</span>
                    <span className="font-semibold" style={{ color: colors.text.primary }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <EnhancedFooter />
    </div>
  );
}

