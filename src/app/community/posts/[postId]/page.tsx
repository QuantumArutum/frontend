'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Eye, MessageSquare, Clock, User } from 'lucide-react';
import ParticlesBackground from '../../../components/ParticlesBackground';
import CommunityNavbar from '../../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../../components/EnhancedFooter';
import VoteButtons from '../../../../components/community/VoteButtons';
import TagBadge from '../../../../components/community/TagBadge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

interface Post {
  id: number;
  title: string;
  content: string;
  userName: string;
  userAvatar: string;
  userId: string;
  categoryName: string;
  categorySlug: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  tags?: Array<{
    id: number;
    name: string;
    slug: string;
    color?: string;
  }>;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params?.postId as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userVote, setUserVote] = useState<'upvote' | 'downvote' | null>(null);

  const loadPost = useCallback(async () => {
    if (!postId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/v2/barong/public/community/post-detail?postId=${postId}`);
      const data = await response.json();

      if (data.success) {
        setPost(data.data);
        setUserVote(data.data.userVote);
      } else {
        setError(data.message || 'Failed to load post');
      }
    } catch (err) {
      console.error('Failed to load post:', err);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);
      
      if (data.success) {
        setPost(data.data);
        // 加载帖子标签
        loadPostTags(postId);
      } else {
        setError('Failed to load post');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const loadPostTags = async (postId: string) => {
    try {
      const response = await fetch(`/api/v2/barong/public/community/posts/${postId}/tags`);
      const data = await response.json();
      if (data.success && data.data.tags) {
        setPost(prev => prev ? { ...prev, tags: data.data.tags } : null);
      }
    } catch (err) {
      console.error('Error loading tags:', err);
    }
  };

  const handleVote = async (type: 'upvote' | 'downvote') => {
    if (!post) return;
    
    try {
      const response = await fetch('/api/v2/barong/public/community/vote-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          voteType: type,
          userId: localStorage.getItem('user_id') || 'anonymous'
        })
      });

      const data = await response.json();
      if (data.success) {
        setUserVote(type);
        // 重新加载帖子以获取最新投票数
        loadPost();
      }
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    if (days < 30) return `${days} 天前`;
    return date.toLocaleDateString('zh-CN');
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <ParticlesBackground />
        <CommunityNavbar />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen relative">
        <ParticlesBackground />
        <CommunityNavbar />
        <div className="relative z-10 max-w-4xl mx-auto px-4 py-24">
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">错误</h1>
            <p className="text-red-300 mb-6">{error || '帖子未找到'}</p>
            <Link
              href="/community"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              返回社区
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10">
        <div className="max-w-5xl mx-auto px-4 py-24">
          {/* 返回按钮 */}
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            返回社区
          </Link>

          <div className="flex gap-6">
            {/* 投票按钮 */}
            <div className="flex-shrink-0">
              <VoteButtons
                targetId={post.id}
                targetType="post"
                upvoteCount={post.upvotes || 0}
                downvoteCount={post.downvotes || 0}
                userVote={userVote}
                layout="vertical"
                size="large"
              />
            </div>

            {/* 主内容 */}
            <div className="flex-1 min-w-0">
              {/* 帖子头部 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 mb-6">
                <h1 className="text-3xl font-bold text-white mb-4">{post.title}</h1>

                {/* 标签 */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map(tag => (
                      <TagBadge
                        key={tag.id}
                        tag={tag}
                        size="medium"
                        clickable
                      />
                    ))}
                  </div>
                )}

                {/* 元信息 */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                      {post.userAvatar}
                    </div>
                    <Link
                      href={`/community/user/${post.userName}`}
                      className="hover:text-white transition-colors"
                    >
                      {post.userName}
                    </Link>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(post.createdAt)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.viewCount} 浏览
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {post.commentCount} 评论
                  </div>
                  <Link
                    href={`/community/forum/category?slug=${post.categorySlug}`}
                    className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30 transition-colors"
                  >
                    {post.categoryName}
                  </Link>
                </div>
              </div>

              {/* 帖子内容 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8 mb-6">
                <div className="prose prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </div>
              </div>

              {/* 评论区 */}
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">
                  评论 ({post.commentCount})
                </h2>
                <div className="text-center py-12 text-gray-400">
                  评论功能即将推出...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
