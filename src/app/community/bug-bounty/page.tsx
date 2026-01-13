'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Bug, Shield, Award, AlertTriangle, CheckCircle, DollarSign } from 'lucide-react';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';

const severityLevels = [
  { level: 'Critical', reward: '$10,000 - $50,000', color: 'from-red-500 to-rose-500', description: '可能导致资金损失或系统完全崩溃的漏洞' },
  { level: 'High', reward: '$5,000 - $10,000', color: 'from-orange-500 to-amber-500', description: '严重影响系统安全或用户数据的漏洞' },
  { level: 'Medium', reward: '$1,000 - $5,000', color: 'from-yellow-500 to-lime-500', description: '中等影响的安全问题' },
  { level: 'Low', reward: '$100 - $1,000', color: 'from-green-500 to-emerald-500', description: '轻微的安全问题或改进建议' },
];

const inScope = [
  'Quantaureum 主网智能合约',
  '量子钱包应用 (Web/iOS/Android)',
  '区块链浏览器',
  'DeFi 协议合约',
  'API 和 RPC 端点',
  '跨链桥接合约',
];

const outOfScope = [
  '第三方服务和集成',
  '社交工程攻击',
  'DoS/DDoS 攻击',
  '已知问题和正在修复的漏洞',
  '测试网环境',
];

export default function BugBountyPage() {
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
            <span className="text-white">Bug Bounty</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Bug className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Bug Bounty Program</h1>
              <p className="text-gray-400">帮助我们发现漏洞，获得丰厚奖励</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
            <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">$500K+</div>
            <div className="text-sm text-gray-400">已发放奖励</div>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
            <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">156</div>
            <div className="text-sm text-gray-400">已修复漏洞</div>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
            <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">89</div>
            <div className="text-sm text-gray-400">安全研究员</div>
          </div>
        </div>

        {/* Severity Levels */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">奖励等级</h2>
          <div className="space-y-3">
            {severityLevels.map((level) => (
              <div key={level.level} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <div className="flex items-center">
                  <div className={`w-2 h-full bg-gradient-to-b ${level.color}`} />
                  <div className="flex-1 p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{level.level}</div>
                      <div className="text-sm text-gray-400">{level.description}</div>
                    </div>
                    <div className="text-lg font-bold text-green-400">{level.reward}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scope */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center gap-2 text-green-400 font-semibold mb-4">
              <CheckCircle className="w-5 h-5" />
              范围内
            </div>
            <ul className="space-y-2">
              {inScope.map((item, i) => (
                <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
            <div className="flex items-center gap-2 text-red-400 font-semibold mb-4">
              <AlertTriangle className="w-5 h-5" />
              范围外
            </div>
            <ul className="space-y-2">
              {outOfScope.map((item, i) => (
                <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Submit */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">发现漏洞？</h3>
          <p className="text-gray-400 mb-4">请通过安全渠道提交您的发现</p>
          <a
            href="mailto:security@quantaureum.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            <Bug className="w-5 h-5" />
            提交漏洞报告
          </a>
        </div>
      </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
