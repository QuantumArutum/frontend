'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n';

export default function ExchangePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">{t('exchange_page.coming_soon', 'Exchange Coming Soon')}</h2>
        <p className="text-gray-400 mb-6">{t('exchange_page.description', 'Our professional trading platform is under development. Stay tuned for updates!')}</p>
        <a 
          href="/" 
          className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
        >
          {t('exchange_page.back_home', 'Back to Home')}
        </a>
      </div>
    </div>
  );
}

