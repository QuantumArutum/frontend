'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import WalletApp from '@/app/components/WalletApp';

export default function WalletPage() {
  return (
    <AuthProvider>
      <WalletApp />
    </AuthProvider>
  );
}

