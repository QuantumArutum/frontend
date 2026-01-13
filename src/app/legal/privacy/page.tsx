'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Eye, Database, Globe, Mail, ChevronRight } from 'lucide-react';
import '../../../i18n/index';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <Link href="/" className="hover:text-white">{t('legal.home', 'Home')}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{t('legal.privacy.title', 'Privacy Policy')}</span>
          </div>
          <div className="flex items-center gap-4">
            <Shield className="w-12 h-12 text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">{t('legal.privacy.title', 'Privacy Policy')}</h1>
              <p className="text-gray-400 mt-1">{t('legal.last_updated', 'Last Updated')}: 2024-01-01</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-invert max-w-none">
          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-cyan-400" />
              {t('legal.privacy.overview.title', 'Overview')}
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                {t('legal.privacy.overview.content', 'Quantaureum ("we") takes your privacy very seriously. This privacy policy explains how we collect, use, disclose and protect your personal information. By using our services, you agree to the practices described in this privacy policy.')}
              </p>
            </div>
          </section>

          {/* Information Collection */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Database className="w-6 h-6 text-cyan-400" />
              {t('legal.privacy.collection.title', 'Information We Collect')}
            </h2>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">{t('legal.privacy.collection.provided.title', 'Information You Provide')}</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• {t('legal.privacy.collection.provided.item1', 'Account registration information (email address, username)')}</li>
                  <li>• {t('legal.privacy.collection.provided.item2', 'Wallet addresses and transaction records')}</li>
                  <li>• {t('legal.privacy.collection.provided.item3', 'Customer support communications')}</li>
                  <li>• {t('legal.privacy.collection.provided.item4', 'Any other information you choose to provide')}</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">{t('legal.privacy.collection.automatic.title', 'Automatically Collected Information')}</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• {t('legal.privacy.collection.automatic.item1', 'Device information (device type, operating system, browser type)')}</li>
                  <li>• {t('legal.privacy.collection.automatic.item2', 'IP address and geographic location information')}</li>
                  <li>• {t('legal.privacy.collection.automatic.item3', 'Usage data and analytics information')}</li>
                  <li>• {t('legal.privacy.collection.automatic.item4', 'Information collected through cookies and similar technologies')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Information Use */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Globe className="w-6 h-6 text-cyan-400" />
              {t('legal.privacy.use.title', 'How We Use Information')}
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <ul className="text-gray-300 space-y-3">
                <li>• {t('legal.privacy.use.item1', 'Provide, maintain and improve our services')}</li>
                <li>• {t('legal.privacy.use.item2', 'Process transactions and send related notifications')}</li>
                <li>• {t('legal.privacy.use.item3', 'Respond to your requests and provide customer support')}</li>
                <li>• {t('legal.privacy.use.item4', 'Send technical notices, updates and security alerts')}</li>
                <li>• {t('legal.privacy.use.item5', 'Detect, prevent and resolve fraud and security issues')}</li>
                <li>• {t('legal.privacy.use.item6', 'Comply with legal obligations')}</li>
                <li>• {t('legal.privacy.use.item7', 'Conduct research and analysis to improve services')}</li>
              </ul>
            </div>
          </section>

          {/* Information Protection */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-cyan-400" />
              {t('legal.privacy.security.title', 'Information Security')}
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('legal.privacy.security.intro', 'We employ industry-standard security measures to protect your personal information, including:')}
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• {t('legal.privacy.security.item1', 'Quantum-safe encryption technology to protect data transmission')}</li>
                <li>• {t('legal.privacy.security.item2', 'Secure data storage and access controls')}</li>
                <li>• {t('legal.privacy.security.item3', 'Regular security audits and vulnerability assessments')}</li>
                <li>• {t('legal.privacy.security.item4', 'Employee security training and access restrictions')}</li>
              </ul>
            </div>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">{t('legal.privacy.rights.title', 'Your Rights')}</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('legal.privacy.rights.intro', 'Under applicable data protection laws, you may have the following rights:')}
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• {t('legal.privacy.rights.item1', 'Access your personal information')}</li>
                <li>• {t('legal.privacy.rights.item2', 'Correct inaccurate information')}</li>
                <li>• {t('legal.privacy.rights.item3', 'Delete your personal information')}</li>
                <li>• {t('legal.privacy.rights.item4', 'Restrict or object to processing')}</li>
                <li>• {t('legal.privacy.rights.item5', 'Data portability')}</li>
                <li>• {t('legal.privacy.rights.item6', 'Withdraw consent')}</li>
              </ul>
            </div>
          </section>

          {/* Contact Us */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-cyan-400" />
              {t('legal.privacy.contact.title', 'Contact Us')}
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('legal.privacy.contact.intro', 'If you have any questions about this privacy policy or wish to exercise your rights, please contact us:')}
              </p>
              <div className="text-gray-300">
                <p>{t('legal.privacy.contact.email', 'Email')}: privacy@quantaureum.com</p>
                <p>{t('legal.privacy.contact.address', 'Address')}: [Company Address]</p>
              </div>
            </div>
          </section>

          {/* Policy Updates */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{t('legal.privacy.updates.title', 'Policy Updates')}</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                {t('legal.privacy.updates.content', 'We may update this privacy policy from time to time. Updated policies will be posted on this page with the last updated date noted. We recommend that you review this policy regularly to stay informed of any changes. Continued use of our services indicates your acceptance of the updated policy.')}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
