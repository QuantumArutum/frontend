'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, Clock, User } from 'lucide-react';
import ParticlesBackground from '../../../../app/components/ParticlesBackground';
import CommunityNavbar from '../../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../../../components/EnhancedFooter';

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
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const categoryName = params?.categoryName
    ? decodeURIComponent(params.categoryName as string)
    : '';

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCategoryPosts = useCallback(async () => {
    setLoading(true);
    try {
      const categoryMap: Record<string, string> = {
        'General Discussion': 'general',
        Technical: 'technical',
        'DeFi & Trading': 'defi',
        Governance: 'governance',
      };

      const category = categoryMap[categoryName] || 'general';
      const response = await fetch(`/api/community/posts?category=${category}&limit=20`);
      const data = await response.json();

      if (data.success) {
        setPosts(data.data.posts);
      }
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  }, [categoryName]);

  useEffect(() => {
    loadCategoryPosts();
  }, [loadCategoryPosts]);

  const handlePostClick = (postId: string) => {
    router.push(`/community/post/${postId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">{categoryName}</h1>
            <p className="text-gray-400">{posts.length} 个帖子</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-white mt-4">加载中...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">此分类暂无帖子</p>
              <button
                onClick={() => router.push('/community/create-post')}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                发布第一个帖子
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handlePostClick(post.id)}
                  className="bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-6 hover:border-blue-500/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    {post.userAvatar ? (
                      <Image
                        src={post.userAvatar}
                        alt={post.userName}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                        {post.userName?.[0] || 'U'}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2 hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{post.userName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(post.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.commentCount || 0} 评论</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{post.likeCount || 0} 赞</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
