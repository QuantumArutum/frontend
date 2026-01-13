import React from 'react';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import ParticlesBackground from '../../components/ParticlesBackground';

export default function Whitepaper() {
  return (
    <div className="min-h-screen bg-quantum-dark relative">
      <ParticlesBackground />
      <div className="relative z-10">
      <EnhancedNavbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-quantum-dark via-quantum-dark-secondary to-quantum-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-quantum-light mb-6">
              技术白皮书
            </h1>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              深入了解quantaureum的技术架构、创新理念和发展路线图
            </p>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="quantum-card p-8 text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-quantum-light mb-4">quantaureum技术白皮书</h2>
            <p className="text-quantum-secondary text-lg mb-8">
              完整的技术文档，包含系统架构、算法设计、安全机制和实现细节
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="quantum-btn quantum-btn-primary text-lg px-8 py-4">
                下载完整版(PDF)
              </button>
              <button className="quantum-btn quantum-btn-secondary text-lg px-8 py-4">
                在线阅读
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Abstract */}
      <section className="py-16 bg-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-quantum-light mb-8 text-center">摘要</h2>
          <div className="quantum-card p-8">
            <p className="text-quantum-secondary text-lg leading-relaxed mb-6">
              quantaureum是一个革命性的量子安全区块链生态系统，旨在解决传统区块链在量子计算时代面临的安全挑战。本白皮书详细介绍了我们的技术创新，包括后量子密码学的应用以及完整的去中心化应用生态。
            </p>
            <p className="text-quantum-secondary text-lg leading-relaxed mb-6">
              我们采用CRYSTALS-Dilithium和Kyber等NIST标准化的后量子密码学算法，确保系统在量子计算机出现后仍能提供可靠的安全保障。同时，创新的Quantum Proof of Stake (QPoS)共识机制结合分片技术，实现了高性能和高扩展性。
            </p>
            <p className="text-quantum-secondary text-lg leading-relaxed">
              完整的应用生态涵盖金融、娱乐、旅游、基础设施等多个领域，为用户提供全方位的区块链服务。
            </p>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-quantum-light mb-8 text-center">目录</h2>
          <div className="quantum-card p-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-quantum-primary/20">
                <span className="text-quantum-light font-medium">1. 引言</span>
                <span className="text-quantum-secondary">3</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-quantum-primary/20">
                <span className="text-quantum-light font-medium">2. 量子安全技术</span>
                <span className="text-quantum-secondary">8</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-quantum-primary/20">
                <span className="text-quantum-light font-medium">3. 区块链架构设计</span>
                <span className="text-quantum-secondary">15</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-quantum-primary/20">
                <span className="text-quantum-light font-medium">4. 共识机制</span>
                <span className="text-quantum-secondary">22</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-quantum-primary/20">
                <span className="text-quantum-light font-medium">5. AI自主进化系统</span>
                <span className="text-quantum-secondary">28</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-quantum-primary/20">
                <span className="text-quantum-light font-medium">6. 智能合约虚拟机</span>
                <span className="text-quantum-secondary">35</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-quantum-primary/20">
                <span className="text-quantum-light font-medium">7. 跨链互操作性</span>
                <span className="text-quantum-secondary">42</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-quantum-primary/20">
                <span className="text-quantum-light font-medium">8. 应用生态系统</span>
                <span className="text-quantum-secondary">48</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-quantum-primary/20">
                <span className="text-quantum-light font-medium">9. 经济模型</span>
                <span className="text-quantum-secondary">55</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-quantum-primary/20">
                <span className="text-quantum-light font-medium">10. 安全分析</span>
                <span className="text-quantum-secondary">62</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-quantum-primary/20">
                <span className="text-quantum-light font-medium">11. 性能评估</span>
                <span className="text-quantum-secondary">68</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-quantum-primary/20">
                <span className="text-quantum-light font-medium">12. 发展路线图</span>
                <span className="text-quantum-secondary">74</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-quantum-light font-medium">13. 结论</span>
                <span className="text-quantum-secondary">80</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-quantum-light mb-12 text-center">核心技术亮点</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">后量子密码学</h3>
              <p className="text-quantum-secondary">
                采用NIST标准化的后量子密码学算法，确保在量子计算时代的安全性
              </p>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">AI自主进化</h3>
              <p className="text-quantum-secondary">
                具备元学习和递归自我改进能力的AI系统，持续优化平台性能
              </p>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">高性能共识</h3>
              <p className="text-quantum-secondary">
                创新的QPoS共识机制，实现高吞吐量和低延迟的交易处理
              </p>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m13 0h-6m-2-5h6m2 5v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">跨链互操作</h3>
              <p className="text-quantum-secondary">
                无缝连接多个区块链网络，构建统一的数字经济生态系统
              </p>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">智能合约</h3>
              <p className="text-quantum-secondary">
                量子安全的智能合约执行环境，支持复杂的去中心化应用
              </p>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">应用生态</h3>
              <p className="text-quantum-secondary">
                涵盖金融、娱乐、旅游等多个领域的完整应用生态系统
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Research Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-quantum-light mb-12 text-center">研究团队</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-4xl text-white">👨‍🔬</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-2">首席科学家</h3>
              <p className="text-quantum-secondary mb-2">密码学博士</p>
              <p className="text-sm text-quantum-secondary">MIT，发表论文50+篇</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <span className="text-4xl text-white">👨‍🔬</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-2">量子计算专家</h3>
              <p className="text-quantum-secondary mb-2">物理学博士</p>
              <p className="text-sm text-quantum-secondary">前Google量子AI团队</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <span className="text-4xl text-white">👩‍💻</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-2">区块链架构师</h3>
              <p className="text-quantum-secondary mb-2">计算机科学博士</p>
              <p className="text-sm text-quantum-secondary">前以太坊核心开发者</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-4xl text-white">🤖</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-2">AI系统专家</h3>
              <p className="text-quantum-secondary mb-2">人工智能博士</p>
              <p className="text-sm text-quantum-secondary">前OpenAI研究员</p>
            </div>
          </div>
        </div>
      </section>

      <EnhancedFooter />
      </div>
    </div>
  );
}


