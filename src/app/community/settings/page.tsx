'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  User, Shield, Bell, Eye, Palette, FileText, Save, Camera,
  Mail, Lock, Smartphone, Link2, Globe, Moon, Sun, Monitor,
  MessageSquare, Heart, UserPlus, AtSign, Clock, Users,
  Ban, ChevronRight, Check, X, Trash2, LogOut, AlertTriangle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../../i18n';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../../components/EnhancedFooter';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface UserSettings {
  // Profile
  displayName: string;
  bio: string;
  avatar: string;
  coverImage: string;
  location: string;
  website: string;
  twitter: string;
  github: string;
  linkedin: string;

  // Security
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  
  // Notifications
  emailNotifications: {
    replies: boolean;
    likes: boolean;
    follows: boolean;
    mentions: boolean;
    newsletter: boolean;
    announcements: boolean;
  };
  pushNotifications: {
    replies: boolean;
    likes: boolean;
    follows: boolean;
    mentions: boolean;
    directMessages: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  
  // Privacy
  profileVisibility: 'public' | 'members' | 'private';
  showOnlineStatus: boolean;
  showActivityStatus: boolean;
  allowDirectMessages: 'everyone' | 'followers' | 'none';
  showEmail: boolean;
  blockedUsers: string[];
  
  // Display
  theme: 'light' | 'dark' | 'system';
  language: string;
  postsPerPage: number;
  defaultSort: 'newest' | 'popular' | 'trending';
  compactMode: boolean;
  
  // Content
  signature: string;
  defaultCategory: string;
  autoSaveDrafts: boolean;
}

const defaultSettings: UserSettings = {
  displayName: '',
  bio: '',
  avatar: '',
  coverImage: '',
  location: '',
  website: '',
  twitter: '',
  github: '',
  linkedin: '',
  twoFactorEnabled: false,
  loginAlerts: true,
  emailNotifications: {
    replies: true,
    likes: true,
    follows: true,
    mentions: true,
    newsletter: false,
    announcements: true,
  },
  pushNotifications: {
    replies: true,
    likes: false,
    follows: true,
    mentions: true,
    directMessages: true,
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
  profileVisibility: 'public',
  showOnlineStatus: true,
  showActivityStatus: true,
  allowDirectMessages: 'everyone',
  showEmail: false,
  blockedUsers: [],
  theme: 'dark',
  language: 'en',
  postsPerPage: 20,
  defaultSort: 'newest',
  compactMode: false,
  signature: '',
  defaultCategory: 'general',
  autoSaveDrafts: true,
};


type SettingsTab = 'profile' | 'security' | 'notifications' | 'privacy' | 'display' | 'content';

export default function CommunitySettingsPage() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [blockUsername, setBlockUsername] = useState('');
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  // API base URL
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://api.quantaureum.com';

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userInfoStr = localStorage.getItem('user_info');

    if (!token || !userInfoStr) {
      router.push('/auth/login?redirect=/community/settings');
      return;
    }

    try {
      const user = JSON.parse(userInfoStr);
      setUserInfo(user);
      loadSettings(user.id);
    } catch {
      router.push('/auth/login?redirect=/community/settings');
    }
  }, [router]);

  const loadSettings = async (userId: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      
      // Try to load from API first
      try {
        const response = await fetch(`${API_BASE}/api/v2/barong/resource/users/settings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            const apiSettings = data.data;
            setSettings({
              ...defaultSettings,
              displayName: apiSettings.display_name || '',
              bio: apiSettings.bio || '',
              avatar: apiSettings.avatar || '',
              coverImage: apiSettings.cover_image || '',
              location: apiSettings.location || '',
              website: apiSettings.website || '',
              twitter: apiSettings.twitter || '',
              github: apiSettings.github || '',
              linkedin: apiSettings.linkedin || '',
              twoFactorEnabled: apiSettings.two_factor_enabled || false,
              loginAlerts: apiSettings.login_alerts !== false,
              emailNotifications: apiSettings.email_notifications || defaultSettings.emailNotifications,
              pushNotifications: apiSettings.push_notifications || defaultSettings.pushNotifications,
              quietHours: apiSettings.quiet_hours || defaultSettings.quietHours,
              profileVisibility: apiSettings.profile_visibility || 'public',
              showOnlineStatus: apiSettings.show_online_status !== false,
              showActivityStatus: apiSettings.show_activity_status !== false,
              allowDirectMessages: apiSettings.allow_direct_messages || 'everyone',
              showEmail: apiSettings.show_email || false,
              blockedUsers: apiSettings.blocked_users || [],
              theme: apiSettings.theme || 'dark',
              language: apiSettings.language || 'en',
              postsPerPage: apiSettings.posts_per_page || 20,
              defaultSort: apiSettings.default_sort || 'newest',
              compactMode: apiSettings.compact_mode || false,
              signature: apiSettings.signature || '',
              defaultCategory: apiSettings.default_category || 'general',
              autoSaveDrafts: apiSettings.auto_save_drafts !== false
            });
            setLoading(false);
            return;
          }
        }
      } catch (apiErr) {
        console.log('API not available, using localStorage');
      }
      
      // Fallback to localStorage
      const savedSettings = localStorage.getItem(`community_settings_${userId}`);
      if (savedSettings) {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    if (!userInfo) return;
    setSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      
      // Try to save to API
      try {
        const response = await fetch(`${API_BASE}/api/v2/barong/resource/users/settings`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(settings)
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
          }
        }
      } catch (apiErr) {
        console.log('API not available, saving to localStorage');
      }
      
      // Also save to localStorage as backup
      localStorage.setItem(`community_settings_${userInfo.id}`, JSON.stringify(settings));
      
      // Update user info if display name changed
      if (settings.displayName && settings.displayName !== userInfo.name) {
        const updatedUser = { ...userInfo, name: settings.displayName };
        localStorage.setItem('user_info', JSON.stringify(updatedUser));
        setUserInfo(updatedUser);
      }
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };


  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, coverImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlockUser = () => {
    if (blockUsername.trim() && !settings.blockedUsers.includes(blockUsername.trim())) {
      setSettings(prev => ({
        ...prev,
        blockedUsers: [...prev.blockedUsers, blockUsername.trim()]
      }));
      setBlockUsername('');
      setShowBlockModal(false);
    }
  };

  const handleUnblockUser = (username: string) => {
    setSettings(prev => ({
      ...prev,
      blockedUsers: prev.blockedUsers.filter(u => u !== username)
    }));
  };

  const handleChangePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      alert(t('settings_page.security.password_mismatch'));
      return;
    }
    
    if (passwordData.new.length < 8) {
      alert(t('settings_page.security.password_too_short', 'Password must be at least 8 characters'));
      return;
    }
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE}/api/v2/barong/resource/users/password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          current_password: passwordData.current,
          new_password: passwordData.new
        })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        alert(t('settings_page.security.password_changed'));
        setPasswordData({ current: '', new: '', confirm: '' });
        setShowPasswordChange(false);
      } else {
        alert(data.message || t('settings_page.security.password_change_failed', 'Failed to change password'));
      }
    } catch (err) {
      console.error('Password change error:', err);
      alert(t('settings_page.security.password_change_failed', 'Failed to change password'));
    }
  };

  const handleDeleteAccount = async () => {
    const password = prompt(t('settings_page.delete_modal.enter_password', 'Enter your password to confirm:'));
    
    if (!password) {
      return;
    }
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE}/api/v2/barong/resource/users/account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.clear();
        router.push('/');
      } else {
        alert(data.message || t('settings_page.delete_modal.delete_failed', 'Failed to delete account'));
      }
    } catch (err) {
      console.error('Delete account error:', err);
      // Fallback: clear local storage anyway
      localStorage.clear();
      router.push('/');
    }
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: t('settings_page.tabs.profile', 'Profile'), icon: User },
    { id: 'security', label: t('settings_page.tabs.security', 'Security'), icon: Shield },
    { id: 'notifications', label: t('settings_page.tabs.notifications', 'Notifications'), icon: Bell },
    { id: 'privacy', label: t('settings_page.tabs.privacy', 'Privacy'), icon: Eye },
    { id: 'display', label: t('settings_page.tabs.display', 'Display'), icon: Palette },
    { id: 'content', label: t('settings_page.tabs.content', 'Content'), icon: FileText },
  ];


  const renderProfileSettings = () => (
    <div className="space-y-6">
      {/* Avatar & Cover */}
      <div className="relative">
        <div 
          className="h-32 rounded-xl bg-gradient-to-r from-purple-500/30 to-cyan-500/30 relative overflow-hidden cursor-pointer group"
          onClick={() => coverInputRef.current?.click()}
        >
          {settings.coverImage && (
            <Image 
              src={settings.coverImage} 
              alt="Cover" 
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          )}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-8 h-8 text-white" />
          </div>
        </div>
        <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
        
        <div className="absolute -bottom-10 left-6">
          <div 
            className="w-24 h-24 rounded-full border-4 border-gray-900 bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center cursor-pointer group relative overflow-hidden"
            onClick={() => fileInputRef.current?.click()}
          >
            {settings.avatar || userInfo?.avatar ? (
              <Image 
                src={settings.avatar || userInfo?.avatar || ''} 
                alt="Avatar" 
                fill
                className="object-cover rounded-full"
                sizes="96px"
              />
            ) : (
              <span className="text-3xl font-bold text-white">{userInfo?.name?.[0]?.toUpperCase() || 'U'}</span>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </div>
      </div>

      <div className="pt-12 space-y-4">
        {/* Display Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('settings_page.profile.display_name', 'Display Name')}</label>
          <input
            type="text"
            value={settings.displayName || userInfo?.name || ''}
            onChange={(e) => setSettings(prev => ({ ...prev, displayName: e.target.value }))}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            placeholder={t('settings_page.profile.display_name_placeholder', 'Your display name')}
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('settings_page.profile.bio', 'Bio')}</label>
          <textarea
            value={settings.bio}
            onChange={(e) => setSettings(prev => ({ ...prev, bio: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
            placeholder={t('settings_page.profile.bio_placeholder', 'Tell us about yourself...')}
          />
          <p className="text-xs text-gray-500 mt-1">{settings.bio.length}/500</p>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('settings_page.profile.location', 'Location')}</label>
          <input
            type="text"
            value={settings.location}
            onChange={(e) => setSettings(prev => ({ ...prev, location: e.target.value }))}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
            placeholder={t('settings_page.profile.location_placeholder', 'City, Country')}
          />
        </div>

        {/* Website */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">{t('settings_page.profile.website', 'Website')}</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="url"
              value={settings.website}
              onChange={(e) => setSettings(prev => ({ ...prev, website: e.target.value }))}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Twitter</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
              <input
                type="text"
                value={settings.twitter}
                onChange={(e) => setSettings(prev => ({ ...prev, twitter: e.target.value }))}
                className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="username"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">GitHub</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">@</span>
              <input
                type="text"
                value={settings.github}
                onChange={(e) => setSettings(prev => ({ ...prev, github: e.target.value }))}
                className="w-full pl-8 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="username"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn</label>
            <div className="relative">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={settings.linkedin}
                onChange={(e) => setSettings(prev => ({ ...prev, linkedin: e.target.value }))}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                placeholder="profile-url"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );


  const renderSecuritySettings = () => (
    <div className="space-y-6">
      {/* Email */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium">{t('settings_page.security.email', 'Email Address')}</p>
              <p className="text-sm text-gray-400">{userInfo?.email}</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">{t('settings_page.security.verified', 'Verified')}</span>
        </div>
      </div>

      {/* Password */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-medium">{t('settings_page.security.password', 'Password')}</p>
              <p className="text-sm text-gray-400">{t('settings_page.security.last_changed', 'Last changed 30 days ago')}</p>
            </div>
          </div>
          <button
            onClick={() => setShowPasswordChange(!showPasswordChange)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            {t('settings_page.security.change_password', 'Change')}
          </button>
        </div>
        
        {showPasswordChange && (
          <div className="space-y-3 pt-4 border-t border-white/10">
            <input
              type="password"
              value={passwordData.current}
              onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder={t('settings_page.security.current_password', 'Current password')}
            />
            <input
              type="password"
              value={passwordData.new}
              onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder={t('settings_page.security.new_password', 'New password')}
            />
            <input
              type="password"
              value={passwordData.confirm}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              placeholder={t('settings_page.security.confirm_password', 'Confirm new password')}
            />
            <button
              onClick={handleChangePassword}
              className="px-6 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              {t('settings_page.security.update_password', 'Update Password')}
            </button>
          </div>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white font-medium">{t('settings_page.security.two_factor', 'Two-Factor Authentication')}</p>
              <p className="text-sm text-gray-400">{t('settings_page.security.two_factor_desc', 'Add an extra layer of security')}</p>
            </div>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }))}
            className={`w-12 h-6 rounded-full transition-colors relative ${settings.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.twoFactorEnabled ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>

      {/* Login Alerts */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Bell className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-medium">{t('settings_page.security.login_alerts', 'Login Alerts')}</p>
              <p className="text-sm text-gray-400">{t('settings_page.security.login_alerts_desc', 'Get notified of new logins')}</p>
            </div>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, loginAlerts: !prev.loginAlerts }))}
            className={`w-12 h-6 rounded-full transition-colors relative ${settings.loginAlerts ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.loginAlerts ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-white font-medium mb-4">{t('settings_page.security.connected_accounts', 'Connected Accounts')}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </div>
              <span className="text-white">Google</span>
            </div>
            <span className="text-green-400 text-sm">{t('settings_page.security.connected', 'Connected')}</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/30">
        <h3 className="text-red-400 font-medium mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {t('settings_page.security.danger_zone', 'Danger Zone')}
        </h3>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
        >
          {t('settings_page.security.delete_account', 'Delete Account')}
        </button>
      </div>
    </div>
  );


  const renderNotificationSettings = () => (
    <div className="space-y-6">
      {/* Email Notifications */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-400" />
          {t('settings_page.notifications.email_notifications', 'Email Notifications')}
        </h3>
        <div className="space-y-3">
          {[
            { key: 'replies', icon: MessageSquare, label: t('settings_page.notifications.replies', 'Replies to your posts') },
            { key: 'likes', icon: Heart, label: t('settings_page.notifications.likes', 'Likes on your posts') },
            { key: 'follows', icon: UserPlus, label: t('settings_page.notifications.follows', 'New followers') },
            { key: 'mentions', icon: AtSign, label: t('settings_page.notifications.mentions', 'Mentions') },
            { key: 'newsletter', icon: Mail, label: t('settings_page.notifications.newsletter', 'Newsletter') },
            { key: 'announcements', icon: Bell, label: t('settings_page.notifications.announcements', 'Platform announcements') },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{item.label}</span>
              </div>
              <button
                onClick={() => setSettings(prev => ({
                  ...prev,
                  emailNotifications: {
                    ...prev.emailNotifications,
                    [item.key]: !prev.emailNotifications[item.key as keyof typeof prev.emailNotifications]
                  }
                }))}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  settings.emailNotifications[item.key as keyof typeof settings.emailNotifications] ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.emailNotifications[item.key as keyof typeof settings.emailNotifications] ? 'left-5' : 'left-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Push Notifications */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-purple-400" />
          {t('settings_page.notifications.push_notifications', 'Push Notifications')}
        </h3>
        <div className="space-y-3">
          {[
            { key: 'replies', icon: MessageSquare, label: t('settings_page.notifications.replies', 'Replies to your posts') },
            { key: 'likes', icon: Heart, label: t('settings_page.notifications.likes', 'Likes on your posts') },
            { key: 'follows', icon: UserPlus, label: t('settings_page.notifications.follows', 'New followers') },
            { key: 'mentions', icon: AtSign, label: t('settings_page.notifications.mentions', 'Mentions') },
            { key: 'directMessages', icon: MessageSquare, label: t('settings_page.notifications.direct_messages', 'Direct messages') },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{item.label}</span>
              </div>
              <button
                onClick={() => setSettings(prev => ({
                  ...prev,
                  pushNotifications: {
                    ...prev.pushNotifications,
                    [item.key]: !prev.pushNotifications[item.key as keyof typeof prev.pushNotifications]
                  }
                }))}
                className={`w-10 h-5 rounded-full transition-colors relative ${
                  settings.pushNotifications[item.key as keyof typeof settings.pushNotifications] ? 'bg-green-500' : 'bg-gray-600'
                }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                  settings.pushNotifications[item.key as keyof typeof settings.pushNotifications] ? 'left-5' : 'left-0.5'
                }`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quiet Hours */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-cyan-400" />
            <div>
              <p className="text-white font-medium">{t('settings_page.notifications.quiet_hours', 'Quiet Hours')}</p>
              <p className="text-sm text-gray-400">{t('settings_page.notifications.quiet_hours_desc', 'Pause notifications during specific hours')}</p>
            </div>
          </div>
          <button
            onClick={() => setSettings(prev => ({
              ...prev,
              quietHours: { ...prev.quietHours, enabled: !prev.quietHours.enabled }
            }))}
            className={`w-12 h-6 rounded-full transition-colors relative ${settings.quietHours.enabled ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.quietHours.enabled ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
        
        {settings.quietHours.enabled && (
          <div className="flex items-center gap-4 pt-4 border-t border-white/10">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">{t('settings_page.notifications.start_time', 'Start')}</label>
              <input
                type="time"
                value={settings.quietHours.start}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  quietHours: { ...prev.quietHours, start: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">{t('settings_page.notifications.end_time', 'End')}</label>
              <input
                type="time"
                value={settings.quietHours.end}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  quietHours: { ...prev.quietHours, end: e.target.value }
                }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );


  const renderPrivacySettings = () => (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-blue-400" />
          {t('settings_page.privacy.profile_visibility', 'Profile Visibility')}
        </h3>
        <div className="space-y-2">
          {[
            { value: 'public', label: t('settings_page.privacy.public', 'Public'), desc: t('settings_page.privacy.public_desc', 'Anyone can view your profile') },
            { value: 'members', label: t('settings_page.privacy.members_only', 'Members Only'), desc: t('settings_page.privacy.members_desc', 'Only logged-in members can view') },
            { value: 'private', label: t('settings_page.privacy.private', 'Private'), desc: t('settings_page.privacy.private_desc', 'Only you can view your profile') },
          ].map(option => (
            <label
              key={option.value}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                settings.profileVisibility === option.value ? 'bg-purple-500/20 border border-purple-500/50' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div>
                <p className="text-white font-medium">{option.label}</p>
                <p className="text-sm text-gray-400">{option.desc}</p>
              </div>
              <input
                type="radio"
                name="profileVisibility"
                value={option.value}
                checked={settings.profileVisibility === option.value}
                onChange={(e) => setSettings(prev => ({ ...prev, profileVisibility: e.target.value as 'public' | 'members' | 'private' }))}
                className="w-4 h-4 accent-purple-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Online Status */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <div>
              <p className="text-white font-medium">{t('settings_page.privacy.show_online', 'Show Online Status')}</p>
              <p className="text-sm text-gray-400">{t('settings_page.privacy.show_online_desc', 'Let others see when you are online')}</p>
            </div>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, showOnlineStatus: !prev.showOnlineStatus }))}
            className={`w-12 h-6 rounded-full transition-colors relative ${settings.showOnlineStatus ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.showOnlineStatus ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">{t('settings_page.privacy.show_activity', 'Show Activity Status')}</p>
            <p className="text-sm text-gray-400">{t('settings_page.privacy.show_activity_desc', 'Show your recent activity to others')}</p>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, showActivityStatus: !prev.showActivityStatus }))}
            className={`w-12 h-6 rounded-full transition-colors relative ${settings.showActivityStatus ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.showActivityStatus ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">{t('settings_page.privacy.show_email', 'Show Email Address')}</p>
            <p className="text-sm text-gray-400">{t('settings_page.privacy.show_email_desc', 'Display email on your profile')}</p>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, showEmail: !prev.showEmail }))}
            className={`w-12 h-6 rounded-full transition-colors relative ${settings.showEmail ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.showEmail ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>

      {/* Direct Messages */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-purple-400" />
          {t('settings_page.privacy.direct_messages', 'Who can send you direct messages')}
        </h3>
        <div className="space-y-2">
          {[
            { value: 'everyone', label: t('settings_page.privacy.dm_everyone', 'Everyone') },
            { value: 'followers', label: t('settings_page.privacy.dm_followers', 'Only people you follow') },
            { value: 'none', label: t('settings_page.privacy.dm_none', 'No one') },
          ].map(option => (
            <label
              key={option.value}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                settings.allowDirectMessages === option.value ? 'bg-purple-500/20 border border-purple-500/50' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <span className="text-white">{option.label}</span>
              <input
                type="radio"
                name="allowDirectMessages"
                value={option.value}
                checked={settings.allowDirectMessages === option.value}
                onChange={(e) => setSettings(prev => ({ ...prev, allowDirectMessages: e.target.value as 'everyone' | 'followers' | 'none' }))}
                className="w-4 h-4 accent-purple-500"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Blocked Users */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium flex items-center gap-2">
            <Ban className="w-5 h-5 text-red-400" />
            {t('settings_page.privacy.blocked_users', 'Blocked Users')}
          </h3>
          <button
            onClick={() => setShowBlockModal(true)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
          >
            {t('settings_page.privacy.block_user', 'Block User')}
          </button>
        </div>
        
        {settings.blockedUsers.length === 0 ? (
          <p className="text-gray-400 text-sm">{t('settings_page.privacy.no_blocked', 'No blocked users')}</p>
        ) : (
          <div className="space-y-2">
            {settings.blockedUsers.map(username => (
              <div key={username} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm">
                    {username[0].toUpperCase()}
                  </div>
                  <span className="text-white">{username}</span>
                </div>
                <button
                  onClick={() => handleUnblockUser(username)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  {t('settings_page.privacy.unblock', 'Unblock')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );


  const renderDisplaySettings = () => (
    <div className="space-y-6">
      {/* Theme */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-400" />
          {t('settings_page.display.theme', 'Theme')}
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'light', icon: Sun, label: t('settings_page.display.light', 'Light') },
            { value: 'dark', icon: Moon, label: t('settings_page.display.dark', 'Dark') },
            { value: 'system', icon: Monitor, label: t('settings_page.display.system', 'System') },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setSettings(prev => ({ ...prev, theme: option.value as 'light' | 'dark' | 'system' }))}
              className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                settings.theme === option.value
                  ? 'bg-purple-500/20 border-2 border-purple-500'
                  : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
              }`}
            >
              <option.icon className={`w-6 h-6 ${settings.theme === option.value ? 'text-purple-400' : 'text-gray-400'}`} />
              <span className={settings.theme === option.value ? 'text-white' : 'text-gray-400'}>{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Language */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-cyan-400" />
          {t('settings_page.display.language', 'Language')}
        </h3>
        <select
          value={settings.language}
          onChange={(e) => {
            setSettings(prev => ({ ...prev, language: e.target.value }));
            i18n.changeLanguage(e.target.value);
          }}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          <option value="en">English</option>
          <option value="zh">中文</option>
          <option value="ja">日本語</option>
          <option value="ko">한국어</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="pt">Português</option>
          <option value="ru">Русский</option>
          <option value="ar">العربية</option>
          <option value="vi">Tiếng Việt</option>
        </select>
      </div>

      {/* Posts Per Page */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-white font-medium mb-4">{t('settings_page.display.posts_per_page', 'Posts Per Page')}</h3>
        <div className="flex gap-2">
          {[10, 20, 30, 50].map(num => (
            <button
              key={num}
              onClick={() => setSettings(prev => ({ ...prev, postsPerPage: num }))}
              className={`px-4 py-2 rounded-lg transition-colors ${
                settings.postsPerPage === num
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      {/* Default Sort */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-white font-medium mb-4">{t('settings_page.display.default_sort', 'Default Sort Order')}</h3>
        <div className="flex gap-2">
          {[
            { value: 'newest', label: t('settings_page.display.newest', 'Newest') },
            { value: 'popular', label: t('settings_page.display.popular', 'Popular') },
            { value: 'trending', label: t('settings_page.display.trending', 'Trending') },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setSettings(prev => ({ ...prev, defaultSort: option.value as 'newest' | 'popular' | 'trending' }))}
              className={`px-4 py-2 rounded-lg transition-colors ${
                settings.defaultSort === option.value
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Compact Mode */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">{t('settings_page.display.compact_mode', 'Compact Mode')}</p>
            <p className="text-sm text-gray-400">{t('settings_page.display.compact_mode_desc', 'Show more content with less spacing')}</p>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, compactMode: !prev.compactMode }))}
            className={`w-12 h-6 rounded-full transition-colors relative ${settings.compactMode ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.compactMode ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );


  const renderContentSettings = () => (
    <div className="space-y-6">
      {/* Signature */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-purple-400" />
          {t('settings_page.content.signature', 'Signature')}
        </h3>
        <textarea
          value={settings.signature}
          onChange={(e) => setSettings(prev => ({ ...prev, signature: e.target.value }))}
          rows={3}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
          placeholder={t('settings_page.content.signature_placeholder', 'Your signature will appear at the bottom of your posts...')}
        />
        <p className="text-xs text-gray-500 mt-1">{settings.signature.length}/200</p>
      </div>

      {/* Default Category */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <h3 className="text-white font-medium mb-4">{t('settings_page.content.default_category', 'Default Post Category')}</h3>
        <select
          value={settings.defaultCategory}
          onChange={(e) => setSettings(prev => ({ ...prev, defaultCategory: e.target.value }))}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          <option value="general">{t('community_page.categories.general', 'General Discussion')}</option>
          <option value="technical">{t('community_page.categories.technical', 'Technical')}</option>
          <option value="defi">{t('community_page.categories.defi', 'DeFi')}</option>
          <option value="governance">{t('community_page.categories.governance', 'Governance')}</option>
        </select>
      </div>

      {/* Auto Save Drafts */}
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-medium">{t('settings_page.content.auto_save', 'Auto-save Drafts')}</p>
            <p className="text-sm text-gray-400">{t('settings_page.content.auto_save_desc', 'Automatically save your posts as drafts')}</p>
          </div>
          <button
            onClick={() => setSettings(prev => ({ ...prev, autoSaveDrafts: !prev.autoSaveDrafts }))}
            className={`w-12 h-6 rounded-full transition-colors relative ${settings.autoSaveDrafts ? 'bg-green-500' : 'bg-gray-600'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.autoSaveDrafts ? 'left-7' : 'left-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'privacy': return renderPrivacySettings();
      case 'display': return renderDisplaySettings();
      case 'content': return renderContentSettings();
      default: return null;
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen relative">
        <ParticlesBackground />
        <CommunityNavbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">{t('settings_page.title', 'Settings')}</h1>
            <p className="text-gray-400 mt-1">{t('settings_page.subtitle', 'Manage your account preferences')}</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-xl font-medium disabled:opacity-50 transition-all"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : saved ? (
              <Check className="w-5 h-5" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {saved ? t('settings_page.saved', 'Saved!') : t('settings_page.save', 'Save Changes')}
          </motion.button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-2 sticky top-24">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border border-purple-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  {activeTab === tab.id && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-2xl border border-white/20 p-6 max-w-md w-full mx-4"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{t('settings_page.delete_modal.title', 'Delete Account')}</h3>
                <p className="text-sm text-gray-400">{t('settings_page.delete_modal.subtitle', 'This action cannot be undone')}</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6">{t('settings_page.delete_modal.warning', 'Are you sure you want to delete your account? All your data will be permanently removed.')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                onClick={handleDeleteAccount}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
              >
                {t('settings_page.delete_modal.confirm', 'Delete Account')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Block User Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-2xl border border-white/20 p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold text-white mb-4">{t('settings_page.block_modal.title', 'Block User')}</h3>
            <input
              type="text"
              value={blockUsername}
              onChange={(e) => setBlockUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-purple-500 mb-4"
              placeholder={t('settings_page.block_modal.placeholder', 'Enter username to block')}
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowBlockModal(false); setBlockUsername(''); }}
                className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
              >
                {t('common.cancel', 'Cancel')}
              </button>
              <button
                onClick={handleBlockUser}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
              >
                {t('settings_page.block_modal.confirm', 'Block')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <EnhancedFooter />
    </div>
  );
}