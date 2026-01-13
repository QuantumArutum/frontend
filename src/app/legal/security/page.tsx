'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Lock, AlertTriangle, CheckCircle, Mail, ChevronRight } from 'lucide-react';

export default function SecurityStatementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <Link href="/" className="hover:text-white">首页</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">安全声明</span>
          </div>
          <div className="flex items-center gap-4">
            <Shield className="w-12 h-12 text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">安全声明</h1>
              <p className="text-gray-400 mt-1">最后更新：2024年1月1日</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-invert max-w-none">
          {/* 安全承诺 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">我们的安全承诺</h2>
            <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-6 border border-cyan-500/30">
              <p className="text-gray-300 leading-relaxed">
                在 Quantaureum，安全是我们的首要任务。我们采用最先进的量子安全技术和行业最佳实践，
                确保您的数字资产和个人信息得到最高级别的保护。我们的安全团队全天候监控系统，
                持续改进我们的安全措施。
              </p>
            </div>
          </section>

          {/* 量子安全技术 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="w-6 h-6 text-cyan-400" />
              量子安全技术
            </h2>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">后量子密码学</h3>
                <p className="text-gray-300 mb-3">
                  我们采用NIST标准化的后量子密码算法，确保即使在量子计算时代，您的资产也能得到保护：
                </p>
                <ul className="text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    CRYSTALS-Dilithium - 数字签名算法
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    CRYSTALS-Kyber - 密钥封装机制
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    SPHINCS+ - 哈希签名方案
                  </li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">加密标准</h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• 所有数据传输使用TLS 1.3加密</li>
                  <li>• 敏感数据使用AES-256加密存储</li>
                  <li>• 私钥使用硬件安全模块(HSM)保护</li>
                  <li>• 量子随机数生成器(QRNG)用于密钥生成</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 安全措施 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">安全措施</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">基础设施安全</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• 多层防火墙保护</li>
                  <li>• DDoS攻击防护</li>
                  <li>• 入侵检测和预防系统</li>
                  <li>• 24/7安全监控</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">应用安全</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• 安全代码审查</li>
                  <li>• 定期渗透测试</li>
                  <li>• 漏洞扫描和修复</li>
                  <li>• 安全开发生命周期</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">账户安全</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• 多因素认证(MFA)</li>
                  <li>• 生物识别支持</li>
                  <li>• 异常登录检测</li>
                  <li>• 会话管理和超时</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">运营安全</h3>
                <ul className="text-gray-300 space-y-2 text-sm">
                  <li>• 员工安全培训</li>
                  <li>• 最小权限原则</li>
                  <li>• 访问日志审计</li>
                  <li>• 事件响应计划</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 安全审计 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">安全审计和认证</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-4">
                我们定期接受独立第三方的安全审计，以确保我们的安全措施符合最高标准：
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className="text-white font-medium">CertiK</div>
                  <div className="text-gray-400 text-sm">智能合约审计</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl mb-2">🔒</div>
                  <div className="text-white font-medium">SOC 2 Type II</div>
                  <div className="text-gray-400 text-sm">合规认证</div>
                </div>
                <div className="text-center p-4 bg-white/5 rounded-lg">
                  <div className="text-2xl mb-2">✓</div>
                  <div className="text-white font-medium">ISO 27001</div>
                  <div className="text-gray-400 text-sm">信息安全管理</div>
                </div>
              </div>
            </div>
          </section>

          {/* 漏洞报告 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
              漏洞报告
            </h2>
            <div className="bg-yellow-500/10 rounded-xl p-6 border border-yellow-500/30">
              <p className="text-gray-300 leading-relaxed mb-4">
                我们重视安全研究人员的贡献。如果您发现任何安全漏洞，请通过我们的漏洞赏金计划负责任地披露：
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/community/bug-bounty"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  漏洞赏金计划
                </Link>
                <a 
                  href="mailto:security@quantaureum.com"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  security@quantaureum.com
                </a>
              </div>
            </div>
          </section>

          {/* 用户安全建议 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">用户安全建议</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-4">
                保护您的账户安全，我们建议您：
              </p>
              <ul className="text-gray-300 space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>启用多因素认证(MFA)以增加账户安全层</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>使用强密码，不要在多个网站重复使用密码</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>安全备份您的私钥和助记词，不要在线存储</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>警惕钓鱼攻击，始终验证网站URL</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>保持软件和设备更新到最新版本</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                  <span>考虑使用硬件钱包存储大额资产</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 联系安全团队 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Mail className="w-6 h-6 text-cyan-400" />
              联系安全团队
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-4">
                如果您有任何安全相关的问题或疑虑，请联系我们的安全团队：
              </p>
              <div className="text-gray-300">
                <p>安全问题：security@quantaureum.com</p>
                <p>漏洞报告：bugbounty@quantaureum.com</p>
                <p>PGP密钥：可在我们的GitHub页面获取</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
