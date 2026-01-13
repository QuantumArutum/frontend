'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Heart, MessageSquare, Share2, Clock } from 'lucide-react';
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

export default function TopicPage() {
  const params = useParams();
  const { t } = useTranslation();
  const topicId = (params?.topicId as string) || 'default-topic';

  const handleBack = () => {
    window.history.back();
  };

  // 模拟话题数据 - 使用一致的数字生成避免 hydration 错误
  const topicData = {
    id: topicId,
    title: topicId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    content: t('topic_page.sample_content', { topic: topicId.replace(/-/g, ' ') }),
    author: {
      name: 'QuantumPioneer',
      avatar: 'QP',
      level: t('topic_page.levels.quantum_expert'),
      joinDate: t('topic_page.joined_year', { year: '2023' })
    },
    stats: {
      views: generateConsistentNumber(topicId + 'views', 5000, 1000),
      likes: generateConsistentNumber(topicId + 'likes', 200, 50),
      replies: generateConsistentNumber(topicId + 'replies', 100, 20)
    },
    createdAt: '2024-01-15 14:30',
    category: t('topic_page.categories.quantum_computing')
  };

  const replies = [
    {
      id: 1,
      author: { name: 'TechEnthusiast', avatar: 'TE', level: t('topic_page.levels.active_member') },
      content: t('topic_page.sample_replies.reply1'),
      createdAt: t('topic_page.time.hours_ago', { count: 2 }),
      likes: 12
    },
    {
      id: 2,
      author: { name: 'QuantumStudent', avatar: 'QS', level: t('topic_page.levels.newbie') },
      content: t('topic_page.sample_replies.reply2'),
      createdAt: t('topic_page.time.hours_ago', { count: 4 }),
      likes: 8
    }
  ];

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10 w-full h-full">
        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Topic Post */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 mb-8">
            {/* Topic Header */}
            <div className="p-6 border-b border-white/10">
              <h1 className="text-2xl font-bold text-white mb-4">{topicData.title}</h1>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {topicData.author.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{topicData.author.name}</span>
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                        {topicData.author.level}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-white/60">
                      <Clock className="w-4 h-4" />
                      <span>{topicData.createdAt}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span>{t('topic_page.views', { count: topicData.stats.views })}</span>
                  <span>{t('topic_page.replies_count', { count: topicData.stats.replies })}</span>
                </div>
              </div>
            </div>

            {/* Topic Content */}
            <div className="p-6">
              <div className="text-white/80 leading-relaxed whitespace-pre-line">
                {topicData.content}
              </div>
            </div>

            {/* Topic Actions */}
            <div className="p-6 border-t border-white/10">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white">
                  <Heart className="w-4 h-4" />
                  <span>{topicData.stats.likes}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white">
                  <MessageSquare className="w-4 h-4" />
                  <span>{t('topic_page.reply')}</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white">
                  <Share2 className="w-4 h-4" />
                  <span>{t('topic_page.share')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Replies */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
            <div className="p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">{t('topic_page.replies_title', { count: replies.length })}</h3>
            </div>
            
            <div className="divide-y divide-white/10">
              {replies.map((reply) => (
                <div key={reply.id} className="p-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                      {reply.author.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-white font-medium">{reply.author.name}</span>
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                          {reply.author.level}
                        </span>
                        <span className="text-white/50 text-sm">{reply.createdAt}</span>
                      </div>
                      <p className="text-white/80 mb-3">{reply.content}</p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-white/60 hover:text-white transition-colors text-sm">
                          <Heart className="w-4 h-4" />
                          <span>{reply.likes}</span>
                        </button>
                        <button className="text-white/60 hover:text-white transition-colors text-sm">
                          {t('topic_page.reply')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Form */}
            <div className="p-6 border-t border-white/10">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  U
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder={t('topic_page.reply_placeholder')}
                    className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 resize-none"
                    rows={4}
                  />
                  <div className="mt-4 flex justify-end">
                    <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all font-medium">
                      {t('topic_page.post_reply')}
                    </button>
                  </div>
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
