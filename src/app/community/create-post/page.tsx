'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Send, Save, AlertCircle, FileText, Eye } from 'lucide-react';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import MarkdownEditor from '../../../components/community/MarkdownEditor';
import TagInput from '../../../components/community/TagInput';
import { useDraftSave } from '../../../hooks/useDraftSave';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export default function CreatePostPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    tags: [] as string[]
  });
  const [showPreview, setShowPreview] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);

  // 草稿保存
  const { saveDraft, loadDraft, clearDraft } = useDraftSave(
    formData.title,
    formData.content,
    formData.category,
    isLoggedIn
  );

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

      // 加载草稿
      if (!draftLoaded) {
        const draft = loadDraft();
        if (draft) {
          const shouldLoad = window.confirm(
            `检测到未发布的草稿（保存于 ${new Date(draft.lastSaved).toLocaleString()}），是否恢复？`
          );
          if (shouldLoad) {
            setFormData({
              title: draft.title,
              content: draft.content,
              category: draft.category,
              tags: []
            });
          }
        }
        setDraftLoaded(true);
      }
    } catch {
      router.push('/auth/login?redirect=/community/create-post');
    }
  }, [router, loadDraft, draftLoaded]);

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    if (formData.title.length > 200) {
      setError('标题不能超过 200 字符');
      return;
    }

    if (formData.content.length < 10) {
      setError('内容至少需要 10 字符');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/v2/barong/public/community/create-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          categorySlug: formData.category,
          currentUserId: userInfo?.id,
          tags: formData.tags,
          isDraft,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // 清除草稿
        clearDraft();
        
        if (isDraft) {
          alert('草稿已保存');
          router.push('/community');
        } else {
          router.push('/community');
        }
      } else {
        setError(data.message || '发布失败，请重试');
      }
    } catch {
      setError('网络错误，请检查连接');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    saveDraft();
    alert('草稿已保存到本地');
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
        <div className="max-w-4xl mx-auto p-4 pt-24">
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
          onSubmit={(e) => handleSubmit(e, false)}
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
            <label className="block text-sm font-medium text-gray-300 mb-2">标签</label>
            <TagInput
              value={formData.tags}
              onChange={(tags) => setFormData({ ...formData, tags })}
              placeholder="添加标签（最多5个）..."
              maxTags={5}
            />
            <div className="mt-1 text-xs text-gray-500">
              添加相关标签可以帮助其他用户更容易找到你的帖子
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">内容 * (支持 Markdown)</label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
              >
                {showPreview ? <FileText className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? '编辑' : '预览'}
              </button>
            </div>
            <MarkdownEditor
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              placeholder="开始编写你的内容... 支持 Markdown 语法"
              height={400}
            />
            <div className="mt-1 text-xs text-gray-400 text-right">{formData.content.length}/50000</div>
            <div className="mt-2 text-xs text-gray-500">
              提示：支持 Markdown 语法，包括标题、列表、代码块、链接、图片等
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
              disabled={loading}
            >
              <Save className="w-4 h-4" />
              保存草稿
            </button>

            <div className="flex items-center gap-4">
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
          </div>
        </motion.form>
      </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
