'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Shield, Heart, MessageSquare, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';

const guidelines = [
  {
    icon: Heart,
    title: '尊重他人',
    description: '对所有社区成员保持尊重和礼貌。不允许人身攻击、骚扰或歧视性言论。',
    dos: ['使用礼貌的语言', '尊重不同观点', '建设性地提出批评'],
    donts: ['人身攻击', '骚扰他人', '发布歧视性内容']
  },
  {
    icon: MessageSquare,
    title: '有价值的讨论',
    description: '发布有意义的内容，为社区增加价值。避免垃圾信息和无关内容。',
    dos: ['分享有用的信息', '提出深思熟虑的问题', '参与有意义的讨论'],
    donts: ['发布垃圾信息', '重复发帖', '发布无关内容']
  },
  {
    icon: Shield,
    title: '保护隐私',
    description: '保护自己和他人的隐私。不要分享个人敏感信息。',
    dos: ['保护个人信息', '使用安全的通信方式', '报告可疑活动'],
    donts: ['分享他人私人信息', '发布敏感数据', '进行钓鱼攻击']
  },
  {
    icon: AlertTriangle,
    title: '遵守法律',
    description: '所有活动必须遵守适用的法律法规。禁止任何非法活动。',
    dos: ['遵守当地法律', '报告非法内容', '负责任地使用平台'],
    donts: ['推广非法活动', '发布侵权内容', '进行欺诈行为']
  }
];

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <Link href="/community" className="hover:text-white">Community</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Guidelines</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">社区准则</h1>
          <p className="text-gray-400">帮助我们维护一个友好、安全、有价值的社区环境</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20 mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">欢迎来到 Quantaureum 社区</h2>
          <p className="text-gray-300">
            我们致力于创建一个开放、包容、有建设性的社区。请阅读并遵守以下准则，
            共同维护良好的社区氛围。违反准则可能导致警告、禁言或永久封禁。
          </p>
        </div>

        {/* Guidelines */}
        <div className="space-y-6">
          {guidelines.map((guideline, index) => {
            const Icon = guideline.icon;
            return (
              <div key={index} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{guideline.title}</h3>
                  </div>
                  <p className="text-gray-400 mb-6">{guideline.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                      <div className="flex items-center gap-2 text-green-400 font-medium mb-3">
                        <CheckCircle className="w-5 h-5" />
                        推荐做法
                      </div>
                      <ul className="space-y-2">
                        {guideline.dos.map((item, i) => (
                          <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                      <div className="flex items-center gap-2 text-red-400 font-medium mb-3">
                        <XCircle className="w-5 h-5" />
                        禁止行为
                      </div>
                      <ul className="space-y-2">
                        {guideline.donts.map((item, i) => (
                          <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Report Section */}
        <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-3">举报违规行为</h3>
          <p className="text-gray-400 mb-4">
            如果您发现任何违反社区准则的行为，请立即举报。我们的管理团队会尽快处理。
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            <AlertTriangle className="w-5 h-5" />
            举报违规
          </Link>
        </div>
      </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
