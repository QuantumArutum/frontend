'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, MapPin, Link as LinkIcon, MessageSquare, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../../../i18n';
import ParticlesBackground from '../../../../app/components/ParticlesBackground';
import CommunityNavbar from '../../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../../../components/EnhancedFooter';

// 根据字符串生成一致的数字（避免 hydration 错误）
const generateConsistentNumber = (seed: string, max: number, min: number = 0) => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % (max - min) + min;
};

export default function UserProfilePage() {
  const params = useParams();
  const { t } = useTranslation();
  const userName = params?.userName ? decodeURIComponent(params.userName as string) : 'Unknown User';

  const handleBack = () => {
    window.history.back();
  };

  const userData = {
    name: userName,
    avatar: userName.charAt(0).toUpperCase(),
    title: t('user_profile_page.title_quantum_expert'),
    bio: t('user_profile_page.sample_bio'),
    location: t('user_profile_page.sample_location'),
    website: 'https://quantum-research.com',
    joinDate: t('user_profile_page.joined_date', { date: '2023-03' }),
    stats: {
      posts: generateConsistentNumber(userName + 'posts', 500, 100),
      likes: generateConsistentNumber(userName + 'likes', 2000, 500),
      followers: generateConsistentNumber(userName + 'followers', 1000, 200),
      following: generateConsistentNumber(userName + 'following', 300, 50)
    },
    badges: [
      { name: t('user_profile_page.badges.quantum_pioneer'), color: 'from-purple-500 to-pink-500', icon: '🚀' },
      { name: t('user_profile_page.badges.knowledge_sharer'), color: 'from-blue-500 to-cyan-500', icon: '📚' },
      { name: t('user_profile_page.badges.community_contributor'), color: 'from-green-500 to-emerald-500', icon: '🌟' }
    ],
    recentPosts: [
      { id: 1, title: t('user_profile_page.sample_posts.post1.title'), category: t('user_profile_page.sample_posts.post1.category'), replies: 23, likes: 45, createdAt: t('user_profile_page.time.days_ago', { count: 2 }) },
      { id: 2, title: t('user_profile_page.sample_posts.post2.title'), category: t('user_profile_page.sample_posts.post2.category'), replies: 18, likes: 32, createdAt: t('user_profile_page.time.days_ago', { count: 5 }) },
      { id: 3, title: t('user_profile_page.sample_posts.post3.title'), category: t('user_profile_page.sample_posts.post3.category'), replies: 41, likes: 67, createdAt: t('user_profile_page.time.week_ago', { count: 1 }) }
    ]
  };

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10 w-full h-full">
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                    {userData.avatar}
                  </div>
                  <h2 className="text-xl font-bold text-white mb-1">{userData.name}</h2>
                  <p className="text-purple-400 font-medium">{userData.title}</p>
                </div>
                <div className="mb-6">
                  <p className="text-white/70 text-sm leading-relaxed">{userData.bio}</p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <MapPin className="w-4 h-4" /><span>{userData.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <LinkIcon className="w-4 h-4" />
                    <a href={userData.website} className="text-purple-400 hover:text-purple-300 transition-colors">{t('user_profile_page.personal_website')}</a>
                  </div>
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <Calendar className="w-4 h-4" /><span>{t('user_profile_page.joined_at')} {userData.joinDate}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center"><div className="text-2xl font-bold text-white">{userData.stats.posts}</div><div className="text-white/60 text-sm">{t('user_profile_page.stats.posts')}</div></div>
                  <div className="text-center"><div className="text-2xl font-bold text-white">{userData.stats.likes}</div><div className="text-white/60 text-sm">{t('user_profile_page.stats.likes')}</div></div>
                  <div className="text-center"><div className="text-2xl font-bold text-white">{userData.stats.followers}</div><div className="text-white/60 text-sm">{t('user_profile_page.stats.followers')}</div></div>
                  <div className="text-center"><div className="text-2xl font-bold text-white">{userData.stats.following}</div><div className="text-white/60 text-sm">{t('user_profile_page.stats.following')}</div></div>
                </div>
                <div className="space-y-3">
                  <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all font-medium">{t('user_profile_page.follow')}</button>
                  <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium">{t('user_profile_page.send_message')}</button>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">{t('user_profile_page.achievement_badges')}</h3>
                <div className="space-y-3">
                  {userData.badges.map((badge, index) => (
                    <div key={index} className={`p-3 bg-gradient-to-r ${badge.color} rounded-lg`}>
                      <div className="flex items-center gap-3"><span className="text-2xl">{badge.icon}</span><span className="text-white font-medium">{badge.name}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
                <div className="p-6 border-b border-white/10"><h3 className="text-lg font-semibold text-white">{t('user_profile_page.recent_posts')}</h3></div>
                <div className="divide-y divide-white/10">
                  {userData.recentPosts.map((post) => (
                    <div key={post.id} className="p-6 hover:bg-white/5 transition-colors cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-white font-medium hover:text-purple-400 transition-colors">{post.title}</h4>
                        <span className="text-white/50 text-sm">{post.createdAt}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full">{post.category}</span>
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <div className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /><span>{post.replies}</span></div>
                          <div className="flex items-center gap-1"><Heart className="w-4 h-4" /><span>{post.likes}</span></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 text-center">
                  <button className="text-purple-400 hover:text-purple-300 transition-colors font-medium">{t('user_profile_page.view_more_posts')}</button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <EnhancedFooter />
    </div>
  );
}
