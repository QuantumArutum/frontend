'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Heart,
  Eye,
  Calendar,
  MapPin,
  Twitter,
  Github,
  Globe,
  Share2,
  Crown,
  Shield,
  Star,
  Activity,
  Users,
  Mail,
} from 'lucide-react';
import '../../../styles/design-system.css';

interface UserProfileProps {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string;
    bio: string;
    level: string;
    reputation: number;
    joinDate: string;
    location?: string;
    website?: string;
    twitter?: string;
    github?: string;
    isOnline: boolean;
    isVerified: boolean;
    badges: Array<{
      id: string;
      name: string;
      description: string;
      icon: string;
      rarity: 'common' | 'rare' | 'epic' | 'legendary';
    }>;
    stats: {
      posts: number;
      replies: number;
      likes: number;
      views: number;
      followers: number;
      following: number;
    };
  };
}

const ModernUserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'replies' | 'badges' | 'activity'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-yellow-400 to-orange-500';
      case 'epic':
        return 'from-purple-500 to-pink-500';
      case 'rare':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'Core Developer': 'from-purple-500 to-pink-500',
      'Community Leader': 'from-amber-500 to-orange-500',
      'Senior Member': 'from-blue-500 to-cyan-500',
      Member: 'from-emerald-500 to-teal-500',
      'New Member': 'from-gray-500 to-gray-600',
    };
    return colors[level as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/10 to-gray-900">
      {/* Profile Header */}
      <div className="quantum-glass border-b border-white/10">
        <div className="quantum-container py-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col items-center text-center md:text-left">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-4xl font-bold text-white">
                  {user.avatar}
                </div>
                <div
                  className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-gray-900 ${
                    user.isOnline ? 'bg-green-400' : 'bg-gray-400'
                  }`}
                ></div>
                {user.isVerified && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-white">{user.displayName}</h1>
                <span
                  className={`px-3 py-1 text-sm rounded-full bg-gradient-to-r ${getLevelColor(user.level)} text-white`}
                >
                  {user.level}
                </span>
              </div>

              <p className="text-gray-400 mb-1">@{user.username}</p>
              <div className="flex items-center gap-1 text-purple-400 font-semibold">
                <Star className="w-4 h-4" />
                <span>{user.reputation.toLocaleString()}</span>
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {user.joinDate}</span>
                  </div>
                  {user.location && (
                    <div className="flex items-center gap-1 text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`quantum-btn ${
                      isFollowing ? 'quantum-btn-secondary' : 'quantum-btn-primary'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="quantum-btn quantum-btn-ghost">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="quantum-btn quantum-btn-ghost">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-300 mb-6 leading-relaxed">{user.bio}</p>

              {/* Social Links */}
              <div className="flex items-center gap-4 mb-6">
                {user.website && (
                  <a
                    href={user.website}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Website</span>
                  </a>
                )}
                {user.twitter && (
                  <a
                    href={user.twitter}
                    className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>Twitter</span>
                  </a>
                )}
                {user.github && (
                  <a
                    href={user.github}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                {[
                  { label: 'Posts', value: user.stats.posts, icon: MessageSquare },
                  { label: 'Replies', value: user.stats.replies, icon: MessageSquare },
                  { label: 'Likes', value: user.stats.likes, icon: Heart },
                  { label: 'Views', value: user.stats.views, icon: Eye },
                  { label: 'Followers', value: user.stats.followers, icon: Users },
                  { label: 'Following', value: user.stats.following, icon: Users },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="flex items-center justify-center mb-1">
                      <stat.icon className="w-4 h-4 text-purple-400 mr-1" />
                      <span className="text-lg font-bold text-white">
                        {stat.value.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Content */}
      <div className="quantum-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="flex items-center gap-4 mb-8">
              {[
                { id: 'posts' as const, label: 'Posts', count: user.stats.posts },
                { id: 'replies' as const, label: 'Replies', count: user.stats.replies },
                { id: 'badges' as const, label: 'Badges', count: user.badges.length },
                { id: 'activity' as const, label: 'Activity', count: null },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`quantum-btn ${
                    activeTab === tab.id ? 'quantum-btn-primary' : 'quantum-btn-ghost'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-white/20 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'badges' && (
                <motion.div
                  key="badges"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="quantum-grid quantum-grid-3 gap-6"
                >
                  {user.badges.map((badge, index) => (
                    <motion.div
                      key={badge.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className={`quantum-card text-center relative overflow-hidden`}
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${getBadgeColor(badge.rarity)} opacity-10`}
                      ></div>
                      <div className="relative z-10">
                        <div className="text-4xl mb-3">{badge.icon}</div>
                        <h3 className="font-semibold text-white mb-2">{badge.name}</h3>
                        <p className="text-sm text-gray-400 mb-3">{badge.description}</p>
                        <span
                          className={`px-2 py-1 text-xs rounded-full bg-gradient-to-r ${getBadgeColor(badge.rarity)} text-white`}
                        >
                          {badge.rarity.toUpperCase()}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'activity' && (
                <motion.div
                  key="activity"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="quantum-card"
                >
                  <div className="text-center py-12">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Recent Activity</h3>
                    <p className="text-gray-400">Activity feed coming soon...</p>
                  </div>
                </motion.div>
              )}

              {(activeTab === 'posts' || activeTab === 'replies') && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="quantum-card"
                >
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {activeTab === 'posts' ? 'User Posts' : 'User Replies'}
                    </h3>
                    <p className="text-gray-400">
                      {activeTab === 'posts' ? 'Posts' : 'Replies'} will be displayed here...
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="quantum-card">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                Top Badges
              </h3>
              <div className="space-y-3">
                {user.badges.slice(0, 3).map((badge) => (
                  <div
                    key={badge.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{badge.name}</div>
                      <div className="text-xs text-gray-400">{badge.rarity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernUserProfile;
