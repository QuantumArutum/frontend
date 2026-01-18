'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  MessageCircle,
  Heart,
  Share2,
  Eye,
  TrendingUp,
  Zap,
  Clock,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'mention' | 'achievement' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}

interface LiveUpdate {
  id: string;
  type: 'post' | 'vote' | 'price' | 'user';
  title: string;
  content: string;
  timestamp: Date;
  impact: 'low' | 'medium' | 'high';
}

interface WebSocketStatus {
  connected: boolean;
  lastPing: Date;
  reconnectAttempts: number;
}

export default function RealTimeUpdates() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'like',
      title: '帖子获得点赞',
      message: '你的帖子"量子安全钱包使用心得"获得了 5个新点赞',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
    },
    {
      id: '2',
      type: 'comment',
      title: '新评论',
      message: 'CryptoExpert 回复了你的帖子',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      isRead: false,
    },
    {
      id: '3',
      type: 'achievement',
      title: '获得新成就',
      message: '🎉 恭喜！你获得了"社区建设者"成就',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true,
    },
  ]);

  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>([
    {
      id: '1',
      type: 'vote',
      title: '治理提案更新',
      content: '新提案"升级量子安全算法"获得95%支持率',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      impact: 'high',
    },
    {
      id: '2',
      type: 'price',
      title: 'QAU价格变动',
      content: 'QAU价格上涨5.2%，当前价格 $2.45',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      impact: 'medium',
    },
    {
      id: '3',
      type: 'user',
      title: '新用户加入',
      content: '1,234位新用户加入社区',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      impact: 'low',
    },
  ]);

  const [wsStatus, setWsStatus] = useState<WebSocketStatus>({
    connected: true,
    lastPing: new Date(),
    reconnectAttempts: 0,
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLiveUpdates, setShowLiveUpdates] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  // 模拟WebSocket连接
  useEffect(() => {
    const notificationTypes: Notification['type'][] = ['like', 'comment', 'mention', 'achievement'];
    const updateTypes: LiveUpdate['type'][] = ['post', 'vote', 'price', 'user'];
    const impactLevels: LiveUpdate['impact'][] = ['low', 'medium', 'high'];

    const interval = setInterval(() => {
      // 模拟新通知
      if (Math.random() > 0.7) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: notificationTypes[Math.floor(Math.random() * notificationTypes.length)],
          title: '新通知',
          message: '实时数据更新中...',
          timestamp: new Date(),
          isRead: false,
        };
        setNotifications((prev) => [newNotification, ...prev].slice(0, 10));
      }

      // 模拟实时更新
      if (Math.random() > 0.8) {
        const newUpdate: LiveUpdate = {
          id: Date.now().toString(),
          type: updateTypes[Math.floor(Math.random() * updateTypes.length)],
          title: '实时更新',
          content: '社区动态实时推送',
          timestamp: new Date(),
          impact: impactLevels[Math.floor(Math.random() * impactLevels.length)],
        };
        setLiveUpdates((prev) => [newUpdate, ...prev].slice(0, 5));
      }

      setWsStatus((prev) => ({
        ...prev,
        lastPing: new Date(),
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, isRead: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-4 w-4 text-red-400" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-blue-400" />;
      case 'mention':
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case 'achievement':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      default:
        return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const getUpdateColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'from-red-500 to-pink-500';
      case 'medium':
        return 'from-yellow-500 to-orange-500';
      case 'low':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <>
      {/* 实时通知按钮 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowNotifications(!showNotifications)}
        className="fixed top-6 right-6 w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full shadow-lg flex items-center justify-center text-white z-40"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          >
            {unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* 实时更新按钮 */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowLiveUpdates(!showLiveUpdates)}
        className="fixed top-20 right-6 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg flex items-center justify-center text-white z-40"
      >
        <Zap className="h-5 w-5" />
        <div
          className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${wsStatus.connected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}
        ></div>
      </motion.button>

      {/* 通知面板 */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-20 right-20 w-96 max-h-96 bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">通知中心</h3>
                <div className="flex gap-2">
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-purple-400 hover:text-purple-300"
                  >
                    全部已读
                  </button>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
            <div className="overflow-y-auto max-h-80">
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 border-b border-white/10 hover:bg-white/5 cursor-pointer transition-colors ${
                    !notification.isRead ? 'bg-purple-500/10' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium">{notification.title}</h4>
                      <p className="text-gray-400 text-xs mt-1">{notification.message}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 实时更新面板 */}
      <AnimatePresence>
        {showLiveUpdates && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-36 right-20 w-96 max-h-96 bg-gray-900/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">实时动态</h3>
                <button
                  onClick={() => setShowLiveUpdates(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-80">
              {liveUpdates.map((update) => (
                <motion.div
                  key={update.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full bg-gradient-to-r ${getUpdateColor(update.impact)} mt-2`}
                    ></div>
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium">{update.title}</h4>
                      <p className="text-gray-400 text-xs mt-1">{update.content}</p>
                      <p className="text-gray-500 text-xs mt-2">{formatTime(update.timestamp)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 连接状态指示器 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-32 right-6 bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white border border-white/20"
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${wsStatus.connected ? 'bg-green-400' : 'bg-red-400'}`}
          ></div>
          {wsStatus.connected ? '实时连接' : '连接中...'}{' '}
        </div>
      </motion.div>
    </>
  );
}
