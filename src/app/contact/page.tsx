'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  MessageSquare, 
  MapPin, 
  Send,
  Building2,
  Briefcase,
  HelpCircle,
  CheckCircle,
  Globe,
  Clock
} from 'lucide-react';
import { FaXTwitter, FaDiscord, FaTelegram, FaLinkedinIn, FaGithub } from 'react-icons/fa6';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '../components/EnhancedFooter';
import ParticlesBackground from '../components/ParticlesBackground';
import { colors } from '@/styles/design-tokens';
import { useTranslation } from 'react-i18next';
import '../../i18n';

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactTypes = [
    { id: 'general', label: t('contact.types.general'), icon: HelpCircle },
    { id: 'enterprise', label: t('contact.types.enterprise'), icon: Building2 },
    { id: 'partnership', label: t('contact.types.partnership'), icon: Briefcase },
    { id: 'support', label: t('contact.types.support'), icon: MessageSquare }
  ];

  const contactInfo = [
    { icon: Mail, title: t('contact.info.email.title'), value: t('contact.info.email.value'), description: t('contact.info.email.desc') },
    { icon: MessageSquare, title: t('contact.info.support.title'), value: t('contact.info.support.value'), description: t('contact.info.support.desc') },
    { icon: Globe, title: t('contact.info.website.title'), value: t('contact.info.website.value'), description: t('contact.info.website.desc') },
    { icon: Clock, title: t('contact.info.response.title'), value: t('contact.info.response.value'), description: t('contact.info.response.desc') }
  ];

  const socialLinks = [
    { icon: FaXTwitter, href: 'https://twitter.com/quantaureum', name: 'Twitter' },
    { icon: FaDiscord, href: 'https://discord.gg/quantaureum', name: 'Discord' },
    { icon: FaTelegram, href: 'https://t.me/quantaureum', name: 'Telegram' },
    { icon: FaLinkedinIn, href: 'https://linkedin.com/company/quantaureum', name: 'LinkedIn' },
    { icon: FaGithub, href: 'https://github.com/quantaureum', name: 'GitHub' }
  ];

  const offices = [
    { city: t('contact.offices.singapore.city'), address: t('contact.offices.singapore.address'), type: t('contact.offices.singapore.type') },
    { city: t('contact.offices.sanfrancisco.city'), address: t('contact.offices.sanfrancisco.address'), type: t('contact.offices.sanfrancisco.type') },
    { city: t('contact.offices.london.city'), address: t('contact.offices.london.address'), type: t('contact.offices.london.type') }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-quantum-dark relative">
      <ParticlesBackground />
      <div className="relative z-10">
      <EnhancedNavbar />
      
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: colors.secondary }} />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: colors.accent.cyan }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-2xl" style={{ background: `${colors.secondary}20`, border: `1px solid ${colors.secondary}40` }}>
                <Mail className="w-12 h-12" style={{ color: colors.secondary }} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: colors.text.primary }}>
              {t('contact.title')}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent.cyan})` }}>
                {t('contact.title_highlight')}
              </span>
            </h1>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>{t('contact.subtitle')}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl text-center" style={{ background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}>
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: `${colors.secondary}20` }}>
                  <info.icon className="w-6 h-6" style={{ color: colors.secondary }} />
                </div>
                <h3 className="font-bold mb-1" style={{ color: colors.text.primary }}>{info.title}</h3>
                <p className="font-medium mb-1" style={{ color: colors.accent.cyan }}>{info.value}</p>
                <p className="text-sm" style={{ color: colors.text.muted }}>{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              className="p-8 rounded-2xl" style={{ background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}>
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: `${colors.accent.green}20` }}>
                    <CheckCircle className="w-10 h-10" style={{ color: colors.accent.green }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: colors.text.primary }}>{t('contact.form.success_title')}</h3>
                  <p style={{ color: colors.text.secondary }}>{t('contact.form.success_message')}</p>
                  <button onClick={() => { setIsSubmitted(false); setFormData({ name: '', email: '', company: '', subject: '', message: '', type: 'general' }); }}
                    className="mt-6 px-6 py-2 rounded-lg font-medium transition-all hover:scale-105"
                    style={{ background: colors.glass.medium, color: colors.text.primary }}>{t('contact.form.send_another')}</button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-6" style={{ color: colors.text.primary }}>{t('contact.form.title')}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {contactTypes.map((type) => (
                      <button key={type.id} type="button" onClick={() => setFormData(prev => ({ ...prev, type: type.id }))}
                        className="p-3 rounded-xl text-center transition-all"
                        style={{ background: formData.type === type.id ? `${colors.secondary}30` : colors.glass.medium, border: `1px solid ${formData.type === type.id ? colors.secondary : colors.glass.border}` }}>
                        <type.icon className="w-5 h-5 mx-auto mb-1" style={{ color: formData.type === type.id ? colors.secondary : colors.text.muted }} />
                        <span className="text-xs" style={{ color: formData.type === type.id ? colors.secondary : colors.text.muted }}>{type.label}</span>
                      </button>
                    ))}
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>{t('contact.form.name_label')}</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required
                          className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2"
                          style={{ background: colors.glass.medium, border: `1px solid ${colors.glass.border}`, color: colors.text.primary }}
                          placeholder={t('contact.form.name_placeholder')} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>{t('contact.form.email_label')}</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required
                          className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2"
                          style={{ background: colors.glass.medium, border: `1px solid ${colors.glass.border}`, color: colors.text.primary }}
                          placeholder={t('contact.form.email_placeholder')} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>{t('contact.form.company_label')}</label>
                        <input type="text" name="company" value={formData.company} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2"
                          style={{ background: colors.glass.medium, border: `1px solid ${colors.glass.border}`, color: colors.text.primary }}
                          placeholder={t('contact.form.company_placeholder')} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>{t('contact.form.subject_label')}</label>
                        <input type="text" name="subject" value={formData.subject} onChange={handleChange} required
                          className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2"
                          style={{ background: colors.glass.medium, border: `1px solid ${colors.glass.border}`, color: colors.text.primary }}
                          placeholder={t('contact.form.subject_placeholder')} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2" style={{ color: colors.text.secondary }}>{t('contact.form.message_label')}</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} required rows={5}
                        className="w-full px-4 py-3 rounded-xl outline-none transition-all focus:ring-2 resize-none"
                        style={{ background: colors.glass.medium, border: `1px solid ${colors.glass.border}`, color: colors.text.primary }}
                        placeholder={t('contact.form.message_placeholder')} />
                    </div>
                    <button type="submit" disabled={isSubmitting}
                      className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
                      style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent.cyan})`, color: colors.text.primary }}>
                      {isSubmitting ? <>{t('contact.form.submitting')}</> : <><Send className="w-5 h-5" />{t('contact.form.submit')}</>}
                    </button>
                  </form>
                </>
              )}
            </motion.div>

            <div className="space-y-8">
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
                className="p-8 rounded-2xl" style={{ background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}>
                <h3 className="text-xl font-bold mb-6" style={{ color: colors.text.primary }}>{t('contact.social.title')}</h3>
                <p className="mb-6" style={{ color: colors.text.secondary }}>{t('contact.social.subtitle')}</p>
                <div className="flex flex-wrap gap-4">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" title={social.name}
                        className="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                        style={{ background: colors.glass.medium, border: `1px solid ${colors.glass.border}` }}>
                        <IconComponent size={22} style={{ color: colors.text.primary }} />
                      </a>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                className="p-8 rounded-2xl" style={{ background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}>
                <h3 className="text-xl font-bold mb-6" style={{ color: colors.text.primary }}>{t('contact.offices.title')}</h3>
                <div className="space-y-4">
                  {offices.map((office, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl" style={{ background: colors.glass.medium }}>
                      <div className="p-2 rounded-lg" style={{ background: `${colors.accent.cyan}20` }}>
                        <MapPin className="w-5 h-5" style={{ color: colors.accent.cyan }} />
                      </div>
                      <div>
                        <h4 className="font-bold" style={{ color: colors.text.primary }}>{office.city}</h4>
                        <p className="text-sm" style={{ color: colors.text.secondary }}>{office.address}</p>
                        <span className="text-xs" style={{ color: colors.accent.cyan }}>{office.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                className="p-6 rounded-2xl" style={{ background: `linear-gradient(135deg, ${colors.secondary}20, ${colors.accent.cyan}20)`, border: `1px solid ${colors.glass.border}` }}>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl" style={{ background: `${colors.secondary}30` }}>
                    <HelpCircle className="w-6 h-6" style={{ color: colors.secondary }} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1" style={{ color: colors.text.primary }}>{t('contact.faq.title')}</h4>
                    <p className="text-sm" style={{ color: colors.text.secondary }}>{t('contact.faq.subtitle')}</p>
                  </div>
                  <a href="/support/help" className="ml-auto px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
                    style={{ background: colors.glass.medium, color: colors.text.primary }}>{t('contact.faq.button')}</a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <EnhancedFooter />
      </div>
    </div>
  );
}
