'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, HelpCircle, Shield, Wallet, Zap, Globe, Code } from 'lucide-react';
import EnhancedNavbar from '../components/EnhancedNavbar';
import EnhancedFooter from '../components/EnhancedFooter';
import ParticlesBackground from '../components/ParticlesBackground';
import { useTranslation } from 'react-i18next';

const FAQPage = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', name: t('faq_page.categories.all'), icon: HelpCircle },
    { id: 'basics', name: t('faq_page.categories.basics'), icon: Globe },
    { id: 'security', name: t('faq_page.categories.security'), icon: Shield },
    { id: 'wallet', name: t('faq_page.categories.wallet'), icon: Wallet },
    { id: 'trading', name: t('faq_page.categories.trading'), icon: Zap },
    { id: 'developer', name: t('faq_page.categories.developer'), icon: Code },
  ];

  const faqData = [
    {
      category: 'basics',
      question: t('faq_page.questions.what_is_quantaureum.q'),
      answer: t('faq_page.questions.what_is_quantaureum.a')
    },
    {
      category: 'basics',
      question: t('faq_page.questions.what_is_qau.q'),
      answer: t('faq_page.questions.what_is_qau.a')
    },
    {
      category: 'security',
      question: t('faq_page.questions.quantum_safe.q'),
      answer: t('faq_page.questions.quantum_safe.a')
    },
    {
      category: 'security',
      question: t('faq_page.questions.asset_security.q'),
      answer: t('faq_page.questions.asset_security.a')
    },
    {
      category: 'wallet',
      question: t('faq_page.questions.create_wallet.q'),
      answer: t('faq_page.questions.create_wallet.a')
    },
    {
      category: 'wallet',
      question: t('faq_page.questions.supported_assets.q'),
      answer: t('faq_page.questions.supported_assets.a')
    },
    {
      category: 'trading',
      question: t('faq_page.questions.transaction_fees.q'),
      answer: t('faq_page.questions.transaction_fees.a')
    },
    {
      category: 'trading',
      question: t('faq_page.questions.confirmation_time.q'),
      answer: t('faq_page.questions.confirmation_time.a')
    },
    {
      category: 'developer',
      question: t('faq_page.questions.start_developing.q'),
      answer: t('faq_page.questions.start_developing.a')
    },
    {
      category: 'developer',
      question: t('faq_page.questions.smart_contract_languages.q'),
      answer: t('faq_page.questions.smart_contract_languages.a')
    }
  ];

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
              {t('faq_page.title')}
            </h1>
            <p className="text-gray-400 text-lg">
              {t('faq_page.subtitle')}
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
                placeholder={t('faq_page.search_placeholder')}
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
              <p className="text-gray-400">{t('faq_page.no_results')}</p>
            </div>
          )}

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-white/10 rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-white mb-2">{t('faq_page.more_questions')}</h3>
            <p className="text-gray-400 mb-4">{t('faq_page.support_team')}</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              {t('faq_page.contact_us')}
            </a>
          </motion.div>
        </div>
      </main>

      <EnhancedFooter />
    </div>
  );
};

export default FAQPage;
