'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Bug, Shield, Award, AlertTriangle, CheckCircle, DollarSign, Copy, Check } from 'lucide-react';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

export default function BugBountyPage() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('security@quantaureum.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const severityLevels = [
    { level: t('community_sub.bug_bounty.severity.critical.level'), reward: t('community_sub.bug_bounty.severity.critical.reward'), color: 'from-red-500 to-rose-500', description: t('community_sub.bug_bounty.severity.critical.desc') },
    { level: t('community_sub.bug_bounty.severity.high.level'), reward: t('community_sub.bug_bounty.severity.high.reward'), color: 'from-orange-500 to-amber-500', description: t('community_sub.bug_bounty.severity.high.desc') },
    { level: t('community_sub.bug_bounty.severity.medium.level'), reward: t('community_sub.bug_bounty.severity.medium.reward'), color: 'from-yellow-500 to-lime-500', description: t('community_sub.bug_bounty.severity.medium.desc') },
    { level: t('community_sub.bug_bounty.severity.low.level'), reward: t('community_sub.bug_bounty.severity.low.reward'), color: 'from-green-500 to-emerald-500', description: t('community_sub.bug_bounty.severity.low.desc') },
  ];
  
  const inScope = t('community_sub.bug_bounty.scope.items_in', { returnObjects: true }) as string[];
  const outOfScope = t('community_sub.bug_bounty.scope.items_out', { returnObjects: true }) as string[];

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
            <span className="text-white">Bug Bounty</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
              <Bug className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">{t('community_sub.bug_bounty.title')}</h1>
              <p className="text-gray-400">{t('community_sub.bug_bounty.subtitle')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
            <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">$500K+</div>
            <div className="text-sm text-gray-400">{t('community_sub.bug_bounty.stats.rewards_paid')}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
            <Shield className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">156</div>
            <div className="text-sm text-gray-400">{t('community_sub.bug_bounty.stats.bugs_fixed')}</div>
          </div>
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 text-center">
            <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">89</div>
            <div className="text-sm text-gray-400">{t('community_sub.bug_bounty.stats.researchers')}</div>
          </div>
        </div>

        {/* Severity Levels */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">{t('community_sub.bug_bounty.reward_levels')}</h2>
          <div className="space-y-3">
            {severityLevels.map((level) => (
              <div key={level.level} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <div className="flex items-center">
                  <div className={`w-2 h-full bg-gradient-to-b ${level.color}`} />
                  <div className="flex-1 p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-white">{level.level}</div>
                      <div className="text-sm text-gray-400">{level.description}</div>
                    </div>
                    <div className="text-lg font-bold text-green-400">{level.reward}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scope */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center gap-2 text-green-400 font-semibold mb-4">
              <CheckCircle className="w-5 h-5" />
              {t('community_sub.bug_bounty.scope.in_scope')}
            </div>
            <ul className="space-y-2">
              {inScope.map((item, i) => (
                <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-red-500/10 rounded-xl p-6 border border-red-500/20">
            <div className="flex items-center gap-2 text-red-400 font-semibold mb-4">
              <AlertTriangle className="w-5 h-5" />
              {t('community_sub.bug_bounty.scope.out_scope')}
            </div>
            <ul className="space-y-2">
              {outOfScope.map((item, i) => (
                <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Submit */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">{t('community_sub.bug_bounty.found_bug')}</h3>
          <p className="text-gray-400 mb-4">{t('community_sub.bug_bounty.submit_desc')}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:security@quantaureum.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              <Bug className="w-5 h-5" />
              {t('community_sub.bug_bounty.submit')}
            </a>
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-green-400" />
                  <span>已复制</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>复制邮箱</span>
                </>
              )}
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-3">security@quantaureum.com</p>
        </div>
      </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
