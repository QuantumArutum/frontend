'use client';

import React from 'react';
import ParticlesBackground from '../components/ParticlesBackground';
import EnhancedNavbar from '../components/EnhancedNavbar';
import EnhancedFooter from '../components/EnhancedFooter';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <EnhancedNavbar />
      <div className="relative z-10 max-w-4xl mx-auto p-8 pt-24">
        <h1 className="text-4xl font-bold text-white mb-8">{t('profile_page.title')}</h1>

        <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-8">
          <div className="flex items-center space-x-6 mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">U</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{t('profile_page.username')}</h2>
              <p className="text-gray-300">user@example.com</p>
              <p className="text-sm text-gray-400">{t('profile_page.registered')}: 2024年1月</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {t('profile_page.basic_info')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">{t('profile_page.username')}</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    defaultValue={t('profile_page.username')}
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">{t('profile_page.email')}</label>
                  <input
                    type="email"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                    defaultValue="user@example.com"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-white mb-4">
                {t('profile_page.security_settings')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">{t('profile_page.two_factor')}</span>
                  <span className="text-green-400">{t('profile_page.enabled')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">{t('profile_page.quantum_encryption')}</span>
                  <span className="text-green-400">{t('profile_page.enabled')}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors">
              {t('profile_page.save_changes')}
            </button>
          </div>
        </div>
      </div>
      <EnhancedFooter />
    </div>
  );
};

export default ProfilePage;
