'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Users, Search, Bell, MessageSquare, Settings, Plus, LogOut, Menu, X, Globe, ChevronDown, Check } from 'lucide-react';

interface UserInfo {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

// 12 Languages Configuration
const languages = [
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
];

const categories = [
  { name: '首页', href: '/community', key: 'home' },
  { name: '综合讨论', href: '/community/forum/general', key: 'general' },
  { name: '技术交流', href: '/community/forum/technical', key: 'technical' },
  { name: 'DeFi讨论', href: '/community/forum/defi', key: 'defi' },
  { name: '治理提案', href: '/community/governance', key: 'governance' },
  { name: '活动中心', href: '/community/events', key: 'events' },
];

export default function CommunityNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('zh');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Click outside to close language menu
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Load saved language
    const savedLang = localStorage.getItem('quantaureum-language');
    if (savedLang && languages.find(l => l.code === savedLang)) {
      setCurrentLang(savedLang);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userInfoStr = localStorage.getItem('user_info');
    if (token && userInfoStr) {
      try {
        const user = JSON.parse(userInfoStr);
        setUserInfo(user);
        setIsLoggedIn(true);
      } catch (error) {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    setIsLoggedIn(false);
    setUserInfo(null);
    window.location.reload();
  };

  const handleLangSelect = (langCode: string) => {
    setCurrentLang(langCode);
    localStorage.setItem('quantaureum-language', langCode);
    setIsLangMenuOpen(false);
    
    // Simulate/Trigger translation effect
    console.log(`Language switched to: ${langCode}`);
    
    // Optional: Dispatch event for other components if needed
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: langCode }));
  };

  const isActive = (href: string, key: string) => {
    if (key === 'home' && pathname === '/community') return true;
    if (key === 'governance' && pathname?.includes('/governance')) return true;
    if (key === 'events' && pathname?.includes('/events')) return true;
    if (pathname?.includes(`/forum/${key}`)) return true;
    return false;
  };

  return (
    <div className="sticky top-0 z-50 w-full">
      {/* 分类导航 - 放在最上面 */}
      <nav
        className="relative border-b border-white/10 w-full"
        style={{
          background: 'rgba(15, 23, 42, 0.8)', // slate-900 with opacity
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop View */}
          <div className="hidden md:flex items-center justify-between py-2">
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {categories.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                    isActive(item.href, item.key)
                      ? 'bg-gradient-to-r from-[#6E3CBC]/30 to-[#00D4FF]/30 text-white border border-[#00D4FF]/30 shadow-lg shadow-[#00D4FF]/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span className="text-sm font-medium font-sans">{item.name}</span>
                </a>
              ))}
            </div>

            {/* Language Switcher */}
            <div className="relative ml-4 z-[100]" ref={langMenuRef}>
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className={`px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2 ${isLangMenuOpen ? 'bg-white/10 text-white' : ''}`}
                title="Switch Language"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium uppercase">{currentLang}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#0F172A]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                  <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLangSelect(lang.code)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                          currentLang === lang.code 
                            ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-white border-l-2 border-cyan-500' 
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                        {currentLang === lang.code && <Check className="w-3 h-3 text-cyan-400" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between py-3">
              <span className="text-white font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                {categories.find(c => isActive(c.href, c.key))?.name || '导航菜单'}
              </span>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
              <div className="pb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
                {categories.map((item) => (
                  <a
                    key={item.key}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive(item.href, item.key)
                        ? 'bg-gradient-to-r from-[#6E3CBC]/20 to-[#00D4FF]/20 text-white border border-[#00D4FF]/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="font-medium">{item.name}</span>
                    {isActive(item.href, item.key) && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 主导航头部 - 放在分类导航下面 */}
      <header
        className="relative w-full"
        style={{
          background: 'rgba(15, 23, 42, 0.6)', // slate-900 with opacity
          backdropFilter: 'blur(15px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            {/* Left - Title */}
            <a href="/community" className="flex items-center gap-4 hover:opacity-80 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105" style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)'
              }}>
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">Community</h1>
                <p className="text-sm text-gray-300">125,847 members online</p>
              </div>
            </a>

            {/* Center - Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/community/search?q=${encodeURIComponent(searchQuery)}`);
                  }
                }}
                className="relative w-full group"
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-white" />
                <input
                  type="text"
                  placeholder="搜索讨论..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:border-purple-500 focus:shadow-lg focus:shadow-purple-500/25 transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)'
                  }}
                />
              </form>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-3">
              <a
                href="/community/notifications"
                className="relative p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/15 transition-all duration-300 hover:shadow-md hover:shadow-white/10"
                title="通知"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center shadow-lg">
                  3
                </span>
              </a>
              <a
                href="/community/messages"
                className="relative p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/15 transition-all duration-300 hover:shadow-md hover:shadow-white/10"
                title="私信"
              >
                <MessageSquare className="w-5 h-5" />
              </a>
              <button className="p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/15 transition-all duration-300 hover:shadow-md hover:shadow-white/10">
                <Settings className="w-5 h-5" />
              </button>

              {isLoggedIn && userInfo ? (
                <div className="flex items-center gap-3">
                  <a
                    href={`/community/user/${encodeURIComponent(userInfo.name)}`}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/15 transition-all duration-300 hover:shadow-md hover:shadow-white/10"
                  >
                    {userInfo.avatar ? (
                      <Image src={userInfo.avatar} alt={userInfo.name} width={36} height={36} className="w-9 h-9 rounded-full border-2 border-purple-500 shadow-lg" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                        {userInfo.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="text-sm text-white font-medium hidden md:inline">{userInfo.name}</span>
                  </a>
                  <button onClick={handleLogout} className="p-2.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/15 transition-all duration-300 hover:shadow-md hover:shadow-red-500/25" title="登出">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <a
                  href={`/auth/login?redirect=${encodeURIComponent(pathname || '/community')}`}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-blue-500/25"
                >
                  登录
                </a>
              )}

              <a
                href={isLoggedIn ? '/community/create-post' : `/auth/login?redirect=/community/create-post`}
                className="px-6 py-2.5 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/40"
                style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
                  boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)'
                }}
              >
                <Plus className="w-4 h-4 inline mr-2" />
                新建帖子
              </a>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
