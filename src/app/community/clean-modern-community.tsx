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
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'trending' | 'new'>('all');

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const userInfoStr = localStorage.getItem('user_info');
      if (token && userInfoStr) {
        try {
          setUserInfo(JSON.parse(userInfoStr));
          setIsLoggedIn(true);
        } catch { setIsLoggedIn(false); }
      }
    };
    checkAuth();
    window.addEventListener('focus', checkAuth);
    return () => window.removeEventListener('focus', checkAuth);
  }, []);

  useEffect(() => { loadPosts(); }, []);

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
    { name: 'General Discussion', description: 'Community discussions and announcements', icon: MessageSquare, posts: 15420, color: colors.accent.cyan },
    { name: 'Technical', description: 'Development and technical topics', icon: Zap, posts: 8930, color: colors.secondary },
    { name: 'DeFi & Trading', description: 'Decentralized finance discussions', icon: TrendingUp, posts: 12650, color: colors.accent.green },
    { name: 'Governance', description: 'Community governance and voting', icon: Award, posts: 3420, color: colors.primary },
  ];

  const hotTopics = [
    { title: 'Quantum Mainnet Launch Announcement', replies: 234, views: 5420, isPinned: true },
    { title: 'Post-Quantum Cryptography Implementation Guide', replies: 89, views: 2100, isPinned: false },
    { title: 'Governance Proposal #12: Fee Structure Update', replies: 156, views: 3200, isPinned: false },
    { title: 'Weekly Development Update - Week 52', replies: 67, views: 1800, isPinned: false },
  ];

  const activeUsers = [
    { name: 'QuantumDev', level: 'Core Developer', reputation: 9850, isOnline: true },
    { name: 'CryptoQueen', level: 'Community Leader', reputation: 8920, isOnline: true },
    { name: 'BlockchainBob', level: 'Senior Member', reputation: 7650, isOnline: false },
    { name: 'DeFiAlice', level: 'DeFi Expert', reputation: 6890, isOnline: true },
  ];

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />

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
            Quantaureum Community
          </h1>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
            Join the quantum blockchain revolution. Connect, discuss, and build the future together.
          </p>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Members', value: '125.8K', icon: Users, color: colors.accent.cyan, change: '+12%' },
            { label: 'Posts', value: '520K', icon: MessageSquare, color: colors.secondary, change: '+8%' },
            { label: 'Active Today', value: '85K', icon: Activity, color: colors.accent.green, change: '+15%' },
            { label: 'Topics', value: '1.2K', icon: Hash, color: colors.primary, change: '+5%' }
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
              placeholder="Search discussions, topics, users..."
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
            New Post
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
                  Forum Categories
                </h2>
                <Link href="/community/forum/" className="text-sm flex items-center gap-1 transition-colors hover:opacity-80"
                  style={{ color: colors.secondary }}>
                  View All <ChevronRight className="w-4 h-4" />
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
                  Recent Discussions
                </h2>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading discussions...</div>
                ) : posts.length > 0 ? (
                  posts.map((post) => (
                    <Link href={`/community/posts/${post.id}`} key={post.id} className="block">
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
                            {new Date(post.createdAt).toLocaleDateString()}
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
                    Hot Topics
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
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {hotTopics.map((topic, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleTopicClick(topic.title)}
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
                  Active Members
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
                        {user.level}
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
                View All Members <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Links */}
            <div className="p-5 rounded-2xl" style={{
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}>
              <h3 className="font-semibold mb-4" style={{ color: colors.text.primary, fontFamily: "'Space Grotesk', sans-serif" }}>
                Quick Links
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Community Guidelines', href: '/community/guidelines' },
                  { name: 'FAQ', href: '/community/faq' },
                  { name: 'Bug Bounty Program', href: '/community/bug-bounty' },
                  { name: 'Partnership Program', href: '/community/partners' },
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
                Community Stats
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'Total Posts', value: '520,847' },
                  { label: 'Total Members', value: '125,892' },
                  { label: 'Online Now', value: '85,341' },
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

