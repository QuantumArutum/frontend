import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../../i18n';

const ProductFeaturesSection = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 px-5 bg-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title text-4xl font-bold mb-5 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] bg-clip-text text-transparent">
            {t('features.title')}
          </h2>
          <p className="section-subtitle text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
            {t('features.description')}
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
              {t('features.badges.tests')}
            </span>
            <span className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
              {t('features.badges.vulnerabilities')}
            </span>
            <span className="px-4 py-2 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
              {t('features.badges.enterprise')}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Quantum Blockchain Core */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="feature-card bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:border-cyan-500/50"
          >
            <div className="feature-icon w-16 h-16 bg-gradient-to-br from-[#6E3CBC] to-[#00D4FF] rounded-lg flex items-center justify-center text-3xl mb-6">
              ⚛️
            </div>
            <h3 className="feature-title text-xl font-bold mb-4 text-white break-words">
              {t('features.items.blockchain.title')}
            </h3>
            <p className="feature-desc text-gray-300 mb-6 text-sm leading-relaxed break-words">
              {t('features.items.blockchain.desc')}
            </p>
            <div className="feature-stats space-y-2">
              <div className="stat-row flex justify-between items-center">
                <span className="text-gray-400 text-sm break-words flex-1 mr-2">
                  {t('features.items.blockchain.stats.speed')}
                </span>
                <span className="text-[#00D4FF] font-semibold text-sm whitespace-nowrap">
                  1250+ TPS
                </span>
              </div>
              <div className="stat-row flex justify-between items-center">
                <span className="text-gray-400 text-sm break-words flex-1 mr-2">
                  {t('features.items.blockchain.stats.security')}
                </span>
                <span className="text-[#00D4FF] font-semibold text-sm whitespace-nowrap">
                  NIST Level 3
                </span>
              </div>
              <div className="stat-row flex justify-between items-center">
                <span className="text-gray-400 text-sm break-words flex-1 mr-2">
                  {t('features.items.blockchain.stats.coverage')}
                </span>
                <span className="text-[#00D4FF] font-semibold text-sm whitespace-nowrap">100%</span>
              </div>
            </div>
          </motion.div>

          {/* Quantum Wallet */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="feature-card bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:border-cyan-500/50"
          >
            <div className="feature-icon w-16 h-16 bg-gradient-to-br from-[#6E3CBC] to-[#00D4FF] rounded-lg flex items-center justify-center text-3xl mb-6">
              💳
            </div>
            <h3 className="feature-title text-xl font-bold mb-4 text-white break-words">
              {t('features.items.wallet.title')}
            </h3>
            <p className="feature-desc text-gray-300 mb-6 text-sm leading-relaxed break-words">
              {t('features.items.wallet.desc')}
            </p>
            <div className="feature-stats space-y-2">
              <div className="stat-row flex justify-between items-center">
                <span className="text-gray-400 text-sm break-words flex-1 mr-2">
                  {t('features.items.wallet.stats.hardware')}
                </span>
                <span className="text-[#00D4FF] font-semibold text-sm whitespace-nowrap">
                  {t('features.items.wallet.values.hardware')}
                </span>
              </div>
              <div className="stat-row flex justify-between items-center">
                <span className="text-gray-400 text-sm break-words flex-1 mr-2">
                  {t('features.items.wallet.stats.biometric')}
                </span>
                <span className="text-[#00D4FF] font-semibold text-sm whitespace-nowrap">
                  {t('features.items.wallet.values.biometric')}
                </span>
              </div>
              <div className="stat-row flex justify-between items-center">
                <span className="text-gray-400 text-sm break-words flex-1 mr-2">
                  {t('features.items.wallet.stats.mobile')}
                </span>
                <span className="text-[#00D4FF] font-semibold text-sm whitespace-nowrap">
                  {t('features.items.wallet.values.mobile')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Smart Contract System */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="feature-card bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:border-cyan-500/50"
          >
            <div className="feature-icon w-16 h-16 bg-gradient-to-br from-[#6E3CBC] to-[#00D4FF] rounded-lg flex items-center justify-center text-3xl mb-6">
              📜
            </div>
            <h3 className="feature-title text-xl font-bold mb-4 text-white">
              {t('features.items.contracts.title')}
            </h3>
            <p className="feature-desc text-gray-300 mb-6">{t('features.items.contracts.desc')}</p>
            <div className="feature-stats space-y-2">
              <div className="stat-row flex justify-between">
                <span className="text-gray-400">{t('features.items.contracts.stats.vm')}</span>
                <span className="text-[#00D4FF] font-semibold">
                  {t('features.items.contracts.values.vm')}
                </span>
              </div>
              <div className="stat-row flex justify-between">
                <span className="text-gray-400">
                  {t('features.items.contracts.stats.compiler')}
                </span>
                <span className="text-[#00D4FF] font-semibold">
                  {t('features.items.contracts.values.compiler')}
                </span>
              </div>
              <div className="stat-row flex justify-between">
                <span className="text-gray-400">{t('features.items.contracts.stats.speed')}</span>
                <span className="text-[#00D4FF] font-semibold">
                  {t('features.items.contracts.values.speed')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Cross-chain Interoperability */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="feature-card bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:border-cyan-500/50"
          >
            <div className="feature-icon w-16 h-16 bg-gradient-to-br from-[#6E3CBC] to-[#00D4FF] rounded-lg flex items-center justify-center text-3xl mb-6">
              🌐
            </div>
            <h3 className="feature-title text-xl font-bold mb-4 text-white">
              {t('features.items.crosschain.title')}
            </h3>
            <p className="feature-desc text-gray-300 mb-6">{t('features.items.crosschain.desc')}</p>
            <div className="feature-stats space-y-2">
              <div className="stat-row flex justify-between">
                <span className="text-gray-400">{t('features.items.crosschain.stats.chains')}</span>
                <span className="text-[#00D4FF] font-semibold">
                  {t('features.items.crosschain.values.chains')}
                </span>
              </div>
              <div className="stat-row flex justify-between">
                <span className="text-gray-400">{t('features.items.crosschain.stats.bridge')}</span>
                <span className="text-[#00D4FF] font-semibold">
                  {t('features.items.crosschain.values.bridge')}
                </span>
              </div>
              <div className="stat-row flex justify-between">
                <span className="text-gray-400">
                  {t('features.items.crosschain.stats.verification')}
                </span>
                <span className="text-[#00D4FF] font-semibold">
                  {t('features.items.crosschain.values.verification')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Multi-language Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="feature-card bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:border-cyan-500/50"
          >
            <div className="feature-icon w-16 h-16 bg-gradient-to-br from-[#6E3CBC] to-[#00D4FF] rounded-lg flex items-center justify-center text-3xl mb-6">
              🌍
            </div>
            <h3 className="feature-title text-xl font-bold mb-4 text-white">
              {t('features.items.i18n.title')}
            </h3>
            <p className="feature-desc text-gray-300 mb-6">{t('features.items.i18n.desc')}</p>
            <div className="feature-stats space-y-2">
              <div className="stat-row flex justify-between">
                <span className="text-gray-400">{t('features.items.i18n.stats.languages')}</span>
                <span className="text-[#00D4FF] font-semibold">
                  {t('features.items.i18n.values.languages')}
                </span>
              </div>
              <div className="stat-row flex justify-between">
                <span className="text-gray-400">{t('features.items.i18n.stats.coverage')}</span>
                <span className="text-[#00D4FF] font-semibold">
                  {t('features.items.i18n.values.coverage')}
                </span>
              </div>
              <div className="stat-row flex justify-between">
                <span className="text-gray-400">{t('features.items.i18n.stats.rtl')}</span>
                <span className="text-[#00D4FF] font-semibold">
                  {t('features.items.i18n.values.rtl')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Enterprise Deployment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="feature-card bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-8 transition-all duration-300 hover:scale-105 hover:bg-white/15 hover:border-cyan-500/50"
          >
            <div className="feature-icon w-16 h-16 bg-gradient-to-br from-[#6E3CBC] to-[#00D4FF] rounded-lg flex items-center justify-center text-3xl mb-6">
              🏢
            </div>
            <h3 className="feature-title text-xl font-bold mb-4 text-white">
              {t('features.items.enterprise.title')}
            </h3>
            <p className="feature-desc text-gray-300 mb-6">{t('features.items.enterprise.desc')}</p>
            <div className="feature-stats space-y-2">
              <div className="stat-row flex justify-between">
                <span className="text-gray-400">
                  {t('features.items.enterprise.stats.availability')}
                </span>
                <span className="text-[#00D4FF] font-semibold">99.9%</span>
              </div>
              <div className="stat-row flex justify-between">
                <span className="text-gray-400">
                  {t('features.items.enterprise.stats.balancer')}
                </span>
                <span className="text-[#00D4FF] font-semibold">
                  {t('features.items.enterprise.values.balancer')}
                </span>
              </div>
              <div className="stat-row flex justify-between">
                <span className="text-gray-400">
                  {t('features.items.enterprise.stats.deployment')}
                </span>
                <span className="text-[#00D4FF] font-semibold">
                  {t('features.items.enterprise.values.deployment')}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductFeaturesSection;
