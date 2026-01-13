'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Send, Image as ImageIcon, Link as LinkIcon, AlertCircle } from 'lucide-react';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export default function CreatePostPage() {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general'
  });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userInfoStr = localStorage.getItem('user_info');

    if (!token || !userInfoStr) {
      router.push('/auth/login?redirect=/community/create-post');
      return;
    }

    try {
      const user = JSON.parse(userInfoStr);
      setUserInfo(user);
      setIsLoggedIn(true);
    } catch {
      router.push('/auth/login?redirect=/community/create-post');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: userInfo?.id,
          userName: userInfo?.name,
          userAvatar: userInfo?.avatar
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/community');
      } else {
        setError(data.message || '发帖失败，请重试');
      }
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <ParticlesBackground />
        <CommunityNavbar />
        <div className="text-white relative z-10">正在验证登录状态...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10">
      
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white" data-testid="create-post-title">创建新帖子</h1>
          <p className="text-gray-400">分享您的想法与社区</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{error}</span>
          </motion.div>
        )}

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8 space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">分类</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="general">常规讨论</option>
              <option value="technical">技术问答</option>
              <option value="defi">DeFi 交易</option>
              <option value="governance">治理提案</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">标题 *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入帖子标题..."
              maxLength={200}
              required
            />
            <div className="mt-1 text-xs text-gray-400 text-right">{formData.title.length}/200</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">内容 *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              placeholder="分享您的想法..."
              rows={12}
              maxLength={10000}
              required
            />
            <div className="mt-1 text-xs text-gray-400 text-right">{formData.content.length}/10000</div>
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-gray-700">
            <button type="button" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors" disabled>
              <ImageIcon className="w-5 h-5" aria-hidden="true" />
            </button>
            <button type="button" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors" disabled>
              <LinkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              disabled={loading}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  发布中...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  发布帖子
                </>
              )}
            </button>
          </div>
        </motion.form>
      </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
