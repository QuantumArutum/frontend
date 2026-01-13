import React from 'react';
import Link from 'next/link';
import EnhancedFooter from '../../../components/EnhancedFooter';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';

export default function Support() {
  return (
    <div className="min-h-screen relative">
      <EnhancedNavbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-quantum-light mb-6">
              帮助支持
            </h1>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              获取专业的技术支持和帮助，解决您在使用quantaureum过程中遇到的问题
            </p>
          </div>
        </div>
      </section>

      {/* Quick Help */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">快速帮助</h2>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              常见问题的快速解决方案
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="quantum-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-quantum-light mb-2">钱包问题</h3>
              <p className="text-quantum-secondary text-sm mb-4">
                钱包创建、导入和安全相关问题
              </p>
              <Link href="/support/wallet" className="text-quantum-primary hover:text-quantum-accent transition-colors text-sm">
                查看帮助 →
              </Link>
            </div>

            <div className="quantum-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-quantum-light mb-2">交易问题</h3>
              <p className="text-quantum-secondary text-sm mb-4">
                交易发送、确认和手续费相关问题
              </p>
              <Link href="/support/transactions" className="text-quantum-primary hover:text-quantum-accent transition-colors text-sm">
                查看帮助 →
              </Link>
            </div>

            <div className="quantum-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-quantum-light mb-2">开发问题</h3>
              <p className="text-quantum-secondary text-sm mb-4">
                API使用、SDK集成和开发相关问题
              </p>
              <Link href="/support/development" className="text-quantum-primary hover:text-quantum-accent transition-colors text-sm">
                查看帮助 →
              </Link>
            </div>

            <div className="quantum-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-quantum-light mb-2">账户问题</h3>
              <p className="text-quantum-secondary text-sm mb-4">
                账户注册、登录和安全设置问题
              </p>
              <Link href="/support/account" className="text-quantum-primary hover:text-quantum-accent transition-colors text-sm">
                查看帮助 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-quantum-dark-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">联系支持</h2>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              多种方式获取专业技术支持
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="quantum-card p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-quantum-light mb-4">在线客服</h3>
              <p className="text-quantum-secondary mb-6">
                24/7在线客服支持，实时解答您的问题
              </p>
              <button className="quantum-btn quantum-btn-primary w-full">
                开始对话
              </button>
              <p className="text-xs text-quantum-secondary mt-2">
                平均响应时间: 2分钟
              </p>
            </div>

            <div className="quantum-card p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-quantum-light mb-4">邮件支持</h3>
              <p className="text-quantum-secondary mb-6">
                发送详细问题描述，获取专业技术支持
              </p>
              <button className="quantum-btn quantum-btn-secondary w-full">
                发送邮件
              </button>
              <p className="text-xs text-quantum-secondary mt-2">
                support@quantaureum.com
              </p>
            </div>

            <div className="quantum-card p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-quantum-light mb-4">工单系统</h3>
              <p className="text-quantum-secondary mb-6">
                提交技术工单，跟踪问题解决进度
              </p>
              <button className="quantum-btn quantum-btn-accent w-full">
                创建工单
              </button>
              <p className="text-xs text-quantum-secondary mt-2">
                平均解决时间: 24小时
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">常见问题</h2>
            <p className="text-xl text-quantum-secondary">
              最常见问题的快速解答
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="quantum-card p-6">
              <h3 className="text-lg font-bold text-quantum-light mb-3">
                如何创建quantaureum钱包？
              </h3>
              <p className="text-quantum-secondary">
                您可以通过我们的官方钱包应用或使用SDK创建钱包。钱包使用量子安全的密码学算法，确保您的资产安全。详细步骤请参考钱包使用指南。
              </p>
            </div>

            <div className="quantum-card p-6">
              <h3 className="text-lg font-bold text-quantum-light mb-3">
                交易手续费是如何计算的？
              </h3>
              <p className="text-quantum-secondary">
                交易手续费基于网络拥堵程度和交易复杂度动态计算。简单转账的基础费用约为0.001 QAU，智能合约交互费用会根据计算复杂度有所不同。
              </p>
            </div>

            <div className="quantum-card p-6">
              <h3 className="text-lg font-bold text-quantum-light mb-3">
                什么是量子安全？为什么重要？
              </h3>
              <p className="text-quantum-secondary">
                量子安全是指能够抵御量子计算机攻击的密码学技术。随着量子计算技术的发展，传统的加密算法将面临威胁。quantaureum采用后量子密码学算法，确保长期安全性。
              </p>
            </div>

            <div className="quantum-card p-6">
              <h3 className="text-lg font-bold text-quantum-light mb-3">
                如何参与quantaureum的治理？
              </h3>
              <p className="text-quantum-secondary">
                持有QAU代币的用户可以参与网络治理。您可以对协议升级、参数调整等重要决策进行投票。投票权重与您持有的QAU数量成正比。
              </p>
            </div>

            <div className="quantum-card p-6">
              <h3 className="text-lg font-bold text-quantum-light mb-3">
                后量子密码学是如何保护安全的？
              </h3>
              <p className="text-quantum-secondary">
                我们采用NIST标准化的Dilithium3数字签名和Kyber密钥封装算法，这些算法能够抵抗量子计算机的攻击，确保您的资产在量子计算时代依然安全。
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/support/faq" className="quantum-btn quantum-btn-secondary">
              查看更多FAQ
            </Link>
          </div>
        </div>
      </section>

      {/* Knowledge Base */}
      <section className="py-16 bg-quantum-dark-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">知识库</h2>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              详细的使用指南和技术文档
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">用户指南</h3>
              <p className="text-quantum-secondary mb-4">
                从入门到高级的完整用户使用指南
              </p>
              <Link href="/support/user-guide" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                查看指南 →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">开发文档</h3>
              <p className="text-quantum-secondary mb-4">
                API参考、SDK使用和开发最佳实践
              </p>
              <Link href="/developers/docs" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                查看文档 →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">安全指南</h3>
              <p className="text-quantum-secondary mb-4">
                保护您的资产和隐私的安全最佳实践
              </p>
              <Link href="/support/security-guide" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                查看指南 →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">故障排除</h3>
              <p className="text-quantum-secondary mb-4">
                常见问题的诊断和解决方法
              </p>
              <Link href="/support/troubleshooting" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                查看指南 →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">视频教程</h3>
              <p className="text-quantum-secondary mb-4">
                直观的视频教程和操作演示
              </p>
              <Link href="/support/video-tutorials" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                观看视频 →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">发布说明</h3>
              <p className="text-quantum-secondary mb-4">
                最新版本的功能更新和改进说明
              </p>
              <Link href="/support/release-notes" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                查看更新 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <EnhancedFooter />
    </div>
  );
}


