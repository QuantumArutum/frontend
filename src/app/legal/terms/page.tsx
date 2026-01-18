'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { FileText, AlertTriangle, Scale, Users, Ban, ChevronRight } from 'lucide-react';
import '../../../i18n/index';

export default function TermsOfServicePage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <Link href="/" className="hover:text-white">
              {t('legal.home', 'Home')}
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{t('legal.terms.title', 'Terms of Service')}</span>
          </div>
          <div className="flex items-center gap-4">
            <FileText className="w-12 h-12 text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                {t('legal.terms.title', 'Terms of Service')}
              </h1>
              <p className="text-gray-400 mt-1">
                {t('legal.last_updated', 'Last Updated')}: 2024-01-01
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-invert max-w-none">
          {/* Acceptance */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Scale className="w-6 h-6 text-cyan-400" />
              {t('legal.terms.acceptance.title', 'Acceptance of Terms')}
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                {t(
                  'legal.terms.acceptance.content',
                  'Welcome to the Quantaureum platform. By accessing or using our services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services. We reserve the right to modify these terms at any time, and modified terms will take effect immediately upon posting.'
                )}
              </p>
            </div>
          </section>

          {/* Service Description */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('legal.terms.services.title', 'Service Description')}
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-4">
                {t(
                  'legal.terms.services.intro',
                  'Quantaureum provides the following services based on quantum-safe blockchain technology:'
                )}
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• {t('legal.terms.services.item1', 'Quantum-safe digital wallet services')}</li>
                <li>
                  •{' '}
                  {t('legal.terms.services.item2', 'Blockchain transactions and transfer services')}
                </li>
                <li>
                  • {t('legal.terms.services.item3', 'Decentralized Finance (DeFi) services')}
                </li>
                <li>
                  • {t('legal.terms.services.item4', 'Smart contract deployment and execution')}
                </li>
                <li>• {t('legal.terms.services.item5', 'Token sale and trading services')}</li>
                <li>• {t('legal.terms.services.item6', 'Developer tools and APIs')}</li>
              </ul>
            </div>
          </section>

          {/* User Responsibilities */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Users className="w-6 h-6 text-cyan-400" />
              {t('legal.terms.responsibilities.title', 'User Responsibilities')}
            </h2>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {t('legal.terms.responsibilities.security.title', 'Account Security')}
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>
                    •{' '}
                    {t(
                      'legal.terms.responsibilities.security.item1',
                      'You are responsible for protecting your account credentials and private keys'
                    )}
                  </li>
                  <li>
                    •{' '}
                    {t(
                      'legal.terms.responsibilities.security.item2',
                      'Do not share your login information with others'
                    )}
                  </li>
                  <li>
                    •{' '}
                    {t(
                      'legal.terms.responsibilities.security.item3',
                      'Notify us immediately if you discover unauthorized access'
                    )}
                  </li>
                  <li>
                    •{' '}
                    {t(
                      'legal.terms.responsibilities.security.item4',
                      'You are responsible for all activities under your account'
                    )}
                  </li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {t('legal.terms.responsibilities.compliance.title', 'Compliant Use')}
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>
                    •{' '}
                    {t(
                      'legal.terms.responsibilities.compliance.item1',
                      'Comply with all applicable laws and regulations'
                    )}
                  </li>
                  <li>
                    •{' '}
                    {t(
                      'legal.terms.responsibilities.compliance.item2',
                      'Do not use for illegal activities or money laundering'
                    )}
                  </li>
                  <li>
                    •{' '}
                    {t(
                      'legal.terms.responsibilities.compliance.item3',
                      'Provide accurate and truthful information'
                    )}
                  </li>
                  <li>
                    •{' '}
                    {t(
                      'legal.terms.responsibilities.compliance.item4',
                      'Respect the rights of other users'
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Ban className="w-6 h-6 text-red-400" />
              {t('legal.terms.prohibited.title', 'Prohibited Activities')}
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('legal.terms.prohibited.intro', 'When using our services, you must not:')}
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>
                  •{' '}
                  {t(
                    'legal.terms.prohibited.item1',
                    'Engage in any fraudulent, deceptive or misleading activities'
                  )}
                </li>
                <li>
                  •{' '}
                  {t(
                    'legal.terms.prohibited.item2',
                    'Interfere with or disrupt the normal operation of services'
                  )}
                </li>
                <li>
                  •{' '}
                  {t(
                    'legal.terms.prohibited.item3',
                    'Attempt unauthorized access to systems or data'
                  )}
                </li>
                <li>• {t('legal.terms.prohibited.item4', 'Spread malware or harmful code')}</li>
                <li>
                  •{' '}
                  {t(
                    'legal.terms.prohibited.item5',
                    'Infringe on the intellectual property rights of others'
                  )}
                </li>
                <li>
                  •{' '}
                  {t(
                    'legal.terms.prohibited.item6',
                    'Engage in market manipulation or insider trading'
                  )}
                </li>
                <li>
                  •{' '}
                  {t(
                    'legal.terms.prohibited.item7',
                    'Circumvent any security measures or access controls'
                  )}
                </li>
              </ul>
            </div>
          </section>

          {/* Risk Warning */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              {t('legal.terms.risks.title', 'Risk Warning')}
            </h2>
            <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/30">
              <p className="text-gray-300 leading-relaxed mb-4">
                {t(
                  'legal.terms.risks.intro',
                  'Using blockchain and cryptocurrency services involves significant risks, including but not limited to:'
                )}
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• {t('legal.terms.risks.item1', 'Digital asset price volatility risk')}</li>
                <li>
                  •{' '}
                  {t('legal.terms.risks.item2', 'Technical failure or security vulnerability risk')}
                </li>
                <li>• {t('legal.terms.risks.item3', 'Regulatory change risk')}</li>
                <li>
                  • {t('legal.terms.risks.item4', 'Risk of asset loss due to lost private keys')}
                </li>
                <li>• {t('legal.terms.risks.item5', 'Smart contract vulnerability risk')}</li>
              </ul>
              <p className="text-yellow-400 mt-4 font-medium">
                {t('legal.terms.risks.warning', 'Please only invest what you can afford to lose.')}
              </p>
            </div>
          </section>

          {/* Disclaimer */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('legal.terms.disclaimer.title', 'Disclaimer')}
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                {t(
                  'legal.terms.disclaimer.content',
                  'Services are provided on an "as is" and "as available" basis without any express or implied warranties. We do not guarantee that services will be uninterrupted or error-free. To the maximum extent permitted by law, we are not liable for any indirect, incidental, special or consequential damages.'
                )}
              </p>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('legal.terms.ip.title', 'Intellectual Property')}
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                {t(
                  'legal.terms.ip.content',
                  'The Quantaureum platform and all its content, features and functionality are the property of Quantaureum or its licensors and are protected by copyright, trademark and other intellectual property laws. You may not copy, modify, distribute or otherwise use our intellectual property without our prior written consent.'
                )}
              </p>
            </div>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('legal.terms.termination.title', 'Termination')}
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                {t(
                  'legal.terms.termination.content',
                  'We reserve the right to suspend or terminate your access to services at any time for any reason, including but not limited to violation of these terms. Upon termination, your right to use services will cease immediately. Certain provisions will survive termination.'
                )}
              </p>
            </div>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('legal.terms.law.title', 'Governing Law')}
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                {t(
                  'legal.terms.law.content',
                  'These terms are governed by and construed in accordance with applicable law. Any disputes arising from these terms shall be submitted to a court of competent jurisdiction. If any part of these terms is found to be invalid or unenforceable, the remaining parts shall remain in effect.'
                )}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
