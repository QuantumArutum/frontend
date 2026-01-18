'use client';

import React, { useState } from 'react';
import { Pin, Lock, Trash2, Move, Shield } from 'lucide-react';
import { barongAPI } from '@/api/client';

interface ModeratorActionsProps {
  postId: number;
  isPinned: boolean;
  isLocked: boolean;
  currentUserId: string;
  onUpdate: () => void;
}

export default function ModeratorActions({
  postId,
  isPinned,
  isLocked,
  currentUserId,
  onUpdate,
}: ModeratorActionsProps) {
  const [loading, setLoading] = useState(false);

  // 置顶/取消置顶帖子
  const handlePin = async () => {
    if (loading) return;

    const action = isPinned ? '取消置顶' : '置顶';
    const confirmed = window.confirm(`确定要${action}这个帖子吗？`);
    if (!confirmed) return;

    try {
      setLoading(true);
      const response = await barongAPI.post('/public/community/mod/pin-post', {
        postId,
        pinType: isPinned ? null : 'global',
        currentUserId,
      });

      if (response.data.success) {
        alert(`${action}成功`);
        onUpdate();
      } else {
        alert(response.data.message || `${action}失败`);
      }
    } catch (err: any) {
      console.error('Failed to pin post:', err);
      alert(err.response?.data?.message || `${action}失败`);
    } finally {
      setLoading(false);
    }
  };

  // 锁定/解锁帖子
  const handleLock = async () => {
    if (loading) return;

    const action = isLocked ? '解锁' : '锁定';
    const reason = prompt(`请输入${action}原因：`);
    if (reason === null) return;

    try {
      setLoading(true);
      const response = await barongAPI.post('/public/community/mod/lock-post', {
        postId,
        lock: !isLocked,
        reason: reason || `版主${action}`,
        currentUserId,
      });

      if (response.data.success) {
        alert(`${action}成功`);
        onUpdate();
      } else {
        alert(response.data.message || `${action}失败`);
      }
    } catch (err: any) {
      console.error('Failed to lock post:', err);
      alert(err.response?.data?.message || `${action}失败`);
    } finally {
      setLoading(false);
    }
  };

  // 删除帖子（版主权限）
  const handleModDelete = async () => {
    if (loading) return;

    const reason = prompt('请输入删除原因：');
    if (reason === null) return;

    const confirmed = window.confirm('确定要删除这个帖子吗？此操作无法撤销。');
    if (!confirmed) return;

    try {
      setLoading(true);
      const response = await barongAPI.delete(
        `/public/community/delete-post?postId=${postId}&currentUserId=${currentUserId}&reason=${encodeURIComponent(reason)}`
      );

      if (response.data.success) {
        alert('删除成功');
        window.location.href = '/community';
      } else {
        alert(response.data.message || '删除失败');
      }
    } catch (err: any) {
      console.error('Failed to delete post:', err);
      alert(err.response?.data?.message || '删除失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
      <Shield className="w-5 h-5 text-yellow-400" />
      <span className="text-yellow-300 text-sm font-medium mr-2">版主操作：</span>

      <button
        onClick={handlePin}
        disabled={loading}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
          isPinned
            ? 'bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30'
            : 'bg-white/10 text-white/70 hover:bg-white/20'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isPinned ? '取消置顶' : '置顶帖子'}
      >
        <Pin className={`w-4 h-4 ${isPinned ? 'fill-current' : ''}`} />
        <span>{isPinned ? '取消置顶' : '置顶'}</span>
      </button>

      <button
        onClick={handleLock}
        disabled={loading}
        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
          isLocked
            ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
            : 'bg-white/10 text-white/70 hover:bg-white/20'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isLocked ? '解锁帖子' : '锁定帖子'}
      >
        <Lock className={`w-4 h-4 ${isLocked ? 'fill-current' : ''}`} />
        <span>{isLocked ? '解锁' : '锁定'}</span>
      </button>

      <button
        onClick={handleModDelete}
        disabled={loading}
        className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        title="删除帖子"
      >
        <Trash2 className="w-4 h-4" />
        <span>删除</span>
      </button>
    </div>
  );
}
