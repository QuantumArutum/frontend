'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Eye, EyeOff, Mail, Lock, User, Shield, Zap, CheckCircle, AlertCircle, ArrowRight, Sparkles
} from 'lucide-react';
import { colors, typography, shadows } from '@/styles/design-tokens';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

const RegisterPage = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '', verificationCode: '', password: '', confirmPassword: '',
    agreeTerms: false, agreePrivacy: false, agreeMarketing: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // 倒计时效果
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // 发送验证码
  const sendVerificationCode = async () => {
    if (!formData.email.trim()) {
      setErrors({ email: t('auth.register.validation.email_required') });
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: t('auth.register.validation.email_invalid') });
      return;
    }

    setSendingCode(true);
    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, type: 'register' }),
      });
      const data = await response.json();
      if (data.success) {
        setCodeSent(true);
        setCountdown(60);
        setErrors({});
        // 开发/测试模式：自动填充验证码
        if (data.devCode) {
          setFormData(prev => ({ ...prev, verificationCode: data.devCode }));
        }
      } else {
        setErrors({ email: data.message || t('auth.register.send_code_failed') });
      }
    } catch {
      setErrors({ email: t('auth.register.network_error') });
    } finally {
      setSendingCode(false);
    }

  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.email.trim()) newErrors.email = t('auth.register.validation.email_required');
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('auth.register.validation.email_invalid');
      if (!formData.verificationCode.trim()) newErrors.verificationCode = t('auth.register.validation.code_required');
      else if (formData.verificationCode.length !== 6) newErrors.verificationCode = t('auth.register.validation.code_invalid');
    }
    if (step === 2) {
      if (!formData.password) newErrors.password = t('auth.register.validation.password_required');
      else if (formData.password.length < 8) newErrors.password = t('auth.register.validation.password_min_length');
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) newErrors.password = t('auth.register.validation.password_complexity');
      if (!formData.confirmPassword) newErrors.confirmPassword = t('auth.register.validation.confirm_password_required');
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t('auth.register.validation.password_mismatch');
    }
    if (step === 3) {
      if (!formData.agreeTerms) newErrors.agreeTerms = t('auth.register.validation.terms_required');
      if (!formData.agreePrivacy) newErrors.agreePrivacy = t('auth.register.validation.privacy_required');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => { if (validateStep(currentStep)) setCurrentStep(prev => prev + 1); };
  const handlePrevious = () => { setCurrentStep(prev => prev - 1); };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          verificationCode: formData.verificationCode,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          acceptTerms: formData.agreeTerms && formData.agreePrivacy,
          marketing_consent: formData.agreeMarketing
        }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccess(t('auth.register.register_success'));
        setTimeout(() => { window.location.href = '/auth/login'; }, 3000);
      } else { setErrors({ submit: data.message || t('auth.register.register_failed') }); }
    } catch { setErrors({ submit: t('auth.register.network_error') }); }
    finally { setLoading(false); }
  };

  const getPasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return Math.min(strength, 5);
  };

  const inputStyle = (fieldName: string, hasError?: boolean) => ({
    background: colors.glass.light,
    border: `1px solid ${hasError ? colors.status.error : focusedField === fieldName ? colors.secondary : colors.glass.border}`,
    color: colors.text.primary,
    boxShadow: focusedField === fieldName ? shadows.glow.secondary : 'none',
    transition: 'all 0.3s ease'
  });

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>{t('auth.register.step_email_verify')}</h3>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>{t('auth.register.email_label')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: focusedField === 'email' ? colors.secondary : colors.text.muted }} />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl outline-none" style={inputStyle('email', !!errors.email)} 
                  placeholder={t('auth.register.email_placeholder')} />
              </div>
              {errors.email && <p className="text-sm mt-1" style={{ color: colors.status.error }}>{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>{t('auth.register.verification_code')}</label>
              <div className="flex gap-3">
                <input type="text" name="verificationCode" value={formData.verificationCode} onChange={handleInputChange}
                  onFocus={() => setFocusedField('verificationCode')} onBlur={() => setFocusedField(null)}
                  maxLength={6} className="flex-1 px-4 py-3 rounded-xl outline-none text-center tracking-widest text-lg"
                  style={inputStyle('verificationCode', !!errors.verificationCode)} placeholder="000000" />
                <button type="button" onClick={sendVerificationCode} disabled={sendingCode || countdown > 0}
                  className="px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all disabled:opacity-50"
                  style={{ background: countdown > 0 ? colors.glass.medium : `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent.cyan} 100%)`, 
                           color: colors.text.primary, border: `1px solid ${colors.glass.border}` }}>
                  {sendingCode ? <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" /> :
                   countdown > 0 ? `${countdown}s` : codeSent ? t('auth.register.resend_code') : t('auth.register.send_code')}
                </button>
              </div>
              {errors.verificationCode && <p className="text-sm mt-1" style={{ color: colors.status.error }}>{errors.verificationCode}</p>}
              {codeSent && <p className="text-sm mt-2" style={{ color: colors.status.success }}>{t('auth.register.code_sent_hint')}</p>}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>{t('auth.register.step_password')}</h3>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>{t('auth.register.password_label')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: focusedField === 'password' ? colors.secondary : colors.text.muted }} />
                <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange}
                  onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl outline-none" style={inputStyle('password', !!errors.password)} 
                  placeholder={t('auth.register.password_placeholder')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.text.muted }}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-sm mt-1" style={{ color: colors.status.error }}>{errors.password}</p>}
              <p className="text-sm mt-1" style={{ color: colors.text.muted }}>{t('auth.register.password_hint')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>{t('auth.register.confirm_password_label')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: focusedField === 'confirmPassword' ? colors.secondary : colors.text.muted }} />
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange}
                  onFocus={() => setFocusedField('confirmPassword')} onBlur={() => setFocusedField(null)}
                  className="w-full pl-10 pr-12 py-3 rounded-xl outline-none" style={inputStyle('confirmPassword', !!errors.confirmPassword)} 
                  placeholder={t('auth.register.confirm_password_placeholder')} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.text.muted }}>
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm mt-1" style={{ color: colors.status.error }}>{errors.confirmPassword}</p>}
            </div>
            <div className="space-y-2">
              <p className="text-sm" style={{ color: colors.text.secondary }}>{t('auth.register.password_strength')}:</p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((level) => {
                  const strength = getPasswordStrength(formData.password);
                  const strengthColors = [colors.status.error, colors.status.error, colors.status.warning, colors.accent.cyan, colors.status.success];
                  return <div key={level} className="h-2 flex-1 rounded" style={{ background: strength >= level ? strengthColors[strength - 1] : colors.background.tertiary }} />;
                })}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>{t('auth.register.step_terms')}</h3>
            <div className="space-y-4">
              <label className="flex items-start cursor-pointer">
                <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleInputChange}
                  className="w-4 h-4 rounded mt-1" style={{ accentColor: colors.secondary }} />
                <span className="ml-3 text-sm" style={{ color: colors.text.secondary }}>
                  {t('auth.register.agree_terms')} <Link href="/terms" style={{ color: colors.secondary }}>{t('auth.register.terms_of_service')}</Link>
                </span>
              </label>
              {errors.agreeTerms && <p className="text-sm" style={{ color: colors.status.error }}>{errors.agreeTerms}</p>}
              <label className="flex items-start cursor-pointer">
                <input type="checkbox" name="agreePrivacy" checked={formData.agreePrivacy} onChange={handleInputChange}
                  className="w-4 h-4 rounded mt-1" style={{ accentColor: colors.secondary }} />
                <span className="ml-3 text-sm" style={{ color: colors.text.secondary }}>
                  {t('auth.register.agree_privacy')} <Link href="/privacy" style={{ color: colors.secondary }}>{t('auth.register.privacy_policy')}</Link>
                </span>
              </label>
              {errors.agreePrivacy && <p className="text-sm" style={{ color: colors.status.error }}>{errors.agreePrivacy}</p>}
              <label className="flex items-start cursor-pointer">
                <input type="checkbox" name="agreeMarketing" checked={formData.agreeMarketing} onChange={handleInputChange}
                  className="w-4 h-4 rounded mt-1" style={{ accentColor: colors.secondary }} />
                <span className="ml-3 text-sm" style={{ color: colors.text.secondary }}>{t('auth.register.agree_marketing')}</span>
              </label>
            </div>
            <div className="p-4 rounded-xl flex items-center" style={{ background: `${colors.status.success}10`, border: `1px solid ${colors.status.success}30` }}>
              <Shield className="w-5 h-5 mr-2" style={{ color: colors.status.success }} />
              <span className="text-sm" style={{ color: colors.status.success }}>{t('auth.register.security_guarantee')}</span>
            </div>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="w-full max-w-lg relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="rounded-3xl p-8" style={{ background: colors.glass.light, backdropFilter: 'blur(20px)', border: `1px solid ${colors.glass.border}` }}>
          <div className="text-center mb-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent.cyan} 100%)`, boxShadow: shadows.glow.secondary }}>
              <Zap className="w-8 h-8" style={{ color: colors.text.primary }} />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text.primary, fontFamily: typography.fontFamily.heading }}>{t('auth.register.title')}</h1>
            <p style={{ color: colors.text.muted }}>{t('auth.register.subtitle')}</p>
          </div>

          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{ background: step <= currentStep ? colors.secondary : colors.background.tertiary, color: colors.text.primary }}>
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 3 && <div className="w-12 md:w-16 h-1 mx-2 rounded" style={{ background: step < currentStep ? colors.secondary : colors.background.tertiary }} />}
              </div>
            ))}
          </div>

          {errors.submit && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="mb-4 p-3 rounded-xl flex items-center" style={{ background: `${colors.status.error}15`, border: `1px solid ${colors.status.error}40` }}>
              <AlertCircle className="w-5 h-5 mr-2" style={{ color: colors.status.error }} />
              <span style={{ color: colors.status.error, fontSize: typography.fontSize.sm }}>{errors.submit}</span>
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="mb-4 p-3 rounded-xl flex items-center" style={{ background: `${colors.status.success}15`, border: `1px solid ${colors.status.success}40` }}>
              <CheckCircle className="w-5 h-5 mr-2" style={{ color: colors.status.success }} />
              <span style={{ color: colors.status.success, fontSize: typography.fontSize.sm }}>{success}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit}>
            {renderStep()}
            <div className="flex justify-between mt-8">
              {currentStep > 1 && (
                <button type="button" onClick={handlePrevious} className="px-6 py-3 rounded-xl font-medium transition-all"
                  style={{ background: colors.glass.medium, border: `1px solid ${colors.glass.border}`, color: colors.text.primary }}>{t('auth.register.previous')}</button>
              )}
              <div className="ml-auto">
                {currentStep < 3 ? (
                  <motion.button type="button" onClick={handleNext} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 rounded-xl font-semibold flex items-center transition-all"
                    style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent.cyan} 100%)`, color: colors.text.primary, boxShadow: shadows.glow.secondary }}>
                    {t('auth.register.next')}<ArrowRight className="w-5 h-5 ml-2" />
                  </motion.button>
                ) : (
                  <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 rounded-xl font-semibold flex items-center transition-all disabled:opacity-50"
                    style={{ background: `linear-gradient(135deg, ${colors.secondary} 0%, ${colors.accent.cyan} 100%)`, color: colors.text.primary, boxShadow: shadows.glow.secondary }}>
                    {loading ? <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${colors.text.primary} transparent` }} />
                      : <><span>{t('auth.register.create_account')}</span><CheckCircle className="w-5 h-5 ml-2" /></>}
                  </motion.button>
                )}
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <span style={{ color: colors.text.muted }}>{t('auth.register.have_account')}</span>
            <Link href="/auth/login" className="ml-1 font-medium transition-colors hover:opacity-80" style={{ color: colors.secondary }}>{t('auth.register.login_now')}</Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="mt-6 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" style={{ color: colors.primary }} />
          <span style={{ color: colors.text.muted, fontSize: typography.fontSize.sm }}>{t('auth.register.brand_tagline')}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
