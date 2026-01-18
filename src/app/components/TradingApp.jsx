'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n';

const TradingApp = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-8">
          {t('trading.title')}
        </h1>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
          <p className="text-gray-300">{t('trading.coming_soon')}</p>
        </div>
      </div>
    </div>
  );
};

export default TradingApp;
