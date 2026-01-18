'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, AlertTriangle, CheckCircle, Mail, ChevronRight } from 'lucide-react';
import '../../../i18n/index';

export default function SecurityStatementPage() {
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
            <span className="text-white">{t('legal.security.title', 'Security Statement')}</span>
          </div>
          <div className="flex items-center gap-4">
            <Shield className="w-12 h-12 text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                {t('legal.security.title', 'Security Statement')}
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
          {/* Security Commitment */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('legal.security.commitment.title', 'Our Security Commitment')}
            </h2>
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-6 border border-cyan-500/30">
              <p className="text-gray-300 leading-relaxed">
                {t(
                  'legal.security.commitment.content',
                  'At Quantaureum, security is our top priority. We employ the most advanced quantum-safe technology and industry best practices to ensure your digital assets and personal information receive the highest level of protection. Our security team monitors systems around the clock and continuously improves our security measures.'
                )}
              </p>
            </div>
          </section>

          {/* Quantum Security Technology */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-cyan-400" />
              {t('legal.security.quantum.title', 'Quantum Security Technology')}
            </h2>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {t('legal.security.quantum.pqc.title', 'Post-Quantum Cryptography')}
                </h3>
                <p className="text-gray-300 mb-3">
                  {t(
                    'legal.security.quantum.pqc.desc',
                    'We use NIST-standardized post-quantum cryptographic algorithms to ensure your assets are protected even in the quantum computing era:'
                  )}
                </p>
                <ul className="text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    CRYSTALS-Dilithium -{' '}
                    {t('legal.security.quantum.pqc.dilithium', 'Digital signature algorithm')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    CRYSTALS-Kyber -{' '}
                    {t('legal.security.quantum.pqc.kyber', 'Key encapsulation mechanism')}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    SPHINCS+ -{' '}
                    {t('legal.security.quantum.pqc.sphincs', 'Hash-based signature scheme')}
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {t('legal.security.quantum.standards.title', 'Encryption Standards')}
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>
                    •{' '}
                    {t(
                      'legal.security.quantum.standards.item1',
                      'All data transmission uses TLS 1.3 encryption'
                    )}
                  </li>
                  <li>
                    •{' '}
                    {t(
                      'legal.security.quantum.standards.item2',
                      'Sensitive data stored with AES-256 encryption'
                    )}
                  </li>
                  <li>
                    •{' '}
                    {t(
                      'legal.security.quantum.standards.item3',
                      'Private keys protected by Hardware Security Modules (HSM)'
                    )}
                  </li>
                  <li>
                    •{' '}
                    {t(
                      'legal.security.quantum.standards.item4',
                      'Quantum Random Number Generator (QRNG) for key generation'
                    )}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Security Measures */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('legal.security.measures.title', 'Security Measures')}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {t('legal.security.measures.infrastructure.title', 'Infrastructure Security')}
                </h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>
                    •{' '}
                    {t(
                      'legal.security.measures.infrastructure.item1',
                      'Multi-layer firewall protection'
                    )}
                  </li>
                  <li>
                    • {t('legal.security.measures.infrastructure.item2', 'DDoS attack protection')}
                  </li>
                  <li>
                    •{' '}
                    {t(
                      'legal.security.measures.infrastructure.item3',
                      'Intrusion detection and prevention systems'
                    )}
                  </li>
                  <li>
                    •{' '}
                    {t('legal.security.measures.infrastructure.item4', '24/7 security monitoring')}
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {t('legal.security.measures.application.title', 'Application Security')}
                </h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• {t('legal.security.measures.application.item1', 'Secure code review')}</li>
                  <li>
                    •{' '}
                    {t('legal.security.measures.application.item2', 'Regular penetration testing')}
                  </li>
                  <li>
                    •{' '}
                    {t(
                      'legal.security.measures.application.item3',
                      'Vulnerability scanning and remediation'
                    )}
                  </li>
                  <li>
                    •{' '}
                    {t('legal.security.measures.application.item4', 'Secure development lifecycle')}
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {t('legal.security.measures.account.title', 'Account Security')}
                </h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>
                    •{' '}
                    {t(
                      'legal.security.measures.account.item1',
                      'Multi-factor authentication (MFA)'
                    )}
                  </li>
                  <li>• {t('legal.security.measures.account.item2', 'Biometric support')}</li>
                  <li>
                    • {t('legal.security.measures.account.item3', 'Anomalous login detection')}
                  </li>
                  <li>
                    • {t('legal.security.measures.account.item4', 'Session management and timeout')}
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">
                  {t('legal.security.measures.operational.title', 'Operational Security')}
                </h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>
                    • {t('legal.security.measures.operational.item1', 'Employee security training')}
                  </li>
                  <li>
                    •{' '}
                    {t('legal.security.measures.operational.item2', 'Principle of least privilege')}
                  </li>
                  <li>• {t('legal.security.measures.operational.item3', 'Access log auditing')}</li>
                  <li>
                    • {t('legal.security.measures.operational.item4', 'Incident response plan')}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Security Audits */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('legal.security.audits.title', 'Security Audits and Certifications')}
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-4">
                {t(
                  'legal.security.audits.intro',
                  'We regularly undergo independent third-party security audits to ensure our security measures meet the highest standards:'
                )}
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className="text-white font-medium">CertiK</div>
                  <div className="text-gray-400 text-sm">
                    {t('legal.security.audits.certik', 'Smart contract audit')}
                  </div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl mb-2">🔒</div>
                  <div className="text-white font-medium">SOC 2 Type II</div>
                  <div className="text-gray-400 text-sm">
                    {t('legal.security.audits.soc2', 'Compliance certification')}
                  </div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl mb-2">✓</div>
                  <div className="text-white font-medium">ISO 27001</div>
                  <div className="text-gray-400 text-sm">
                    {t('legal.security.audits.iso', 'Information security management')}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Vulnerability Reporting */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              {t('legal.security.vulnerability.title', 'Vulnerability Reporting')}
            </h2>
            <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/30">
              <p className="text-gray-300 leading-relaxed mb-4">
                {t(
                  'legal.security.vulnerability.intro',
                  'We value the contributions of security researchers. If you discover any security vulnerabilities, please responsibly disclose them through our bug bounty program:'
                )}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/community/bug-bounty"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  {t('legal.security.vulnerability.bounty', 'Bug Bounty Program')}
                </Link>
                <a
                  href="mailto:security@quantaureum.com"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  security@quantaureum.com
                </a>
              </div>
            </div>
          </section>

          {/* User Security Tips */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('legal.security.tips.title', 'User Security Tips')}
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('legal.security.tips.intro', 'To protect your account security, we recommend:')}
              </p>
              <ul className="text-gray-300 space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>
                    {t(
                      'legal.security.tips.item1',
                      'Enable multi-factor authentication (MFA) to add an extra layer of account security'
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>
                    {t(
                      'legal.security.tips.item2',
                      'Use strong passwords and do not reuse passwords across multiple websites'
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>
                    {t(
                      'legal.security.tips.item3',
                      'Securely backup your private keys and seed phrases, do not store them online'
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>
                    {t(
                      'legal.security.tips.item4',
                      'Be wary of phishing attacks, always verify website URLs'
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>
                    {t(
                      'legal.security.tips.item5',
                      'Keep software and devices updated to the latest versions'
                    )}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>
                    {t(
                      'legal.security.tips.item6',
                      'Consider using a hardware wallet to store large amounts of assets'
                    )}
                  </span>
                </li>
              </ul>
            </div>
          </section>

          {/* Contact Security Team */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-cyan-400" />
              {t('legal.security.contact.title', 'Contact Security Team')}
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-4">
                {t(
                  'legal.security.contact.intro',
                  'If you have any security-related questions or concerns, please contact our security team:'
                )}
              </p>
              <div className="text-gray-300">
                <p>
                  {t('legal.security.contact.security', 'Security Issues')}:
                  security@quantaureum.com
                </p>
                <p>
                  {t('legal.security.contact.bounty', 'Vulnerability Reports')}:
                  bugbounty@quantaureum.com
                </p>
                <p>
                  {t('legal.security.contact.pgp', 'PGP Key')}:{' '}
                  {t('legal.security.contact.pgp_note', 'Available on our GitHub page')}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
