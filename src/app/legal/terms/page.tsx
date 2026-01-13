'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, AlertTriangle, Scale, Users, Ban, ChevronRight } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <Link href="/" className="hover:text-white">首页</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">服务条款</span>
          </div>
          <div className="flex items-center gap-4">
            <FileText className="w-12 h-12 text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">服务条款</h1>
              <p className="text-gray-400 mt-1">最后更新：2024年1月1日</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-invert max-w-none">
          {/* 接受条款 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Scale className="w-6 h-6 text-cyan-400" />
              接受条款
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                欢迎使用 Quantaureum 平台。通过访问或使用我们的服务，您同意受本服务条款的约束。
                如果您不同意这些条款，请不要使用我们的服务。我们保留随时修改这些条款的权利，
                修改后的条款将在发布后立即生效。
              </p>
            </div>
          </section>

          {/* 服务描述 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">服务描述</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-4">
                Quantaureum 提供基于量子安全区块链技术的以下服务：
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• 量子安全数字钱包服务</li>
                <li>• 区块链交易和转账服务</li>
                <li>• 去中心化金融（DeFi）服务</li>
                <li>• 智能合约部署和执行</li>
                <li>• 代币销售和交易服务</li>
                <li>• 开发者工具和API</li>
              </ul>
            </div>
          </section>

          {/* 用户责任 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Users className="w-6 h-6 text-cyan-400" />
              用户责任
            </h2>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">账户安全</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• 您有责任保护您的账户凭证和私钥</li>
                  <li>• 不得与他人共享您的登录信息</li>
                  <li>• 发现未授权访问应立即通知我们</li>
                  <li>• 您对账户下的所有活动负责</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">合规使用</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• 遵守所有适用的法律法规</li>
                  <li>• 不得用于非法活动或洗钱</li>
                  <li>• 提供准确真实的信息</li>
                  <li>• 尊重其他用户的权利</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 禁止行为 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Ban className="w-6 h-6 text-red-400" />
              禁止行为
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-4">
                使用我们的服务时，您不得：
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• 从事任何欺诈、欺骗或误导性活动</li>
                <li>• 干扰或破坏服务的正常运行</li>
                <li>• 尝试未经授权访问系统或数据</li>
                <li>• 传播恶意软件或有害代码</li>
                <li>• 侵犯他人的知识产权</li>
                <li>• 进行市场操纵或内幕交易</li>
                <li>• 规避任何安全措施或访问控制</li>
              </ul>
            </div>
          </section>

          {/* 风险警告 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              风险警告
            </h2>
            <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/30">
              <p className="text-gray-300 leading-relaxed mb-4">
                使用区块链和加密货币服务涉及重大风险，包括但不限于：
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• 数字资产价格波动风险</li>
                <li>• 技术故障或安全漏洞风险</li>
                <li>• 监管变化风险</li>
                <li>• 私钥丢失导致资产无法恢复的风险</li>
                <li>• 智能合约漏洞风险</li>
              </ul>
              <p className="text-yellow-400 mt-4 font-medium">
                请仅投资您能承受损失的金额。
              </p>
            </div>
          </section>

          {/* 免责声明 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">免责声明</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                服务按"现状"和"可用"基础提供，不提供任何明示或暗示的保证。
                我们不保证服务不会中断或无错误。在法律允许的最大范围内，
                我们不对任何间接、附带、特殊或后果性损害承担责任。
              </p>
            </div>
          </section>

          {/* 知识产权 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">知识产权</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                Quantaureum 平台及其所有内容、功能和特性均为 Quantaureum 或其许可方的财产，
                受版权、商标和其他知识产权法律保护。未经我们事先书面同意，
                您不得复制、修改、分发或以其他方式使用我们的知识产权。
              </p>
            </div>
          </section>

          {/* 终止 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">终止</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                我们保留在任何时候以任何理由暂停或终止您访问服务的权利，
                包括但不限于违反本条款。终止后，您使用服务的权利将立即停止。
                某些条款在终止后仍然有效。
              </p>
            </div>
          </section>

          {/* 适用法律 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">适用法律</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                本条款受适用法律管辖并按其解释。任何因本条款引起的争议应提交至有管辖权的法院解决。
                如果本条款的任何部分被认定为无效或不可执行，其余部分仍然有效。
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
