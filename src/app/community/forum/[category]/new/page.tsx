'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Send, Image as ImageIcon, Link as LinkIcon, AlertCircle } from 'lucide-react';
import QuantumBackground from '../../../../../components/common/QuantumBackground';
import CommunityNavbar from '../../../../../components/community/CommunityNavbar';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

const categoryData: Record<string, { name: string; icon: string; color: string }> = {
  general: { name: 'General', icon: 'G', color: 'from-blue-500 to-cyan-500' },
  technical: { name: 'Technical', icon: 'T', color: 'from-purple-500 to-pink-500' },
  defi: { name: 'DeFi', icon: 'D', color: 'from-green-500 to-emerald-500' },
  trading: { name: 'Trading', icon: 'TR', color: 'from-orange-500 to-red-500' },
  governance: { name: 'Governance', icon: 'GV', color: 'from-indigo-500 to-purple-500' },
  events: { name: 'Events', icon: 'E', color: 'from-yellow-500 to-orange-500' }
};

export default function NewForumPostPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.category as string || 'general';
  const category = categoryData[categoryId] || categoryData.general;

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ title: '', content: '', tags: '' });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userInfoStr = localStorage.getItem('user_info');

    if (!token || !userInfoStr) {
      router.push(`/auth/login?redirect=/community/forum/${categoryId}/new`);
      return;
    }

    try {
      const user = JSON.parse(userInfoStr);
      setUserInfo(user);
      setIsLoggedIn(true);
    } catch (err) {
      router.push(`/auth/login?redirect=/community/forum/${categoryId}/new`);
    }
  }, [router, categoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content,
          category: categoryId,
          userId: userInfo?.id,
          userName: userInfo?.name,
          userAvatar: userInfo?.avatar,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        }),
      });

      const data = await response.json();
      if (data.success) {
        router.push(`/community/forum/${categoryId}`);
      } else {
        setError(data.message || 'Failed to create post');
      }
    } catch (err) {
      setError('Network error, please try again');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="text-white">Verifying login status...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 w-full h-full" style={{
        background: `radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #1e3a8a 50%, #1e40af 75%, #1d4ed8 100%)`,
        zIndex: -2
      }} />
      <QuantumBackground id="new-post-particles" intensity="light" interactive={true} />

      {/* 社区导航条 */}
      <CommunityNavbar />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl font-bold text-purple-400">{category.icon}</span>
            <h1 className="text-2xl font-bold text-white">Create New Post</h1>
          </div>
          <p className="text-gray-400">Post in {category.name} category</p>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300">{error}</span>
          </motion.div>
        )}

        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${category.color} rounded-lg text-white`}>
              <span className="font-bold">{category.icon}</span>
              <span>{category.name}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="Enter post title..."
              maxLength={200}
              required
            />
            <div className="mt-1 text-xs text-gray-400 text-right">{formData.title.length}/200</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Content *</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
              placeholder="Share your thoughts..."
              rows={12}
              maxLength={10000}
              required
            />
            <div className="mt-1 text-xs text-gray-400 text-right">{formData.content.length}/10000</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags (optional)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
              placeholder="Enter tags, separated by commas..."
            />
          </div>

          <div className="flex items-center gap-3 pt-2 border-t border-white/20">
            <button type="button" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Add image (coming soon)" disabled>
              <ImageIcon className="w-5 h-5" aria-hidden="true" />
            </button>
            <button type="button" className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors" title="Add link (coming soon)" disabled>
              <LinkIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <button type="button" onClick={() => router.back()} className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors" disabled={loading}>
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Publish Post
                </>
              )}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
