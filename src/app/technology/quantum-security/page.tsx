'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Key, 
  FileCheck,
  AlertTriangle,
  CheckCircle,
  Cpu,
  Fingerprint,
  Eye,
  Server,
  Code,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import ParticlesBackground from '../../components/ParticlesBackground';
import { colors, typography, shadows } from '@/styles/design-tokens';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

export default function QuantumSecurityPage() {
  const { t } = useTranslation();

  const securityFeatures = [
    {
      icon: Key,
      title: 'CRYSTALS-Dilithium',
      description: t('technology.quantum_security.algorithms.dilithium.desc'),
      specs: t('technology.quantum_security.algorithms.dilithium.specs', { returnObjects: true }) as string[],
      color: colors.accent.green
    },
    {
      icon: Lock,
      title: 'CRYSTALS-Kyber',
      description: t('technology.quantum_security.algorithms.kyber.desc'),
      specs: t('technology.quantum_security.algorithms.kyber.specs', { returnObjects: true }) as string[],
      color: colors.accent.cyan
    },
    {
      icon: Fingerprint,
      title: 'SHA3-256',
      description: t('technology.quantum_security.algorithms.sha3.desc'),
      specs: t('technology.quantum_security.algorithms.sha3.specs', { returnObjects: true }) as string[],
      color: colors.secondary
    },
    {
      icon: Cpu,
      title: t('technology.quantum_security.algorithms.qrng.title'),
      description: t('technology.quantum_security.algorithms.qrng.desc'),
      specs: t('technology.quantum_security.algorithms.qrng.specs', { returnObjects: true }) as string[],
      color: colors.primary
    }
  ];

  const auditProcess = [
    { step: 1, title: t('technology.quantum_security.audit.steps.review.title'), desc: t('technology.quantum_security.audit.steps.review.desc'), icon: Code },
    { step: 2, title: t('technology.quantum_security.audit.steps.scan.title'), desc: t('technology.quantum_security.audit.steps.scan.desc'), icon: Eye },
    { step: 3, title: t('technology.quantum_security.audit.steps.verify.title'), desc: t('technology.quantum_security.audit.steps.verify.desc'), icon: FileCheck },
    { step: 4, title: t('technology.quantum_security.audit.steps.pentest.title'), desc: t('technology.quantum_security.audit.steps.pentest.desc'), icon: AlertTriangle },
    { step: 5, title: t('technology.quantum_security.audit.steps.report.title'), desc: t('technology.quantum_security.audit.steps.report.desc'), icon: CheckCircle }
  ];

  const vulnerabilityTypes = t('technology.quantum_security.vulnerabilities.items', { returnObjects: true }) as Array<{ name: string; severity: string; description: string }>;

  const certifications = t('technology.quantum_security.certifications.items', { returnObjects: true }) as Array<{ name: string; desc: string; status: string }>;

  return (
    <div className="min-h-screen bg-quantum-dark relative">
      <ParticlesBackground />
      <div className="relative z-10">
      <EnhancedNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: colors.accent.green }} />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: colors.secondary }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-2xl" style={{ background: `${colors.accent.green}20`, border: `1px solid ${colors.accent.green}40` }}>
                <Shield className="w-12 h-12" style={{ color: colors.accent.green }} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: colors.text.primary }}>
              {t('technology.quantum_security.title')}
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-10" style={{ color: colors.text.secondary }}>
              {t('technology.quantum_security.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ background: `${colors.accent.green}20`, color: colors.accent.green, border: `1px solid ${colors.accent.green}40` }}>
                <CheckCircle className="w-4 h-4 inline mr-2" />{t('technology.quantum_security.badges.nist')}
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ background: `${colors.accent.cyan}20`, color: colors.accent.cyan, border: `1px solid ${colors.accent.cyan}40` }}>
                <Shield className="w-4 h-4 inline mr-2" />{t('technology.quantum_security.badges.quantum_resistant')}
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ background: `${colors.secondary}20`, color: colors.secondary, border: `1px solid ${colors.secondary}40` }}>
                <FileCheck className="w-4 h-4 inline mr-2" />{t('technology.quantum_security.badges.audit')}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Post-Quantum Cryptography */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>{t('technology.quantum_security.pqc.title')}</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
              {t('technology.quantum_security.pqc.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl shrink-0" style={{ background: `${feature.color}20` }}>
                    <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: colors.text.primary }}>{feature.title}</h3>
                    <p className="mb-4" style={{ color: colors.text.secondary }}>{feature.description}</p>
                    <div className="space-y-1">
                      {feature.specs.map((spec, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm" style={{ color: colors.text.muted }}>
                          <CheckCircle className="w-4 h-4" style={{ color: feature.color }} />
                          {spec}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Audit Process */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>{t('technology.quantum_security.audit.title')}</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
              {t('technology.quantum_security.audit.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {auditProcess.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative p-6 rounded-2xl text-center"
                style={{ background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent.cyan})` }}>
                  <item.icon className="w-6 h-6" style={{ color: colors.text.primary }} />
                </div>
                <div className="text-xs font-medium mb-2" style={{ color: colors.accent.cyan }}>{t('technology.quantum_security.audit.step')} {item.step}</div>
                <h3 className="font-bold mb-2" style={{ color: colors.text.primary }}>{item.title}</h3>
                <p className="text-sm" style={{ color: colors.text.secondary }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vulnerability Detection */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>{t('technology.quantum_security.vulnerabilities.title')}</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
              {t('technology.quantum_security.vulnerabilities.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vulnerabilityTypes.map((vuln, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 rounded-xl"
                style={{ background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold" style={{ color: colors.text.primary }}>{vuln.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    vuln.severity === t('technology.quantum_security.severity.high') ? 'bg-red-500/20 text-red-400' :
                    vuln.severity === t('technology.quantum_security.severity.medium') ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {vuln.severity}
                  </span>
                </div>
                <p className="text-sm" style={{ color: colors.text.secondary }}>{vuln.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-20 bg-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>{t('technology.quantum_security.certifications.title')}</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-xl flex items-center justify-between"
                style={{ background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}
              >
                <div>
                  <h3 className="font-bold mb-1" style={{ color: colors.text.primary }}>{cert.name}</h3>
                  <p className="text-sm" style={{ color: colors.text.secondary }}>{cert.desc}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  cert.status === t('technology.quantum_security.status.certified') ? 'bg-green-500/20 text-green-400' :
                  cert.status === t('technology.quantum_security.status.in_progress') ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {cert.status}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-10 rounded-3xl"
            style={{ background: `linear-gradient(135deg, ${colors.accent.green}20, ${colors.accent.cyan}20)`, border: `1px solid ${colors.glass.border}` }}
          >
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text.primary }}>{t('technology.quantum_security.cta.title')}</h2>
            <p className="text-lg mb-8" style={{ color: colors.text.secondary }}>
              {t('technology.quantum_security.cta.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${colors.accent.green}, ${colors.accent.cyan})`, color: colors.text.primary }}>
                {t('technology.quantum_security.cta.apply')} <ArrowRight className="w-5 h-5" />
              </a>
              <a href="/developers/docs" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{ background: colors.glass.medium, border: `1px solid ${colors.glass.border}`, color: colors.text.primary }}>
                {t('technology.quantum_security.cta.docs')} <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <EnhancedFooter />
      </div>
    </div>
  );
}

