'use client';

import React from 'react';
import Link from 'next/link';
import { Cookie, Settings, BarChart, Shield, ChevronRight } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <Link href="/" className="hover:text-white">首页</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Cookie政策</span>
          </div>
          <div className="flex items-center gap-4">
            <Cookie className="w-12 h-12 text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Cookie政策</h1>
              <p className="text-gray-400 mt-1">最后更新：2024年1月1日</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-invert max-w-none">
          {/* 什么是Cookie */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">什么是Cookie？</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                Cookie是存储在您设备上的小型文本文件，用于记住您的偏好设置和改善您的浏览体验。
                当您访问我们的网站时，我们可能会在您的设备上放置Cookie。
                这些Cookie帮助我们了解您如何使用我们的服务，并使我们能够为您提供更好的体验。
              </p>
            </div>
          </section>

          {/* Cookie类型 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Settings className="w-6 h-6 text-cyan-400" />
              我们使用的Cookie类型
            </h2>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">必要Cookie</h3>
                <p className="text-gray-300 mb-3">
                  这些Cookie对于网站的基本功能是必需的，无法关闭。
                </p>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• 会话管理</li>
                  <li>• 安全认证</li>
                  <li>• 负载均衡</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">功能Cookie</h3>
                <p className="text-gray-300 mb-3">
                  这些Cookie使网站能够记住您的选择，提供增强的个性化功能。
                </p>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• 语言偏好</li>
                  <li>• 主题设置</li>
                  <li>• 用户界面自定义</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-cyan-400" />
                  分析Cookie
                </h3>
                <p className="text-gray-300 mb-3">
                  这些Cookie帮助我们了解访问者如何与网站互动，以便我们改进服务。
                </p>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• 页面访问统计</li>
                  <li>• 用户行为分析</li>
                  <li>• 性能监控</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">营销Cookie</h3>
                <p className="text-gray-300 mb-3">
                  这些Cookie用于跟踪访问者跨网站的活动，以显示相关广告。
                </p>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• 广告定向</li>
                  <li>• 社交媒体集成</li>
                  <li>• 转化跟踪</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookie列表 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">具体Cookie列表</h2>
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left text-white p-4">名称</th>
                    <th className="text-left text-white p-4">类型</th>
                    <th className="text-left text-white p-4">有效期</th>
                    <th className="text-left text-white p-4">用途</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="text-gray-300 p-4">session_id</td>
                    <td className="text-gray-400 p-4">必要</td>
                    <td className="text-gray-400 p-4">会话</td>
                    <td className="text-gray-400 p-4">用户会话管理</td>
                  </tr>
                  <tr>
                    <td className="text-gray-300 p-4">auth_token</td>
                    <td className="text-gray-400 p-4">必要</td>
                    <td className="text-gray-400 p-4">7天</td>
                    <td className="text-gray-400 p-4">身份验证</td>
                  </tr>
                  <tr>
                    <td className="text-gray-300 p-4">locale</td>
                    <td className="text-gray-400 p-4">功能</td>
                    <td className="text-gray-400 p-4">1年</td>
                    <td className="text-gray-400 p-4">语言偏好</td>
                  </tr>
                  <tr>
                    <td className="text-gray-300 p-4">theme</td>
                    <td className="text-gray-400 p-4">功能</td>
                    <td className="text-gray-400 p-4">1年</td>
                    <td className="text-gray-400 p-4">主题设置</td>
                  </tr>
                  <tr>
                    <td className="text-gray-300 p-4">_ga</td>
                    <td className="text-gray-400 p-4">分析</td>
                    <td className="text-gray-400 p-4">2年</td>
                    <td className="text-gray-400 p-4">Google Analytics</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 管理Cookie */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-cyan-400" />
              管理您的Cookie偏好
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-4">
                您可以通过以下方式管理Cookie：
              </p>
              <ul className="text-gray-300 space-y-3">
                <li>
                  <strong className="text-white">浏览器设置：</strong>
                  大多数浏览器允许您通过设置控制Cookie。您可以选择阻止所有Cookie或仅阻止第三方Cookie。
                </li>
                <li>
                  <strong className="text-white">Cookie偏好中心：</strong>
                  您可以使用我们网站上的Cookie偏好中心来管理非必要Cookie。
                </li>
                <li>
                  <strong className="text-white">选择退出：</strong>
                  对于分析Cookie，您可以使用Google Analytics选择退出浏览器插件。
                </li>
              </ul>
              <p className="text-yellow-400 mt-4 text-sm">
                注意：禁用某些Cookie可能会影响网站的功能和您的用户体验。
              </p>
            </div>
          </section>

          {/* 更新 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">政策更新</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                我们可能会不时更新本Cookie政策。任何更改将在本页面发布，并注明最后更新日期。
                我们建议您定期查看本政策以了解我们如何使用Cookie。
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
