import React from 'react';
import Link from 'next/link';
import EnhancedNavbar from '../../components/EnhancedNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import ParticlesBackground from '../../components/ParticlesBackground';

export default function DeveloperDocs() {
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
              开发者文档
            </h1>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              完整的API文档和开发指南，助您快速构建量子安全的区块链应用
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">快速开始</h2>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              几分钟内开始您的第一个quantaureum应用开发
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="quantum-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">安装SDK</h3>
              <p className="text-quantum-secondary mb-4">
                下载并安装quantaureum开发工具包
              </p>
              <code className="bg-quantum-dark-secondary p-2 rounded text-quantum-accent text-sm">
                npm install @quantaureum/sdk
              </code>
            </div>

            <div className="quantum-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">创建钱包</h3>
              <p className="text-quantum-secondary mb-4">
                使用量子安全算法创建您的第一个钱包
              </p>
              <code className="bg-quantum-dark-secondary p-2 rounded text-quantum-accent text-sm">
                const wallet = new QAWallet()
              </code>
            </div>

            <div className="quantum-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">发送交易</h3>
              <p className="text-quantum-secondary mb-4">
                使用量子签名发送您的第一笔交易
              </p>
              <code className="bg-quantum-dark-secondary p-2 rounded text-quantum-accent text-sm">
                await wallet.sendTransaction()
              </code>
            </div>
          </div>
        </div>
      </section>

      {/* API Documentation */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">API文档</h2>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              完整的API参考文档，涵盖所有核心功能
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">钱包API</h3>
              <p className="text-quantum-secondary mb-4">
                量子安全的钱包创建、管理和交易功能
              </p>
              <Link href="/docs/wallet-api" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                查看文档 →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">交易API</h3>
              <p className="text-quantum-secondary mb-4">
                高性能的交易处理和查询接口
              </p>
              <Link href="/docs/transaction-api" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                查看文档 →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">智能合约API</h3>
              <p className="text-quantum-secondary mb-4">
                部署和调用量子安全的智能合约
              </p>
              <Link href="/docs/smart-contract-api" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                查看文档 →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">数据API</h3>
              <p className="text-quantum-secondary mb-4">
                区块链数据查询和分析接口
              </p>
              <Link href="/docs/data-api" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                查看文档 →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m13 0h-6m-2-5h6m2 5v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">跨链API</h3>
              <p className="text-quantum-secondary mb-4">
                跨链资产转移和数据交换接口
              </p>
              <Link href="/docs/cross-chain-api" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                查看文档 →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">AI API</h3>
              <p className="text-quantum-secondary mb-4">
                与AI进化系统交互的接口
              </p>
              <Link href="/docs/ai-api" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                查看文档 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">代码示例</h2>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              实用的代码示例，帮助您快速上手开发
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="quantum-card p-6">
              <h3 className="text-xl font-bold text-quantum-light mb-4">创建量子钱包</h3>
              <div className="bg-quantum-dark-secondary rounded-lg p-4 overflow-x-auto">
                <pre className="text-quantum-accent text-sm">
{`import { QAWallet, QAProvider } from '@quantaureum/sdk';

// 初始化提供者
const provider = new QAProvider('https://mainnet.quantaureum.com');

// 创建新钱包
const wallet = QAWallet.createRandom();

// 连接到网络
await wallet.connect(provider);

// 获取余额
const balance = await wallet.getBalance();
console.log('余额:', balance.toString());`}
                </pre>
              </div>
            </div>

            <div className="quantum-card p-6">
              <h3 className="text-xl font-bold text-quantum-light mb-4">发送量子安全交易</h3>
              <div className="bg-quantum-dark-secondary rounded-lg p-4 overflow-x-auto">
                <pre className="text-quantum-accent text-sm">
{`// 创建交易
const transaction = {
  to: '0x742d35Cc6634C0532925a3b8D4C0C8b3C2e',
  value: QAUtils.parseQAU('1.0'), // 1 QAU
  gasLimit: 21000
};

// 使用量子签名发送交易
const txResponse = await wallet.sendTransaction(transaction);

// 等待确认
const receipt = await txResponse.wait();
console.log('交易哈希:', receipt.transactionHash);`}
                </pre>
              </div>
            </div>

            <div className="quantum-card p-6">
              <h3 className="text-xl font-bold text-quantum-light mb-4">部署智能合约</h3>
              <div className="bg-quantum-dark-secondary rounded-lg p-4 overflow-x-auto">
                <pre className="text-quantum-accent text-sm">
{`import { QAContractFactory } from '@quantaureum/sdk';

// 合约字节码和ABI
const bytecode = '0x608060405234801561001057600080fd5b50...';
const abi = [...];

// 创建合约工厂
const factory = new QAContractFactory(abi, bytecode, wallet);

// 部署合约
const contract = await factory.deploy('Hello, Quantum!');
await contract.deployed();

console.log('合约地址:', contract.address);`}
                </pre>
              </div>
            </div>

            <div className="quantum-card p-6">
              <h3 className="text-xl font-bold text-quantum-light mb-4">跨链资产转移</h3>
              <div className="bg-quantum-dark-secondary rounded-lg p-4 overflow-x-auto">
                <pre className="text-quantum-accent text-sm">
{`import { QACrossBridge } from '@quantaureum/sdk';

// 初始化跨链桥
const bridge = new QACrossBridge(wallet);

// 跨链转移
const transfer = await bridge.transfer({
  fromChain: 'quantaureum',
  toChain: 'ethereum',
  token: 'QAU',
  amount: QAUtils.parseQAU('10.0'),
  recipient: '0x742d35Cc6634C0532925a3b8D4C0C8b3C2e'
});

console.log('跨链交易ID:', transfer.id);`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tutorials */}
      <section className="py-16 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">教程指南</h2>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              从基础到高级的完整教程系列
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">基础教程</h3>
              <p className="text-quantum-secondary mb-4">
                学习quantaureum的基本概念和开发环境搭建
              </p>
              <Link href="/tutorials/basics" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                开始学习 →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">智能合约开发</h3>
              <p className="text-quantum-secondary mb-4">
                深入学习量子安全智能合约的开发和部署
              </p>
              <Link href="/tutorials/smart-contracts" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                开始学习 →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">DApp开发</h3>
              <p className="text-quantum-secondary mb-4">
                构建完整的去中心化应用程序
              </p>
              <Link href="/tutorials/dapp-development" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                开始学习 →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-2xl">🔗</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">跨链开发</h3>
              <p className="text-quantum-secondary mb-4">
                实现跨链互操作和资产转移功能
              </p>
              <Link href="/tutorials/cross-chain" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                开始学习 →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">安全最佳实践</h3>
              <p className="text-quantum-secondary mb-4">
                学习量子安全开发的最佳实践和安全模式
              </p>
              <Link href="/tutorials/security" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                开始学习 →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">性能优化</h3>
              <p className="text-quantum-secondary mb-4">
                优化应用性能和用户体验的高级技巧
              </p>
              <Link href="/tutorials/optimization" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                开始学习 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <EnhancedFooter />
      </div>
    </div>
  );
}


