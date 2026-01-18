'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  Shield,
  Zap,
  Network,
  Lock,
  Database,
  GitBranch,
  Layers,
  Clock,
  CheckCircle,
  ArrowRight,
  Code,
  Server,
  Globe,
} from 'lucide-react';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '../../../components/EnhancedFooter';
import ParticlesBackground from '../../components/ParticlesBackground';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

const colors = {
  primary: '#F59E0B',
  secondary: '#8B5CF6',
  accent: { cyan: '#06B6D4', green: '#10B981' },
  background: { primary: '#0F172A', secondary: '#1E293B' },
  text: { primary: '#F8FAFC', secondary: '#CBD5E1', muted: '#64748B' },
  border: '#334155',
  glass: {
    light: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.1)',
    border: 'rgba(255, 255, 255, 0.1)',
  },
};

export default function BlockchainPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const coreFeatures = [
    {
      icon: Shield,
      title: t('technology.quantum_security.algorithms.dilithium.name'),
      description: t('technology.quantum_security.algorithms.dilithium.desc'),
      details: ['Dilithium3', 'Kyber768', 'NIST Level 3'],
      color: colors.accent.green,
    },
    {
      icon: Zap,
      title: t('technology.blockchain.consensus.title'),
      description: t('technology.blockchain.consensus.desc'),
      details: t('technology.blockchain.consensus.features', { returnObjects: true }) as string[],
      color: colors.primary,
    },
    {
      icon: Network,
      title: t('technology.blockchain.architecture.title'),
      description: t('technology.blockchain.architecture.desc'),
      details: ['Dynamic Sharding', 'Cross-shard', 'Linear Scaling'],
      color: colors.accent.cyan,
    },
    {
      icon: Database,
      title: t('technology.quantum_security.protection.storage'),
      description:
        'Optimized Merkle Patricia Trie structure for efficient blockchain state storage and verification',
      details: ['Incremental Sync', 'State Pruning', 'Snapshot Recovery'],
      color: colors.secondary,
    },
  ];

  const architectureLayers = [
    {
      name: 'Application Layer',
      description: 'DApp, Smart Contracts, Wallet Interface',
      icon: Globe,
      items: ['Web3 API', 'JSON-RPC', 'WebSocket', 'GraphQL'],
    },
    {
      name: 'Contract Layer',
      description: 'Quantum Virtual Machine (QVM)',
      icon: Code,
      items: ['Solidity Compatible', 'WASM Support', 'Quantum Safe Lib', 'Precompiled'],
    },
    {
      name: 'Consensus Layer',
      description: 'Quantum Enhanced Proof of Stake (QPoS)',
      icon: GitBranch,
      items: ['Validator Election', 'Block Proposal', 'Finality', 'Slashing'],
    },
    {
      name: 'Network Layer',
      description: 'P2P Communication',
      icon: Network,
      items: ['Gossip Protocol', 'Node Discovery', 'Message Broadcast', 'Shard Routing'],
    },
    {
      name: 'Data Layer',
      description: 'Block and State Storage',
      icon: Database,
      items: ['Block Storage', 'State Tree', 'TX Pool', 'Index Service'],
    },
    {
      name: 'Crypto Layer',
      description: 'Post-Quantum Cryptographic Primitives',
      icon: Lock,
      items: ['Dilithium Sig', 'Kyber Enc', 'Hash Functions', 'RNG'],
    },
  ];

  const consensusSteps = [
    {
      step: 1,
      title: 'Validator Election',
      desc: 'Select block proposer based on stake weight and quantum random number',
    },
    {
      step: 2,
      title: 'Block Proposal',
      desc: 'Selected validator packages transactions and proposes new block',
    },
    {
      step: 3,
      title: 'Vote Confirmation',
      desc: 'Other validators verify and vote to confirm block validity',
    },
    {
      step: 4,
      title: 'Final Confirmation',
      desc: 'Block achieves finality after reaching 2/3 majority votes',
    },
  ];

  const specs = [
    { label: 'Block Time', value: '3s' },
    { label: 'TPS', value: t('technology.blockchain.performance.tps') },
    { label: 'Finality', value: t('technology.blockchain.performance.finality') },
    { label: 'Signature', value: 'Dilithium3' },
    { label: 'Encryption', value: 'Kyber768' },
    { label: 'Hash', value: 'SHA3-256' },
    { label: 'Address', value: '32 bytes' },
    { label: 'Max Block', value: '2MB' },
  ];

  return (
    <div className="min-h-screen bg-quantum-dark relative">
      <ParticlesBackground />
      <div className="relative z-10">
        <EnhancedNavbar />

        {/* Hero Section */}
        <section className="relative pt-24 pb-20 overflow-hidden">
          <div className="absolute inset-0">
            <div
              className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20"
              style={{ background: colors.secondary }}
            />
            <div
              className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20"
              style={{ background: colors.accent.cyan }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="flex justify-center mb-8">
                <div
                  className="p-4 rounded-2xl"
                  style={{
                    background: `${colors.secondary}20`,
                    border: `1px solid ${colors.secondary}40`,
                  }}
                >
                  <Cpu className="w-12 h-12" style={{ color: colors.secondary }} />
                </div>
              </div>
              <h1
                className="text-4xl md:text-6xl font-bold mb-6"
                style={{ color: colors.text.primary }}
              >
                {t('technology.blockchain.title')}
              </h1>
              <p
                className="text-xl max-w-3xl mx-auto mb-10"
                style={{ color: colors.text.secondary }}
              >
                {t('technology.blockchain.subtitle')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {specs.slice(0, 4).map((spec, i) => (
                  <div
                    key={i}
                    className="px-6 py-3 rounded-xl"
                    style={{
                      background: colors.glass.light,
                      border: `1px solid ${colors.glass.border}`,
                    }}
                  >
                    <div className="text-2xl font-bold" style={{ color: colors.primary }}>
                      {spec.value}
                    </div>
                    <div className="text-sm" style={{ color: colors.text.muted }}>
                      {spec.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Core Features */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center mb-16"
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: colors.text.primary }}
              >
                {t('common.features')}
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
                {t('technology.blockchain.subtitle')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {coreFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-8 rounded-2xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: colors.glass.light,
                    border: `1px solid ${colors.glass.border}`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="p-3 rounded-xl shrink-0"
                      style={{ background: `${feature.color}20` }}
                    >
                      <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: colors.text.primary }}>
                        {feature.title}
                      </h3>
                      <p className="mb-4" style={{ color: colors.text.secondary }}>
                        {feature.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {feature.details.map((detail, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-full text-sm"
                            style={{ background: `${feature.color}15`, color: feature.color }}
                          >
                            {detail}
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

        {/* Architecture Layers */}
        <section className="py-20 bg-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center mb-16"
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: colors.text.primary }}
              >
                {t('technology.blockchain.architecture.title')}
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
                {t('technology.blockchain.architecture.desc')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {architectureLayers.map((layer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl"
                  style={{
                    background: colors.glass.light,
                    border: `1px solid ${colors.glass.border}`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg" style={{ background: `${colors.secondary}20` }}>
                      <layer.icon className="w-6 h-6" style={{ color: colors.secondary }} />
                    </div>
                    <div>
                      <h3 className="font-bold" style={{ color: colors.text.primary }}>
                        {layer.name}
                      </h3>
                      <p className="text-sm" style={{ color: colors.text.muted }}>
                        {layer.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {layer.items.map((item, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded text-xs"
                        style={{ background: colors.glass.medium, color: colors.text.secondary }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Consensus Mechanism */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center mb-16"
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: colors.text.primary }}
              >
                {t('technology.blockchain.consensus.title')}
              </h2>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
                {t('technology.blockchain.consensus.desc')}
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {consensusSteps.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 }}
                  className="relative p-6 rounded-2xl text-center"
                  style={{
                    background: colors.glass.light,
                    border: `1px solid ${colors.glass.border}`,
                  }}
                >
                  <div
                    className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center text-xl font-bold"
                    style={{
                      background: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent.cyan})`,
                      color: colors.text.primary,
                    }}
                  >
                    {item.step}
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: colors.text.primary }}>
                    {item.title}
                  </h3>
                  <p className="text-sm" style={{ color: colors.text.secondary }}>
                    {item.desc}
                  </p>
                  {index < 3 && (
                    <ArrowRight
                      className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6"
                      style={{ color: colors.text.muted }}
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Specs */}
        <section className="py-20 bg-white/5">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-center mb-12"
            >
              <h2
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: colors.text.primary }}
              >
                {t('technology.blockchain.performance.title')}
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {specs.map((spec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-xl text-center"
                  style={{
                    background: colors.glass.light,
                    border: `1px solid ${colors.glass.border}`,
                  }}
                >
                  <div className="text-lg font-bold mb-1" style={{ color: colors.primary }}>
                    {spec.value}
                  </div>
                  <div className="text-sm" style={{ color: colors.text.muted }}>
                    {spec.label}
                  </div>
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
              style={{
                background: `linear-gradient(135deg, ${colors.secondary}20, ${colors.accent.cyan}20)`,
                border: `1px solid ${colors.glass.border}`,
              }}
            >
              <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text.primary }}>
                {t('common.get_started')}
              </h2>
              <p className="text-lg mb-8" style={{ color: colors.text.secondary }}>
                {t('technology.blockchain.subtitle')}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/developers/docs"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent.cyan})`,
                    color: colors.text.primary,
                  }}
                >
                  {t('developers_sub.sdk.docs')} <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="/developers/sdk"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                  style={{
                    background: colors.glass.medium,
                    border: `1px solid ${colors.glass.border}`,
                    color: colors.text.primary,
                  }}
                >
                  {t('developers_sub.sdk.download')} SDK
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
