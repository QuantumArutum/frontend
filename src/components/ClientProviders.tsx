'use client';

import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import LaunchStatusWrapper from './LaunchStatusWrapper';

interface ClientProvidersProps {
  children: React.ReactNode;
}

/**
 * Client-side providers wrapper that includes:
 * - AuthProvider for authentication context
 * - LaunchStatusWrapper for maintenance/pre-launch mode (Requirements 15.5, 15.6, 15.7)
 */
const ClientProviders: React.FC<ClientProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <LaunchStatusWrapper>
        <div className="relative z-10">{children}</div>
      </LaunchStatusWrapper>
    </AuthProvider>
  );
};

export default ClientProviders;
