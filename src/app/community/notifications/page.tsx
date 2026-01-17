'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bell, Heart, MessageSquare, UserPlus, AtSign, Check, Trash2, CheckCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../../i18n';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import { barongAPI } from '@/api/client';

interface Notification {
  id: number;
  userId: string;
  type: string;
  title: string;
  content: string;
  link: string;
  actorId: string;
  actorName: string;
  isRead: boolean;
  createdAt: string;
}

interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userInfoStr = localStorage.getItem('user_info');

    if (!token || !userInfoStr) {
      router.push('/auth/login?redirect=/community/notifications');
      return;
    }

    try {
      const user = JSON.parse(userInfoStr);
      setUserInfo(user);
      loadNotifications(user.id);
    } catch {
      router.push('/auth/login?redirect=/community/notifications');
    }
  }, [router]);

  const loadNotifications = async (userId: string) => {
    setLoading(true);
    try {
      const response = await barongAPI.get(`/public/community/notifications?userId=${userId}&limit=50`);
      if (response.data.success) {
        setNotifications(response.data.data.notifications);
        setUnreadCount(response.data.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    if (!userInfo) return;
    try {
      const response = await barongAPI.put('/public/community/notifications', {
        notificationId,
        userId: userInfo.id,
      });
      
      if (response.data.success) {
        setNotifications(prev => prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    if (!userInfo) return;
    try {
      const response = await barongAPI.put('/public/community/notifications', {
        userId: userInfo.id,
        markAllAsRead: true,
      });
      
      if (response.data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const deleteNotification = async (notificationId: number) => {
    if (!userInfo) return;
    try {
      const response = await barongAPI.delete(`/public/community/notifications?notificationId=${notificationId}&userId=${userInfo.id}`);
      
      if (response.data.success) {
        const notification = notifications.find(n => n.id === notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        if (notification && !notification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="w-5 h-5 text-red-400" />;
      case 'comment':
        return <MessageSquare className="w-5 h-5 text-blue-400" />;
      case 'follow':
        return <UserPlus className="w-5 h-5 text-green-400" />;
      case 'mention':
        return <AtSign className="w-5 h-5 text-purple-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
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

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

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

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10 w-full h-full">
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* 标题和操作 */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {t('notifications_page.title', '通知')}
              </h1>
              <p className="text-white/60">
                {unreadCount > 0 ? `${unreadCount} 条未读通知` : '所有通知已读'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                全部标为已读
              </button>
            )}
          </div>

          {/* 过滤器 */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              全部 ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'unread'
                  ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              未读 ({unreadCount})
            </button>
          </div>

          {/* 通知列表 */}
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
              <Bell className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {filter === 'unread' ? '没有未读通知' : '暂无通知'}
              </h3>
              <p className="text-white/60">
                {filter === 'unread' ? '所有通知都已读完' : '当有新动态时，我们会通知你'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border transition-all ${
                    notification.isRead
                      ? 'bg-white/5 border-white/10'
                      : 'bg-white/10 border-purple-500/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* 图标 */}
                    <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* 内容 */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={notification.link || '#'}
                        onClick={() => !notification.isRead && markAsRead(notification.id)}
                        className="block hover:opacity-80 transition-opacity"
                      >
                        <h3 className="text-white font-medium mb-1">
                          {notification.title}
                        </h3>
                        {notification.content && (
                          <p className="text-white/70 text-sm mb-2">
                            {notification.content}
                          </p>
                        )}
                        <div className="flex items-center gap-3 text-sm text-white/50">
                          {notification.actorName && (
                            <span>{notification.actorName}</span>
                          )}
                          <span>{formatDate(notification.createdAt)}</span>
                        </div>
                      </Link>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center gap-2">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                          title="标为已读"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
      <EnhancedFooter />
    </div>
  );
}
