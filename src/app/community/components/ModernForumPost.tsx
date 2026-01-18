'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Clock,
  Eye,
  Award,
  Crown,
  Pin,
  Lock,
  Edit,
  Trash2,
  Reply,
  Quote,
  Link as LinkIcon,
} from 'lucide-react';
import '../../../styles/design-system.css';

interface ForumPostProps {
  post: {
    id: string;
    title: string;
    content: string;
    author: {
      name: string;
      avatar: string;
      level: string;
      reputation: number;
      badges: string[];
      isOnline: boolean;
    };
    createdAt: string;
    updatedAt?: string;
    replies: number;
    views: number;
    likes: number;
    dislikes: number;
    tags: string[];
    isPinned: boolean;
    isLocked: boolean;
    isFeatured: boolean;
    category: string;
  };
  isPreview?: boolean;
  showActions?: boolean;
}

const ModernForumPost: React.FC<ForumPostProps> = ({
  post,
  isPreview = false,
  showActions = true,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  const getBadgeColor = (badge: string) => {
    const colors = {
      'Core Developer': 'from-purple-500 to-pink-500',
      'Community Leader': 'from-amber-500 to-orange-500',
      'Early Adopter': 'from-blue-500 to-cyan-500',
      'Top Contributor': 'from-emerald-500 to-teal-500',
      Moderator: 'from-red-500 to-pink-500',
    };
    return colors[badge as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`quantum-card group relative ${isPreview ? 'cursor-pointer' : ''}`}
    >
      {/* Post Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4 flex-1">
          {/* Author Avatar */}
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-lg font-semibold text-white">
              {post.author.avatar}
            </div>
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${
                post.author.isOnline ? 'bg-green-400' : 'bg-gray-400'
              }`}
            ></div>
          </div>

          {/* Author Info & Post Meta */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-white">{post.author.name}</h4>
              {post.author.badges.map((badge) => (
                <span
                  key={badge}
                  className={`px-2 py-0.5 text-xs rounded-full bg-gradient-to-r ${getBadgeColor(badge)} text-white`}
                >
                  {badge}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>{post.author.level}</span>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                <span>{post.author.reputation.toLocaleString()}</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{post.createdAt}</span>
              </div>
              {post.updatedAt && (
                <>
                  <span>·</span>
                  <span className="text-xs">edited {post.updatedAt}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Post Actions Menu */}
        {showActions && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="quantum-btn quantum-btn-ghost p-2 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 quantum-glass rounded-xl border border-white/20 py-2 z-50"
                >
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Post
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2">
                    <Pin className="w-4 h-4" />
                    Pin Post
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Copy Link
                  </button>
                  <hr className="my-2 border-white/10" />
                  <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    Report
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Post Status Indicators */}
      <div className="flex items-center gap-2 mb-3">
        {post.isPinned && (
          <span className="flex items-center gap-1 px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded-md">
            <Pin className="w-3 h-3" />
            Pinned
          </span>
        )}
        {post.isLocked && (
          <span className="flex items-center gap-1 px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-md">
            <Lock className="w-3 h-3" />
            Locked
          </span>
        )}
        {post.isFeatured && (
          <span className="flex items-center gap-1 px-2 py-1 text-xs bg-amber-500/20 text-amber-400 rounded-md">
            <Crown className="w-3 h-3" />
            Featured
          </span>
        )}
        <span className="px-2 py-1 text-xs bg-purple-500/20 text-purple-400 rounded-md">
          {post.category}
        </span>
      </div>

      {/* Post Title */}
      <h2
        className={`font-bold text-white mb-3 group-hover:text-purple-300 transition-colors ${
          isPreview ? 'text-lg' : 'text-xl'
        }`}
      >
        {post.title}
      </h2>

      {/* Post Content */}
      <div className={`text-gray-300 leading-relaxed mb-4 ${isPreview ? 'line-clamp-3' : ''}`}>
        {post.content}
      </div>

      {/* Post Tags */}
      {post.tags.length > 0 && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-white/5 text-gray-400 rounded-md border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Post Stats & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        {/* Stats */}
        <div className="flex items-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{post.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="w-4 h-4" />
            <span>{post.replies}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{post.likes}</span>
          </div>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`quantum-btn quantum-btn-ghost p-2 ${
                isLiked ? 'text-green-400' : 'text-gray-400'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button
              onClick={handleDislike}
              className={`quantum-btn quantum-btn-ghost p-2 ${
                isDisliked ? 'text-red-400' : 'text-gray-400'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`quantum-btn quantum-btn-ghost p-2 ${
                isBookmarked ? 'text-amber-400' : 'text-gray-400'
              }`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="quantum-btn quantum-btn-ghost p-2 text-gray-400">
              <Share2 className="w-4 h-4" />
            </button>
            {!isPreview && (
              <button
                onClick={() => setShowReplyBox(!showReplyBox)}
                className="quantum-btn quantum-btn-primary"
              >
                <Reply className="w-4 h-4" />
                Reply
              </button>
            )}
          </div>
        )}
      </div>

      {/* Reply Box */}
      <AnimatePresence>
        {showReplyBox && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-white/10"
          >
            <div className="quantum-glass rounded-lg p-4">
              <textarea
                placeholder="Write your reply..."
                className="w-full h-24 bg-transparent border border-white/20 rounded-lg p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-purple-500"
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <button className="quantum-btn quantum-btn-ghost p-2">
                    <Quote className="w-4 h-4" />
                  </button>
                  <button className="quantum-btn quantum-btn-ghost p-2">
                    <LinkIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowReplyBox(false)}
                    className="quantum-btn quantum-btn-ghost"
                  >
                    Cancel
                  </button>
                  <button className="quantum-btn quantum-btn-primary">Post Reply</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
};

export default ModernForumPost;
