'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeftRight, 
  Shield, 
  Zap, 
  Globe,
  Building2,
  Wallet,
  FileCheck,
  Users,
  TrendingUp,
  Lock,
  Network,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '../components/EnhancedFooter';
import ParticlesBackground from '../components/ParticlesBackground';
import { colors } from '@/styles/design-tokens';
import { useTranslation } from 'react-i18next';
import '../../i18n';

export default function ApplicationsPage() {
  const { t } = useTranslation();
  
  const bridgeFeatures = [
    {
      icon: Shield,
      title: t('applications_page.bridge.features.quantum_secure.title'),
      description: t('applications_page.bridge.features.quantum_secure.description'),
      color: colors.accent.green
    },
    {
      icon: Zap,
      title: t('applications_page.bridge.features.fast_confirm.title'),
      description: t('applications_page.bridge.features.fast_confirm.description'),
      color: colors.primary
    },
    {
      icon: Lock,
      title: t('applications_page.bridge.features.multi_verify.title'),
      description: t('applications_page.bridge.features.multi_verify.description'),
      color: colors.accent.cyan
    },
    {
      icon: Globe,
      title: t('applications_page.bridge.features.multi_chain.title'),
      description: t('applications_page.bridge.features.multi_chain.description'),
      color: colors.secondary
    }
  ];

  const supportedChains = [
    { name: 'Ethereum', symbol: 'ETH', status: t('applications_page.status.online') },
    { name: 'BNB Chain', symbol: 'BNB', status: t('applications_page.status.online') },
    { name: 'Polygon', symbol: 'MATIC', status: t('applications_page.status.online') },
    { name: 'Arbitrum', symbol: 'ARB', status: t('applications_page.status.developing') },
    { name: 'Optimism', symbol: 'OP', status: t('applications_page.status.developing') },
    { name: 'Avalanche', symbol: 'AVAX', status: t('applications_page.status.planned') }
  ];

  const enterpriseSolutions = [
    {
      icon: Building2,
      title: t('applications_page.enterprise.blockchain.title'),
      description: t('applications_page.enterprise.blockchain.description'),
      features: [
        t('applications_page.enterprise.blockchain.features.private'),
        t('applications_page.enterprise.blockchain.features.permission'),
        t('applications_page.enterprise.blockchain.features.audit'),
        t('applications_page.enterprise.blockchain.features.privacy')
      ]
    },
    {
      icon: FileCheck,
      title: t('applications_page.enterprise.supply_chain.title'),
      description: t('applications_page.enterprise.supply_chain.description'),
      features: [
        t('applications_page.enterprise.supply_chain.features.tracing'),
        t('applications_page.enterprise.supply_chain.features.anti_fake'),
        t('applications_page.enterprise.supply_chain.features.logistics'),
        t('applications_page.enterprise.supply_chain.features.quality')
      ]
    },
    {
      icon: Wallet,
      title: t('applications_page.enterprise.asset_mgmt.title'),
      description: t('applications_page.enterprise.asset_mgmt.description'),
      features: [
        t('applications_page.enterprise.asset_mgmt.features.multi_sig'),
        t('applications_page.enterprise.asset_mgmt.features.cold_hot'),
        t('applications_page.enterprise.asset_mgmt.features.approval'),
        t('applications_page.enterprise.asset_mgmt.features.reports')
      ]
    },
    {
      icon: Users,
      title: t('applications_page.enterprise.identity.title'),
      description: t('applications_page.enterprise.identity.description'),
      features: [
        t('applications_page.enterprise.identity.features.did'),
        t('applications_page.enterprise.identity.features.credentials'),
        t('applications_page.enterprise.identity.features.privacy'),
        t('applications_page.enterprise.identity.features.cross_platform')
      ]
    }
  ];

  const useCases = [
    {
      industry: t('applications_page.use_cases.finance.title'),
      icon: TrendingUp,
      cases: [
        t('applications_page.use_cases.finance.cases.cross_border'),
        t('applications_page.use_cases.finance.cases.tokenization'),
        t('applications_page.use_cases.finance.cases.settlement'),
        t('applications_page.use_cases.finance.cases.defi')
      ],
      color: colors.primary
    },
    {
      industry: t('applications_page.use_cases.supply_chain.title'),
      icon: Network,
      cases: [
        t('applications_page.use_cases.supply_chain.cases.tracing'),
        t('applications_page.use_cases.supply_chain.cases.logistics'),
        t('applications_page.use_cases.supply_chain.cases.inventory'),
        t('applications_page.use_cases.supply_chain.cases.supplier')
      ],
      color: colors.accent.cyan
    },
    {
      industry: t('applications_page.use_cases.healthcare.title'),
      icon: Shield,
      cases: [
        t('applications_page.use_cases.healthcare.cases.records'),
        t('applications_page.use_cases.healthcare.cases.drug_trace'),
        t('applications_page.use_cases.healthcare.cases.clinical'),
        t('applications_page.use_cases.healthcare.cases.insurance')
      ],
      color: colors.accent.green
    },
    {
      industry: t('applications_page.use_cases.government.title'),
      icon: Building2,
      cases: [
        t('applications_page.use_cases.government.cases.e_gov'),
        t('applications_page.use_cases.government.cases.digital_id'),
        t('applications_page.use_cases.government.cases.voting'),
        t('applications_page.use_cases.government.cases.certificates')
      ],
      color: colors.secondary
    }
  ];

  const stats = [
    { label: t('applications_page.stats.chains'), value: '6+' },
    { label: t('applications_page.stats.transactions'), value: '100K+' },
    { label: t('applications_page.stats.tvl'), value: '$50M+' },
    { label: t('applications_page.stats.enterprise_clients'), value: '50+' }
  ];

  return (
    <div className="min-h-screen bg-quantum-dark relative">
      <ParticlesBackground />
      <div className="relative z-10">
        <EnhancedNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: colors.accent.cyan }} />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: colors.secondary }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-2xl" style={{ background: `${colors.accent.cyan}20`, border: `1px solid ${colors.accent.cyan}40` }}>
                <ArrowLeftRight className="w-12 h-12" style={{ color: colors.accent.cyan }} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: colors.text.primary }}>
              {t('applications_page.hero.title')}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${colors.accent.cyan}, ${colors.secondary})` }}>
                {' '}{t('applications_page.hero.title_highlight')}
              </span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-10" style={{ color: colors.text.secondary }}>
              {t('applications_page.hero.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="px-6 py-3 rounded-xl" style={{ background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}>
                  <div className="text-2xl font-bold" style={{ color: colors.accent.cyan }}>{stat.value}</div>
                  <div className="text-sm" style={{ color: colors.text.muted }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cross-Chain Bridge */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>{t('applications_page.bridge.title')}</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
              {t('applications_page.bridge.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {bridgeFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1"
                style={{ background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: `${feature.color}20` }}>
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <h3 className="font-bold mb-2" style={{ color: colors.text.primary }}>{feature.title}</h3>
                <p className="text-sm" style={{ color: colors.text.secondary }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Supported Chains */}
          <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }}
            className="p-8 rounded-2xl"
            style={{ background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}
          >
            <h3 className="text-xl font-bold mb-6 text-center" style={{ color: colors.text.primary }}>{t('applications_page.bridge.supported_chains')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {supportedChains.map((chain, index) => (
                <div key={index} className="p-4 rounded-xl text-center" style={{ background: colors.glass.medium }}>
                  <div className="font-bold mb-1" style={{ color: colors.text.primary }}>{chain.name}</div>
                  <div className="text-sm mb-2" style={{ color: colors.text.muted }}>{chain.symbol}</div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    chain.status === '已上线' ? 'bg-green-500/20 text-green-400' :
                    chain.status === '开发中' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {chain.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enterprise Solutions */}
      <section className="py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>{t('applications_page.enterprise.title')}</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
              {t('applications_page.enterprise.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {enterpriseSolutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl shrink-0" style={{ background: `${colors.secondary}20` }}>
                    <solution.icon className="w-8 h-8" style={{ color: colors.secondary }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: colors.text.primary }}>{solution.title}</h3>
                    <p className="mb-4" style={{ color: colors.text.secondary }}>{solution.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {solution.features.map((feature, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-sm" style={{ background: colors.glass.medium, color: colors.text.muted }}>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>{t('applications_page.use_cases.title')}</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
              {t('applications_page.use_cases.description')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl"
                style={{ background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}
              >
                <div className="w-12 h-12 mb-4 rounded-xl flex items-center justify-center" style={{ background: `${useCase.color}20` }}>
                  <useCase.icon className="w-6 h-6" style={{ color: useCase.color }} />
                </div>
                <h3 className="font-bold mb-4" style={{ color: colors.text.primary }}>{useCase.industry}</h3>
                <ul className="space-y-2">
                  {useCase.cases.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm" style={{ color: colors.text.secondary }}>
                      <CheckCircle className="w-4 h-4" style={{ color: useCase.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-10 rounded-3xl"
            style={{ background: `linear-gradient(135deg, ${colors.accent.cyan}20, ${colors.secondary}20)`, border: `1px solid ${colors.glass.border}` }}
          >
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text.primary }}>{t('applications_page.cta.title')}</h2>
            <p className="text-lg mb-8" style={{ color: colors.text.secondary }}>
              {t('applications_page.cta.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/wallet" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${colors.accent.cyan}, ${colors.secondary})`, color: colors.text.primary }}>
                {t('applications_page.cta.launch_bridge')} <ArrowLeftRight className="w-5 h-5" />
              </a>
              <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{ background: colors.glass.medium, border: `1px solid ${colors.glass.border}`, color: colors.text.primary }}>
                {t('applications_page.cta.contact_us')} <ArrowRight className="w-5 h-5" />
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
