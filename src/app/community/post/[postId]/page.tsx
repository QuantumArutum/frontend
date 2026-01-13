'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, ThumbsDown, Send, Clock, Pin, Lock, AlertCircle } from 'lucide-react';
import CommunityNavbar from '../../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../../../components/EnhancedFooter';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  isPinned: boolean;
  isLocked: boolean;
}

interface Comment {
  id: string;
  postId: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  parentId?: string;
  createdAt: string;
}

interface LikeStats {
  likeCount: number;
  dislikeCount: number;
  userLike: 'like' | 'dislike' | null;
}

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const postId = (params?.postId as string) || '';

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [likeStats, setLikeStats] = useState<LikeStats>({ likeCount: 0, dislikeCount: 0, userLike: null });
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userInfoStr = localStorage.getItem('user_info');
    if (token && userInfoStr) {
      try {
        const user = JSON.parse(userInfoStr);
        setUserInfo(user);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Failed to parse user info:', error);
      }
    }
  }, []);

  const loadPostData = useCallback(async () => {
    setLoading(true);
    try {
      const [postRes, commentsRes, likesRes] = await Promise.all([
        fetch(`/api/community/posts?id=${postId}`),
        fetch(`/api/community/posts/${postId}/comments`),
        fetch(`/api/community/posts/${postId}/like${userInfo ? `?userId=${userInfo.id}` : ''}`)
      ]);
      const postData = await postRes.json();
      const commentsData = await commentsRes.json();
      const likesData = await likesRes.json();

      if (postData.success && postData.data.posts.length > 0) {
        setPost(postData.data.posts[0]);
      } else {
        setError('帖子不存在');
      }
      if (commentsData.success) setComments(commentsData.data);
      if (likesData.success) setLikeStats(likesData.data);
    } catch {
      setError('加载失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [postId, userInfo]);

  useEffect(() => {
    loadPostData();
  }, [loadPostData]);

  const handleLike = async (type: 'like' | 'dislike') => {
    if (!isLoggedIn) {
      router.push('/auth/login?redirect=/community/post/' + postId);
      return;
    }
    try {
      const response = await fetch(`/api/community/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userInfo?.id, type })
      });
      const data = await response.json();
      if (data.success) {
        const likesRes = await fetch(`/api/community/posts/${postId}/like?userId=${userInfo?.id}`);
        const likesData = await likesRes.json();
        if (likesData.success) setLikeStats(likesData.data);
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      router.push('/auth/login?redirect=/community/post/' + postId);
      return;
    }
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          userId: userInfo?.id,
          userName: userInfo?.name,
          userAvatar: userInfo?.avatar
        })
      });
      const data = await response.json();
      if (data.success) {
        setNewComment('');
        const commentsRes = await fetch(`/api/community/posts/${postId}/comments`);
        const commentsData = await commentsRes.json();
        if (commentsData.success) setComments(commentsData.data);
      }
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setSubmitting(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <div className="text-white text-xl mb-4">{error || '帖子不存在'}</div>
          <button onClick={() => router.push('/community')} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
            返回社区
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <CommunityNavbar />

      <div className="relative z-10 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            {post.isPinned && <Pin className="w-5 h-5 text-green-400" />}
            {post.isLocked && <Lock className="w-5 h-5 text-yellow-400" />}
            <span className="text-sm text-gray-400">
              {post.category === 'general' && '常规讨论'}
              {post.category === 'technical' && '技术问题'}
              {post.category === 'defi' && 'DeFi & 交易'}
              {post.category === 'governance' && '治理提案'}
            </span>
          </div>

          {/* Post Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 mb-6"
          >
            <h1 className="text-3xl font-bold text-white mb-6">{post.title}</h1>
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/20">
              {post.userAvatar ? (
                <Image src={post.userAvatar} alt={post.userName} width={48} height={48} className="w-12 h-12 rounded-full" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {post.userName[0]}
                </div>
              )}
              <div>
                <div className="text-white font-medium">{post.userName}</div>
                <div className="text-sm text-gray-400 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formatDate(post.createdAt)}
                </div>
              </div>
            </div>
            <div className="text-gray-300 whitespace-pre-wrap mb-6">{post.content}</div>
            <div className="flex items-center gap-4">
              <button
                data-testid="like-button"
                onClick={() => handleLike('like')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  likeStats.userLike === 'like' ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <ThumbsUp className="w-5 h-5" />
                <span>{likeStats.likeCount}</span>
              </button>
              <button
                onClick={() => handleLike('dislike')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  likeStats.userLike === 'dislike' ? 'bg-red-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                <ThumbsDown className="w-5 h-5" />
                <span>{likeStats.dislikeCount}</span>
              </button>
              <div className="flex items-center gap-2 text-gray-400 ml-auto">
                <MessageSquare className="w-5 h-5" />
                <span>{comments.length} 条评论</span>
              </div>
            </div>
          </motion.div>

          {/* Comments Section */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">评论</h2>
            {isLoggedIn ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <textarea
                  data-testid="comment-input"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="发表您的评论..."
                  rows={4}
                  maxLength={2000}
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-400">{newComment.length}/2000</span>
                  <button
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? '加载中...' : <><Send className="w-4 h-4" />发表评论</>}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-blue-900/30 border border-blue-700/50 rounded-lg text-center">
                <p className="text-blue-300 mb-3">登录后可发表评论</p>
                <button
                  onClick={() => router.push('/auth/login?redirect=/community/post/' + postId)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  立即登录
                </button>
              </div>
            )}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-8 text-gray-400">暂无评论，来发表第一条吧！</div>
              ) : (
                comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-start gap-3">
                      {comment.userAvatar ? (
                        <Image src={comment.userAvatar} alt={comment.userName} width={40} height={40} className="w-10 h-10 rounded-full" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                          {comment.userName[0]}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white font-medium">{comment.userName}</span>
                          <span className="text-xs text-gray-400">{formatDate(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <EnhancedFooter />
    </div>
  );
}
