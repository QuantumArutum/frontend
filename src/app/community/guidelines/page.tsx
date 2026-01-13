'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Shield, Heart, MessageSquare, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

interface Guideline {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  dos: string[];
  donts: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getGuidelines = (t: any): Guideline[] => [
  {
    icon: Heart,
    title: t('community_page.guidelines.items.respect.title') as string,
    description: t('community_page.guidelines.items.respect.desc') as string,
    dos: t('community_page.guidelines.items.respect.dos', { returnObjects: true }) as string[],
    donts: t('community_page.guidelines.items.respect.donts', { returnObjects: true }) as string[]
  },
  {
    icon: MessageSquare,
    title: t('community_page.guidelines.items.discussion.title') as string,
    description: t('community_page.guidelines.items.discussion.desc') as string,
    dos: t('community_page.guidelines.items.discussion.dos', { returnObjects: true }) as string[],
    donts: t('community_page.guidelines.items.discussion.donts', { returnObjects: true }) as string[]
  },
  {
    icon: Shield,
    title: t('community_page.guidelines.items.privacy.title') as string,
    description: t('community_page.guidelines.items.privacy.desc') as string,
    dos: t('community_page.guidelines.items.privacy.dos', { returnObjects: true }) as string[],
    donts: t('community_page.guidelines.items.privacy.donts', { returnObjects: true }) as string[]
  },
  {
    icon: AlertTriangle,
    title: t('community_page.guidelines.items.legal.title') as string,
    description: t('community_page.guidelines.items.legal.desc') as string,
    dos: t('community_page.guidelines.items.legal.dos', { returnObjects: true }) as string[],
    donts: t('community_page.guidelines.items.legal.donts', { returnObjects: true }) as string[]
  }
];

export default function GuidelinesPage() {
  const { t } = useTranslation();
  const guidelines = getGuidelines(t);

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10">
      {/* Header */}
      <div className="bg-white/5 border-b border-white/10 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
            <Link href="/community" className="hover:text-white">{t('nav.community')}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">{t('community_page.guidelines.title')}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('community_page.guidelines.title')}</h1>
          <p className="text-gray-400">{t('community_page.guidelines.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20 mb-8">
          <h2 className="text-xl font-semibold text-white mb-3">{t('community_page.guidelines.welcome.title')}</h2>
          <p className="text-gray-300">{t('community_page.guidelines.welcome.desc')}</p>
        </div>

        {/* Guidelines */}
        <div className="space-y-6">
          {guidelines.map((guideline, index) => {
            const Icon = guideline.icon;
            return (
              <div key={index} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{guideline.title}</h3>
                  </div>
                  <p className="text-gray-400 mb-6">{guideline.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
                      <div className="flex items-center gap-2 text-green-400 font-medium mb-3">
                        <CheckCircle className="w-5 h-5" />
                        {t('community_page.guidelines.recommended')}
                      </div>
                      <ul className="space-y-2">
                        {Array.isArray(guideline.dos) && guideline.dos.map((item, i) => (
                          <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                      <div className="flex items-center gap-2 text-red-400 font-medium mb-3">
                        <XCircle className="w-5 h-5" />
                        {t('community_page.guidelines.prohibited')}
                      </div>
                      <ul className="space-y-2">
                        {Array.isArray(guideline.donts) && guideline.donts.map((item, i) => (
                          <li key={i} className="text-gray-300 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Report Section */}
        <div className="mt-8 bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-xl font-semibold text-white mb-3">{t('community_page.guidelines.report.title')}</h3>
          <p className="text-gray-400 mb-4">{t('community_page.guidelines.report.desc')}</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            <AlertTriangle className="w-5 h-5" />
            {t('community_page.guidelines.report.button')}
          </Link>
        </div>
      </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
