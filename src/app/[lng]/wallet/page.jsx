'use client';

import React from 'react';
import { AuthProvider } from '../../../contexts/AuthContext';
import WalletApp from '../../components/WalletApp';

const WalletPage = () => {
  return (
    <AuthProvider>
      <WalletApp />
    </AuthProvider>
  );
};

export default WalletPage;
