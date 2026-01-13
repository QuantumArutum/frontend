'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import EnhancedFooter from '../../../components/EnhancedFooter';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import '../../../i18n/index';

export default function Support() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen relative">
      <EnhancedNavbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-quantum-light mb-6">
              {t('support_help.title', 'Help & Support')}
            </h1>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              {t('support_help.subtitle', 'Get professional technical support and help to solve problems you encounter while using Quantaureum')}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Help */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">{t('support_help.quick_help.title', 'Quick Help')}</h2>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              {t('support_help.quick_help.subtitle', 'Quick solutions for common problems')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="quantum-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-quantum-light mb-2">{t('support_help.quick_help.wallet.title', 'Wallet Issues')}</h3>
              <p className="text-quantum-secondary text-sm mb-4">
                {t('support_help.quick_help.wallet.desc', 'Wallet creation, import and security related issues')}
              </p>
              <Link href="/support/wallet" className="text-quantum-primary hover:text-quantum-accent transition-colors text-sm">
                {t('support_help.view_help', 'View Help')} →
              </Link>
            </div>

            <div className="quantum-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-quantum-light mb-2">{t('support_help.quick_help.transaction.title', 'Transaction Issues')}</h3>
              <p className="text-quantum-secondary text-sm mb-4">
                {t('support_help.quick_help.transaction.desc', 'Transaction sending, confirmation and fee related issues')}
              </p>
              <Link href="/support/transactions" className="text-quantum-primary hover:text-quantum-accent transition-colors text-sm">
                {t('support_help.view_help', 'View Help')} →
              </Link>
            </div>

            <div className="quantum-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-quantum-light mb-2">{t('support_help.quick_help.development.title', 'Development Issues')}</h3>
              <p className="text-quantum-secondary text-sm mb-4">
                {t('support_help.quick_help.development.desc', 'API usage, SDK integration and development related issues')}
              </p>
              <Link href="/support/development" className="text-quantum-primary hover:text-quantum-accent transition-colors text-sm">
                {t('support_help.view_help', 'View Help')} →
              </Link>
            </div>

            <div className="quantum-card p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-quantum-light mb-2">{t('support_help.quick_help.account.title', 'Account Issues')}</h3>
              <p className="text-quantum-secondary text-sm mb-4">
                {t('support_help.quick_help.account.desc', 'Account registration, login and security settings issues')}
              </p>
              <Link href="/support/account" className="text-quantum-primary hover:text-quantum-accent transition-colors text-sm">
                {t('support_help.view_help', 'View Help')} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 bg-quantum-dark-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">{t('support_help.contact.title', 'Contact Support')}</h2>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              {t('support_help.contact.subtitle', 'Multiple ways to get professional technical support')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="quantum-card p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-quantum-light mb-4">{t('support_help.contact.live_chat.title', 'Live Chat')}</h3>
              <p className="text-quantum-secondary mb-6">
                {t('support_help.contact.live_chat.desc', '24/7 online customer support, real-time answers to your questions')}
              </p>
              <button className="quantum-btn quantum-btn-primary w-full">
                {t('support_help.contact.live_chat.button', 'Start Chat')}
              </button>
              <p className="text-xs text-quantum-secondary mt-2">
                {t('support_help.contact.live_chat.response_time', 'Average response time: 2 minutes')}
              </p>
            </div>

            <div className="quantum-card p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-quantum-light mb-4">{t('support_help.contact.email.title', 'Email Support')}</h3>
              <p className="text-quantum-secondary mb-6">
                {t('support_help.contact.email.desc', 'Send detailed problem description for professional technical support')}
              </p>
              <button className="quantum-btn quantum-btn-secondary w-full">
                {t('support_help.contact.email.button', 'Send Email')}
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
              <h3 className="text-2xl font-bold text-quantum-light mb-4">{t('support_help.contact.ticket.title', 'Ticket System')}</h3>
              <p className="text-quantum-secondary mb-6">
                {t('support_help.contact.ticket.desc', 'Submit technical tickets, track issue resolution progress')}
              </p>
              <button className="quantum-btn quantum-btn-accent w-full">
                {t('support_help.contact.ticket.button', 'Create Ticket')}
              </button>
              <p className="text-xs text-quantum-secondary mt-2">
                {t('support_help.contact.ticket.resolution_time', 'Average resolution time: 24 hours')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">{t('support_help.faq.title', 'Frequently Asked Questions')}</h2>
            <p className="text-xl text-quantum-secondary">
              {t('support_help.faq.subtitle', 'Quick answers to the most common questions')}
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="quantum-card p-6">
              <h3 className="text-lg font-bold text-quantum-light mb-3">
                {t('support_help.faq.q1.question', 'How to create a Quantaureum wallet?')}
              </h3>
              <p className="text-quantum-secondary">
                {t('support_help.faq.q1.answer', 'You can create a wallet through our official wallet app or using the SDK. The wallet uses quantum-safe cryptographic algorithms to ensure your assets are secure. Please refer to the wallet user guide for detailed steps.')}
              </p>
            </div>

            <div className="quantum-card p-6">
              <h3 className="text-lg font-bold text-quantum-light mb-3">
                {t('support_help.faq.q2.question', 'How are transaction fees calculated?')}
              </h3>
              <p className="text-quantum-secondary">
                {t('support_help.faq.q2.answer', 'Transaction fees are dynamically calculated based on network congestion and transaction complexity. The base fee for simple transfers is about 0.001 QAU, and smart contract interaction fees vary depending on computational complexity.')}
              </p>
            </div>

            <div className="quantum-card p-6">
              <h3 className="text-lg font-bold text-quantum-light mb-3">
                {t('support_help.faq.q3.question', 'What is quantum security? Why is it important?')}
              </h3>
              <p className="text-quantum-secondary">
                {t('support_help.faq.q3.answer', 'Quantum security refers to cryptographic technology that can resist quantum computer attacks. As quantum computing technology develops, traditional encryption algorithms will face threats. Quantaureum uses post-quantum cryptographic algorithms to ensure long-term security.')}
              </p>
            </div>

            <div className="quantum-card p-6">
              <h3 className="text-lg font-bold text-quantum-light mb-3">
                {t('support_help.faq.q4.question', 'How to participate in Quantaureum governance?')}
              </h3>
              <p className="text-quantum-secondary">
                {t('support_help.faq.q4.answer', 'Users holding QAU tokens can participate in network governance. You can vote on important decisions such as protocol upgrades and parameter adjustments. Voting weight is proportional to the amount of QAU you hold.')}
              </p>
            </div>

            <div className="quantum-card p-6">
              <h3 className="text-lg font-bold text-quantum-light mb-3">
                {t('support_help.faq.q5.question', 'How does post-quantum cryptography protect security?')}
              </h3>
              <p className="text-quantum-secondary">
                {t('support_help.faq.q5.answer', 'We use NIST-standardized Dilithium3 digital signatures and Kyber key encapsulation algorithms. These algorithms can resist quantum computer attacks, ensuring your assets remain secure in the quantum computing era.')}
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/faq" className="quantum-btn quantum-btn-secondary">
              {t('support_help.faq.view_more', 'View More FAQ')}
            </Link>
          </div>
        </div>
      </section>

      {/* Knowledge Base */}
      <section className="py-16 bg-quantum-dark-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-quantum-light mb-6">{t('support_help.knowledge.title', 'Knowledge Base')}</h2>
            <p className="text-xl text-quantum-secondary max-w-3xl mx-auto">
              {t('support_help.knowledge.subtitle', 'Detailed user guides and technical documentation')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('support_help.knowledge.user_guide.title', 'User Guide')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('support_help.knowledge.user_guide.desc', 'Complete user guide from beginner to advanced')}
              </p>
              <Link href="/support/user-guide" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                {t('support_help.knowledge.view_guide', 'View Guide')} →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('support_help.knowledge.dev_docs.title', 'Developer Docs')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('support_help.knowledge.dev_docs.desc', 'API reference, SDK usage and development best practices')}
              </p>
              <Link href="/developers/docs" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                {t('support_help.knowledge.view_docs', 'View Docs')} →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('support_help.knowledge.security_guide.title', 'Security Guide')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('support_help.knowledge.security_guide.desc', 'Security best practices to protect your assets and privacy')}
              </p>
              <Link href="/support/security-guide" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                {t('support_help.knowledge.view_guide', 'View Guide')} →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-primary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('support_help.knowledge.troubleshooting.title', 'Troubleshooting')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('support_help.knowledge.troubleshooting.desc', 'Diagnosis and solutions for common problems')}
              </p>
              <Link href="/support/troubleshooting" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                {t('support_help.knowledge.view_guide', 'View Guide')} →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-secondary rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('support_help.knowledge.video_tutorials.title', 'Video Tutorials')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('support_help.knowledge.video_tutorials.desc', 'Visual video tutorials and operation demonstrations')}
              </p>
              <Link href="/support/video-tutorials" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                {t('support_help.knowledge.watch_videos', 'Watch Videos')} →
              </Link>
            </div>

            <div className="quantum-card p-6">
              <div className="w-16 h-16 mb-4 bg-quantum-gradient-accent rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-quantum-light mb-3">{t('support_help.knowledge.release_notes.title', 'Release Notes')}</h3>
              <p className="text-quantum-secondary mb-4">
                {t('support_help.knowledge.release_notes.desc', 'Latest version feature updates and improvements')}
              </p>
              <Link href="/support/release-notes" className="text-quantum-primary hover:text-quantum-accent transition-colors">
                {t('support_help.knowledge.view_updates', 'View Updates')} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <EnhancedFooter />
    </div>
  );
}
