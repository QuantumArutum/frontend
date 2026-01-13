'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronDown, Search, HelpCircle } from 'lucide-react';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function CommunityFAQPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    { category: t('community_page.faq.categories.account'), question: t('community_page.faq.questions.create_account.q'), answer: t('community_page.faq.questions.create_account.a') },
    { category: t('community_page.faq.categories.account'), question: t('community_page.faq.questions.edit_profile.q'), answer: t('community_page.faq.questions.edit_profile.a') },
    { category: t('community_page.faq.categories.posting'), question: t('community_page.faq.questions.create_post.q'), answer: t('community_page.faq.questions.create_post.a') },
    { category: t('community_page.faq.categories.posting'), question: t('community_page.faq.questions.post_formats.q'), answer: t('community_page.faq.questions.post_formats.a') },
    { category: t('community_page.faq.categories.reputation'), question: t('community_page.faq.questions.what_is_reputation.q'), answer: t('community_page.faq.questions.what_is_reputation.a') },
    { category: t('community_page.faq.categories.reputation'), question: t('community_page.faq.questions.how_to_increase.q'), answer: t('community_page.faq.questions.how_to_increase.a') },
    { category: t('community_page.faq.categories.governance'), question: t('community_page.faq.questions.participate_governance.q'), answer: t('community_page.faq.questions.participate_governance.a') },
    { category: t('community_page.faq.categories.governance'), question: t('community_page.faq.questions.submit_proposal.q'), answer: t('community_page.faq.questions.submit_proposal.a') }
  ];

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
          <h1 className="text-3xl font-bold text-white mb-2">{t('community_page.faq.title')}</h1>
          <p className="text-gray-400">{t('community_page.faq.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder={t('community_page.faq.search_placeholder')}
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
              {cat === 'all' ? t('community_page.faq.all') : cat}
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
            <p className="text-gray-400">{t('community_page.faq.no_results')}</p>
          </div>
        )}

        {/* Contact */}
        <div className="mt-8 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">{t('community_page.faq.contact_title')}</h3>
          <p className="text-gray-400 mb-4">{t('community_page.faq.contact_desc')}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            {t('community_page.faq.contact_us')}
          </Link>
        </div>
      </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
