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

export default function ApplicationsPage() {
  const bridgeFeatures = [
    {
      icon: Shield,
      title: '量子安全跨链',
      description: '采用后量子密码学保护跨链资产转移，确保在量子计算时代的安全性',
      color: colors.accent.green
    },
    {
      icon: Zap,
      title: '快速确认',
      description: '优化的跨链协议，实现分钟级资产转移确认',
      color: colors.primary
    },
    {
      icon: Lock,
      title: '多重验证',
      description: '分布式验证节点网络，确保跨链交易的安全性和可靠性',
      color: colors.accent.cyan
    },
    {
      icon: Globe,
      title: '多链支持',
      description: '支持Ethereum、BSC、Polygon等主流区块链网络',
      color: colors.secondary
    }
  ];

  const supportedChains = [
    { name: 'Ethereum', symbol: 'ETH', status: '已上线' },
    { name: 'BNB Chain', symbol: 'BNB', status: '已上线' },
    { name: 'Polygon', symbol: 'MATIC', status: '已上线' },
    { name: 'Arbitrum', symbol: 'ARB', status: '开发中' },
    { name: 'Optimism', symbol: 'OP', status: '开发中' },
    { name: 'Avalanche', symbol: 'AVAX', status: '计划中' }
  ];

  const enterpriseSolutions = [
    {
      icon: Building2,
      title: '企业级区块链',
      description: '为企业提供私有链和联盟链解决方案，满足合规和隐私需求',
      features: ['私有部署', '权限管理', '合规审计', '数据隐私']
    },
    {
      icon: FileCheck,
      title: '供应链追溯',
      description: '基于区块链的供应链管理系统，实现产品全生命周期追溯',
      features: ['产品溯源', '防伪验证', '物流追踪', '质量管理']
    },
    {
      icon: Wallet,
      title: '数字资产管理',
      description: '企业级数字资产托管和管理平台，支持多签和冷存储',
      features: ['多签钱包', '冷热分离', '审批流程', '报表分析']
    },
    {
      icon: Users,
      title: '身份认证',
      description: '去中心化身份(DID)解决方案，实现安全的身份验证',
      features: ['DID标准', '可验证凭证', '隐私保护', '跨平台']
    }
  ];

  const useCases = [
    {
      industry: '金融服务',
      icon: TrendingUp,
      cases: ['跨境支付', '资产代币化', '清算结算', 'DeFi协议'],
      color: colors.primary
    },
    {
      industry: '供应链',
      icon: Network,
      cases: ['产品追溯', '物流管理', '库存优化', '供应商管理'],
      color: colors.accent.cyan
    },
    {
      industry: '医疗健康',
      icon: Shield,
      cases: ['病历管理', '药品溯源', '临床试验', '保险理赔'],
      color: colors.accent.green
    },
    {
      industry: '政务服务',
      icon: Building2,
      cases: ['电子政务', '数字身份', '投票系统', '证照管理'],
      color: colors.secondary
    }
  ];

  const stats = [
    { label: '支持链数', value: '6+' },
    { label: '跨链交易', value: '100K+' },
    { label: '锁仓价值', value: '$50M+' },
    { label: '企业客户', value: '50+' }
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
              跨链桥接 &
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${colors.accent.cyan}, ${colors.secondary})` }}>
                {' '}企业解决方案
              </span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-10" style={{ color: colors.text.secondary }}>
              量子安全的跨链资产桥接服务，以及面向企业的区块链解决方案，
              助力企业实现数字化转型
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>量子安全跨链桥</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
              安全、快速、可靠的跨链资产转移解决方案
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
            <h3 className="text-xl font-bold mb-6 text-center" style={{ color: colors.text.primary }}>支持的区块链网络</h3>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>企业解决方案</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
              为企业量身定制的区块链解决方案，助力数字化转型
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>行业应用场景</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
              覆盖多个行业的区块链应用解决方案
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
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text.primary }}>开始使用</h2>
            <p className="text-lg mb-8" style={{ color: colors.text.secondary }}>
              体验量子安全的跨链桥接服务，或联系我们了解企业解决方案
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/wallet" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${colors.accent.cyan}, ${colors.secondary})`, color: colors.text.primary }}>
                启动跨链桥 <ArrowLeftRight className="w-5 h-5" />
              </a>
              <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{ background: colors.glass.medium, border: `1px solid ${colors.glass.border}`, color: colors.text.primary }}>
                联系我们 <ArrowRight className="w-5 h-5" />
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
