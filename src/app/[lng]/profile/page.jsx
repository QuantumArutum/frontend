'use client';

import React from 'react';
import { AuthProvider } from '../../../contexts/AuthContext';
import ProfilePage from '../../../components/ProfilePage';

const ProfilePageWrapper = () => {
  return (
    <AuthProvider>
      <ProfilePage />
    </AuthProvider>
  );
};

export default ProfilePageWrapper;

