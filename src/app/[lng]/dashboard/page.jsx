'use client';

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import UserDashboard from '@/app/components/UserDashboard';

const DashboardPage = () => {
  return (
    <AuthProvider>
      <UserDashboard />
    </AuthProvider>
  );
};

export default DashboardPage;

