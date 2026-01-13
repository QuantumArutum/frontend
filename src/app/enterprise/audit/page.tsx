'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaCheckCircle, FaFileAlt, FaDownload, FaExternalLinkAlt, FaLock, FaBug, FaCode, FaUserShield, FaCertificate } from 'react-icons/fa';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '@/app/components/EnhancedFooter';
import ParticlesBackground from '@/app/components/ParticlesBackground';

const auditReports = [
  {
    title: '智能合约安全审计',
    auditor: 'CertiK',
    date: '2025-12-15',
    status: '通过',
    score: '98/100',
    findings: { critical: 0, high: 0, medium: 1, low: 3 },
    description: '对核心智能合约进行全面安全审计，包括代币合约、质押合约和治理合约',
    reportUrl: '#'
  },
  {
    title: '量子密码学实现审计',
    auditor: 'Trail of Bits',
    date: '2025-11-20',
    status: '通过',
    score: '99/100',
    findings: { critical: 0, high: 0, medium: 0, low: 2 },
    description: '对后量子密码算法实现进行深度审计，验证 CRYSTALS-Dilithium 和 Kyber 实现的正确性',
    reportUrl: '#'
  },
  {
    title: '共识机制安全审计',
    auditor: 'OpenZeppelin',
    date: '2025-10-10',
    status: '通过',
    score: '97/100',
    findings: { critical: 0, high: 0, medium: 2, low: 4 },
    description: '对 QPOS 共识机制进行安全审计，验证拜占庭容错能力和抗攻击性',
    reportUrl: '#'
  },
  {
    title: '网络协议安全审计',
    auditor: 'Halborn',
    date: '2025-09-05',
    status: '通过',
    score: '96/100',
    findings: { critical: 0, high: 0, medium: 1, low: 5 },
    description: '对 P2P 网络协议和 RPC 接口进行安全审计',
    reportUrl: '#'
  }
];

const certifications = [
  {
    name: 'SOC 2 Type II',
    issuer: 'AICPA',
    validUntil: '2026-06-30',
    description: '服务组织控制报告，验证安全性、可用性和保密性'
  },
  {
    name: 'ISO 27001',
    issuer: 'BSI',
    validUntil: '2026-12-31',
    description: '信息安全管理体系认证'
  },
  {
    name: 'GDPR 合规',
    issuer: 'TÜV',
    validUntil: '2026-03-31',
    description: '欧盟通用数据保护条例合规认证'
  },
  {
    name: 'PCI DSS Level 1',
    issuer: 'PCI SSC',
    validUntil: '2026-09-30',
    description: '支付卡行业数据安全标准最高级别认证'
  }
];

const securityFeatures = [
  {
    icon: FaLock,
    title: '后量子密码学',
    description: '采用 NIST 标准后量子算法，抵御量子计算攻击'
  },
  {
    icon: FaBug,
    title: '漏洞赏金计划',
    description: '持续运行的漏洞赏金计划，最高奖励 $100,000'
  },
  {
    icon: FaCode,
    title: '开源代码',
    description: '核心代码开源，接受社区审查和贡献'
  },
  {
    icon: FaUserShield,
    title: '多重签名',
    description: '关键操作需要多重签名授权'
  }
];

const bugBountyTiers = [
  { severity: '严重', reward: '$50,000 - $100,000', color: 'text-red-400', bgColor: 'bg-red-500/20' },
  { severity: '高危', reward: '$10,000 - $50,000', color: 'text-orange-400', bgColor: 'bg-orange-500/20' },
  { severity: '中危', reward: '$2,000 - $10,000', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
  { severity: '低危', reward: '$500 - $2,000', color: 'text-green-400', bgColor: 'bg-green-500/20' }
];

export default function EnterpriseAuditPage() {
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
              安全审计
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              透明的
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"> 安全审计 </span>
              报告
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              我们的代码经过多家顶级安全公司审计，确保最高级别的安全性
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-green-400">
                <FaCheckCircle className="text-xl" />
                <span>0 严重漏洞</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <FaCheckCircle className="text-xl" />
                <span>4 次独立审计</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <FaCheckCircle className="text-xl" />
                <span>100% 开源</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Audit Reports */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">审计报告</h2>
          <p className="text-gray-400 text-center mb-12">由全球顶级安全公司进行的独立审计</p>
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
                      <span className="text-gray-300">审计方: <span className="text-white font-medium">{report.auditor}</span></span>
                      <span className="text-gray-300">日期: <span className="text-white">{report.date}</span></span>
                      <span className="text-gray-300">评分: <span className="text-green-400 font-bold">{report.score}</span></span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-red-500/20 rounded-lg p-2">
                        <div className="text-red-400 font-bold">{report.findings.critical}</div>
                        <div className="text-gray-400 text-xs">严重</div>
                      </div>
                      <div className="bg-orange-500/20 rounded-lg p-2">
                        <div className="text-orange-400 font-bold">{report.findings.high}</div>
                        <div className="text-gray-400 text-xs">高危</div>
                      </div>
                      <div className="bg-yellow-500/20 rounded-lg p-2">
                        <div className="text-yellow-400 font-bold">{report.findings.medium}</div>
                        <div className="text-gray-400 text-xs">中危</div>
                      </div>
                      <div className="bg-green-500/20 rounded-lg p-2">
                        <div className="text-green-400 font-bold">{report.findings.low}</div>
                        <div className="text-gray-400 text-xs">低危</div>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20"
                    >
                      <FaDownload /> 下载报告
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
          <h2 className="text-3xl font-bold text-white text-center mb-4">合规认证</h2>
          <p className="text-gray-400 text-center mb-12">获得国际权威机构认证</p>
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
                  <div>颁发机构: {cert.issuer}</div>
                  <div>有效期至: {cert.validUntil}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">安全特性</h2>
          <p className="text-gray-400 text-center mb-12">多层次安全防护体系</p>
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
          <h2 className="text-3xl font-bold text-white text-center mb-4">漏洞赏金计划</h2>
          <p className="text-gray-400 text-center mb-12">发现漏洞，获得丰厚奖励</p>
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
                我们欢迎安全研究人员负责任地披露漏洞。所有有效报告都将获得奖励。
              </p>
              <Link href="/community/bug-bounty">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto"
                >
                  <FaBug /> 了解更多
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
            <h2 className="text-3xl font-bold text-white mb-4">需要定制安全审计？</h2>
            <p className="text-gray-300 mb-8">我们可以为您的企业部署提供专属安全审计服务</p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-xl font-semibold"
              >
                联系我们
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
