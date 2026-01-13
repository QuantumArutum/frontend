'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Bell, Heart, MessageSquare, UserPlus, AtSign, Check, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../../i18n';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import { notificationsService, Notification } from '../../../services/communityService';

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
      const data = await notificationsService.getNotifications(userId);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationIds: string[]) => {
    if (!userInfo) return;
    try {
      const result = await notificationsService.markAsRead(userInfo.id, notificationIds);
      if (result.success) {
        setNotifications(prev => prev.map(n => notificationIds.includes(n.id) ? { ...n, isRead: true } : n));
        setUnreadCount(prev => Math.max(0, prev - notificationIds.filter(id => !notifications.find(n => n.id === id)?.isRead).length));
      }
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const markAllAsRead = async () => {
    if (!userInfo) return;
    try {
      const result = await notificationsService.markAllAsRead(userInfo.id);
      if (result.success) {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        setUnreadCount(0);
      }
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!userInfo) return;
    try {
      const notification = notifications.find(n => n.id === notificationId);
      const result = await notificationsService.deleteNotification(userInfo.id, notificationId);
      if (result.success) {
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
      case 'like': return Heart;
      case 'comment': return MessageSquare;
      case 'reply': return MessageSquare;
      case 'follow': return UserPlus;
      case 'mention': return AtSign;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like': return 'text-red-400 bg-red-500/20';
      case 'comment': return 'text-blue-400 bg-blue-500/20';
      case 'reply': return 'text-green-400 bg-green-500/20';
      case 'follow': return 'text-purple-400 bg-purple-500/20';
      case 'mention': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('notifications_page.time.just_now');
    if (minutes < 60) return t('notifications_page.time.minutes_ago', { count: minutes });
    if (hours < 24) return t('notifications_page.time.hours_ago', { count: hours });
    if (days < 7) return t('notifications_page.time.days_ago', { count: days });
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.isRead;
    return n.type === filter;
  });

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{t('notifications_page.title')}</h1>
              {unreadCount > 0 && <p className="text-sm text-gray-400">{t('notifications_page.unread_count', { count: unreadCount })}</p>}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
                {t('notifications_page.mark_all_read')}
              </button>
            )}
          </div>
        </div>

        <main className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'all', label: t('notifications_page.filters.all') },
              { id: 'unread', label: t('notifications_page.filters.unread') },
              { id: 'like', label: t('notifications_page.filters.like') },
              { id: 'comment', label: t('notifications_page.filters.comment') },
              { id: 'follow', label: t('notifications_page.filters.follow') },
              { id: 'system', label: t('notifications_page.filters.system') }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                  filter === item.id
                    ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-white mt-4">{t('notifications_page.loading')}</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-12 text-center">
              <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">{t('notifications_page.no_notifications')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification, index) => {
                const Icon = getNotificationIcon(notification.type);
                const colorClass = getNotificationColor(notification.type);

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 hover:border-white/40 transition-all ${
                      !notification.isRead ? 'border-l-4 border-l-purple-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{notification.title}</p>
                        {notification.content && <p className="text-gray-400 text-sm mt-1">{notification.content}</p>}
                        <p className="text-gray-500 text-xs mt-2">{formatTime(notification.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <button
                            onClick={() => markAsRead([notification.id])}
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      </div>
      <EnhancedFooter />
    </div>
  );
}
