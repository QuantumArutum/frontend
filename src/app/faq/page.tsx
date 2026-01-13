'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle, Shield, Wallet, Zap, Globe, Code } from 'lucide-react';
import EnhancedNavbar from '../components/EnhancedNavbar';
import EnhancedFooter from '../components/EnhancedFooter';
import ParticlesBackground from '../components/ParticlesBackground';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  {
    category: '基础知识',
    question: '什么是 Quantaureum？',
    answer: 'Quantaureum 是新一代量子安全区块链平台，采用后量子密码学技术（CRYSTALS-Dilithium 和 CRYSTALS-Kyber），为企业和开发者提供安全、高效的区块链基础设施。'
  },
  {
    category: '基础知识',
    question: 'QAU 代币是什么？',
    answer: 'QAU 是 Quantaureum 网络的原生代币，与实物黄金 1:1 挂钩。1 QAU = 1 克黄金。所有黄金储备都存储在 LBMA 认证的金库中，并定期接受独立审计。'
  },
  {
    category: '安全性',
    question: '量子安全是什么意思？',
    answer: 'Quantaureum 采用 NIST 标准的后量子密码学算法，能够抵御未来量子计算机的攻击。传统加密算法（如 RSA、ECDSA）可能被量子计算机破解，而我们的算法设计能够抵御这种威胁。'
  },
  {
    category: '安全性',
    question: '我的资产安全吗？',
    answer: '是的。我们采用多层安全措施：后量子密码学签名、多重签名钱包、冷存储、定期安全审计，以及全额保险的黄金储备。所有智能合约都经过第三方安全审计。'
  },
  {
    category: '钱包',
    question: '如何创建量子钱包？',
    answer: '您可以通过我们的 Web3 钱包直接在浏览器中创建钱包，无需下载任何软件。钱包支持量子安全签名、多链资产管理和生物识别解锁。'
  },
  {
    category: '钱包',
    question: '支持哪些资产？',
    answer: '量子钱包支持 QAU、ETH、BTC、USDT、USDC 等主流数字资产，以及 Quantaureum 网络上的所有代币。我们还支持跨链资产转移。'
  },
  {
    category: '交易',
    question: '交易手续费是多少？',
    answer: '网络交易费用根据网络拥堵情况动态调整，通常在 0.001-0.01 QAU 之间。购买 QAU 代币时收取 0.5% 的平台费用，用于黄金存储和保险。'
  },
  {
    category: '交易',
    question: '交易确认需要多长时间？',
    answer: 'Quantaureum 网络的平均出块时间约为 12 秒，大多数交易在 1-2 个区块内确认。我们的 TPS 可达 100,000+，确保高效的交易处理。'
  },
  {
    category: '开发者',
    question: '如何开始开发？',
    answer: '访问我们的开发者文档（/developers/docs）获取完整的 API 参考和 SDK。我们提供 JavaScript、Python、Go、Rust 等多种语言的 SDK，以及详细的教程和示例代码。'
  },
  {
    category: '开发者',
    question: '智能合约支持哪些语言？',
    answer: '我们的 QVM（量子虚拟机）完全兼容 EVM，支持 Solidity 语言。同时我们也在开发自研的 QSL（Quantum Smart Language）语言，提供更强的量子安全特性。'
  }
];

const categories = [
  { id: 'all', name: '全部', icon: HelpCircle },
  { id: '基础知识', name: '基础知识', icon: Globe },
  { id: '安全性', name: '安全性', icon: Shield },
  { id: '钱包', name: '钱包', icon: Wallet },
  { id: '交易', name: '交易', icon: Zap },
  { id: '开发者', name: '开发者', icon: Code },
];

const FAQPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen relative text-white">
      <ParticlesBackground />
      <EnhancedNavbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] bg-clip-text text-transparent">
              常见问题
            </h1>
            <p className="text-gray-400 text-lg">
              找到您需要的答案，了解更多关于 Quantaureum 的信息
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索问题..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-8"
          >
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
          </motion.div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium text-white">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {expandedIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 text-gray-300 border-t border-white/10 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">没有找到相关问题</p>
            </div>
          )}

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-white mb-2">还有其他问题？</h3>
            <p className="text-gray-400 mb-4">我们的支持团队随时为您提供帮助</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              联系我们
            </a>
          </motion.div>
        </div>
      </main>

      <EnhancedFooter />
    </div>
  );
};

export default FAQPage;

