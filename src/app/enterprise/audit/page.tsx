'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaCheckCircle, FaFileAlt, FaDownload, FaExternalLinkAlt, FaLock, FaBug, FaCode, FaUserShield, FaCertificate } from 'react-icons/fa';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '@/app/components/EnhancedFooter';
import ParticlesBackground from '@/app/components/ParticlesBackground';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const getAuditReports = (t: any) => [
  {
    title: t('enterprise.audit.reports_list.smart_contract.title'),
    auditor: 'CertiK',
    date: '2025-12-15',
    status: t('enterprise.audit.reports_list.smart_contract.status'),
    score: '98/100',
    findings: { critical: 0, high: 0, medium: 1, low: 3 },
    description: t('enterprise.audit.reports_list.smart_contract.desc'),
    reportUrl: '#'
  },
  {
    title: t('enterprise.audit.reports_list.quantum_crypto.title'),
    auditor: 'Trail of Bits',
    date: '2025-11-20',
    status: t('enterprise.audit.reports_list.quantum_crypto.status'),
    score: '99/100',
    findings: { critical: 0, high: 0, medium: 0, low: 2 },
    description: t('enterprise.audit.reports_list.quantum_crypto.desc'),
    reportUrl: '#'
  },
  {
    title: t('enterprise.audit.reports_list.consensus.title'),
    auditor: 'OpenZeppelin',
    date: '2025-10-10',
    status: t('enterprise.audit.reports_list.consensus.status'),
    score: '97/100',
    findings: { critical: 0, high: 0, medium: 2, low: 4 },
    description: t('enterprise.audit.reports_list.consensus.desc'),
    reportUrl: '#'
  },
  {
    title: t('enterprise.audit.reports_list.network.title'),
    auditor: 'Halborn',
    date: '2025-09-05',
    status: t('enterprise.audit.reports_list.network.status'),
    score: '96/100',
    findings: { critical: 0, high: 0, medium: 1, low: 5 },
    description: t('enterprise.audit.reports_list.network.desc'),
    reportUrl: '#'
  }
];

const getCertifications = (t: any) => [
  {
    name: 'SOC 2 Type II',
    issuer: 'AICPA',
    validUntil: '2026-06-30',
    description: t('enterprise.audit.certifications_list.soc2.desc')
  },
  {
    name: 'ISO 27001',
    issuer: 'BSI',
    validUntil: '2026-12-31',
    description: t('enterprise.audit.certifications_list.iso27001.desc')
  },
  {
    name: t('enterprise.audit.certifications_list.gdpr.name'),
    issuer: 'TÜV',
    validUntil: '2026-03-31',
    description: t('enterprise.audit.certifications_list.gdpr.desc')
  },
  {
    name: 'PCI DSS Level 1',
    issuer: 'PCI SSC',
    validUntil: '2026-09-30',
    description: t('enterprise.audit.certifications_list.pci.desc')
  }
];

const getSecurityFeatures = (t: any) => [
  {
    icon: FaLock,
    title: t('enterprise.audit.features.quantum.title'),
    description: t('enterprise.audit.features.quantum.desc')
  },
  {
    icon: FaBug,
    title: t('enterprise.audit.features.bounty.title'),
    description: t('enterprise.audit.features.bounty.desc')
  },
  {
    icon: FaCode,
    title: t('enterprise.audit.features.opensource.title'),
    description: t('enterprise.audit.features.opensource.desc')
  },
  {
    icon: FaUserShield,
    title: t('enterprise.audit.features.multisig.title'),
    description: t('enterprise.audit.features.multisig.desc')
  }
];

const getBugBountyTiers = (t: any) => [
  { severity: t('enterprise.audit.findings.critical'), reward: '$50,000 - $100,000', color: 'text-red-400', bgColor: 'bg-red-500/20' },
  { severity: t('enterprise.audit.findings.high'), reward: '$10,000 - $50,000', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  { severity: t('enterprise.audit.findings.medium'), reward: '$2,000 - $10,000', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
  { severity: t('enterprise.audit.findings.low'), reward: '$500 - $2,000', color: 'text-green-400', bgColor: 'bg-green-500/20' }
];

export default function EnterpriseAuditPage() {
  const { t } = useTranslation();
  const auditReports = getAuditReports(t);
  const certifications = getCertifications(t);
  const securityFeatures = getSecurityFeatures(t);
  const bugBountyTiers = getBugBountyTiers(t);

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <EnhancedNavbar />
      <div className="relative z-10">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-green-500/20 text-green-300 rounded-full text-sm mb-6">
              {t('enterprise.audit.title')}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('enterprise.audit.hero.title_prefix')}
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"> {t('enterprise.audit.hero.title_highlight')} </span>
              {t('enterprise.audit.hero.title_suffix')}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              {t('enterprise.audit.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-green-400">
                <FaCheckCircle className="text-xl" />
                <span>{t('enterprise.audit.stats.zero_critical')}</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <FaCheckCircle className="text-xl" />
                <span>{t('enterprise.audit.stats.audits_count')}</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <FaCheckCircle className="text-xl" />
                <span>{t('enterprise.audit.stats.opensource')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Audit Reports */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">{t('enterprise.audit.reports.title')}</h2>
          <p className="text-gray-400 text-center mb-12">{t('enterprise.audit.reports.subtitle')}</p>
          <div className="space-y-6">
            {auditReports.map((report, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-green-500/50 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FaShieldAlt className="text-green-400 text-xl" />
                      <h3 className="text-xl font-bold text-white">{report.title}</h3>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                        {report.status}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-4">{report.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <span className="text-gray-300">{t('enterprise.audit.auditor')}: <span className="text-white font-medium">{report.auditor}</span></span>
                      <span className="text-gray-300">{t('enterprise.audit.date')}: <span className="text-white">{report.date}</span></span>
                      <span className="text-gray-300">{t('enterprise.audit.score')}: <span className="text-green-400 font-bold">{report.score}</span></span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-red-500/20 rounded-lg p-2">
                        <div className="text-red-400 font-bold">{report.findings.critical}</div>
                        <div className="text-gray-400 text-xs">{t('enterprise.audit.findings.critical')}</div>
                      </div>
                      <div className="bg-orange-500/20 rounded-lg p-2">
                        <div className="text-orange-400 font-bold">{report.findings.high}</div>
                        <div className="text-gray-400 text-xs">{t('enterprise.audit.findings.high')}</div>
                      </div>
                      <div className="bg-yellow-500/20 rounded-lg p-2">
                        <div className="text-yellow-400 font-bold">{report.findings.medium}</div>
                        <div className="text-gray-400 text-xs">{t('enterprise.audit.findings.medium')}</div>
                      </div>
                      <div className="bg-green-500/20 rounded-lg p-2">
                        <div className="text-green-400 font-bold">{report.findings.low}</div>
                        <div className="text-gray-400 text-xs">{t('enterprise.audit.findings.low')}</div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20"
                    >
                      <FaDownload /> {t('enterprise.audit.reports.download')}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">{t('enterprise.audit.certifications.title')}</h2>
          <p className="text-gray-400 text-center mb-12">{t('enterprise.audit.certifications.subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center hover:border-cyan-500/50 transition-all"
              >
                <FaCertificate className="text-4xl text-cyan-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">{cert.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{cert.description}</p>
                <div className="text-xs text-gray-500">
                  <div>{t('enterprise.audit.certifications.issuer')}: {cert.issuer}</div>
                  <div>{t('enterprise.audit.certifications.valid_until')}: {cert.validUntil}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">{t('enterprise.audit.features.title')}</h2>
          <p className="text-gray-400 text-center mb-12">{t('enterprise.audit.features.subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-2xl text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bug Bounty */}
      <section className="py-16 px-4 bg-black/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">{t('enterprise.audit.bounty.title')}</h2>
          <p className="text-gray-400 text-center mb-12">{t('enterprise.audit.bounty.subtitle')}</p>
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {bugBountyTiers.map((tier, index) => (
                <div key={index} className={`${tier.bgColor} rounded-xl p-4 flex items-center justify-between`}>
                  <span className={`${tier.color} font-semibold`}>{tier.severity}</span>
                  <span className="text-white font-bold">{tier.reward}</span>
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-gray-300 mb-6">
                {t('enterprise.audit.bounty.desc')}
              </p>
              <Link href="/community/bug-bounty">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto"
                >
                  <FaBug /> {t('enterprise.audit.bounty.learn_more')}
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-600/20 to-cyan-600/20 rounded-3xl border border-green-500/30 p-12"
          >
            <FaFileAlt className="text-5xl text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">{t('enterprise.audit.cta.title')}</h2>
            <p className="text-gray-300 mb-8">{t('enterprise.audit.cta.subtitle')}</p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-xl font-semibold"
              >
                {t('enterprise.audit.cta.button')}
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
    <EnhancedFooter />
  </div>
  );
}
