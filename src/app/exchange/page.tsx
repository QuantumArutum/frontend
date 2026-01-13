'use client';

import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n';

export default function ExchangePage() {
  const { t } = useTranslation();
  
  useEffect(() => {
    // 重定向到专业交易所
    window.location.href = 'http://localhost:3001';
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-white mb-2">{t('exchange_page.redirecting')}</h2>
        <p className="text-gray-400">{t('exchange_page.manual_redirect')}<a href="http://localhost:3001" className="text-cyan-500 hover:text-cyan-400">{t('exchange_page.click_here')}</a></p>
      </div>
    </div>
  );
}

