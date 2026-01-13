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

export default function QuantumSecurityPage() {
  const securityFeatures = [
    {
      icon: Key,
      title: 'CRYSTALS-Dilithium',
      description: 'NIST标准化的后量子数字签名算法，提供安全级别3的签名保护',
      specs: ['签名大小: 2420字节', '公钥大小: 1312字节', '安全级别: NIST L3'],
      color: colors.accent.green
    },
    {
      icon: Lock,
      title: 'CRYSTALS-Kyber',
      description: '基于格的密钥封装机制，用于安全的密钥交换和加密通信',
      specs: ['密文大小: 1088字节', '共享密钥: 32字节', '安全级别: NIST L3'],
      color: colors.accent.cyan
    },
    {
      icon: Fingerprint,
      title: 'SHA3-256哈希',
      description: 'Keccak系列哈希函数，提供抗量子的哈希安全性',
      specs: ['输出长度: 256位', '抗碰撞性', '抗原像攻击'],
      color: colors.secondary
    },
    {
      icon: Cpu,
      title: '量子随机数',
      description: '基于量子物理原理的真随机数生成，用于密钥生成和共识选举',
      specs: ['真随机性', '不可预测', '高熵值'],
      color: colors.primary
    }
  ];

  const auditProcess = [
    { step: 1, title: '代码审查', desc: '专业安全团队对智能合约源代码进行逐行审查', icon: Code },
    { step: 2, title: '自动化扫描', desc: '使用多种静态分析工具检测已知漏洞模式', icon: Eye },
    { step: 3, title: '形式化验证', desc: '数学证明合约逻辑的正确性和安全性', icon: FileCheck },
    { step: 4, title: '渗透测试', desc: '模拟攻击场景测试合约的实际安全性', icon: AlertTriangle },
    { step: 5, title: '报告生成', desc: '生成详细的审计报告和修复建议', icon: CheckCircle }
  ];

  const vulnerabilityTypes = [
    { name: '重入攻击', severity: '高危', description: '检测并防止递归调用漏洞' },
    { name: '整数溢出', severity: '高危', description: '安全的数学运算库保护' },
    { name: '访问控制', severity: '中危', description: '严格的权限验证机制' },
    { name: '时间依赖', severity: '中危', description: '避免区块时间戳操纵' },
    { name: '前端运行', severity: '中危', description: '交易排序保护机制' },
    { name: 'Gas限制', severity: '低危', description: '防止DoS攻击的Gas优化' }
  ];

  const certifications = [
    { name: 'NIST PQC', desc: '后量子密码学标准认证', status: '已认证' },
    { name: 'SOC 2 Type II', desc: '安全运营合规认证', status: '已认证' },
    { name: 'ISO 27001', desc: '信息安全管理体系', status: '进行中' },
    { name: 'FIPS 140-3', desc: '密码模块安全标准', status: '计划中' }
  ];

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
              量子安全 &
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${colors.accent.green}, ${colors.accent.cyan})` }}>
                {' '}安全审计
              </span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-10" style={{ color: colors.text.secondary }}>
              采用NIST标准化的后量子密码学算法，结合专业的智能合约安全审计服务，
              为您的数字资产提供面向未来的全方位安全保护
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ background: `${colors.accent.green}20`, color: colors.accent.green, border: `1px solid ${colors.accent.green}40` }}>
                <CheckCircle className="w-4 h-4 inline mr-2" />NIST L3 安全级别
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ background: `${colors.accent.cyan}20`, color: colors.accent.cyan, border: `1px solid ${colors.accent.cyan}40` }}>
                <Shield className="w-4 h-4 inline mr-2" />抗量子计算攻击
              </span>
              <span className="px-4 py-2 rounded-full text-sm font-medium" style={{ background: `${colors.secondary}20`, color: colors.secondary, border: `1px solid ${colors.secondary}40` }}>
                <FileCheck className="w-4 h-4 inline mr-2" />专业安全审计
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Post-Quantum Cryptography */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>后量子密码学</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
              采用经过NIST标准化认证的后量子密码学算法，确保在量子计算时代的安全性
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>智能合约安全审计</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
              专业的五步审计流程，全面保障智能合约安全
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
                <div className="text-xs font-medium mb-2" style={{ color: colors.accent.cyan }}>步骤 {item.step}</div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>漏洞检测覆盖</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: colors.text.secondary }}>
              全面检测智能合约中的常见安全漏洞
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
                    vuln.severity === '高危' ? 'bg-red-500/20 text-red-400' :
                    vuln.severity === '中危' ? 'bg-yellow-500/20 text-yellow-400' :
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.text.primary }}>安全认证</h2>
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
                  cert.status === '已认证' ? 'bg-green-500/20 text-green-400' :
                  cert.status === '进行中' ? 'bg-yellow-500/20 text-yellow-400' :
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
            <h2 className="text-3xl font-bold mb-4" style={{ color: colors.text.primary }}>申请安全审计</h2>
            <p className="text-lg mb-8" style={{ color: colors.text.secondary }}>
              为您的智能合约提供专业的安全审计服务，确保代码安全可靠
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{ background: `linear-gradient(135deg, ${colors.accent.green}, ${colors.accent.cyan})`, color: colors.text.primary }}>
                申请审计 <ArrowRight className="w-5 h-5" />
              </a>
              <a href="/developers/docs" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
                style={{ background: colors.glass.medium, border: `1px solid ${colors.glass.border}`, color: colors.text.primary }}>
                安全文档 <ExternalLink className="w-5 h-5" />
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

