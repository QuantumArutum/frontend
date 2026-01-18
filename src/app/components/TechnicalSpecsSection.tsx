import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../../i18n';

type SpecTab = 'quantum-crypto' | 'performance' | 'security' | 'compatibility';

interface SpecData {
  label: string;
  value: string;
  description: string;
}

interface SpecCategory {
  title: string;
  icon: string;
  data: SpecData[];
}

const TechnicalSpecsSection = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SpecTab>('quantum-crypto');

  const specs: Record<SpecTab, SpecCategory> = {
    'quantum-crypto': {
      title: t('specs.tabs.quantum-crypto.title'),
      icon: t('specs.tabs.quantum-crypto.icon'),
      data: [
        {
          label: 'CRYSTALS-Dilithium',
          value: 'NIST Level 3',
          description: t('specs.data.crypto.dilithium'),
        },
        {
          label: 'CRYSTALS-Kyber',
          value: 'NIST Level 3',
          description: t('specs.data.crypto.kyber'),
        },
        {
          label: 'SPHINCS+',
          value: t('specs.data.crypto.sphincs_value'),
          description: t('specs.data.crypto.sphincs'),
        },
        {
          label: t('specs.data.crypto.prng_label'),
          value: t('specs.data.crypto.prng_value'),
          description: t('specs.data.crypto.prng'),
        },
        {
          label: t('specs.data.crypto.key_length_label'),
          value: t('specs.data.crypto.key_length_value'),
          description: t('specs.data.crypto.key_length'),
        },
        {
          label: t('specs.data.crypto.signature_length_label'),
          value: t('specs.data.crypto.signature_length_value'),
          description: t('specs.data.crypto.signature_length'),
        },
      ],
    },
    performance: {
      title: t('specs.tabs.performance.title'),
      icon: t('specs.tabs.performance.icon'),
      data: [
        {
          label: t('specs.data.performance.tps_label'),
          value: '1250+ TPS',
          description: t('specs.data.performance.tps'),
        },
        {
          label: t('specs.data.performance.block_time_label'),
          value: t('specs.data.performance.block_time_value'),
          description: t('specs.data.performance.block_time'),
        },
        {
          label: t('specs.data.performance.key_gen_label'),
          value: t('specs.data.performance.key_gen_value'),
          description: t('specs.data.performance.key_gen'),
        },
        {
          label: t('specs.data.performance.verify_label'),
          value: t('specs.data.performance.verify_value'),
          description: t('specs.data.performance.verify'),
        },
        {
          label: t('specs.data.performance.latency_label'),
          value: '45ms',
          description: t('specs.data.performance.latency'),
        },
        {
          label: t('specs.data.performance.memory_label'),
          value: '1.4GB',
          description: t('specs.data.performance.memory'),
        },
      ],
    },
    security: {
      title: t('specs.tabs.security.title'),
      icon: t('specs.tabs.security.icon'),
      data: [
        {
          label: t('specs.data.security.vulnerabilities_label'),
          value: t('specs.data.security.vulnerabilities_value'),
          description: t('specs.data.security.vulnerabilities'),
        },
        {
          label: t('specs.data.security.coverage_label'),
          value: t('specs.data.security.coverage_value'),
          description: t('specs.data.security.coverage'),
        },
        {
          label: t('specs.data.security.penetration_label'),
          value: t('specs.data.security.penetration_value'),
          description: t('specs.data.security.penetration'),
        },
        {
          label: t('specs.data.security.quantum_resistance_label'),
          value: t('specs.data.security.quantum_resistance_value'),
          description: t('specs.data.security.quantum_resistance'),
        },
        {
          label: t('specs.data.security.side_channel_label'),
          value: t('specs.data.security.side_channel_value'),
          description: t('specs.data.security.side_channel'),
        },
        {
          label: t('specs.data.security.formal_verification_label'),
          value: t('specs.data.security.formal_verification_value'),
          description: t('specs.data.security.formal_verification'),
        },
      ],
    },
    compatibility: {
      title: t('specs.tabs.compatibility.title'),
      icon: t('specs.tabs.compatibility.icon'),
      data: [
        {
          label: t('specs.data.compatibility.evm_label'),
          value: t('specs.data.compatibility.evm_value'),
          description: t('specs.data.compatibility.evm'),
        },
        {
          label: t('specs.data.compatibility.protocols_label'),
          value: t('specs.data.compatibility.protocols_value'),
          description: t('specs.data.compatibility.protocols'),
        },
        {
          label: t('specs.data.compatibility.hardware_label'),
          value: t('specs.data.compatibility.hardware_value'),
          description: t('specs.data.compatibility.hardware'),
        },
        {
          label: t('specs.data.compatibility.api_label'),
          value: t('specs.data.compatibility.api_value'),
          description: t('specs.data.compatibility.api'),
        },
        {
          label: t('specs.data.compatibility.languages_label'),
          value: t('specs.data.compatibility.languages_value'),
          description: t('specs.data.compatibility.languages'),
        },
        {
          label: t('specs.data.compatibility.os_label'),
          value: t('specs.data.compatibility.os_value'),
          description: t('specs.data.compatibility.os'),
        },
      ],
    },
  };

  return (
    <section className="py-24 px-5 bg-gradient-to-br from-gray-900/50 to-black/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-5 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] bg-clip-text text-transparent">
            {t('specs.title')}
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">{t('specs.description')}</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-12 gap-4">
          {(Object.entries(specs) as [SpecTab, SpecCategory][]).map(([key, spec]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === key
                  ? 'bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              <span className="text-xl">{spec.icon}</span>
              {spec.title}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specs[activeTab].data.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white/5 rounded-lg p-6 border border-white/10 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-semibold text-lg break-words flex-1 mr-3">
                    {item.label}
                  </h3>
                  <span className="text-[#00D4FF] font-bold text-xl whitespace-nowrap">
                    {item.value}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed break-words">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Real-time Status Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-6 border border-green-500/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold">
                {t('specs.status.network_label')}
              </span>
            </div>
            <div className="text-white text-2xl font-bold">{t('specs.status.network_value')}</div>
            <div className="text-green-300 text-sm">{t('specs.status.network_desc')}</div>
          </div>

          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-6 border border-blue-500/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-400 font-semibold">{t('specs.status.nodes_label')}</span>
            </div>
            <div className="text-white text-2xl font-bold">{t('specs.status.nodes_value')}</div>
            <div className="text-blue-300 text-sm">{t('specs.status.nodes_desc')}</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg p-6 border border-purple-500/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-purple-400 font-semibold">{t('specs.status.tps_label')}</span>
            </div>
            <div className="text-white text-2xl font-bold">{t('specs.status.tps_value')}</div>
            <div className="text-purple-300 text-sm">{t('specs.status.tps_desc')}</div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-lg p-6 border border-cyan-500/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse"></div>
              <span className="text-cyan-400 font-semibold">{t('specs.status.quantum_label')}</span>
            </div>
            <div className="text-white text-2xl font-bold">{t('specs.status.quantum_value')}</div>
            <div className="text-cyan-300 text-sm">{t('specs.status.quantum_desc')}</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TechnicalSpecsSection;
