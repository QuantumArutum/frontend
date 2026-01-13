'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaXTwitter, FaDiscord, FaTelegram, FaLinkedinIn, FaGithub, FaMedium } from 'react-icons/fa6';
import { useFooter, useSiteConfig } from '../hooks/useSiteConfig';
import '../i18n';

const EnhancedFooter = () => {
  const { t } = useTranslation();
  
  // Fetch dynamic footer data from API (Requirements 2.2, 2.3, 2.4, 2.5)
  const { sections: dynamicSections, loading: footerLoading } = useFooter();
  const { config: siteConfig } = useSiteConfig();

  // Default footer sections (fallback when API is not available)
  const defaultFooterSections = useMemo(() => [
    {
      title: t('footer.sections.product.title'),
      links: [
        { label: t('footer.sections.product.links.core'), href: '/technology/blockchain' },
        { label: t('footer.sections.product.links.wallet'), href: '/wallet' },
        { label: t('footer.sections.product.links.contracts'), href: '/technology/quantum-security' },
        { label: t('footer.sections.product.links.crosschain'), href: '/applications' },
        { label: t('footer.sections.product.links.docs'), href: '/developers/api' }
      ]
    },
    {
      title: t('footer.sections.developer.title'),
      links: [
        { label: t('footer.sections.developer.links.docs'), href: '/developers/docs' },
        { label: t('footer.sections.developer.links.sdk'), href: '/developers/sdk' },
        { label: t('footer.sections.developer.links.examples'), href: '/developers/examples' },
        { label: t('footer.sections.developer.links.community'), href: '/community' },
        { label: t('footer.sections.developer.links.github'), href: 'https://github.com/quantaureum' }
      ]
    },
    {
      title: t('footer.sections.enterprise.title'),
      links: [
        { label: t('footer.sections.enterprise.links.solutions'), href: '/enterprise/solutions' },
        { label: t('footer.sections.enterprise.links.support'), href: '/enterprise/support' },
        { label: t('footer.sections.enterprise.links.partners'), href: '/enterprise/partners' },
        { label: t('footer.sections.enterprise.links.audit'), href: '/enterprise/audit' },
        { label: t('footer.sections.enterprise.links.contact'), href: '/contact' }
      ]
    }
  ], [t]);

  // Use dynamic sections if available, otherwise use defaults
  const footerSections = useMemo(() => {
    if (footerLoading || dynamicSections.length === 0) {
      return defaultFooterSections;
    }
    
    // Convert dynamic sections to the expected format
    return dynamicSections.map(section => ({
      title: section.title,
      links: section.links.map(link => ({
        label: link.label,
        href: link.link || '#'
      }))
    }));
  }, [dynamicSections, footerLoading, defaultFooterSections]);

  // Default social links (can be overridden by site config)
  const defaultSocialLinks = [
    { name: 'Twitter', icon: FaXTwitter, href: 'https://twitter.com/quantaureum' },
    { name: 'Discord', icon: FaDiscord, href: 'https://discord.gg/quantaureum' },
    { name: 'Telegram', icon: FaTelegram, href: 'https://t.me/quantaureum' },
    { name: 'LinkedIn', icon: FaLinkedinIn, href: 'https://linkedin.com/company/quantaureum' },
    { name: 'GitHub', icon: FaGithub, href: 'https://github.com/quantaureum' },
    { name: 'Medium', icon: FaMedium, href: 'https://medium.com/@quantaureum' }
  ];

  // Use site config social links if available
  const socialLinks = useMemo(() => {
    if (!siteConfig) return defaultSocialLinks;
    
    return [
      { name: 'Twitter', icon: FaXTwitter, href: siteConfig.social_twitter || 'https://twitter.com/quantaureum' },
      { name: 'Discord', icon: FaDiscord, href: siteConfig.social_discord || 'https://discord.gg/quantaureum' },
      { name: 'Telegram', icon: FaTelegram, href: siteConfig.social_telegram || 'https://t.me/quantaureum' },
      { name: 'LinkedIn', icon: FaLinkedinIn, href: siteConfig.social_linkedin || 'https://linkedin.com/company/quantaureum' },
      { name: 'GitHub', icon: FaGithub, href: siteConfig.social_github || 'https://github.com/quantaureum' },
      { name: 'Medium', icon: FaMedium, href: siteConfig.social_medium || 'https://medium.com/@quantaureum' }
    ];
  }, [siteConfig]);

  const stats = [
    { label: t('footer.stats.nodes'), value: '127+' },
    { label: t('footer.stats.transactions'), value: '1M+' },
    { label: t('footer.stats.developers'), value: '5K+' },
    { label: t('footer.stats.enterprises'), value: '50+' }
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-black border-t border-white/10">
      {/* Stats Section */}
      <div className="py-16 px-5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] bg-clip-text text-transparent">
              {t('footer.stats.title')}
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {t('footer.stats.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16 px-5 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Image 
                    src="/quantaureum-icon.svg" 
                    alt="Quantaureum" 
                    width={48}
                    height={48}
                    className="w-12 h-12"
                  />
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] bg-clip-text text-transparent">
                    Quantaureum
                  </span>
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {t('footer.brand.description')}
                </p>
                <div className="flex gap-4">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <motion.a
                        key={social.name}
                        whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center text-white hover:bg-white/20 hover:border-cyan-500/50 transition-all duration-300"
                        title={social.name}
                      >
                        <IconComponent size={20} />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Links Sections */}
            {footerSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                >
                  <h4 className="text-lg font-semibold text-white mb-6">
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        {link.href.startsWith('http') ? (
                          <motion.a
                            whileHover={{ x: 5 }}
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-white transition-all duration-300 block"
                          >
                            {link.label}
                          </motion.a>
                        ) : (
                          <Link href={link.href}>
                            <motion.span
                              whileHover={{ x: 5 }}
                              className="text-gray-400 hover:text-white transition-all duration-300 block cursor-pointer"
                            >
                              {link.label}
                            </motion.span>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-12 px-5 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h4 className="text-xl font-semibold text-white mb-4">
              {t('footer.newsletter.title')}
            </h4>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              {t('footer.newsletter.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('footer.newsletter.placeholder')}
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 transition-all duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
              >
                {t('footer.newsletter.subscribe')}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-6 px-5 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              {t('footer.legal.copyright')}
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link href="/legal/privacy">
                <motion.span
                  whileHover={{ y: -2 }}
                  className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  {t('footer.legal.privacy')}
                </motion.span>
              </Link>
              <Link href="/legal/terms">
                <motion.span
                  whileHover={{ y: -2 }}
                  className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  {t('footer.legal.terms')}
                </motion.span>
              </Link>
              <Link href="/legal/cookies">
                <motion.span
                  whileHover={{ y: -2 }}
                  className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  {t('footer.legal.cookies')}
                </motion.span>
              </Link>
              <Link href="/legal/security">
                <motion.span
                  whileHover={{ y: -2 }}
                  className="text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
                >
                  {t('footer.legal.security')}
                </motion.span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 z-40"
      >
        ↑
      </motion.button>
    </footer>
  );
};

export default EnhancedFooter;
