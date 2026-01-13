'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Search, HelpCircle } from 'lucide-react';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: '账户',
    question: '如何创建社区账户？',
    answer: '点击页面右上角的"登录"按钮，然后选择"注册"。您可以使用邮箱注册，或者连接您的钱包直接登录。'
  },
  {
    category: '账户',
    question: '如何修改个人资料？',
    answer: '登录后，点击右上角的头像，选择"个人设置"。在这里您可以修改用户名、头像、个人简介等信息。'
  },
  {
    category: '发帖',
    question: '如何发布新帖子？',
    answer: '登录后，点击"新建帖子"按钮。选择合适的分类，填写标题和内容，然后点击发布即可。'
  },
  {
    category: '发帖',
    question: '帖子支持哪些格式？',
    answer: '我们支持 Markdown 格式，包括标题、列表、代码块、链接、图片等。您还可以使用表情符号和 @提及其他用户。'
  },
  {
    category: '声望',
    question: '什么是声望系统？',
    answer: '声望是衡量社区贡献的指标。您可以通过发帖、回复、获得点赞等方式获得声望。高声望用户可以解锁更多功能。'
  },
  {
    category: '声望',
    question: '如何提高声望？',
    answer: '发布高质量的内容、帮助其他用户、参与社区活动都可以提高声望。被其他用户点赞和采纳答案也会增加声望。'
  },
  {
    category: '治理',
    question: '如何参与社区治理？',
    answer: '持有 QAU 代币的用户可以参与治理投票。访问治理页面查看当前提案，使用您的代币进行投票。'
  },
  {
    category: '治理',
    question: '如何提交治理提案？',
    answer: '需要达到一定的声望等级和代币持有量才能提交提案。满足条件后，在治理页面点击"提交提案"。'
  }
];

export default function CommunityFAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const categories = ['all', ...Array.from(new Set(faqs.map(f => f.category)))];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            <span className="text-white">FAQ</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">常见问题</h1>
          <p className="text-gray-400">找到您需要的答案</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索问题..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {cat === 'all' ? '全部' : cat}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-cyan-400" />
                  <span className="font-medium text-white">{faq.question}</span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${
                    expandedIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {expandedIndex === index && (
                <div className="px-6 pb-4 text-gray-300 border-t border-white/10 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">没有找到相关问题</p>
          </div>
        )}

        {/* Contact */}
        <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">还有其他问题？</h3>
          <p className="text-gray-400 mb-4">我们的支持团队随时为您提供帮助</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            联系我们
          </Link>
        </div>
      </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
