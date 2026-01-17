'use client';

import { useEffect, useCallback, useRef } from 'react';

interface DraftData {
  title: string;
  content: string;
  category: string;
  lastSaved: number;
}

const DRAFT_KEY = 'community_post_draft';
const AUTO_SAVE_INTERVAL = 30000; // 30秒

export function useDraftSave(
  title: string,
  content: string,
  category: string,
  enabled: boolean = true
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 保存草稿到 LocalStorage
  const saveDraft = useCallback(() => {
    if (!enabled || (!title.trim() && !content.trim())) {
      return;
    }

    const draft: DraftData = {
      title,
      content,
      category,
      lastSaved: Date.now(),
    };

    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      console.log('草稿已自动保存');
    } catch (error) {
      console.error('保存草稿失败:', error);
    }
  }, [title, content, category, enabled]);

  // 加载草稿
  const loadDraft = useCallback((): DraftData | null => {
    try {
      const draftStr = localStorage.getItem(DRAFT_KEY);
      if (!draftStr) return null;

      const draft: DraftData = JSON.parse(draftStr);
      
      // 检查草稿是否过期（7天）
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      if (draft.lastSaved < sevenDaysAgo) {
        localStorage.removeItem(DRAFT_KEY);
        return null;
      }

      return draft;
    } catch (error) {
      console.error('加载草稿失败:', error);
      return null;
    }
  }, []);

  // 清除草稿
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(DRAFT_KEY);
      console.log('草稿已清除');
    } catch (error) {
      console.error('清除草稿失败:', error);
    }
  }, []);

  // 自动保存
  useEffect(() => {
    if (!enabled) return;

    // 清除之前的定时器
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 设置新的定时器
    timeoutRef.current = setTimeout(() => {
      saveDraft();
    }, AUTO_SAVE_INTERVAL);

    // 清理函数
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [title, content, category, enabled, saveDraft]);

  // 页面卸载时保存
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (enabled && (title.trim() || content.trim())) {
        saveDraft();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [title, content, enabled, saveDraft]);

  return {
    saveDraft,
    loadDraft,
    clearDraft,
  };
}
