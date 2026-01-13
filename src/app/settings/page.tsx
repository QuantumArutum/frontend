'use client';

import React, { useState } from 'react';
import { Settings, Bell, Shield, Globe, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import ParticlesBackground from '../components/ParticlesBackground';
import EnhancedNavbar from '../components/EnhancedNavbar';
import EnhancedFooter from '../components/EnhancedFooter';

const SettingsPage = () => {
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
          <h1 className="text-4xl font-bold text-white">设置</h1>
        </div>

        <div className="space-y-6">
          {/* 外观设置 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />} 外观设置
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">深色模式</p>
                  <p className="text-gray-400 text-sm">使用深色主题</p>
                </div>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-purple-600' : 'bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* 通知设置 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5" /> 通知设置
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">推送通知</p>
                  <p className="text-gray-400 text-sm">接收交易和系统通知</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-purple-600' : 'bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">声音提醒</p>
                  <p className="text-gray-400 text-sm">播放通知声音</p>
                </div>
                <button
                  onClick={() => setSound(!sound)}
                  className={`w-12 h-6 rounded-full transition-colors ${sound ? 'bg-purple-600' : 'bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${sound ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* 语言设置 */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5" /> 语言设置
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">界面语言</p>
                  <p className="text-gray-400 text-sm">选择您偏好的语言</p>
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
              <Shield className="w-5 h-5" /> 安全设置
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">双因素认证</p>
                  <p className="text-gray-400 text-sm">增强账户安全性</p>
                </div>
                <span className="text-green-400">已启用</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">量子加密</p>
                  <p className="text-gray-400 text-sm">使用后量子密码学保护</p>
                </div>
                <span className="text-green-400">已启用</span>
              </div>
              <button className="w-full mt-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-6 py-3 rounded-lg transition-colors">
                修改密码
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
