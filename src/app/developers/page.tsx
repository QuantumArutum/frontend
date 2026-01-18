'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '@/app/components/EnhancedFooter';
import ParticlesBackground from '@/app/components/ParticlesBackground';
import '../../i18n/index';

export default function DevelopersPage() {
  const { t } = useTranslation();

  const resources = [
    {
      title: t('developers.resources.docs.title', 'Documentation'),
      description: t(
        'developers.resources.docs.description',
        'Complete API docs, SDK guides and tutorials'
      ),
      icon: '📚',
      href: '/developers/docs',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      title: t('developers.resources.api.title', 'API Reference'),
      description: t(
        'developers.resources.api.description',
        'RESTful API documentation and sample code'
      ),
      icon: '🔌',
      href: '/developers/api',
      color: 'from-purple-600 to-pink-600',
    },
    {
      title: t('developers.resources.sdk.title', 'SDK Download'),
      description: t(
        'developers.resources.sdk.description',
        'Multi-language SDK packages and dev tools'
      ),
      icon: '📦',
      href: '/developers/sdk',
      color: 'from-green-600 to-teal-600',
    },
  ];

  const quickStart = [
    {
      step: '1',
      title: t('developers.quickStart.step1.title', 'Get API Key'),
      description: t(
        'developers.quickStart.step1.description',
        'Register a developer account and get your API access key'
      ),
    },
    {
      step: '2',
      title: t('developers.quickStart.step2.title', 'Install SDK'),
      description: t(
        'developers.quickStart.step2.description',
        'Choose your preferred programming language and install the SDK'
      ),
    },
    {
      step: '3',
      title: t('developers.quickStart.step3.title', 'Start Building'),
      description: t(
        'developers.quickStart.step3.description',
        'Check sample code and start building your quantum-safe app'
      ),
    },
  ];

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <EnhancedNavbar />
      <div className="container mx-auto px-4 py-16 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6">
              {t('developers.title', 'Developer Resources')}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t(
                'developers.subtitle',
                'Build next-generation applications using Quantaureum quantum-safe blockchain technology. Get complete development tools, documentation and support.'
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:border-cyan-400/50 transition-all duration-300 group"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{resource.icon}</div>
                  <h3 className="text-2xl font-semibold text-white mb-4">{resource.title}</h3>
                  <p className="text-gray-300 mb-6">{resource.description}</p>
                  <a
                    href={resource.href}
                    className={`inline-block bg-gradient-to-r ${resource.color} text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200`}
                  >
                    {t('developers.resources.explore', 'Explore')} →
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              {t('developers.quickStart.title', 'Quick Start')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {quickStart.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-300">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">
              {t('developers.codeExample.title', 'Code Example')}
            </h2>
            <div className="bg-black/50 rounded-lg p-6 font-mono text-sm overflow-x-auto">
              <div className="text-green-400 mb-2">{`// ${t('developers.codeExample.comment', 'Create quantum-safe wallet')}`}</div>
              <div className="text-blue-400">import</div>{' '}
              <span className="text-white">{'{ QuantumWallet }'}</span>{' '}
              <span className="text-blue-400">from</span>{' '}
              <span className="text-yellow-400">{`'@quantaureum/sdk'`}</span>
              <span className="text-white">;</span>
              <br />
              <br />
              <span className="text-blue-400">const</span>{' '}
              <span className="text-white">wallet</span> <span className="text-purple-400">=</span>{' '}
              <span className="text-blue-400">new</span>{' '}
              <span className="text-green-300">QuantumWallet</span>
              <span className="text-white">(</span>
              <span className="text-yellow-400">{`'your-api-key'`}</span>
              <span className="text-white">);</span>
              <br />
              <span className="text-blue-400">const</span>{' '}
              <span className="text-white">address</span> <span className="text-purple-400">=</span>{' '}
              <span className="text-blue-400">await</span>{' '}
              <span className="text-white">wallet.</span>
              <span className="text-green-300">createAddress</span>
              <span className="text-white">();</span>
              <br />
              <span className="text-gray-400">console.</span>
              <span className="text-green-300">log</span>
              <span className="text-white">(</span>
              <span className="text-yellow-400">{`'Quantum-safe address:'`}</span>
              <span className="text-white">, address);</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-4">
                {t('developers.community.title', 'Developer Community')}
              </h3>
              <p className="text-gray-300 mb-6">
                {t(
                  'developers.community.description',
                  'Join our developer community to exchange experiences and get technical support.'
                )}
              </p>
              <div className="space-y-3">
                <a
                  href="/community"
                  className="block text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  🌐 {t('developers.community.forum', 'Developer Forum')}
                </a>
                <a
                  href="https://github.com/quantaureum"
                  className="block text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  💻 {t('developers.community.github', 'GitHub Repository')}
                </a>
                <a
                  href="https://discord.gg/quantaureum"
                  className="block text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  💬 {t('developers.community.discord', 'Discord Channel')}
                </a>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-4">
                {t('developers.support.title', 'Technical Support')}
              </h3>
              <p className="text-gray-300 mb-6">
                {t(
                  'developers.support.description',
                  'Having issues? Our technical team is ready to help.'
                )}
              </p>
              <div className="space-y-3">
                <a
                  href="/support/help"
                  className="block text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  📖 {t('developers.support.docs', 'Help Documentation')}
                </a>
                <a
                  href="/faq"
                  className="block text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  ❓ {t('developers.support.faq', 'FAQ')}
                </a>
                <a
                  href="/contact"
                  className="block text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  📧 {t('developers.support.contact', 'Contact Support')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
