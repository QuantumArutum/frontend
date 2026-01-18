'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import TradingApp from '@/app/components/TradingApp';

const TradingPage = () => {
  return (
    <AuthProvider>
      <TradingApp />
    </AuthProvider>
  );
};

export default TradingPage;
