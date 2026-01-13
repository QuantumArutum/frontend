'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHeadset, FaBook, FaVideo, FaComments, FaTicketAlt, FaClock, FaCheckCircle, FaPhone, FaEnvelope, FaGlobe, FaStar } from 'react-icons/fa';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '@/app/components/EnhancedFooter';
import ParticlesBackground from '@/app/components/ParticlesBackground';

const supportPlans = [
  {
    name: '基础支持',
    price: '免费',
    description: '适合开发和测试阶段',
    features: [
      '社区论坛支持',
      '文档和教程访问',
      '邮件支持（48小时响应）',
      '基础故障排除指南'
    ],
    highlighted: false
  },
  {
    name: '专业支持',
    price: '$999/月',
    description: '适合生产环境部署',
    features: [
      '所有基础支持功能',
      '优先邮件支持（24小时响应）',
      '电话支持（工作日）',
      '专属技术顾问',
      '季度业务回顾',
      '性能优化建议'
    ],
    highlighted: true
  },
  {
    name: '企业支持',
    price: '定制',
    description: '适合大型企业部署',
    features: [
      '所有专业支持功能',
      '7x24 全天候支持',
      '15分钟紧急响应',
      '现场技术支持',
      '定制培训课程',
      '专属客户成功经理',
      'SLA 保证'
    ],
    highlighted: false
  }
];

const supportChannels = [
  {
    icon: FaTicketAlt,
    title: '工单系统',
    description: '提交技术支持工单，追踪问题解决进度',
    action: '提交工单',
    link: '/contact'
  },
  {
    icon: FaComments,
    title: '在线聊天',
    description: '与技术支持团队实时沟通',
    action: '开始聊天',
    link: '#'
  },
  {
    icon: FaPhone,
    title: '电话支持',
    description: '专业支持及以上客户专享',
    action: '+86 400-XXX-XXXX',
    link: 'tel:+86400XXXXXXX'
  },
  {
    icon: FaEnvelope,
    title: '邮件支持',
    description: '发送详细问题描述获取帮助',
    action: 'support@quantaureum.com',
    link: 'mailto:support@quantaureum.com'
  }
];

const resources = [
  {
    icon: FaBook,
    title: '技术文档',
    description: '完整的 API 文档和开发指南',
    link: '/developers/docs'
  },
  {
    icon: FaVideo,
    title: '视频教程',
    description: '从入门到精通的视频课程',
    link: '/developers/docs'
  },
  {
    icon: FaGlobe,
    title: '知识库',
    description: '常见问题和最佳实践',
    link: '/faq'
  },
  {
    icon: FaComments,
    title: '社区论坛',
    description: '与其他开发者交流经验',
    link: '/community/forum'
  }
];

const faqs = [
  {
    question: '如何升级我的支持计划？',
    answer: '您可以随时通过联系我们的销售团队或在账户设置中升级您的支持计划。升级后立即生效。'
  },
  {
    question: '紧急问题如何处理？',
    answer: '专业支持和企业支持客户可以通过专属热线报告紧急问题。我们承诺在 SLA 规定时间内响应。'
  },
  {
    question: '是否提供现场支持？',
    answer: '企业支持计划包含现场技术支持服务。我们的工程师可以到您的办公地点提供面对面的技术支持。'
  },
  {
    question: '支持服务覆盖哪些时区？',
    answer: '基础和专业支持在工作日提供服务（北京时间 9:00-18:00）。企业支持提供 7x24 全天候服务。'
  }
];

export default function EnterpriseSupportPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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
              企业技术支持
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              专业的
              <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent"> 技术支持 </span>
              服务
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              我们的专家团队随时为您提供帮助，确保您的业务顺利运行
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-xl font-semibold flex items-center gap-2"
                >
                  <FaHeadset /> 联系支持
                </motion.button>
              </Link>
              <Link href="/faq">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20"
                >
                  查看 FAQ
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Support Plans */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">支持计划</h2>
          <p className="text-gray-400 text-center mb-12">选择适合您业务需求的支持级别</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-2xl p-8 ${
                  plan.highlighted
                    ? 'bg-gradient-to-b from-green-600/30 to-cyan-600/30 border-2 border-green-500/50'
                    : 'bg-white/5 border border-white/10'
                }`}
              >
                {plan.highlighted && (
                  <div className="flex items-center gap-2 text-green-400 text-sm mb-4">
                    <FaStar /> 最受欢迎
                  </div>
                )}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-green-400 mb-2">{plan.price}</div>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-300">
                      <FaCheckCircle className="text-green-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className={`w-full py-3 rounded-xl font-semibold ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-green-600 to-cyan-600 text-white'
                        : 'bg-white/10 text-white border border-white/20'
                    }`}
                  >
                    {plan.price === '定制' ? '联系销售' : '立即开始'}
                  </motion.button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Channels */}
      <section className="py-16 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">联系方式</h2>
          <p className="text-gray-400 text-center mb-12">多种渠道，随时为您服务</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportChannels.map((channel, index) => {
              const IconComponent = channel.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center hover:border-green-500/50 transition-all"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-2xl text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{channel.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{channel.description}</p>
                  <Link href={channel.link}>
                    <span className="text-green-400 hover:text-green-300 text-sm font-medium">
                      {channel.action}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">自助资源</h2>
          <p className="text-gray-400 text-center mb-12">丰富的学习资源，助您快速上手</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => {
              const IconComponent = resource.icon;
              return (
                <Link key={index} href={resource.link}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-cyan-500/50 transition-all cursor-pointer h-full"
                  >
                    <IconComponent className="text-3xl text-cyan-400 mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">{resource.title}</h3>
                    <p className="text-gray-400 text-sm">{resource.description}</p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-black/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">常见问题</h2>
          <p className="text-gray-400 text-center mb-12">关于技术支持的常见问题</p>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between"
                >
                  <span className="text-white font-medium">{faq.question}</span>
                  <span className="text-gray-400">{expandedFaq === index ? '−' : '+'}</span>
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4 text-gray-300">
                    {faq.answer}
                  </div>
                )}
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
            className="bg-gradient-to-r from-green-600/20 to-cyan-600/20 rounded-3xl border border-green-500/30 p-12"
          >
            <FaClock className="text-5xl text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">需要紧急帮助？</h2>
            <p className="text-gray-300 mb-8">我们的支持团队随时准备为您提供帮助</p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-cyan-600 text-white rounded-xl font-semibold"
              >
                立即联系支持
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
