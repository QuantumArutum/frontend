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
  Globe
} from 'lucide-react';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '../../../components/EnhancedFooter';
import ParticlesBackground from '../../components/ParticlesBackground';

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
    border: 'rgba(255, 255, 255, 0.1)'
  }
};

export default function BlockchainPage() {
  const [activeTab, setActiveTab] = useState(0);

  const coreFeatures = [
    {
      icon: Shield,
      title: '后量子密码学',
      description: '采用NIST标准化的CRYSTALS-Dilithium和CRYSTALS-Kyber算法，提供抵御量子计算攻击的安全保障',
      details: ['Dilithium3数字签名', 'Kyber768密钥封装', 'NIST安全级别3'],
      color: colors.accent.green
    },
    {
      icon: Zap,
      title: '高性能共识',
      description: '创新的量子增强PoS共识机制，实现高吞吐量和低延迟的交易确认',
      details: ['10,000+ TPS', '3秒出块时间', '即时最终性'],
      color: colors.primary
    },
    {
      icon: Network,
      title: '分片架构',
      description: '动态分片技术实现水平扩展，支持大规模并行交易处理',
      details: ['动态分片', '跨分片通信', '线性扩展'],
      color: colors.accent.cyan
    },
    {
      icon: Database,
      title: '状态存储',
      description: '优化的Merkle Patricia Trie结构，高效存储和验证区块链状态',
      details: ['增量同步', '状态裁剪', '快照恢复'],
      color: colors.secondary
    }
  ];

  const architectureLayers = [
    {
      name: '应用层',
      description: 'DApp、智能合约、钱包接口',
      icon: Globe,
      items: ['Web3 API', 'JSON-RPC', 'WebSocket', 'GraphQL']
    },
    {
      name: '合约层',
      description: '量子虚拟机(QVM)执行环境',
      icon: Code,
      items: ['Solidity兼容', 'WASM支持', '量子安全库', '预编译合约']
    },
    {
      name: '共识层',
      description: '量子增强权益证明(QPoS)',
      icon: GitBranch,
      items: ['验证者选举', '区块提议', '最终性确认', '惩罚机制']
    },
    {
      name: '网络层',
      description: 'P2P通信和数据传输',
      icon: Network,
      items: ['Gossip协议', '节点发现', '消息广播', '分片路由']
    },
    {
      name: '数据层',
      description: '区块和状态存储',
      icon: Database,
      items: ['区块存储', '状态树', '交易池', '索引服务']
    },
    {
      name: '密码层',
      description: '后量子密码学原语',
      icon: Lock,
      items: ['Dilithium签名', 'Kyber加密', '哈希函数', '随机数生成']
    }
  ];

  const consensusSteps = [
    { step: 1, title: '验证者选举', desc: '基于质押权重和量子随机数选择区块提议者' },
    { step: 2, title: '区块提议', desc: '被选中的验证者打包交易并提议新区块' },
    { step: 3, title: '投票确认', desc: '其他验证者验证并投票确认区块有效性' },
    { step: 4, title: '最终确认', desc: '达到2/3多数票后区块获得最终性' }
  ];

  const specs = [
    { label: '出块时间', value: '3秒' },
    { label: '交易吞吐量', value: '10,000+ TPS' },
    { label: '最终确认', value: '6秒' },
    { label: '签名算法', value: 'Dilithium3' },
    { label: '加密算法', value: 'Kyber768' },
    { label: '哈希算法', value: 'SHA3-256' },
    { label: '地址长度', value: '32字节' },
    { label: '最大区块大小', value: '2MB' }
  ];

  return (
    <div className="min-h-screen bg-quantum-dark relative">
      <ParticlesBackground />
      <div className="relative z-10">
      <EnhancedNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: colors.secondary }} />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ background: colors.accent.cyan }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-2xl" style={{ background: `${colors.secondary}20`, border: `1px solid ${colors.secondary}40` }}>
                <Cpu className="w-12 h-12" style={{ color: colors.secondary }} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6" style={{ color: colors.text.primary }}>
              区块链
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent.cyan})` }}>
                核心架构
              </span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-10" style={{ color: colors.text.secondary }}>
              Quantaureum采用创新的量子安全区块链架构，结合后量子密码学和高性能共识机制，
              为下一代去中心化应用提供安全、可扩展的基础设施
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {specs.slice(0, 4).map((spec, i) => (
                <div key={i} className="px-6 py-3 rounded-xl" style={{ background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}>
                  <div className="text-2xl font-bold" style={{ color: colors.primary }}>{spec.value}</div>
                  <div className="text-sm" style={{ color: colors.text.muted }}>{spec.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>核心技术特性</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
              融合量子安全与高性能的下一代区块链技术
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
                style={{ background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl shrink-0" style={{ background: `${feature.color}20` }}>
                    <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2" style={{ color: colors.text.primary }}>{feature.title}</h3>
                    <p className="mb-4" style={{ color: colors.text.secondary }}>{feature.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {feature.details.map((detail, i) => (
                        <span key={i} className="px-3 py-1 rounded-full text-sm" style={{ background: `${feature.color}15`, color: feature.color }}>
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
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>分层架构</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
              模块化设计，每一层专注于特定功能
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
                style={{ background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg" style={{ background: `${colors.secondary}20` }}>
                    <layer.icon className="w-6 h-6" style={{ color: colors.secondary }} />
                  </div>
                  <div>
                    <h3 className="font-bold" style={{ color: colors.text.primary }}>{layer.name}</h3>
                    <p className="text-sm" style={{ color: colors.text.muted }}>{layer.description}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {layer.items.map((item, i) => (
                    <span key={i} className="px-2 py-1 rounded text-xs" style={{ background: colors.glass.medium, color: colors.text.secondary }}>
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
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>共识机制</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
              量子增强权益证明(QPoS)共识流程
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
                style={{ background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center text-xl font-bold" 
                  style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent.cyan})`, color: colors.text.primary }}>
                  {item.step}
                </div>
                <h3 className="font-bold mb-2" style={{ color: colors.text.primary }}>{item.title}</h3>
                <p className="text-sm" style={{ color: colors.text.secondary }}>{item.desc}</p>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6" style={{ color: colors.text.muted }} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="py-20 bg-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>技术规格</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {specs.map((spec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl text-center"
                style={{ background: colors.glass.light, border: `1px solid ${colors.glass.border}` }}
              >
                <div className="text-lg font-bold mb-1" style={{ color: colors.primary }}>{spec.value}</div>
                <div className="text-sm" style={{ color: colors.text.muted }}>{spec.label}</div>
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
            style={{ background: `linear-gradient(135deg, ${colors.secondary}20, ${colors.accent.cyan}20)`, border: `1px solid ${colors.glass.border}` }}
          >
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text.primary }}>开始构建</h2>
            <p className="text-lg mb-8" style={{ color: colors.text.secondary }}>
              探索Quantaureum的技术文档，开始构建量子安全的去中心化应用
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/developers/docs" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${colors.secondary}, ${colors.accent.cyan})`, color: colors.text.primary }}>
                查看文档 <ArrowRight className="w-5 h-5" />
              </a>
              <a href="/developers/sdk" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{ background: colors.glass.medium, border: `1px solid ${colors.glass.border}`, color: colors.text.primary }}>
                下载SDK
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

