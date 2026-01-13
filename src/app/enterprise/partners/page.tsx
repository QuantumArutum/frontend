'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaHandshake, FaRocket, FaGlobe, FaAward, FaChartLine, FaUsers, FaCheckCircle, FaArrowRight, FaBuilding, FaCode, FaShieldAlt } from 'react-icons/fa';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '@/app/components/EnhancedFooter';
import ParticlesBackground from '@/app/components/ParticlesBackground';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

/* eslint-disable @typescript-eslint/no-explicit-any */
const getPartnerTypes = (t: any) => [
  {
    icon: FaBuilding,
    title: t('enterprise.partners.types.technology.title'),
    description: t('enterprise.partners.types.technology.desc'),
    benefits: t('enterprise.partners.types.technology.benefits', { returnObjects: true }) as string[],
    examples: t('enterprise.partners.types.technology.examples', { returnObjects: true }) as string[]
  },
  {
    icon: FaCode,
    title: t('enterprise.partners.types.developer.title'),
    description: t('enterprise.partners.types.developer.desc'),
    benefits: t('enterprise.partners.types.developer.benefits', { returnObjects: true }) as string[],
    examples: t('enterprise.partners.types.developer.examples', { returnObjects: true }) as string[]
  },
  {
    icon: FaGlobe,
    title: t('enterprise.partners.types.channel.title'),
    description: t('enterprise.partners.types.channel.desc'),
    benefits: t('enterprise.partners.types.channel.benefits', { returnObjects: true }) as string[],
    examples: t('enterprise.partners.types.channel.examples', { returnObjects: true }) as string[]
  }
];

const getFeaturedPartners = (t: any) => [
  { name: 'AWS', category: t('enterprise.partners.categories.cloud'), logo: '☁️' },
  { name: 'Microsoft Azure', category: t('enterprise.partners.categories.cloud'), logo: '🔷' },
  { name: 'Google Cloud', category: t('enterprise.partners.categories.cloud'), logo: '🌐' },
  { name: 'Deloitte', category: t('enterprise.partners.categories.consulting'), logo: '📊' },
  { name: 'PwC', category: t('enterprise.partners.categories.audit'), logo: '📈' },
  { name: 'IBM', category: t('enterprise.partners.categories.technology'), logo: '💻' },
  { name: 'Accenture', category: t('enterprise.partners.categories.consulting'), logo: '🎯' },
  { name: 'KPMG', category: t('enterprise.partners.categories.audit'), logo: '📋' }
];

const getPartnerBenefits = (t: any) => [
  {
    icon: FaRocket,
    title: t('enterprise.partners.benefits_list.growth.title'),
    description: t('enterprise.partners.benefits_list.growth.desc')
  },
  {
    icon: FaChartLine,
    title: t('enterprise.partners.benefits_list.revenue.title'),
    description: t('enterprise.partners.benefits_list.revenue.desc')
  },
  {
    icon: FaUsers,
    title: t('enterprise.partners.benefits_list.support.title'),
    description: t('enterprise.partners.benefits_list.support.desc')
  },
  {
    icon: FaAward,
    title: t('enterprise.partners.benefits_list.certification.title'),
    description: t('enterprise.partners.benefits_list.certification.desc')
  }
];

const getPartnerLevels = (t: any) => [
  {
    level: t('enterprise.partners.levels.registered.name'),
    color: 'from-gray-500 to-gray-600',
    requirements: t('enterprise.partners.levels.registered.requirements', { returnObjects: true }) as string[],
    benefits: t('enterprise.partners.levels.registered.benefits', { returnObjects: true }) as string[]
  },
  {
    level: t('enterprise.partners.levels.silver.name'),
    color: 'from-gray-400 to-gray-500',
    requirements: t('enterprise.partners.levels.silver.requirements', { returnObjects: true }) as string[],
    benefits: t('enterprise.partners.levels.silver.benefits', { returnObjects: true }) as string[]
  },
  {
    level: t('enterprise.partners.levels.gold.name'),
    color: 'from-yellow-500 to-yellow-600',
    requirements: t('enterprise.partners.levels.gold.requirements', { returnObjects: true }) as string[],
    benefits: t('enterprise.partners.levels.gold.benefits', { returnObjects: true }) as string[]
  },
  {
    level: t('enterprise.partners.levels.platinum.name'),
    color: 'from-purple-400 to-purple-600',
    requirements: t('enterprise.partners.levels.platinum.requirements', { returnObjects: true }) as string[],
    benefits: t('enterprise.partners.levels.platinum.benefits', { returnObjects: true }) as string[]
  }
];

export default function EnterprisePartnersPage() {
  const { t } = useTranslation();
  const partnerTypes = getPartnerTypes(t);
  const featuredPartners = getFeaturedPartners(t);
  const partnerBenefits = getPartnerBenefits(t);
  const partnerLevels = getPartnerLevels(t);

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <EnhancedNavbar />
      <div className="relative z-10">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm mb-6">
              {t('enterprise.partners.title')}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('enterprise.partners.hero.title_prefix')}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"> {t('enterprise.partners.hero.title_highlight')} </span>
              {t('enterprise.partners.hero.title_suffix')}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              {t('enterprise.partners.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold flex items-center gap-2"
                >
                  <FaHandshake /> {t('enterprise.partners.apply.button')}
                </motion.button>
              </Link>
              <Link href="/enterprise/solutions">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20"
                >
                  {t('enterprise.partners.view_solutions')}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">{t('enterprise.partners.types_title')}</h2>
          <p className="text-gray-400 text-center mb-12">{t('enterprise.partners.types_subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partnerTypes.map((type, index) => {
              const IconComponent = type.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 hover:border-blue-500/50 transition-all"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="text-2xl text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{type.title}</h3>
                      <p className="text-gray-400">{type.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">{t('enterprise.partners.benefits.title')}</h4>
                      <ul className="space-y-1">
                        {type.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-gray-400 text-sm">
                            <FaCheckCircle className="text-green-400 text-xs" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">{t('enterprise.partners.suitable_for')}</h4>
                      <ul className="space-y-1">
                        {type.examples.map((example, idx) => (
                          <li key={idx} className="text-gray-400 text-sm">• {example}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Partners */}
      <section className="py-16 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">{t('enterprise.partners.featured_title')}</h2>
          <p className="text-gray-400 text-center mb-12">{t('enterprise.partners.featured_subtitle')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredPartners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center hover:border-blue-500/50 transition-all"
              >
                <div className="text-4xl mb-3">{partner.logo}</div>
                <h3 className="text-white font-semibold">{partner.name}</h3>
                <p className="text-gray-400 text-sm">{partner.category}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Benefits */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">{t('enterprise.partners.benefits.title')}</h2>
          <p className="text-gray-400 text-center mb-12">{t('enterprise.partners.benefits.subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600/30 to-cyan-600/30 flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-2xl text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner Levels */}
      <section className="py-16 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">{t('enterprise.partners.levels_title')}</h2>
          <p className="text-gray-400 text-center mb-12">{t('enterprise.partners.levels_subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerLevels.map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
              >
                <div className={`bg-gradient-to-r ${level.color} p-4 text-center`}>
                  <h3 className="text-lg font-bold text-white">{level.level}</h3>
                </div>
                <div className="p-6">
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">{t('enterprise.partners.requirements')}</h4>
                    <ul className="space-y-1">
                      {level.requirements.map((req, idx) => (
                        <li key={idx} className="text-gray-400 text-sm">• {req}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">{t('enterprise.partners.benefits.title')}</h4>
                    <ul className="space-y-1">
                      {level.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-gray-400 text-sm">
                          <FaCheckCircle className="text-green-400 text-xs flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-3xl border border-blue-500/30 p-12"
          >
            <FaHandshake className="text-5xl text-blue-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">{t('enterprise.partners.cta.title')}</h2>
            <p className="text-gray-300 mb-8">{t('enterprise.partners.cta.subtitle')}</p>
            <Link href="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold flex items-center gap-2 mx-auto"
              >
                {t('enterprise.partners.apply.button')} <FaArrowRight />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
    <EnhancedFooter />
  </div>
  );
}
