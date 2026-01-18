'use client';

import React, { useState } from 'react';
import { Settings, Bell, Shield, Globe, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import ParticlesBackground from '../components/ParticlesBackground';
import EnhancedNavbar from '../components/EnhancedNavbar';
import EnhancedFooter from '../components/EnhancedFooter';
import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [language, setLanguage] = useState('zh');

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <EnhancedNavbar />
      <div className="relative z-10 max-w-4xl mx-auto p-8 pt-24">
        <div className="flex items-center gap-4 mb-8">
          <Settings className="w-10 h-10 text-purple-400" />
          <h1 className="text-4xl font-bold text-white">{t('settings_page.title')}</h1>
        </div>

        <div className="space-y-6">
          {/* 外观设置 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}{' '}
              {t('settings_page.appearance.title')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">
                    {t('settings_page.appearance.dark_mode')}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {t('settings_page.appearance.dark_mode_desc')}
                  </p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-purple-600' : 'bg-gray-600'}`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 通知设置 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5" /> {t('settings_page.notifications.title')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{t('settings_page.notifications.push')}</p>
                  <p className="text-gray-400 text-sm">
                    {t('settings_page.notifications.push_desc')}
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-purple-600' : 'bg-gray-600'}`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{t('settings_page.notifications.sound')}</p>
                  <p className="text-gray-400 text-sm">
                    {t('settings_page.notifications.sound_desc')}
                  </p>
                </div>
                <button
                  onClick={() => setSound(!sound)}
                  className={`w-12 h-6 rounded-full transition-colors ${sound ? 'bg-purple-600' : 'bg-gray-600'}`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${sound ? 'translate-x-6' : 'translate-x-0.5'}`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 语言设置 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5" /> {t('settings_page.language.title')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{t('settings_page.language.interface')}</p>
                  <p className="text-gray-400 text-sm">
                    {t('settings_page.language.interface_desc')}
                  </p>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                >
                  <option value="zh">中文</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                  <option value="ko">한국어</option>
                </select>
              </div>
            </div>
          </div>

          {/* 安全设置 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5" /> {t('settings_page.security.title')}
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">{t('settings_page.security.two_factor')}</p>
                  <p className="text-gray-400 text-sm">
                    {t('settings_page.security.two_factor_desc')}
                  </p>
                </div>
                <span className="text-green-400">{t('settings_page.security.enabled')}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">
                    {t('settings_page.security.quantum_encryption')}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {t('settings_page.security.quantum_encryption_desc')}
                  </p>
                </div>
                <span className="text-green-400">{t('settings_page.security.enabled')}</span>
              </div>
              <button className="w-full mt-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-6 py-3 rounded-lg transition-colors">
                {t('settings_page.security.change_password')}
              </button>
            </div>
          </div>
        </div>
      </div>
      <EnhancedFooter />
    </div>
  );
};

export default SettingsPage;
