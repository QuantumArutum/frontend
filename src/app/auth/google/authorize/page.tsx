'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import '../../../../i18n';

export default function GoogleAuthorizePage() {
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    // Handle Google OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('Google OAuth error:', error);
      router.push('/auth/login?error=google_auth_failed');
      return;
    }

    if (code) {
      // Send authorization code to backend for processing
      fetch('/api/auth/google/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            localStorage.setItem('auth_token', data.data.token);
            localStorage.setItem('user_info', JSON.stringify(data.data.user));
            router.push(data.data.redirect_url || '/dashboard');
          } else {
            router.push('/auth/login?error=google_auth_failed');
          }
        })
        .catch(() => {
          router.push('/auth/login?error=google_auth_failed');
        });
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">{t('auth.google.processing')}</p>
      </div>
    </div>
  );
}
