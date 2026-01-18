'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import DeFiApp from '@/app/components/DeFiApp';

export default function DeFiPage() {
  return (
    <AuthProvider>
      <DeFiApp />
    </AuthProvider>
  );
}
