'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { FaXTwitter, FaDiscord, FaTelegram, FaLinkedinIn, FaGithub, FaMedium } from 'react-icons/fa6';
import '../../i18n';

const EnhancedFooter = () => {
  const { t } = useTranslation();

  const footerSections = [
    {
      title: t('footer.sections.product.title'),
      links: [
        { label: t('footer.sections.product.links.core'), href: '/technology/blockchain' },
        { label: t('footer.sections.product.links.wallet'), href: '/wallet' },
        { label: t('footer.sections.product.links.contracts'), href: '/technology/quantum-security' },
        { label: t('footer.sections.product.links.crosschain'), href: '/applications' },
        { label: t('footer.sections.product.links.docs'), href: '/developers/api' },
      ],
    },
    {
      title: t('footer.sections.developer.title'),
      links: [
        { label: t('footer.sections.developer.links.docs'), href: '/developers/docs' },
        { label: t('footer.sections.developer.links.sdk'), href: '/developers/sdk' },
        { label: t('footer.sections.developer.links.examples'), href: '/developers/examples' },
        { label: t('footer.sections.developer.links.community'), href: '/community' },
        { label: t('footer.sections.developer.links.github'), href: 'https://github.com/quantaureum' },
      ],
    },
    {
      title: t('footer.sections.enterprise.title'),
      links: [
        { label: t('footer.sections.enterprise.links.solutions'), href: '/enterprise/solutions' },
        { label: t('footer.sections.enterprise.links.support'), href: '/enterprise/support' },
        { label: t('footer.sections.enterprise.links.partners'), href: '/enterprise/partners' },
        { label: t('footer.sections.enterprise.links.audit'), href: '/enterprise/audit' },
        { label: t('footer.sections.enterprise.links.contact'), href: '/contact' },
      ],
    },
  ];

  const stats = [
    { label: t('footer.stats.nodes'), value: '127+' },
    { label: t('footer.stats.transactions'), value: '1M+' },
    { label: t('footer.stats.developers'), value: '5K+' },
    { label: t('footer.stats.enterprises'), value: '50+' },
  ];

  return (
    <footer className="bg-white/5 backdrop-blur-sm border-t border-white/10">
      {/* Stats Section */}
      <div className="py-16 px-5">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] bg-clip-text text-transparent">
            {t('footer.stats.title')}
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto">{t('footer.stats.description')}</p>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-16 px-5 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Image src="/quantaureum-icon.svg" alt="Quantaureum" width={48} height={48} className="w-12 h-12" />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] bg-clip-text text-transparent">Quantaureum</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">{t('footer.brand.description')}</p>
            <div className="flex gap-4">
              {[
                { icon: FaXTwitter, href: 'https://twitter.com/quantaureum', name: 'Twitter' },
                { icon: FaDiscord, href: 'https://discord.gg/quantaureum', name: 'Discord' },
                { icon: FaTelegram, href: 'https://t.me/quantaureum', name: 'Telegram' },
                { icon: FaLinkedinIn, href: 'https://linkedin.com/company/quantaureum', name: 'LinkedIn' },
                { icon: FaGithub, href: 'https://github.com/quantaureum', name: 'GitHub' },
                { icon: FaMedium, href: 'https://medium.com/@quantaureum', name: 'Medium' },
              ].map((social) => {
                const IconComponent = social.icon;
                return (
                  <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" title={social.name} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30">
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Section - All in one column */}
          <div className="grid grid-cols-3 gap-8">
            {footerSections.map((section, sIdx) => (
              <div key={sIdx}>
                <h4 className="text-lg font-semibold text-white mb-6">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, lIdx) => (
                    <li key={lIdx}>
                      {link.href.startsWith('http') ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-all duration-300 block">{link.label}</a>
                      ) : (
                        <Link href={link.href}>
                          <span className="text-gray-400 hover:text-white transition-all duration-300 block cursor-pointer">{link.label}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="py-12 px-5 border-t border-white/10">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#6E3CBC]/20 to-[#00D4FF]/20 rounded-2xl border border-cyan-500/30 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">{t('footer.newsletter.title')}</h3>
              <p className="text-gray-300">{t('footer.newsletter.description')}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input type="email" placeholder={t('footer.newsletter.placeholder')} className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors duration-300" />
              <button className="px-6 py-3 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300">{t('footer.newsletter.subscribe')}</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="py-6 px-5 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm">{t('footer.legal.copyright')}</div>
          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="/legal/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">{t('footer.legal.privacy')}</Link>
            <Link href="/legal/terms" className="text-gray-400 hover:text-white transition-colors duration-300">{t('footer.legal.terms')}</Link>
            <Link href="/legal/cookies" className="text-gray-400 hover:text-white transition-colors duration-300">{t('footer.legal.cookies')}</Link>
            <Link href="/legal/security" className="text-gray-400 hover:text-white transition-colors duration-300">{t('footer.legal.security')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EnhancedFooter;

