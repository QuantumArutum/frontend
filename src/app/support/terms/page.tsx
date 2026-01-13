'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import '../../../i18n/index';

export default function TermsOfService() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <h1 className="text-4xl font-bold text-white mb-8 text-center">
              {t('terms.title', '服务条款')}
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {t('terms.acceptance.title', '条款接受')}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {t('terms.acceptance.content', '通过访问和使用Quantaureum平台，您同意遵守本服务条款。如果您不同意这些条款，请不要使用我们的服务。')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {t('terms.services.title', '服务描述')}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {t('terms.services.content', 'Quantaureum提供基于后量子密码学的区块链平台服务，包括但不限于量子钱包、智能合约、跨链互操作等功能。')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {t('terms.responsibilities.title', '用户责任')}
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {t('terms.responsibilities.content', '作为用户，您同意：')}
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>{t('terms.responsibilities.lawful', '合法使用我们的服务')}</li>
                  <li>{t('terms.responsibilities.security', '保护您的账户安全')}</li>
                  <li>{t('terms.responsibilities.accurate', '提供准确的信息')}</li>
                  <li>{t('terms.responsibilities.compliance', '遵守所有适用的法律法规')}</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {t('terms.prohibited.title', '禁止行为')}
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {t('terms.prohibited.content', '您不得：')}
                </p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>{t('terms.prohibited.illegal', '进行任何非法活动')}</li>
                  <li>{t('terms.prohibited.harm', '损害平台或其他用户')}</li>
                  <li>{t('terms.prohibited.unauthorized', '未经授权访问系统')}</li>
                  <li>{t('terms.prohibited.manipulation', '操纵市场或价格')}</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {t('terms.risks.title', '风险披露')}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {t('terms.risks.content', '区块链和加密货币交易存在固有风险。价格可能大幅波动，您可能损失全部投资。请在使用前充分了解相关风险。')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {t('terms.liability.title', '责任限制')}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {t('terms.liability.content', 'Quantaureum在法律允许的最大范围内限制其责任。我们不对任何间接、偶然或后果性损害承担责任。')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {t('terms.termination.title', '服务终止')}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {t('terms.termination.content', '我们保留在任何时候暂停或终止您的账户的权利，特别是在违反本条款的情况下。')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {t('terms.changes.title', '条款变更')}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {t('terms.changes.content', '我们可能会不时更新这些条款。重大变更将通过平台通知您。继续使用服务即表示接受更新后的条款。')}
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {t('terms.contact.title', '联系信息')}
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {t('terms.contact.content', '如果您对本服务条款有任何疑问，请联系我们：')}
                </p>
                <div className="mt-4 text-gray-300">
                  <p>Email: legal@quantaureum.com</p>
                  <p>Address: Quantum Security Labs, Global Innovation Center</p>
                </div>
              </section>

              <section>
                <p className="text-sm text-gray-400">
                  {t('terms.lastUpdated', '最后更新：2024年1月1日')}
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

