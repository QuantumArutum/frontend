'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Eye, EyeOff, Mail, Lock, User, Shield, Zap, CheckCircle, AlertCircle, ArrowRight, Phone, Calendar, MapPin, Sparkles
} from 'lucide-react';
import { colors, typography, shadows } from '@/styles/design-tokens';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

const RegisterPage = () => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    dateOfBirth: '', country: '', password: '', confirmPassword: '',
    securityQuestion: '', securityAnswer: '', twoFactorEnabled: false,
    agreeTerms: false, agreePrivacy: false, agreeMarketing: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const securityQuestions = [
    { key: 'q1', label: t('auth.register.security_questions.q1') },
    { key: 'q2', label: t('auth.register.security_questions.q2') },
    { key: 'q3', label: t('auth.register.security_questions.q3') },
    { key: 'q4', label: t('auth.register.security_questions.q4') }
  ];
  
  const countries = [
    { key: 'china', label: t('auth.register.countries.china') },
    { key: 'usa', label: t('auth.register.countries.usa') },
    { key: 'uk', label: t('auth.register.countries.uk') },
    { key: 'canada', label: t('auth.register.countries.canada') },
    { key: 'australia', label: t('auth.register.countries.australia') },
    { key: 'singapore', label: t('auth.register.countries.singapore') },
    { key: 'japan', label: t('auth.register.countries.japan') },
    { key: 'korea', label: t('auth.register.countries.korea') },
    { key: 'germany', label: t('auth.register.countries.germany') },
    { key: 'france', label: t('auth.register.countries.france') }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = type === 'checkbox' ? target.checked : false;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = t('auth.register.validation.first_name_required');
      if (!formData.lastName.trim()) newErrors.lastName = t('auth.register.validation.last_name_required');
      if (!formData.email.trim()) newErrors.email = t('auth.register.validation.email_required');
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('auth.register.validation.email_invalid');
      if (!formData.phone.trim()) newErrors.phone = t('auth.register.validation.phone_required');
      if (!formData.dateOfBirth) newErrors.dateOfBirth = t('auth.register.validation.dob_required');
      if (!formData.country) newErrors.country = t('auth.register.validation.country_required');
    }
    if (step === 2) {
      if (!formData.password) newErrors.password = t('auth.register.validation.password_required');
      else if (formData.password.length < 8) newErrors.password = t('auth.register.validation.password_min_length');
      else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) newErrors.password = t('auth.register.validation.password_complexity');
      if (!formData.confirmPassword) newErrors.confirmPassword = t('auth.register.validation.confirm_password_required');
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t('auth.register.validation.password_mismatch');
    }
    if (step === 3) {
      if (!formData.securityQuestion) newErrors.securityQuestion = t('auth.register.validation.security_question_required');
      if (!formData.securityAnswer.trim()) newErrors.securityAnswer = t('auth.register.validation.security_answer_required');
    }
    if (step === 4) {
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
    if (!validateStep(4)) return;
    setLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.firstName, last_name: formData.lastName, email: formData.email,
          phone: formData.phone, date_of_birth: formData.dateOfBirth, country: formData.country,
          password: formData.password, security_question: formData.securityQuestion,
          security_answer: formData.securityAnswer, two_factor_enabled: formData.twoFactorEnabled,
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
    return Math.min(strength, 4);
  };

  const inputStyle = (fieldName: string, hasError?: boolean) => ({
    background: colors.glass.light,
    border: `1px solid ${hasError ? colors.status.error : focusedField === fieldName ? colors.secondary : colors.glass.border}`,
    color: colors.text.primary,
    boxShadow: focusedField === fieldName ? shadows.glow.secondary : 'none',
    transition: 'all 0.3s ease'
  });

  const selectStyle = (fieldName: string, hasError?: boolean) => ({
    ...inputStyle(fieldName, hasError),
    appearance: 'none' as const
  });


  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>{t('auth.register.step_basic_info')}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>{t('auth.register.first_name')}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: focusedField === 'firstName' ? colors.secondary : colors.text.muted }} />
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                    onFocus={() => setFocusedField('firstName')} onBlur={() => setFocusedField(null)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none" style={inputStyle('firstName', !!errors.firstName)} placeholder={t('auth.register.first_name_placeholder')} />
                </div>
                {errors.firstName && <p className="text-sm mt-1" style={{ color: colors.status.error }}>{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>{t('auth.register.last_name')}</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                  onFocus={() => setFocusedField('lastName')} onBlur={() => setFocusedField(null)}
                  className="w-full px-4 py-3 rounded-xl outline-none" style={inputStyle('lastName', !!errors.lastName)} placeholder={t('auth.register.last_name_placeholder')} />
                {errors.lastName && <p className="text-sm mt-1" style={{ color: colors.status.error }}>{errors.lastName}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>{t('auth.register.email_label')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: focusedField === 'email' ? colors.secondary : colors.text.muted }} />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                  onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl outline-none" style={inputStyle('email', !!errors.email)} placeholder={t('auth.register.email_placeholder')} />
              </div>
              {errors.email && <p className="text-sm mt-1" style={{ color: colors.status.error }}>{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>{t('auth.register.phone_label')}</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: focusedField === 'phone' ? colors.secondary : colors.text.muted }} />
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                  onFocus={() => setFocusedField('phone')} onBlur={() => setFocusedField(null)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl outline-none" style={inputStyle('phone', !!errors.phone)} placeholder={t('auth.register.phone_placeholder')} />
              </div>
              {errors.phone && <p className="text-sm mt-1" style={{ color: colors.status.error }}>{errors.phone}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>{t('auth.register.dob_label')}</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: focusedField === 'dateOfBirth' ? colors.secondary : colors.text.muted }} />
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange}
                    onFocus={() => setFocusedField('dateOfBirth')} onBlur={() => setFocusedField(null)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none" style={inputStyle('dateOfBirth', !!errors.dateOfBirth)} />
                </div>
                {errors.dateOfBirth && <p className="text-sm mt-1" style={{ color: colors.status.error }}>{errors.dateOfBirth}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>{t('auth.register.country_label')}</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: focusedField === 'country' ? colors.secondary : colors.text.muted }} />
                  <select name="country" value={formData.country} onChange={handleInputChange}
                    onFocus={() => setFocusedField('country')} onBlur={() => setFocusedField(null)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl outline-none" style={selectStyle('country', !!errors.country)}>
                    <option value="">{t('auth.register.country_placeholder')}</option>
                    {countries.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                  </select>
                </div>
                {errors.country && <p className="text-sm mt-1" style={{ color: colors.status.error }}>{errors.country}</p>}
              </div>
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
                  className="w-full pl-10 pr-12 py-3 rounded-xl outline-none" style={inputStyle('password', !!errors.password)} placeholder={t('auth.register.password_placeholder')} />
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
                  className="w-full pl-10 pr-12 py-3 rounded-xl outline-none" style={inputStyle('confirmPassword', !!errors.confirmPassword)} placeholder={t('auth.register.confirm_password_placeholder')} />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2" style={{ color: colors.text.muted }}>
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-sm mt-1" style={{ color: colors.status.error }}>{errors.confirmPassword}</p>}
            </div>
            <div className="space-y-2">
              <p className="text-sm" style={{ color: colors.text.secondary }}>{t('auth.register.password_strength')}:</p>
              <div className="flex space-x-1">
                {[1, 2, 3, 4].map((level) => {
                  const strength = getPasswordStrength(formData.password);
                  const strengthColors = [colors.status.error, colors.status.warning, colors.accent.cyan, colors.status.success];
                  return <div key={level} className="h-2 flex-1 rounded" style={{ background: strength >= level ? strengthColors[strength - 1] : colors.background.tertiary }} />;
                })}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <h3 className="text-lg font-semibold mb-4" style={{ color: colors.text.primary }}>{t('auth.register.step_security')}</h3>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>{t('auth.register.security_question')}</label>
              <select name="securityQuestion" value={formData.securityQuestion} onChange={handleInputChange}
                onFocus={() => setFocusedField('securityQuestion')} onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-3 rounded-xl outline-none" style={selectStyle('securityQuestion', !!errors.securityQuestion)}>
                <option value="">{t('auth.register.security_question_placeholder')}</option>
                {securityQuestions.map((q) => <option key={q.key} value={q.key}>{q.label}</option>)}
              </select>
              {errors.securityQuestion && <p className="text-sm mt-1" style={{ color: colors.status.error }}>{errors.securityQuestion}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>{t('auth.register.security_answer')}</label>
              <input type="text" name="securityAnswer" value={formData.securityAnswer} onChange={handleInputChange}
                onFocus={() => setFocusedField('securityAnswer')} onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-3 rounded-xl outline-none" style={inputStyle('securityAnswer', !!errors.securityAnswer)} placeholder={t('auth.register.security_answer_placeholder')} />
              {errors.securityAnswer && <p className="text-sm mt-1" style={{ color: colors.status.error }}>{errors.securityAnswer}</p>}
            </div>
            <div className="p-4 rounded-xl" style={{ background: `${colors.accent.cyan}10`, border: `1px solid ${colors.accent.cyan}30` }}>
              <label className="flex items-start cursor-pointer">
                <input type="checkbox" name="twoFactorEnabled" checked={formData.twoFactorEnabled} onChange={handleInputChange}
                  className="w-4 h-4 rounded mt-1" style={{ accentColor: colors.secondary }} />
                <div className="ml-3">
                  <span className="text-sm font-medium" style={{ color: colors.text.primary }}>{t('auth.register.enable_2fa')}</span>
                  <p className="text-xs mt-1" style={{ color: colors.text.muted }}>{t('auth.register.enable_2fa_desc')}</p>
                </div>
              </label>
            </div>
          </motion.div>
        );

      case 4:
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

          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{ background: step <= currentStep ? colors.secondary : colors.background.tertiary, color: colors.text.primary }}>
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 4 && <div className="w-8 md:w-12 h-1 mx-1 md:mx-2 rounded" style={{ background: step < currentStep ? colors.secondary : colors.background.tertiary }} />}
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
                {currentStep < 4 ? (
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
