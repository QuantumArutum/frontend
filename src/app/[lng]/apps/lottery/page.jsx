'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import LotteryApp from '@/app/components/LotteryApp';

const LotteryPage = () => {
  return (
    <AuthProvider>
      <LotteryApp />
    </AuthProvider>
  );
};

export default LotteryPage;
