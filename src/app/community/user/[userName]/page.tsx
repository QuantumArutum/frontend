'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, Link as LinkIcon, MessageSquare, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../../../i18n';
import ParticlesBackground from '../../../../app/components/ParticlesBackground';
import CommunityNavbar from '../../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../../../components/EnhancedFooter';
import { barongAPI } from '@/api/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  roleKey: string;
  title: string;
  bio: string;
  location: string | null;
  website: string | null;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
  joinedAt: string;
  isOnline: boolean;
  stats: {
    posts: number;
    comments: number;
    likes: number;
    receivedLikes: number;
    reputation: number;
    followers: number;
    following: number;
  };
  badges: Array<{
    name: string;
    color: string;
    icon: string;
  }>;
  recentPosts: Array<{
    id: string;
    title: string;
    category: string;
    categorySlug: string;
    replies: number;
    likes: number;
    createdAt: string;
  }>;
}

export default function UserProfilePage() {
  const params = useParams();
  const { t } = useTranslation();
  const { user: currentUser, isAuthenticated } = useAuth();
  const userName = params?.userName ? decodeURIComponent(params.userName as string) : '';

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);

  // 判断是否是自己的资料页
  // 优先使用 AuthContext，如果不可用则使用 currentUserName
  const isOwnProfile =
    profile &&
    ((isAuthenticated &&
      currentUser &&
      (currentUser.username === profile.username ||
        currentUser.email?.split('@')[0] === profile.username)) ||
      (currentUserName && currentUserName === profile.username));

  // 判断是否已登录（用于显示关注按钮）
  const isLoggedIn = isAuthenticated || !!currentUserName;

  const checkFollowStatus = useCallback(
    async (userId: string) => {
      try {
        // 获取当前用户ID
        let currentId = currentUser?.id;
        if (!currentId && currentUserName) {
          // 从 profile 获取当前用户ID（如果是自己的资料页）
          // 或者从导航栏用户链接推断
          // 这里简化处理：如果有 currentUserName，尝试获取其 ID
          try {
            const userResponse = await barongAPI.get(
              `/public/community/user-profile?username=${encodeURIComponent(currentUserName)}`
            );
            if (userResponse.data.success) {
              currentId = userResponse.data.data.id;
            }
          } catch (e) {
            console.log('Failed to get current user ID:', e);
          }
        }

        const response = await barongAPI.get(
          `/public/community/is-following?userId=${userId}&currentUserId=${currentId || ''}`
        );
        if (response.data.success) {
          setIsFollowing(response.data.data.isFollowing);
        }
      } catch (err) {
        console.error('Failed to check follow status:', err);
      }
    },
    [currentUser, currentUserName]
  );

  const loadUserProfile = useCallback(async () => {
    if (!userName) return;

    setLoading(true);
    setError(null);
    try {
      const response = await barongAPI.get(
        `/public/community/user-profile?username=${encodeURIComponent(userName)}`
      );
      const data = response.data;
      if (data.success) {
        setProfile(data.data);

        // 尝试从导航栏获取当前用户名（备用方案）
        if (!isAuthenticated || !currentUser) {
          try {
            const navbarUserLink = document.querySelector('a[href^="/community/user/"]');
            if (navbarUserLink) {
              const href = navbarUserLink.getAttribute('href');
              if (href) {
                const match = href.match(/\/community\/user\/([^/?]+)/);
                if (match && match[1]) {
                  setCurrentUserName(decodeURIComponent(match[1]));
                }
              }
            }
          } catch (err) {
            console.log('Failed to get current user from navbar:', err);
          }
        }

        // 如果不是自己的资料页，检查关注状态
        const isOwn =
          (isAuthenticated && currentUser && currentUser.username === data.data.username) ||
          (currentUserName && currentUserName === data.data.username);
        if (!isOwn && (isAuthenticated || currentUserName)) {
          checkFollowStatus(data.data.id);
        }
      } else {
        setError(data.message || 'Failed to load user profile');
      }
    } catch (err) {
      console.error('Failed to load user profile:', err);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  }, [userName, isAuthenticated, currentUser, currentUserName, checkFollowStatus]);

  const handleFollow = async () => {
    if (!profile) return;

    // 获取当前用户ID
    let currentId = currentUser?.id;
    if (!currentId && currentUserName) {
      try {
        const userResponse = await barongAPI.get(
          `/public/community/user-profile?username=${encodeURIComponent(currentUserName)}`
        );
        if (userResponse.data.success) {
          currentId = userResponse.data.data.id;
        }
      } catch (e) {
        console.log('Failed to get current user ID:', e);
        alert(t('user_profile_page.login_required'));
        return;
      }
    }

    if (!currentId) {
      alert(t('user_profile_page.login_required'));
      return;
    }

    setFollowLoading(true);
    try {
      if (isFollowing) {
        // 取消关注
        const response = await barongAPI.delete(
          `/public/community/follow?userId=${profile.id}&currentUserId=${currentId}`
        );
        if (response.data.success) {
          setIsFollowing(false);
          // 更新关注者数量
          setProfile({
            ...profile,
            stats: {
              ...profile.stats,
              followers: profile.stats.followers - 1,
            },
          });
        }
      } else {
        // 关注
        const response = await barongAPI.post('/public/community/follow', {
          userId: profile.id,
          currentUserId: currentId,
        });
        if (response.data.success) {
          setIsFollowing(true);
          // 更新关注者数量
          setProfile({
            ...profile,
            stats: {
              ...profile.stats,
              followers: profile.stats.followers + 1,
            },
          });
        }
      }
    } catch (err: any) {
      console.error('Failed to follow/unfollow:', err);
      if (err.response?.status === 401) {
        alert(t('user_profile_page.login_required'));
      } else {
        alert(err.response?.data?.message || 'Failed to follow/unfollow');
      }
    } finally {
      setFollowLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('user_profile_page.time.just_now');
    if (minutes < 60) return t('user_profile_page.time.minutes_ago', { count: minutes });
    if (hours < 24) return t('user_profile_page.time.hours_ago', { count: hours });
    if (days < 7) return t('user_profile_page.time.days_ago', { count: days });
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <ParticlesBackground />
        <CommunityNavbar />
        <div className="text-center relative z-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <ParticlesBackground />
        <CommunityNavbar />
        <div className="text-center relative z-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            {t('user_profile_page.user_not_found')}
          </h1>
          <p className="text-gray-300 mb-6">
            {error || t('user_profile_page.user_not_found_desc')}
          </p>
          <Link href="/community" className="text-purple-400 hover:text-purple-300">
            {t('user_profile_page.back_to_community')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10 w-full h-full">
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧用户信息卡片 */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                      {profile.avatar}
                    </div>
                    {profile.isOnline && (
                      <div className="absolute bottom-4 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">{profile.username}</h2>
                  <p className="text-purple-400 font-medium">{profile.title}</p>
                </div>
                <div className="mb-6">
                  <p className="text-white/70 text-sm leading-relaxed">{profile.bio}</p>
                </div>
                <div className="space-y-3 mb-6">
                  {profile.location && (
                    <div className="flex items-center gap-3 text-white/60 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center gap-3 text-white/60 text-sm">
                      <LinkIcon className="w-4 h-4" />
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        {t('user_profile_page.personal_website')}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {t('user_profile_page.joined_at')}{' '}
                      {new Date(profile.joinedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {/* 社交链接 */}
                {profile.socialLinks &&
                  (profile.socialLinks.twitter ||
                    profile.socialLinks.github ||
                    profile.socialLinks.linkedin) && (
                    <div className="mb-6">
                      <div className="flex items-center gap-3">
                        {profile.socialLinks.twitter && (
                          <a
                            href={`https://twitter.com/${profile.socialLinks.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors"
                            title="Twitter"
                          >
                            <svg
                              className="w-5 h-5 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                          </a>
                        )}
                        {profile.socialLinks.github && (
                          <a
                            href={`https://github.com/${profile.socialLinks.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                            title="GitHub"
                          >
                            <svg
                              className="w-5 h-5 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                          </a>
                        )}
                        {profile.socialLinks.linkedin && (
                          <a
                            href={`https://linkedin.com/in/${profile.socialLinks.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors"
                            title="LinkedIn"
                          >
                            <svg
                              className="w-5 h-5 text-white"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <button
                    onClick={() => setShowFollowersModal(true)}
                    className="text-center hover:bg-white/5 rounded-lg p-2 transition-colors cursor-pointer"
                  >
                    <div className="text-2xl font-bold text-white">{profile.stats.posts}</div>
                    <div className="text-white/60 text-sm">
                      {t('user_profile_page.stats.posts')}
                    </div>
                  </button>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {profile.stats.receivedLikes}
                    </div>
                    <div className="text-white/60 text-sm">
                      {t('user_profile_page.stats.likes')}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowFollowersModal(true)}
                    className="text-center hover:bg-white/5 rounded-lg p-2 transition-colors cursor-pointer"
                  >
                    <div className="text-2xl font-bold text-white">{profile.stats.followers}</div>
                    <div className="text-white/60 text-sm">
                      {t('user_profile_page.stats.followers')}
                    </div>
                  </button>
                  <button
                    onClick={() => setShowFollowingModal(true)}
                    className="text-center hover:bg-white/5 rounded-lg p-2 transition-colors cursor-pointer"
                  >
                    <div className="text-2xl font-bold text-white">{profile.stats.following}</div>
                    <div className="text-white/60 text-sm">
                      {t('user_profile_page.stats.following')}
                    </div>
                  </button>
                </div>
                {/* 如果是自己的资料页，显示编辑资料按钮 */}
                {isOwnProfile && (
                  <div className="space-y-3">
                    <Link
                      href="/community/settings/profile"
                      className="block w-full py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all font-medium text-center"
                    >
                      {t('user_profile_page.edit_profile')}
                    </Link>
                  </div>
                )}
                {/* 如果是他人的资料页且已登录，显示关注按钮 */}
                {!isOwnProfile && isLoggedIn && (
                  <div className="space-y-3">
                    <button
                      onClick={handleFollow}
                      disabled={followLoading}
                      className={`w-full py-2 rounded-lg transition-all font-medium ${
                        isFollowing
                          ? 'bg-white/10 hover:bg-white/20 text-white'
                          : 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white hover:from-purple-600 hover:to-cyan-600'
                      } ${followLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {followLoading
                        ? t('common.loading')
                        : isFollowing
                          ? t('user_profile_page.unfollow')
                          : t('user_profile_page.follow')}
                    </button>
                    <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium">
                      {t('user_profile_page.send_message')}
                    </button>
                  </div>
                )}
              </div>

              {/* 成就徽章 */}
              {profile.badges.length > 0 && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {t('user_profile_page.achievement_badges')}
                  </h3>
                  <div className="space-y-3">
                    {profile.badges.map((badge, index) => (
                      <div key={index} className={`p-3 bg-gradient-to-r ${badge.color} rounded-lg`}>
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{badge.icon}</span>
                          <span className="text-white font-medium">{badge.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 右侧最近帖子 */}
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white">
                    {t('user_profile_page.recent_posts')}
                  </h3>
                </div>
                <div className="divide-y divide-white/10">
                  {profile.recentPosts.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                      {t('user_profile_page.no_posts')}
                    </div>
                  ) : (
                    profile.recentPosts.map((post) => (
                      <div key={post.id} className="p-6 hover:bg-white/5 transition-colors">
                        <div className="flex items-start justify-between mb-3">
                          <Link href={`/community/posts?id=${post.id}`}>
                            <h4 className="text-white font-medium hover:text-purple-400 transition-colors cursor-pointer">
                              {post.title}
                            </h4>
                          </Link>
                          <span className="text-white/50 text-sm whitespace-nowrap ml-4">
                            {formatDate(post.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <Link href={`/community/forum/category?slug=${post.categorySlug}`}>
                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full hover:bg-purple-500/30 transition-colors cursor-pointer">
                              {post.category}
                            </span>
                          </Link>
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{post.replies}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              <span>{post.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {profile.recentPosts.length > 0 && (
                  <div className="p-6 text-center">
                    <button className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                      {t('user_profile_page.view_more_posts')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      <EnhancedFooter />

      {/* 关注者列表弹窗 */}
      {showFollowersModal && profile && (
        <FollowersModal userId={profile.id} onClose={() => setShowFollowersModal(false)} />
      )}

      {/* 关注中列表弹窗 */}
      {showFollowingModal && profile && (
        <FollowingModal userId={profile.id} onClose={() => setShowFollowingModal(false)} />
      )}
    </div>
  );
}

// 关注者列表弹窗组件
function FollowersModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const { t } = useTranslation();
  const [followers, setFollowers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFollowers = useCallback(async () => {
    try {
      const response = await barongAPI.get(`/public/community/followers?userId=${userId}&limit=50`);
      if (response.data.success) {
        setFollowers(response.data.data.followers);
      }
    } catch (err) {
      console.error('Failed to load followers:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadFollowers();
  }, [loadFollowers]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-2xl border border-white/20 max-w-md w-full mx-4 max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{t('user_profile_page.followers_list')}</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            ✕
          </button>
        </div>
        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : followers.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              {t('user_profile_page.no_followers')}
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {followers.map((follower) => (
                <Link
                  key={follower.id}
                  href={`/community/user/${follower.username}`}
                  onClick={onClose}
                >
                  <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                        {follower.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{follower.username}</div>
                        <div className="text-white/60 text-sm">
                          {follower.postCount} {t('user_profile_page.stats.posts')}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 关注中列表弹窗组件
function FollowingModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const { t } = useTranslation();
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFollowing = useCallback(async () => {
    try {
      const response = await barongAPI.get(`/public/community/following?userId=${userId}&limit=50`);
      if (response.data.success) {
        setFollowing(response.data.data.following);
      }
    } catch (err) {
      console.error('Failed to load following:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadFollowing();
  }, [loadFollowing]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-2xl border border-white/20 max-w-md w-full mx-4 max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{t('user_profile_page.following_list')}</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            ✕
          </button>
        </div>
        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="p-8 text-center">
              <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : following.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              {t('user_profile_page.no_following')}
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {following.map((user) => (
                <Link key={user.id} href={`/community/user/${user.username}`} onClick={onClose}>
                  <div className="p-4 hover:bg-white/5 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                        {user.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium">{user.username}</div>
                        <div className="text-white/60 text-sm">
                          {user.postCount} {t('user_profile_page.stats.posts')}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
