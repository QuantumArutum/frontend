'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBuilding, FaShieldAlt, FaChartLine, FaCogs, FaCloud, FaLock, FaRocket, FaUsers, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '@/app/components/EnhancedFooter';
import ParticlesBackground from '@/app/components/ParticlesBackground';

const solutions = [
  {
    id: 'finance',
    icon: FaChartLine,
    title: '金融服务',
    description: '为银行、保险和资产管理公司提供量子安全的区块链解决方案',
    features: ['跨境支付', '资产代币化', '合规审计', '风险管理'],
    benefits: ['降低交易成本 60%', '结算时间从 T+2 缩短到实时', '完全合规监管要求'],
    caseStudy: '某国际银行使用我们的解决方案，每年节省 2000 万美元运营成本'
  },
  {
    id: 'supply-chain',
    icon: FaCogs,
    title: '供应链管理',
    description: '端到端的供应链追溯和验证系统',
    features: ['产品溯源', '库存管理', '物流追踪', '质量认证'],
    benefits: ['供应链透明度提升 100%', '假冒产品减少 95%', '库存周转率提升 40%'],
    caseStudy: '某跨国制造商实现全球供应链实时可视化'
  },
  {
    id: 'healthcare',
    icon: FaShieldAlt,
    title: '医疗健康',
    description: '安全的医疗数据管理和共享平台',
    features: ['电子病历', '药品追溯', '临床试验', '保险理赔'],
    benefits: ['数据安全性提升 99.9%', '理赔处理时间缩短 80%', '符合 HIPAA 标准'],
    caseStudy: '某医疗集团实现跨院区病历安全共享'
  },
  {
    id: 'government',
    icon: FaBuilding,
    title: '政府公共服务',
    description: '透明高效的政务区块链解决方案',
    features: ['电子政务', '数字身份', '投票系统', '公共记录'],
    benefits: ['政务效率提升 50%', '公民信任度提升', '防篡改审计追踪'],
    caseStudy: '某市政府实现全流程数字化政务服务'
  },
  {
    id: 'energy',
    icon: FaCloud,
    title: '能源与公用事业',
    description: '智能能源交易和碳信用管理',
    features: ['能源交易', '碳信用追踪', '智能电网', '可再生能源认证'],
    benefits: ['能源交易成本降低 30%', '碳排放追踪准确率 100%', '支持绿色能源转型'],
    caseStudy: '某能源公司建立区域性能源交易平台'
  },
  {
    id: 'real-estate',
    icon: FaLock,
    title: '房地产',
    description: '房产代币化和智能合约管理',
    features: ['产权登记', '房产代币化', '租赁管理', '物业服务'],
    benefits: ['交易时间从数周缩短到数小时', '降低中介费用 70%', '产权记录不可篡改'],
    caseStudy: '某房地产集团实现资产数字化管理'
  }
];

const deploymentOptions = [
  {
    title: '公有云部署',
    description: '快速部署，按需扩展',
    features: ['AWS/Azure/GCP 支持', '自动扩缩容', '全球 CDN 加速', '99.9% SLA 保证']
  },
  {
    title: '私有云部署',
    description: '完全控制，数据主权',
    features: ['本地数据中心', '定制化配置', '专属技术支持', '合规性保证']
  },
  {
    title: '混合云部署',
    description: '灵活架构，最佳实践',
    features: ['公私云互联', '数据分级存储', '灾备方案', '成本优化']
  }
];

export default function EnterpriseSolutionsPage() {
  const [selectedSolution, setSelectedSolution] = useState(solutions[0]);

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
            <span className="inline-block px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm mb-6">
              企业级解决方案
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              量子安全的
              <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"> 企业区块链 </span>
              解决方案
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              为各行业提供定制化的量子安全区块链解决方案，助力企业数字化转型
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold"
                >
                  预约演示
                </motion.button>
              </Link>
              <Link href="/enterprise/audit">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20"
                >
                  查看案例
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">行业解决方案</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Solution List */}
            <div className="space-y-4">
              {solutions.map((solution) => {
                const IconComponent = solution.icon;
                return (
                  <motion.button
                    key={solution.id}
                    whileHover={{ x: 5 }}
                    onClick={() => setSelectedSolution(solution)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedSolution.id === solution.id
                        ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-purple-500/50'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        selectedSolution.id === solution.id ? 'bg-purple-500/30' : 'bg-white/10'
                      }`}>
                        <IconComponent className="text-xl text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{solution.title}</h3>
                        <p className="text-gray-400 text-sm">{solution.description.slice(0, 30)}...</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Solution Detail */}
            <div className="lg:col-span-2">
              <motion.div
                key={selectedSolution.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-600/30 to-cyan-600/30 flex items-center justify-center">
                    <selectedSolution.icon className="text-3xl text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedSolution.title}</h3>
                    <p className="text-gray-400">{selectedSolution.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">核心功能</h4>
                    <ul className="space-y-2">
                      {selectedSolution.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300">
                          <FaCheckCircle className="text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">业务价值</h4>
                    <ul className="space-y-2">
                      {selectedSolution.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300">
                          <FaRocket className="text-cyan-400" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl p-4 border border-purple-500/30">
                  <h4 className="text-white font-semibold mb-2">📊 成功案例</h4>
                  <p className="text-gray-300">{selectedSolution.caseStudy}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Options */}
      <section className="py-16 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">部署方案</h2>
          <p className="text-gray-400 text-center mb-12">灵活的部署选项，满足不同企业需求</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deploymentOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all"
              >
                <h3 className="text-xl font-bold text-white mb-2">{option.title}</h3>
                <p className="text-gray-400 mb-4">{option.description}</p>
                <ul className="space-y-2">
                  {option.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                      <FaCheckCircle className="text-green-400 text-xs" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-3xl border border-purple-500/30 p-12"
          >
            <FaUsers className="text-5xl text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">准备开始您的数字化转型？</h2>
            <p className="text-gray-300 mb-8">我们的专家团队将为您提供定制化的解决方案咨询</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold flex items-center gap-2"
                >
                  联系我们 <FaArrowRight />
                </motion.button>
              </Link>
              <Link href="/enterprise/support">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20"
                >
                  技术支持
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    <EnhancedFooter />
  </div>
  );
}
