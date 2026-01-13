'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaBuilding, FaShieldAlt, FaChartLine, FaCogs, FaRocket, FaUsers, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '@/app/components/EnhancedFooter';
import ParticlesBackground from '@/app/components/ParticlesBackground';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

interface Solution {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  benefits: string[];
  caseStudy?: string;
}

interface DeploymentOption {
  title: string;
  description: string;
  features: string[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSolutions = (t: any): Solution[] => [
  {
    id: 'finance',
    icon: FaChartLine,
    title: t('enterprise.solutions.finance.title'),
    description: t('enterprise.solutions.finance.desc'),
    features: t('enterprise.solutions.finance.features', { returnObjects: true }) as unknown as string[],
    benefits: t('enterprise.solutions.finance.benefits', { returnObjects: true }) as unknown as string[],
    caseStudy: t('enterprise.solutions.finance.case_study')
  },
  {
    id: 'supply-chain',
    icon: FaCogs,
    title: t('enterprise.solutions.supply_chain.title'),
    description: t('enterprise.solutions.supply_chain.desc'),
    features: t('enterprise.solutions.supply_chain.features', { returnObjects: true }) as unknown as string[],
    benefits: t('enterprise.solutions.supply_chain.benefits', { returnObjects: true }) as unknown as string[],
    caseStudy: t('enterprise.solutions.supply_chain.case_study')
  },
  {
    id: 'healthcare',
    icon: FaShieldAlt,
    title: t('enterprise.solutions.healthcare.title'),
    description: t('enterprise.solutions.healthcare.desc'),
    features: t('enterprise.solutions.healthcare.features', { returnObjects: true }) as unknown as string[],
    benefits: t('enterprise.solutions.healthcare.benefits', { returnObjects: true }) as unknown as string[]
  },
  {
    id: 'government',
    icon: FaBuilding,
    title: t('enterprise.solutions.government.title'),
    description: t('enterprise.solutions.government.desc'),
    features: t('enterprise.solutions.government.features', { returnObjects: true }) as unknown as string[],
    benefits: t('enterprise.solutions.government.benefits', { returnObjects: true }) as unknown as string[]
  }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getDeploymentOptions = (t: any): DeploymentOption[] => [
  {
    title: t('enterprise.solutions.deployment.cloud.title'),
    description: t('enterprise.solutions.deployment.cloud.desc'),
    features: t('enterprise.solutions.deployment.cloud.features', { returnObjects: true }) as unknown as string[]
  },
  {
    title: t('enterprise.solutions.deployment.private.title'),
    description: t('enterprise.solutions.deployment.private.desc'),
    features: t('enterprise.solutions.deployment.private.features', { returnObjects: true }) as unknown as string[]
  },
  {
    title: t('enterprise.solutions.deployment.hybrid.title'),
    description: t('enterprise.solutions.deployment.hybrid.desc'),
    features: t('enterprise.solutions.deployment.hybrid.features', { returnObjects: true }) as unknown as string[]
  }
];

export default function EnterpriseSolutionsPage() {
  const { t } = useTranslation();
  const solutions = getSolutions(t);
  const deploymentOptions = getDeploymentOptions(t);
  const [selectedSolution, setSelectedSolution] = useState(solutions[0]);

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
            <span className="inline-block px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm mb-6">
              {t('enterprise.solutions.title')}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {t('enterprise.solutions.title')}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              {t('enterprise.solutions.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold"
                >
                  {t('enterprise.solutions.cta.demo')}
                </motion.button>
              </Link>
              <Link href="/enterprise/audit">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20"
                >
                  {t('enterprise.audit.reports.view')}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">{t('enterprise.solutions.title')}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Solution List */}
            <div className="space-y-4">
              {solutions.map((solution) => {
                const IconComponent = solution.icon;
                return (
                  <motion.button
                    key={solution.id}
                    whileHover={{ x: 5 }}
                    onClick={() => setSelectedSolution(solution)}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      selectedSolution.id === solution.id
                        ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border border-purple-500/50'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        selectedSolution.id === solution.id ? 'bg-purple-500/30' : 'bg-white/10'
                      }`}>
                        <IconComponent className="text-xl text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{solution.title}</h3>
                        <p className="text-gray-400 text-sm">{solution.description.slice(0, 30)}...</p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Solution Detail */}
            <div className="lg:col-span-2">
              <motion.div
                key={selectedSolution.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-600/30 to-cyan-600/30 flex items-center justify-center">
                    <selectedSolution.icon className="text-3xl text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{selectedSolution.title}</h3>
                    <p className="text-gray-400">{selectedSolution.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">{t('common.features')}</h4>
                    <ul className="space-y-2">
                      {Array.isArray(selectedSolution.features) && selectedSolution.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300">
                          <FaCheckCircle className="text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">{t('common.benefits')}</h4>
                    <ul className="space-y-2">
                      {Array.isArray(selectedSolution.benefits) && selectedSolution.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-300">
                          <FaRocket className="text-cyan-400" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {selectedSolution.caseStudy && (
                  <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-xl p-4 border border-purple-500/30">
                    <h4 className="text-white font-semibold mb-2">📊 {t('common.case_study')}</h4>
                    <p className="text-gray-300">{selectedSolution.caseStudy}</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Options */}
      <section className="py-16 px-4 bg-black/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">{t('enterprise.solutions.deployment.title')}</h2>
          <p className="text-gray-400 text-center mb-12">{t('enterprise.solutions.deployment.subtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {deploymentOptions.map((option: DeploymentOption, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-purple-500/50 transition-all"
              >
                <h3 className="text-xl font-bold text-white mb-2">{option.title}</h3>
                <p className="text-gray-400 mb-4">{option.description}</p>
                <ul className="space-y-2">
                  {Array.isArray(option.features) && option.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-300 text-sm">
                      <FaCheckCircle className="text-green-400 text-xs" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-3xl border border-purple-500/30 p-12"
          >
            <FaUsers className="text-5xl text-purple-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">{t('enterprise.solutions.cta.title')}</h2>
            <p className="text-gray-300 mb-8">{t('enterprise.solutions.subtitle')}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-xl font-semibold flex items-center gap-2"
                >
                  {t('enterprise.solutions.cta.contact')} <FaArrowRight />
                </motion.button>
              </Link>
              <Link href="/enterprise/support">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-8 py-4 bg-white/10 text-white rounded-xl font-semibold border border-white/20"
                >
                  {t('enterprise.support.title')}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
    <EnhancedFooter />
  </div>
  );
}
