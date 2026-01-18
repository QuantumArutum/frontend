'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Send, AlertCircle, ArrowLeft } from 'lucide-react';
import ParticlesBackground from '../../../components/ParticlesBackground';
import CommunityNavbar from '../../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../../components/EnhancedFooter';
import MarkdownEditor from '../../../../components/community/MarkdownEditor';
import TagInput from '../../../../components/community/TagInput';

interface UserInfo {
  id: string;
  email: string;
  name: string;
}

export default function EditPostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams?.get('id');

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    editReason: '',
    tags: [] as string[]
  });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userInfoStr = localStorage.getItem('user_info');

    if (!token || !userInfoStr) {
      router.push('/auth/login?redirect=/community/posts/edit?id=' + postId);
      return;
    }

    try {
      const user = JSON.parse(userInfoStr);
      setUserInfo(user);
      setIsLoggedIn(true);
    } catch {
      router.push('/auth/login?redirect=/community/posts/edit?id=' + postId);
    }
  }, [router, postId]);

  useEffect(() => {
    if (!postId || !isLoggedIn) return;

    const fetchPost = async () => {
      try {
        const response = await fetch(
          `/api/v2/barong/public/community/post-detail?postId=${postId}&currentUserId=${userInfo?.id}`
        );
        const data = await response.json();

        if (data.success && data.data) {
          const post = data.data;
          
          // 验证是否是帖子作者
          if (post.userId !== userInfo?.id) {
            setError('你只能编辑自己的帖子');
            setTimeout(() => router.push('/community'), 2000);
            return;
          }

          setFormData({
            title: post.title,
            content: post.content,
            category: post.categorySlug || 'general',
            editReason: '',
            tags: []
          });
        } else {
          setError('帖子不存在');
          setTimeout(() => router.push('/community'), 2000);
        }
      } catch {
        setError('加载帖子失败');
      } finally {
        setLoadingPost(false);
      }
    };

    fetchPost();
  }, [postId, isLoggedIn, userInfo, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v2/barong/public/community/edit-post', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: parseInt(postId || '0'),
          title: formData.title,
          content: formData.content,
          categorySlug: formData.category,
          currentUserId: userInfo?.id,
          editReason: formData.editReason || null,
          tags: formData.tags,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/community/posts?id=${postId}`);
      } else {
        setError(data.message || '更新失败，请重试');
      }
    } catch {
      setError('网络错误，请检查连接');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn || loadingPost) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <ParticlesBackground />
        <CommunityNavbar />
        <div className="text-white relative z-10">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto p-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">编辑帖子</h1>
            <p className="text-gray-400">修改你的帖子内容</p>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">分类 *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">综合讨论</option>
                <option value="announcements">公告</option>
                <option value="technology">技术交流</option>
                <option value="trading">DeFi & 交易</option>
                <option value="governance">治理</option>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">内容 * (支持 Markdown)</label>
              <MarkdownEditor
                value={formData.content}
                onChange={(value) => setFormData({ ...formData, content: value })}
                placeholder="编辑你的内容... 支持 Markdown 语法"
                height={400}
              />
              <div className="mt-1 text-xs text-gray-400 text-right">{formData.content.length}/50000</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">编辑原因 (可选)</label>
              <input
                type="text"
                value={formData.editReason}
                onChange={(e) => setFormData({ ...formData, editReason: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="说明编辑原因..."
                maxLength={200}
              />
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-700">
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
                    更新中...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    更新帖子
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
