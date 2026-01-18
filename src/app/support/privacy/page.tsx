'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../../i18n/index';

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              {t('privacy.title', '隐私政策')}
            </h1>

            <div className="prose prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {t('privacy.overview.title', '概述')}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {t(
                    'privacy.overview.content',
                    'Quantaureum致力于保护您的隐私。本隐私政策说明了我们如何收集、使用和保护您的个人信息。'
                  )}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {t('privacy.collection.title', '信息收集')}
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {t('privacy.collection.content', '我们可能收集以下类型的信息：')}
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>{t('privacy.collection.personal', '个人身份信息（姓名、邮箱地址等）')}</li>
                  <li>{t('privacy.collection.usage', '使用数据和分析信息')}</li>
                  <li>{t('privacy.collection.technical', '技术信息（IP地址、浏览器类型等）')}</li>
                  <li>{t('privacy.collection.blockchain', '区块链交易数据（公开可见）')}</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {t('privacy.usage.title', '信息使用')}
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {t('privacy.usage.content', '我们使用收集的信息用于：')}
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>{t('privacy.usage.service', '提供和改进我们的服务')}</li>
                  <li>{t('privacy.usage.communication', '与您沟通重要信息')}</li>
                  <li>{t('privacy.usage.security', '确保平台安全和防止欺诈')}</li>
                  <li>{t('privacy.usage.compliance', '遵守法律法规要求')}</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {t('privacy.security.title', '数据安全')}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {t(
                    'privacy.security.content',
                    '我们采用行业领先的量子安全加密技术来保护您的数据。所有敏感信息都经过加密存储和传输。'
                  )}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {t('privacy.rights.title', '您的权利')}
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {t('privacy.rights.content', '您有权：')}
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>{t('privacy.rights.access', '访问您的个人数据')}</li>
                  <li>{t('privacy.rights.correct', '更正不准确的信息')}</li>
                  <li>{t('privacy.rights.delete', '请求删除您的数据')}</li>
                  <li>{t('privacy.rights.portability', '数据可携带性')}</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {t('privacy.contact.title', '联系我们')}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {t(
                    'privacy.contact.content',
                    '如果您对本隐私政策有任何疑问，请通过以下方式联系我们：'
                  )}
                </p>
                <div className="mt-4 text-gray-300">
                  <p>Email: privacy@quantaureum.com</p>
                  <p>Address: Quantum Security Labs, Global Innovation Center</p>
                </div>
              </section>

              <section>
                <p className="text-sm text-gray-400">
                  {t('privacy.lastUpdated', '最后更新：2024年1月1日')}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
