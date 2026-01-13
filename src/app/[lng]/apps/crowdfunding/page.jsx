'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import CrowdfundingApp from '@/app/components/CrowdfundingApp';

export default function CrowdfundingPage() {
  return (
    <AuthProvider>
      <CrowdfundingApp />
    </AuthProvider>
  );
}

