'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Eye, Heart, MessageSquare, Share2, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../../i18n';
import ParticlesBackground from '../../../app/components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../../components/EnhancedFooter';
import MarkdownPreview from '../../../components/community/MarkdownPreview';
import CommentTree from '../../../components/community/CommentTree';
import CommentSort from '../../../components/community/CommentSort';
import { barongAPI } from '@/api/client';
import ModeratorActions from '../../../components/community/ModeratorActions';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface PostDetail {
  id: number;
  title: string;
  content: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isPinned: boolean;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: number;
  postId: number;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: string;
  content: string;
  likeCount: number;
  isLiked: boolean;
  createdAt: string;
}

export default function PostDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslation();

  const postId = searchParams?.get('id');

  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isModerator, setIsModerator] = useState(false);

  // 评论相关状态
  const [commentContent, setCommentContent] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSort, setCommentSort] = useState<'newest' | 'oldest' | 'hot' | 'best'>('newest');

  // 检查登录状态和加载数据
  useEffect(() => {
    if (!postId) {
      setError('Invalid post ID');
      setLoading(false);
      return;
    }

    // 检查登录状态
    const token = localStorage.getItem('auth_token');
    const userInfoStr = localStorage.getItem('user_info');

    let currentUserId: string | null = null;

    if (token && userInfoStr) {
      try {
        const user = JSON.parse(userInfoStr);
        setUserInfo(user);
        setIsAuthenticated(true);
        currentUserId = user.id;

        // 检查是否是版主
        checkModeratorStatus(user.id);
      } catch (error) {
        console.error('Failed to parse user info:', error);
      }
    }

    // 加载帖子数据
    loadPostDetail(currentUserId);
    loadComments(currentUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  // 检查版主状态
  const checkModeratorStatus = async (userId: string) => {
    try {
      const response = await barongAPI.get(
        `/public/community/mod/moderators?currentUserId=${userId}`
      );
      if (response.data.success) {
        setIsModerator(true);
      }
    } catch (err) {
      // 不是版主或没有权限，忽略错误
      setIsModerator(false);
    }
  };

  const loadPostDetail = async (currentUserId: string | null) => {
    try {
      setLoading(true);
      setError(null);
      const url = `/public/community/post-detail?postId=${postId}${currentUserId ? `&currentUserId=${currentUserId}` : ''}`;
      const response = await barongAPI.get(url);

      if (response.data.success) {
        setPost(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load post');
      }
    } catch (err) {
      console.error('Failed to load post:', err);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async (currentUserId: string | null) => {
    try {
      setCommentsLoading(true);
      const url = `/public/community/post-comments?postId=${postId}&sort=${commentSort}${currentUserId ? `&currentUserId=${currentUserId}` : ''}`;
      const response = await barongAPI.get(url);

      if (response.data.success) {
        setComments(response.data.data.comments);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  // 点赞帖子
  const handleLikePost = async () => {
    if (!isAuthenticated || !userInfo) {
      alert('请先登录');
      return;
    }

    if (!post) return;

    const newIsLiked = !post.isLiked;
    const newLikeCount = newIsLiked ? post.likeCount + 1 : post.likeCount - 1;

    setPost({
      ...post,
      isLiked: newIsLiked,
      likeCount: newLikeCount,
    });

    try {
      const response = await barongAPI.post('/public/community/like-post', {
        postId: post.id,
        currentUserId: userInfo.id,
      });

      if (response.data.success) {
        setPost({
          ...post,
          isLiked: response.data.data.isLiked,
          likeCount: response.data.data.likeCount,
        });
      }
    } catch (err) {
      console.error('Failed to like post:', err);
      setPost({
        ...post,
        isLiked: !newIsLiked,
        likeCount: post.likeCount,
      });
    }
  };

  // 发表评论
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !userInfo) {
      alert('请先登录');
      return;
    }

    if (!commentContent.trim()) {
      alert('评论内容不能为空');
      return;
    }

    if (commentContent.length > 1000) {
      alert('评论内容不能超过1000字符');
      return;
    }

    try {
      setSubmittingComment(true);
      const response = await barongAPI.post('/public/community/post-comment', {
        postId: parseInt(postId!),
        currentUserId: userInfo.id,
        content: commentContent,
      });

      if (response.data.success) {
        setComments([response.data.data, ...comments]);
        setCommentContent('');

        if (post) {
          setPost({
            ...post,
            commentCount: post.commentCount + 1,
          });
        }
      } else {
        alert(response.data.message || '发表评论失败');
      }
    } catch (err: any) {
      console.error('Failed to submit comment:', err);
      alert(err.response?.data?.message || '发表评论失败');
    } finally {
      setSubmittingComment(false);
    }
  };

  // 点赞评论
  const handleLikeComment = async (commentId: number) => {
    if (!isAuthenticated || !userInfo) {
      alert('请先登录');
      return;
    }

    const originalComments = [...comments];

    setComments(
      comments.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            isLiked: !c.isLiked,
            likeCount: c.isLiked ? c.likeCount - 1 : c.likeCount + 1,
          };
        }
        return c;
      })
    );

    try {
      const response = await barongAPI.post('/public/community/like-comment', {
        commentId,
        currentUserId: userInfo.id,
      });

      if (response.data.success) {
        setComments(
          comments.map((c) => {
            if (c.id === commentId) {
              return {
                ...c,
                isLiked: response.data.data.isLiked,
                likeCount: response.data.data.likeCount,
              };
            }
            return c;
          })
        );
      }
    } catch (err) {
      console.error('Failed to like comment:', err);
      setComments(originalComments);
    }
  };

  // 回复评论
  const handleReplyComment = async (
    postId: number,
    parentId: number,
    replyToUserId: string,
    replyToUserName: string,
    content: string
  ) => {
    if (!isAuthenticated || !userInfo) {
      throw new Error('请先登录');
    }

    try {
      const response = await barongAPI.post('/public/community/reply-comment', {
        postId,
        parentId,
        replyToUserId,
        replyToUserName,
        content,
        currentUserId: userInfo.id,
        currentUserName: userInfo.name,
      });

      if (response.data.success) {
        // 重新加载评论列表
        loadComments(userInfo.id);

        // 更新帖子评论数
        if (post) {
          setPost({
            ...post,
            commentCount: post.commentCount + 1,
          });
        }
      } else {
        throw new Error(response.data.message || '回复失败');
      }
    } catch (err: any) {
      console.error('Failed to reply comment:', err);
      throw err;
    }
  };

  // 加载子评论
  const handleLoadReplies = async (commentId: number): Promise<Comment[]> => {
    try {
      const url = `/public/community/comment-replies?commentId=${commentId}${userInfo ? `&currentUserId=${userInfo.id}` : ''}`;
      const response = await barongAPI.get(url);

      if (response.data.success) {
        return response.data.data.replies;
      }
      return [];
    } catch (err) {
      console.error('Failed to load replies:', err);
      return [];
    }
  };

  // 处理排序变化
  const handleSortChange = (sort: 'newest' | 'oldest' | 'hot' | 'best') => {
    setCommentSort(sort);
    // 重新加载评论
    const currentUserId = userInfo?.id || null;
    loadComments(currentUserId);
  };

  // 删除帖子
  const handleDeletePost = async () => {
    if (!isAuthenticated || !userInfo || !post) {
      return;
    }

    if (post.userId !== userInfo.id) {
      alert('你只能删除自己的帖子');
      return;
    }

    const confirmed = window.confirm('确定要删除这个帖子吗？此操作无法撤销。');
    if (!confirmed) return;

    try {
      const response = await barongAPI.delete(
        `/public/community/delete-post?postId=${postId}&currentUserId=${userInfo.id}`
      );

      if (response.data.success) {
        alert('帖子已删除');
        router.push('/community');
      } else {
        alert(response.data.message || '删除失败');
      }
    } catch (err: any) {
      console.error('Failed to delete post:', err);
      alert(err.response?.data?.message || '删除失败');
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
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <ParticlesBackground />
        <CommunityNavbar />
        <div className="text-center relative z-10">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen relative">
        <ParticlesBackground />
        <CommunityNavbar />
        <div className="relative z-10 w-full h-full">
          <main className="max-w-4xl mx-auto px-4 py-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 text-center">
              <h1 className="text-2xl font-bold text-white mb-4">帖子不存在</h1>
              <p className="text-white/70 mb-6">{error}</p>
              <Link
                href="/community"
                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all"
              >
                返回社区
              </Link>
            </div>
          </main>
        </div>
        <EnhancedFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10 w-full h-full">
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* 返回按钮 */}
          <Link
            href="/community"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回社区
          </Link>

          {/* 版主操作 */}
          {isModerator && userInfo && (
            <div className="mb-6">
              <ModeratorActions
                postId={post.id}
                isPinned={post.isPinned}
                isLocked={false}
                currentUserId={userInfo.id}
                onUpdate={() => loadPostDetail(userInfo.id)}
              />
            </div>
          )}

          {/* 帖子内容 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8 mb-6">
            {/* 分类标签 */}
            <Link
              href={`/community/forum/category?slug=${post.categorySlug}`}
              className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm mb-4 hover:bg-purple-500/30 transition-colors"
            >
              {post.categoryName}
            </Link>

            {/* 标题 */}
            <h1 className="text-3xl font-bold text-white mb-6">{post.title}</h1>

            {/* 作者信息 */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
              <Link href={`/community/user/${post.userName}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:scale-110 transition-transform">
                  {post.userAvatar}
                </div>
              </Link>
              <div className="flex-1">
                <Link href={`/community/user/${post.userName}`}>
                  <h3 className="text-white font-medium hover:text-purple-300 transition-colors cursor-pointer">
                    {post.userName}
                  </h3>
                </Link>
                <div className="flex items-center gap-4 text-sm text-white/60">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {formatDate(post.createdAt)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {post.viewCount} 浏览
                  </span>
                </div>
              </div>
            </div>

            {/* 帖子内容 */}
            <div className="prose prose-invert max-w-none mb-6">
              <MarkdownPreview content={post.content} />
            </div>

            {/* 互动按钮 */}
            <div className="flex items-center justify-between gap-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLikePost}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    post.isLiked
                      ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span>{post.likeCount}</span>
                </button>

                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white/70">
                  <MessageSquare className="w-5 h-5" />
                  <span>{post.commentCount}</span>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-white/70 hover:bg-white/20 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span>分享</span>
                </button>
              </div>

              {/* 编辑和删除按钮（仅作者可见） */}
              {isAuthenticated && userInfo && post.userId === userInfo.id && (
                <div className="flex items-center gap-2">
                  <Link
                    href={`/community/posts/edit?id=${postId}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>编辑</span>
                  </Link>
                  <button
                    onClick={handleDeletePost}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>删除</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 评论区 */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">评论 ({post.commentCount})</h2>

            {/* 发表评论 */}
            {isAuthenticated ? (
              <form onSubmit={handleSubmitComment} className="mb-8">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="发表你的看法..."
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-500 resize-none"
                  rows={4}
                  maxLength={1000}
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-white/60">{commentContent.length}/1000</span>
                  <button
                    type="submit"
                    disabled={submittingComment || !commentContent.trim()}
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingComment ? '发表中...' : '发表评论'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-lg text-center">
                <p className="text-white/70 mb-3">登录后即可发表评论</p>
                <Link
                  href="/auth/login"
                  className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-600 hover:to-cyan-600 transition-all"
                >
                  立即登录
                </Link>
              </div>
            )}

            {/* 评论排序 */}
            {comments.length > 0 && (
              <CommentSort currentSort={commentSort} onSortChange={handleSortChange} />
            )}

            {/* 评论列表 */}
            {commentsLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-white/60">暂无评论，快来发表第一条评论吧！</div>
            ) : (
              <CommentTree
                comments={comments}
                currentUserId={userInfo?.id}
                currentUserName={userInfo?.name}
                onLike={handleLikeComment}
                onReply={handleReplyComment}
                onLoadReplies={handleLoadReplies}
              />
            )}
          </div>
        </main>
      </div>
      <EnhancedFooter />
    </div>
  );
}
