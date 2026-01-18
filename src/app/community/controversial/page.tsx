'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { AlertTriangle, Eye, MessageSquare, Clock, ArrowLeft } from 'lucide-react';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import VoteButtons from '../../../components/community/VoteButtons';
import TagBadge from '../../../components/community/TagBadge';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  authorAvatar: string;
  category: string;
  categorySlug: string;
  upvotes: number;
  downvotes: number;
  views: number;
  replies: number;
  controversyScore: number;
  createdAt: string;
  tags?: Array<{ id: number; name: string; slug: string; color?: string }>;
}

export default function ControversialPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadControversialPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v2/barong/public/community/controversial-posts?limit=20&offset=${(page - 1) * 20}`);
      const data = await response.json();
      
      if (data.success) {
        setPosts(data.data.posts);
        setHasMore(data.data.pagination.hasMore);
      }
    } catch (err) {
      console.error('Error loading controversial posts:', err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadControversialPosts();
  }, [loadControversialPosts]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 24) return `${hours} 小时前`;
    if (days < 30) return `${days} 天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const getControversyLevel = (score: number) => {
    if (score > 0.8) return { text: '极高', color: 'text-red-400' };
    if (score > 0.6) return { text: '高', color: 'text-orange-400' };
    if (score > 0.4) return { text: '中', color: 'text-yellow-400' };
    return { text: '低', color: 'text-gray-400' };
  };

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-24">
          {/* 头部 */}
          <div className="mb-8">
            <Link
              href="/community"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              返回社区
            </Link>
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="w-8 h-8 text-yellow-400" />
              <h1 className="text-3xl font-bold text-white">争议帖子</h1>
            </div>
            <p className="text-gray-400">赞同和反对票数接近的帖子</p>
          </div>

          {/* 加载状态 */}
          {loading && posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">加载中...</p>
            </div>
          ) : (
            <>
              {/* 帖子列表 */}
              <div className="space-y-4">
                {posts.map((post, index) => {
                  const controversy = getControversyLevel(post.controversyScore);
                  return (
                    <div
                      key={post.id}
                      className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-6 hover:border-white/20 transition-all"
                    >
                      <div className="flex gap-4">
                        {/* 排名和争议度 */}
                        <div className="flex-shrink-0 w-12 text-center">
                          <div className="text-2xl font-bold text-yellow-400">
                            #{index + 1 + (page - 1) * 20}
                          </div>
                          <div className={`text-xs mt-1 ${controversy.color}`}>
                            {controversy.text}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {post.controversyScore.toFixed(2)}
                          </div>
                        </div>

                        {/* 投票 */}
                        <div className="flex-shrink-0">
                          <VoteButtons
                            targetId={post.id}
                            targetType="post"
                            upvoteCount={post.upvotes}
                            downvoteCount={post.downvotes}
                            userVote={null}
                            layout="vertical"
                            size="small"
                          />
                        </div>

                        {/* 内容 */}
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/community/posts/${post.id}`}
                            className="block group"
                          >
                            <h3 className="text-xl font-semibold text-white group-hover:text-cyan-400 transition-colors mb-2">
                              {post.title}
                            </h3>
                          </Link>

                          {/* 标签 */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {post.tags.slice(0, 3).map(tag => (
                                <TagBadge
                                  key={tag.id}
                                  tag={tag}
                                  size="small"
                                  clickable
                                />
                              ))}
                            </div>
                          )}

                          {/* 投票统计 */}
                          <div className="flex items-center gap-4 mb-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-green-400">↑ {post.upvotes}</span>
                              <span className="text-gray-500">/</span>
                              <span className="text-red-400">↓ {post.downvotes}</span>
                            </div>
                            <div className="text-gray-400">
                              比例: {post.upvotes > 0 ? ((post.upvotes / (post.upvotes + post.downvotes)) * 100).toFixed(0) : 0}%
                            </div>
                          </div>

                          {/* 元信息 */}
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                            <Link
                              href={`/community/user/${post.author}`}
                              className="flex items-center gap-2 hover:text-white transition-colors"
                            >
                              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {post.authorAvatar}
                              </div>
                              {post.author}
                            </Link>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {formatDate(post.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {post.views}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {post.replies}
                            </div>
                            <Link
                              href={`/community/forum/category?slug=${post.categorySlug}`}
                              className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500/30 transition-colors text-xs"
                            >
                              {post.category}
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 分页 */}
              {(page > 1 || hasMore) && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  {page > 1 && (
                    <button
                      onClick={() => setPage(page - 1)}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                      上一页
                    </button>
                  )}
                  <span className="text-gray-400">第 {page} 页</span>
                  {hasMore && (
                    <button
                      onClick={() => setPage(page + 1)}
                      className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                    >
                      下一页
                    </button>
                  )}
                </div>
              )}

              {/* 空状态 */}
              {posts.length === 0 && !loading && (
                <div className="text-center py-12 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
                  <AlertTriangle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    暂无争议帖子
                  </h3>
                  <p className="text-gray-400">
                    当前没有引起争议的帖子
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
