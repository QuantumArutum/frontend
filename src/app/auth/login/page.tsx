'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Shield,
  Zap,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { colors, typography, shadows } from '@/styles/design-tokens';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

interface Particle {
  id: number;
}

const LoginPage = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  useEffect(() => {
    const generatedParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      animateX: Math.random() * 1200,
      animateY: Math.random() * 800,
      duration: Math.random() * 15 + 10
    }));
    setParticles(generatedParticles);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          remember_me: formData.rememberMe
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(t('auth.login.login_success'));
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user_info', JSON.stringify(data.user));
        setTimeout(() => {
          window.location.href = '/community';
        }, 1500);
      } else {
        setError(data.message || t('auth.login.login_failed'));
      }
    } catch {
      setError(t('auth.login.network_error'));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (fieldName: string) => ({
    background: colors.glass.light,
    border: `1px solid ${focusedField === fieldName ? colors.secondary : colors.glass.border}`,
    color: colors.text.primary,
    boxShadow: focusedField === fieldName ? shadows.glow.secondary : 'none',
    transition: 'all 0.3s ease'
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="w-full max-w-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl p-8"
          style={{ 
            background: colors.glass.light,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${colors.glass.border}`
          }}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ 
                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent.cyan} 100%)`,
                boxShadow: shadows.glow.secondary
              }}
            >
              <Zap className="w-8 h-8" style={{ color: colors.text.primary }} />
            </motion.div>
            <h1 
              className="text-2xl font-bold mb-2"
              style={{ color: colors.text.primary, fontFamily: typography.fontFamily.heading }}
            >
              {t('auth.login.title')}
            </h1>
            <p style={{ color: colors.text.muted }}>{t('auth.login.subtitle')}</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 p-3 rounded-xl flex items-center"
              style={{ 
                background: `${colors.status.error}15`,
                border: `1px solid ${colors.status.error}40`
              }}
            >
              <AlertCircle className="w-5 h-5 mr-2" style={{ color: colors.status.error }} />
              <span style={{ color: colors.status.error, fontSize: typography.fontSize.sm }}>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 p-3 rounded-xl flex items-center"
              style={{ 
                background: `${colors.status.success}15`,
                border: `1px solid ${colors.status.success}40`
              }}
            >
              <CheckCircle className="w-5 h-5 mr-2" style={{ color: colors.status.success }} />
              <span style={{ color: colors.status.success, fontSize: typography.fontSize.sm }}>{success}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.secondary }}
              >
                {t('auth.login.email_label')}
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: focusedField === 'email' ? colors.secondary : colors.text.muted }}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl outline-none"
                  style={inputStyle('email')}
                  placeholder={t('auth.login.email_placeholder')}
                  required
                />
              </div>
            </div>

            <div>
              <label 
                className="block text-sm font-medium mb-2"
                style={{ color: colors.text.secondary }}
              >
                {t('auth.login.password_label')}
              </label>
              <div className="relative">
                <Lock 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{ color: focusedField === 'password' ? colors.secondary : colors.text.muted }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl outline-none"
                  style={inputStyle('password')}
                  placeholder={t('auth.login.password_placeholder')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                  style={{ color: colors.text.muted }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: colors.secondary }}
                />
                <span className="ml-2 text-sm" style={{ color: colors.text.secondary }}>{t('auth.login.remember_me')}</span>
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sm transition-colors hover:opacity-80"
                style={{ color: colors.secondary }}
              >
                {t('auth.login.forgot_password')}
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent.cyan} 100%)`,
                color: colors.text.primary,
                boxShadow: shadows.glow.secondary
              }}
            >
              {loading ? (
                <div 
                  className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                  style={{ borderColor: `${colors.text.primary} transparent ${colors.text.primary} ${colors.text.primary}` }}
                />
              ) : (
                <>
                  {t('auth.login.login_button')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </motion.button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 h-px" style={{ background: colors.glass.border }}></div>
            <span className="px-4 text-sm" style={{ color: colors.text.muted }}>{t('auth.login.or')}</span>
            <div className="flex-1 h-px" style={{ background: colors.glass.border }}></div>
          </div>

          <motion.a
            href="/api/auth/google"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-3 transition-all"
            style={{ 
              background: colors.text.primary,
              color: colors.background.primary
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {t('auth.login.google_signin')}
          </motion.a>

          <div className="mt-6 text-center">
            <span style={{ color: colors.text.muted }}>{t('auth.login.no_account')}</span>
            <Link
              href="/auth/register"
              className="ml-1 font-medium transition-colors hover:opacity-80"
              style={{ color: colors.secondary }}
            >
              {t('auth.login.register_now')}
            </Link>
          </div>

          <div 
            className="mt-6 p-3 rounded-xl flex items-center"
            style={{ 
              background: `${colors.accent.cyan}10`,
              border: `1px solid ${colors.accent.cyan}30`
            }}
          >
            <Shield className="w-5 h-5 mr-2" style={{ color: colors.accent.cyan }} />
            <span style={{ color: colors.accent.cyan, fontSize: typography.fontSize.sm }}>
              {t('auth.login.security_note')}
            </span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
          <span style={{ color: colors.text.muted, fontSize: typography.fontSize.sm }}>
            {t('auth.login.brand_tagline')}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
