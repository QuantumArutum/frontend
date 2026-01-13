'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHandshake, FaRocket, FaGlobe, FaAward, FaChartLine, FaUsers, FaCheckCircle, FaArrowRight, FaBuilding, FaCode, FaShieldAlt } from 'react-icons/fa';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '@/app/components/EnhancedFooter';
import ParticlesBackground from '@/app/components/ParticlesBackground';

const partnerTypes = [
  {
    icon: FaBuilding,
    title: '技术合作伙伴',
    description: '与领先的技术公司合作，共同构建量子安全生态系统',
    benefits: ['技术集成支持', '联合解决方案开发', '共同市场推广', '技术培训认证'],
    examples: ['云服务提供商', '安全厂商', '系统集成商']
  },
  {
    icon: FaCode,
    title: '开发者合作伙伴',
    description: '为开发者提供工具和资源，构建创新应用',
    benefits: ['优先 API 访问', '技术支持优先级', '开发者社区曝光', '收益分成计划'],
    examples: ['独立开发者', '开发工作室', '技术咨询公司']
  },
  {
    icon: FaGlobe,
    title: '渠道合作伙伴',
    description: '拓展全球市场，共同服务企业客户',
    benefits: ['销售佣金', '市场营销支持', '销售培训', '专属客户经理'],
    examples: ['区域代理商', '行业解决方案商', '咨询公司']
  },
  {
    icon: FaShieldAlt,
    title: '安全合作伙伴',
    description: '共同提升区块链安全标准',
    benefits: ['安全审计合作', '漏洞赏金计划', '安全研究资助', '联合安全认证'],
    examples: ['安全审计公司', '密码学研究机构', '安全实验室']
  }
];

const featuredPartners = [
  { name: 'AWS', category: '云服务', logo: '☁️' },
  { name: 'Microsoft Azure', category: '云服务', logo: '🔷' },
  { name: 'Google Cloud', category: '云服务', logo: '🌐' },
  { name: 'Deloitte', category: '咨询', logo: '📊' },
  { name: 'PwC', category: '审计', logo: '📈' },
  { name: 'IBM', category: '技术', logo: '💻' },
  { name: 'Accenture', category: '咨询', logo: '🎯' },
  { name: 'KPMG', category: '审计', logo: '📋' }
];

const partnerBenefits = [
  {
    icon: FaRocket,
    title: '加速增长',
    description: '借助 Quantaureum 的技术和市场资源，加速业务增长'
  },
  {
    icon: FaChartLine,
    title: '收益分成',
    description: '通过推荐客户和联合销售获得丰厚的收益分成'
  },
  {
    icon: FaUsers,
    title: '专属支持',
    description: '获得专属的技术支持和客户成功团队服务'
  },
  {
    icon: FaAward,
    title: '品牌认证',
    description: '获得官方合作伙伴认证，提升市场信誉'
  }
];

const partnerLevels = [
  {
    level: '注册合作伙伴',
    color: 'from-gray-500 to-gray-600',
    requirements: ['完成合作伙伴注册', '签署合作协议'],
    benefits: ['合作伙伴门户访问', '基础培训资源', '市场营销素材']
  },
  {
    level: '银牌合作伙伴',
    color: 'from-gray-400 to-gray-500',
    requirements: ['年度销售额 $50K+', '2+ 认证工程师'],
    benefits: ['所有注册权益', '优先技术支持', '联合营销机会', '10% 销售佣金']
  },
  {
    level: '金牌合作伙伴',
    color: 'from-yellow-500 to-yellow-600',
    requirements: ['年度销售额 $200K+', '5+ 认证工程师'],
    benefits: ['所有银牌权益', '专属客户经理', '优先项目机会', '15% 销售佣金']
  },
  {
    level: '白金合作伙伴',
    color: 'from-purple-400 to-purple-600',
    requirements: ['年度销售额 $500K+', '10+ 认证工程师'],
    benefits: ['所有金牌权益', '战略合作规划', '联合产品开发', '20% 销售佣金']
  }
];

export default function EnterprisePartnersPage() {
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
            <span className="inline-block px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm mb-6">
              合作伙伴计划
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              携手共建
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> 量子安全 </span>
              生态
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              加入 Quantaureum 合作伙伴计划，共同开拓区块链市场新机遇
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold flex items-center gap-2"
                >
                  <FaHandshake /> 成为合作伙伴
                </motion.button>
              </Link>
              <Link href="/enterprise/solutions">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20"
                >
                  了解解决方案
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">合作伙伴类型</h2>
          <p className="text-gray-400 text-center mb-12">多种合作模式，满足不同业务需求</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partnerTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-blue-500/50 transition-all"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="text-2xl text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{type.title}</h3>
                      <p className="text-gray-400">{type.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">合作权益</h4>
                      <ul className="space-y-1">
                        {type.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-400 text-sm">
                            <FaCheckCircle className="text-green-400 text-xs" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">适合对象</h4>
                      <ul className="space-y-1">
                        {type.examples.map((example, idx) => (
                          <li key={idx} className="text-gray-400 text-sm">• {example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Partners */}
      <section className="py-16 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">合作伙伴</h2>
          <p className="text-gray-400 text-center mb-12">与全球领先企业携手合作</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredPartners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center hover:border-blue-500/50 transition-all"
              >
                <div className="text-4xl mb-3">{partner.logo}</div>
                <h3 className="text-white font-semibold">{partner.name}</h3>
                <p className="text-gray-400 text-sm">{partner.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Benefits */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">合作权益</h2>
          <p className="text-gray-400 text-center mb-12">成为合作伙伴，享受丰厚权益</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600/30 to-cyan-600/30 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-2xl text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner Levels */}
      <section className="py-16 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">合作伙伴等级</h2>
          <p className="text-gray-400 text-center mb-12">根据业绩提升等级，获得更多权益</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerLevels.map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${level.color} p-4 text-center`}>
                  <h3 className="text-lg font-bold text-white">{level.level}</h3>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">要求</h4>
                    <ul className="space-y-1">
                      {level.requirements.map((req, idx) => (
                        <li key={idx} className="text-gray-400 text-sm">• {req}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">权益</h4>
                    <ul className="space-y-1">
                      {level.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-400 text-sm">
                          <FaCheckCircle className="text-green-400 text-xs flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-3xl border border-blue-500/30 p-12"
          >
            <FaHandshake className="text-5xl text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">准备好加入我们了吗？</h2>
            <p className="text-gray-300 mb-8">立即申请成为 Quantaureum 合作伙伴，开启合作共赢之旅</p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto"
              >
                申请合作 <FaArrowRight />
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
