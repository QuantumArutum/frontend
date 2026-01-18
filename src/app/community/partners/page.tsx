'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Handshake, Building, Rocket, Globe, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../../i18n';
import ParticlesBackground from '../../components/ParticlesBackground';
import CommunityNavbar from '../../../components/community/CommunityNavbar';
import EnhancedFooter from '../../components/EnhancedFooter';

export default function PartnersPage() {
  const { t } = useTranslation();

  const partnerTypes = [
    {
      icon: Building,
      title: t('community_partners.types.enterprise.title'),
      description: t('community_partners.types.enterprise.description'),
      benefits: t('community_partners.types.enterprise.benefits', {
        returnObjects: true,
      }) as string[],
    },
    {
      icon: Rocket,
      title: t('community_partners.types.technology.title'),
      description: t('community_partners.types.technology.description'),
      benefits: t('community_partners.types.technology.benefits', {
        returnObjects: true,
      }) as string[],
    },
    {
      icon: Globe,
      title: t('community_partners.types.ecosystem.title'),
      description: t('community_partners.types.ecosystem.description'),
      benefits: t('community_partners.types.ecosystem.benefits', {
        returnObjects: true,
      }) as string[],
    },
  ];

  const currentPartners = [
    {
      name: 'LBMA Gold',
      category: t('community_partners.partner_categories.gold_storage'),
      logo: '🏦',
    },
    { name: 'Chainlink', category: t('community_partners.partner_categories.oracle'), logo: '🔗' },
    {
      name: 'Ledger',
      category: t('community_partners.partner_categories.hardware_wallet'),
      logo: '💳',
    },
    {
      name: 'CertiK',
      category: t('community_partners.partner_categories.security_audit'),
      logo: '🛡️',
    },
    { name: 'AWS', category: t('community_partners.partner_categories.cloud_service'), logo: '☁️' },
    {
      name: 'Polygon',
      category: t('community_partners.partner_categories.cross_chain'),
      logo: '⬡',
    },
  ];

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <CommunityNavbar />
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-white/5 border-b border-white/10 pt-20">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
              <Link href="/community" className="hover:text-white">
                {t('community_partners.breadcrumb.community')}
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">{t('community_partners.breadcrumb.partners')}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Handshake className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  {t('community_partners.title')}
                </h1>
                <p className="text-gray-400">{t('community_partners.subtitle')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Partner Types */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {partnerTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 rounded-xl border border-white/10 p-6 hover:border-cyan-500/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{type.title}</h3>
                  <p className="text-gray-400 mb-4">{type.description}</p>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Current Partners */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {t('community_partners.our_partners')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {currentPartners.map((partner, index) => (
                <div
                  key={index}
                  className="bg-white/5 rounded-xl border border-white/10 p-4 text-center hover:border-white/20 transition-all"
                >
                  <div className="text-4xl mb-2">{partner.logo}</div>
                  <div className="font-medium text-white">{partner.name}</div>
                  <div className="text-xs text-gray-400">{partner.category}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-8 border border-cyan-500/20 text-center">
            <h3 className="text-2xl font-bold text-white mb-3">
              {t('community_partners.cta.title')}
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              {t('community_partners.cta.description')}
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity text-lg font-medium"
            >
              <Handshake className="w-5 h-5" />
              {t('community_partners.cta.apply')}
            </Link>
          </div>
        </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
