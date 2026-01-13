'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, Database, Globe, Mail, ChevronRight } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <Link href="/" className="hover:text-white">首页</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">隐私政策</span>
          </div>
          <div className="flex items-center gap-4">
            <Shield className="w-12 h-12 text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">隐私政策</h1>
              <p className="text-gray-400 mt-1">最后更新：2024年1月1日</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-invert max-w-none">
          {/* 概述 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Eye className="w-6 h-6 text-cyan-400" />
              概述
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                Quantaureum（以下简称"我们"）非常重视您的隐私。本隐私政策说明了我们如何收集、使用、披露和保护您的个人信息。
                使用我们的服务即表示您同意本隐私政策中描述的做法。
              </p>
            </div>
          </section>

          {/* 信息收集 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Database className="w-6 h-6 text-cyan-400" />
              我们收集的信息
            </h2>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">您提供的信息</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• 账户注册信息（电子邮件地址、用户名）</li>
                  <li>• 钱包地址和交易记录</li>
                  <li>• 客户支持通信内容</li>
                  <li>• 您选择提供的任何其他信息</li>
                </ul>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">自动收集的信息</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• 设备信息（设备类型、操作系统、浏览器类型）</li>
                  <li>• IP地址和地理位置信息</li>
                  <li>• 使用数据和分析信息</li>
                  <li>• Cookie和类似技术收集的信息</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 信息使用 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Globe className="w-6 h-6 text-cyan-400" />
              信息使用方式
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <ul className="text-gray-300 space-y-3">
                <li>• 提供、维护和改进我们的服务</li>
                <li>• 处理交易和发送相关通知</li>
                <li>• 响应您的请求和提供客户支持</li>
                <li>• 发送技术通知、更新和安全警报</li>
                <li>• 检测、预防和解决欺诈和安全问题</li>
                <li>• 遵守法律义务</li>
                <li>• 进行研究和分析以改进服务</li>
              </ul>
            </div>
          </section>

          {/* 信息保护 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-cyan-400" />
              信息安全
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-4">
                我们采用行业标准的安全措施来保护您的个人信息，包括：
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• 量子安全加密技术保护数据传输</li>
                <li>• 安全的数据存储和访问控制</li>
                <li>• 定期安全审计和漏洞评估</li>
                <li>• 员工安全培训和访问限制</li>
              </ul>
            </div>
          </section>

          {/* 您的权利 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">您的权利</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-4">
                根据适用的数据保护法律，您可能拥有以下权利：
              </p>
              <ul className="text-gray-300 space-y-2">
                <li>• 访问您的个人信息</li>
                <li>• 更正不准确的信息</li>
                <li>• 删除您的个人信息</li>
                <li>• 限制或反对处理</li>
                <li>• 数据可携带性</li>
                <li>• 撤回同意</li>
              </ul>
            </div>
          </section>

          {/* 联系我们 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-cyan-400" />
              联系我们
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-4">
                如果您对本隐私政策有任何疑问或想行使您的权利，请通过以下方式联系我们：
              </p>
              <div className="text-gray-300">
                <p>电子邮件：privacy@quantaureum.com</p>
                <p>地址：[公司地址]</p>
              </div>
            </div>
          </section>

          {/* 政策更新 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">政策更新</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                我们可能会不时更新本隐私政策。更新后的政策将在本页面发布，并注明最后更新日期。
                我们建议您定期查看本政策以了解任何变更。继续使用我们的服务即表示您接受更新后的政策。
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
