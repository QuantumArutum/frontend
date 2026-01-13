'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Handshake, Building, Rocket, Globe, CheckCircle } from 'lucide-react';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';

const partnerTypes = [
  {
    icon: Building,
    title: '企业合作伙伴',
    description: '与我们合作，将量子安全区块链技术集成到您的业务中',
    benefits: ['优先技术支持', '定制化解决方案', '联合营销机会', '早期功能访问']
  },
  {
    icon: Rocket,
    title: '技术合作伙伴',
    description: '共同开发创新的区块链解决方案和工具',
    benefits: ['技术资源共享', 'API 优先访问', '联合开发项目', '技术培训支持']
  },
  {
    icon: Globe,
    title: '生态合作伙伴',
    description: '加入我们的生态系统，共同推动区块链行业发展',
    benefits: ['生态基金支持', '社区资源', '活动合作', '品牌曝光']
  }
];

const currentPartners = [
  { name: 'LBMA Gold', category: '黄金存储', logo: '🏦' },
  { name: 'Chainlink', category: '预言机', logo: '🔗' },
  { name: 'Ledger', category: '硬件钱包', logo: '💳' },
  { name: 'CertiK', category: '安全审计', logo: '🛡️' },
  { name: 'AWS', category: '云服务', logo: '☁️' },
  { name: 'Polygon', category: '跨链', logo: '⬡' },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <Link href="/community" className="hover:text-white">Community</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Partners</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Handshake className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">合作伙伴计划</h1>
              <p className="text-gray-400">与 Quantaureum 一起构建量子安全的未来</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Partner Types */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {partnerTypes.map((type, index) => {
            const Icon = type.icon;
            return (
              <div key={index} className="bg-white/5 rounded-xl border border-white/10 p-6 hover:border-cyan-500/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{type.title}</h3>
                <p className="text-gray-400 mb-4">{type.description}</p>
                <ul className="space-y-2">
                  {type.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Current Partners */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">我们的合作伙伴</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {currentPartners.map((partner, index) => (
              <div key={index} className="bg-white/5 rounded-xl border border-white/10 p-4 text-center hover:border-white/20 transition-all">
                <div className="text-4xl mb-2">{partner.logo}</div>
                <div className="font-medium text-white">{partner.name}</div>
                <div className="text-xs text-gray-400">{partner.category}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-8 border border-cyan-500/20 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">成为合作伙伴</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            无论您是企业、开发者还是项目方，我们都欢迎您加入 Quantaureum 生态系统
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity text-lg font-medium"
          >
            <Handshake className="w-5 h-5" />
            申请合作
          </Link>
        </div>
      </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
