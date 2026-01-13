'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Cookie, Settings, BarChart, Shield, ChevronRight } from 'lucide-react';
import '../../../i18n/index';

export default function CookiePolicyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#1a1a2e]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <Link href="/" className="hover:text-white">{t('legal.home', 'Home')}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{t('legal.cookies.title', 'Cookie Policy')}</span>
          </div>
          <div className="flex items-center gap-4">
            <Cookie className="w-12 h-12 text-cyan-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">{t('legal.cookies.title', 'Cookie Policy')}</h1>
              <p className="text-gray-400 mt-1">{t('legal.last_updated', 'Last Updated')}: 2024-01-01</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-invert max-w-none">
          {/* What are Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">{t('legal.cookies.what.title', 'What are Cookies?')}</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                {t('legal.cookies.what.content', 'Cookies are small text files stored on your device that remember your preferences and improve your browsing experience. When you visit our website, we may place cookies on your device. These cookies help us understand how you use our services and enable us to provide you with a better experience.')}
              </p>
            </div>
          </section>

          {/* Cookie Types */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Settings className="w-6 h-6 text-cyan-400" />
              {t('legal.cookies.types.title', 'Types of Cookies We Use')}
            </h2>
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">{t('legal.cookies.types.essential.title', 'Essential Cookies')}</h3>
                <p className="text-gray-300 mb-3">
                  {t('legal.cookies.types.essential.desc', 'These cookies are necessary for basic website functionality and cannot be disabled.')}
                </p>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• {t('legal.cookies.types.essential.item1', 'Session management')}</li>
                  <li>• {t('legal.cookies.types.essential.item2', 'Security authentication')}</li>
                  <li>• {t('legal.cookies.types.essential.item3', 'Load balancing')}</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">{t('legal.cookies.types.functional.title', 'Functional Cookies')}</h3>
                <p className="text-gray-300 mb-3">
                  {t('legal.cookies.types.functional.desc', 'These cookies enable the website to remember your choices and provide enhanced personalized features.')}
                </p>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• {t('legal.cookies.types.functional.item1', 'Language preferences')}</li>
                  <li>• {t('legal.cookies.types.functional.item2', 'Theme settings')}</li>
                  <li>• {t('legal.cookies.types.functional.item3', 'User interface customization')}</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-cyan-400" />
                  {t('legal.cookies.types.analytics.title', 'Analytics Cookies')}
                </h3>
                <p className="text-gray-300 mb-3">
                  {t('legal.cookies.types.analytics.desc', 'These cookies help us understand how visitors interact with the website so we can improve our services.')}
                </p>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• {t('legal.cookies.types.analytics.item1', 'Page visit statistics')}</li>
                  <li>• {t('legal.cookies.types.analytics.item2', 'User behavior analysis')}</li>
                  <li>• {t('legal.cookies.types.analytics.item3', 'Performance monitoring')}</li>
                </ul>
              </div>
              
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">{t('legal.cookies.types.marketing.title', 'Marketing Cookies')}</h3>
                <p className="text-gray-300 mb-3">
                  {t('legal.cookies.types.marketing.desc', 'These cookies are used to track visitors across websites to display relevant advertisements.')}
                </p>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• {t('legal.cookies.types.marketing.item1', 'Ad targeting')}</li>
                  <li>• {t('legal.cookies.types.marketing.item2', 'Social media integration')}</li>
                  <li>• {t('legal.cookies.types.marketing.item3', 'Conversion tracking')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookie List */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">{t('legal.cookies.list.title', 'Specific Cookie List')}</h2>
            <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left text-white p-4">{t('legal.cookies.list.name', 'Name')}</th>
                    <th className="text-left text-white p-4">{t('legal.cookies.list.type', 'Type')}</th>
                    <th className="text-left text-white p-4">{t('legal.cookies.list.duration', 'Duration')}</th>
                    <th className="text-left text-white p-4">{t('legal.cookies.list.purpose', 'Purpose')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="text-gray-300 p-4">session_id</td>
                    <td className="text-gray-400 p-4">{t('legal.cookies.types.essential.title', 'Essential')}</td>
                    <td className="text-gray-400 p-4">{t('legal.cookies.list.session', 'Session')}</td>
                    <td className="text-gray-400 p-4">{t('legal.cookies.list.session_mgmt', 'User session management')}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-300 p-4">auth_token</td>
                    <td className="text-gray-400 p-4">{t('legal.cookies.types.essential.title', 'Essential')}</td>
                    <td className="text-gray-400 p-4">7 {t('legal.cookies.list.days', 'days')}</td>
                    <td className="text-gray-400 p-4">{t('legal.cookies.list.auth', 'Authentication')}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-300 p-4">locale</td>
                    <td className="text-gray-400 p-4">{t('legal.cookies.types.functional.title', 'Functional')}</td>
                    <td className="text-gray-400 p-4">1 {t('legal.cookies.list.year', 'year')}</td>
                    <td className="text-gray-400 p-4">{t('legal.cookies.list.language', 'Language preference')}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-300 p-4">theme</td>
                    <td className="text-gray-400 p-4">{t('legal.cookies.types.functional.title', 'Functional')}</td>
                    <td className="text-gray-400 p-4">1 {t('legal.cookies.list.year', 'year')}</td>
                    <td className="text-gray-400 p-4">{t('legal.cookies.list.theme', 'Theme settings')}</td>
                  </tr>
                  <tr>
                    <td className="text-gray-300 p-4">_ga</td>
                    <td className="text-gray-400 p-4">{t('legal.cookies.types.analytics.title', 'Analytics')}</td>
                    <td className="text-gray-400 p-4">2 {t('legal.cookies.list.years', 'years')}</td>
                    <td className="text-gray-400 p-4">Google Analytics</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Managing Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-cyan-400" />
              {t('legal.cookies.manage.title', 'Managing Your Cookie Preferences')}
            </h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('legal.cookies.manage.intro', 'You can manage cookies in the following ways:')}
              </p>
              <ul className="text-gray-300 space-y-3">
                <li>
                  <strong className="text-white">{t('legal.cookies.manage.browser.title', 'Browser Settings')}:</strong>
                  {' '}{t('legal.cookies.manage.browser.desc', 'Most browsers allow you to control cookies through settings. You can choose to block all cookies or only third-party cookies.')}
                </li>
                <li>
                  <strong className="text-white">{t('legal.cookies.manage.center.title', 'Cookie Preference Center')}:</strong>
                  {' '}{t('legal.cookies.manage.center.desc', 'You can use the cookie preference center on our website to manage non-essential cookies.')}
                </li>
                <li>
                  <strong className="text-white">{t('legal.cookies.manage.optout.title', 'Opt Out')}:</strong>
                  {' '}{t('legal.cookies.manage.optout.desc', 'For analytics cookies, you can use the Google Analytics opt-out browser add-on.')}
                </li>
              </ul>
              <p className="text-yellow-400 mt-4 text-sm">
                {t('legal.cookies.manage.warning', 'Note: Disabling certain cookies may affect website functionality and your user experience.')}
              </p>
            </div>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">{t('legal.cookies.updates.title', 'Policy Updates')}</h2>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <p className="text-gray-300 leading-relaxed">
                {t('legal.cookies.updates.content', 'We may update this cookie policy from time to time. Any changes will be posted on this page with the last updated date noted. We recommend that you review this policy regularly to stay informed about how we use cookies.')}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
