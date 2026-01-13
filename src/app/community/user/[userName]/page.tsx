'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, MapPin, Link as LinkIcon, MessageSquare, Heart } from 'lucide-react';
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
  const userName = params?.userName ? decodeURIComponent(params.userName as string) : 'Unknown User';

  const handleBack = () => {
    window.history.back();
  };

  const userData = {
    name: userName,
    avatar: userName.charAt(0).toUpperCase(),
    title: '量子技术专家',
    bio: `我是一名专注于量子计算和量子密码学的研究者。热衷于分享知识，帮助社区成员了解量子技术的最新发展。`,
    location: '北京, 中国',
    website: 'https://quantum-research.com',
    joinDate: '2023年3月',
    stats: {
      posts: generateConsistentNumber(userName + 'posts', 500, 100),
      likes: generateConsistentNumber(userName + 'likes', 2000, 500),
      followers: generateConsistentNumber(userName + 'followers', 1000, 200),
      following: generateConsistentNumber(userName + 'following', 300, 50)
    },
    badges: [
      { name: '量子先锋', color: 'from-purple-500 to-pink-500', icon: '🚀' },
      { name: '知识分享者', color: 'from-blue-500 to-cyan-500', icon: '📚' },
      { name: '社区贡献者', color: 'from-green-500 to-emerald-500', icon: '🌟' }
    ],
    recentPosts: [
      { id: 1, title: '量子纠缠在密码学中的应用', category: '量子密码学', replies: 23, likes: 45, createdAt: '2天前' },
      { id: 2, title: '如何理解量子叠加态', category: '量子物理', replies: 18, likes: 32, createdAt: '5天前' },
      { id: 3, title: '量子计算机的发展现状', category: '量子计算', replies: 41, likes: 67, createdAt: '1周前' }
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
                    <a href={userData.website} className="text-purple-400 hover:text-purple-300 transition-colors">个人网站</a>
                  </div>
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <Calendar className="w-4 h-4" /><span>加入于 {userData.joinDate}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center"><div className="text-2xl font-bold text-white">{userData.stats.posts}</div><div className="text-white/60 text-sm">帖子</div></div>
                  <div className="text-center"><div className="text-2xl font-bold text-white">{userData.stats.likes}</div><div className="text-white/60 text-sm">获赞</div></div>
                  <div className="text-center"><div className="text-2xl font-bold text-white">{userData.stats.followers}</div><div className="text-white/60 text-sm">关注者</div></div>
                  <div className="text-center"><div className="text-2xl font-bold text-white">{userData.stats.following}</div><div className="text-white/60 text-sm">关注中</div></div>
                </div>
                <div className="space-y-3">
                  <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all font-medium">关注</button>
                  <button className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium">发送消息</button>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 mt-6">
                <h3 className="text-lg font-semibold text-white mb-4">成就徽章</h3>
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
                <div className="p-6 border-b border-white/10"><h3 className="text-lg font-semibold text-white">最近发布</h3></div>
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
                  <button className="text-purple-400 hover:text-purple-300 transition-colors font-medium">查看更多帖子</button>
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
