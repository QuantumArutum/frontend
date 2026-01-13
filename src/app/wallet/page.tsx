'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import { 
  Wallet, 
  Shield,
  ExternalLink,
  Lock,
  Zap,
  Users,
  CheckCircle,
  Play,
  Globe,
  ArrowRight,
  Sparkles,
  Key,
  Cpu,
  Network
} from 'lucide-react';
import ParticlesBackground from '../components/ParticlesBackground';

const QuantumWalletPage = () => {
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = useState(false);
  const [isHovering, setIsHovering] = useState<number | null>(null);

  const features = [
    {
      icon: Shield,
      title: t('wallet.features.list.security.title'),
      description: t('wallet.features.list.security.desc'),
      details: t('wallet.features.list.security.details'),
      gradient: 'from-emerald-500/20 to-cyan-500/20',
      iconColor: 'text-emerald-400'
    },
    {
      icon: Lock,
      title: t('wallet.features.list.web3.title'),
      description: t('wallet.features.list.web3.desc'),
      details: t('wallet.features.list.web3.details'),
      gradient: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-400'
    },
    {
      icon: Zap,
      title: t('wallet.features.list.performance.title'),
      description: t('wallet.features.list.performance.desc'),
      details: t('wallet.features.list.performance.details'),
      gradient: 'from-amber-500/20 to-orange-500/20',
      iconColor: 'text-amber-400'
    },
    {
      icon: Users,
      title: t('wallet.features.list.multi_chain.title'),
      description: t('wallet.features.list.multi_chain.desc'),
      details: t('wallet.features.list.multi_chain.details'),
      gradient: 'from-cyan-500/20 to-blue-500/20',
      iconColor: 'text-cyan-400'
    }
  ];

  const stats = [
    { label: t('wallet.stats.labels.security_level'), value: 'NIST L3', icon: Shield, color: 'text-emerald-400' },
    { label: t('wallet.stats.labels.supported_chains'), value: '10+', icon: Network, color: 'text-cyan-400' },
    { label: t('wallet.stats.labels.compatible_dapps'), value: '1000+', icon: Cpu, color: 'text-purple-400' },
    { label: t('wallet.stats.labels.active_users'), value: '50K+', icon: Users, color: 'text-blue-400' }
  ];

  const securityFeatures = [
    { icon: Key, text: t('wallet.security_guarantee.list.local_storage') },
    { icon: Shield, text: t('wallet.security_guarantee.list.multi_sig') },
    { icon: Lock, text: t('wallet.security_guarantee.list.biometric') },
    { icon: Sparkles, text: t('wallet.security_guarantee.list.quantum_rng') }
  ];

  const handleLaunchWallet = () => {
    window.open('/quantum-wallet', '_blank');
    setIsConnected(true);
  };

  const handleConnectWallet = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
      } catch (error) {
        console.error('Wallet connection failed:', error);
      }
    } else {
      handleLaunchWallet();
    }
  };

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Header Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          {/* Logo */}
          <motion.div 
            className="flex justify-center items-center mb-8"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative p-6 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg shadow-purple-500/20">
              <Wallet className="w-16 h-16 text-purple-400" />
              <motion.div
                className="absolute -top-2 -right-2 p-2 rounded-xl bg-emerald-500/20"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Shield className="w-6 h-6 text-emerald-400" />
              </motion.div>
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            <span>{t('wallet.title_prefix')}</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400 ml-2">
              {t('wallet.title_suffix')}
            </span>
          </h1>

          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-gray-300">
            {t('wallet.subtitle')}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {[
              { icon: CheckCircle, text: t('wallet.tags.quantum_secure'), color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
              { icon: Globe, text: t('wallet.tags.web3_compatible'), color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
              { icon: Sparkles, text: t('wallet.tags.nist_standard'), color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' }
            ].map((tag, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border ${tag.bg} ${tag.border}`}
              >
                <tag.icon className={`w-4 h-4 ${tag.color}`} />
                <span className={`font-medium ${tag.color}`}>{tag.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Launch Wallet Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 bg-white/5 backdrop-blur-xl border border-white/10">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 opacity-50" />

            {isConnected ? (
              <div className="relative text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-emerald-500/20"
                >
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-4 text-emerald-400">
                  {t('wallet.launch_card.connected.title')}
                </h3>
                <p className="mb-8 text-gray-300">
                  {t('wallet.launch_card.connected.desc')}
                </p>
                <button
                  onClick={handleLaunchWallet}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 bg-emerald-500 text-white hover:bg-emerald-600"
                >
                  {t('wallet.launch_card.connected.btn')}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="relative text-center">
                <motion.div
                  animate={{ 
                    boxShadow: ['0 0 20px rgba(168, 85, 247, 0.4)', '0 0 40px rgba(6, 182, 212, 0.4)', '0 0 20px rgba(168, 85, 247, 0.4)']
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-purple-500/20"
                >
                  <Play className="w-10 h-10 text-purple-400" />
                </motion.div>
                <h3 className="text-3xl font-bold mb-4 text-white">
                  {t('wallet.launch_card.disconnected.title')}
                </h3>
                <p className="text-lg mb-8 text-gray-300">
                  {t('wallet.launch_card.disconnected.desc')}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLaunchWallet}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-purple-500 to-cyan-500 text-white shadow-lg shadow-purple-500/25"
                  >
                    <ExternalLink className="w-5 h-5" />
                    {t('wallet.launch_card.disconnected.btn_launch')}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleConnectWallet}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all duration-300 bg-white/10 hover:bg-white/20 border border-white/10 text-white"
                  >
                    <Wallet className="w-5 h-5" />
                    {t('wallet.launch_card.disconnected.btn_connect')}
                  </motion.button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Core Features */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-6xl mx-auto mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-white">
            {t('wallet.features.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  onMouseEnter={() => setIsHovering(index)}
                  onMouseLeave={() => setIsHovering(null)}
                  className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 bg-white/5 backdrop-blur-md border ${isHovering === index ? 'border-white/20' : 'border-white/10'}`}
                  style={{ 
                    transform: isHovering === index ? 'translateY(-4px)' : 'none'
                  }}
                >
                  {/* Background Gradient */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />
                  
                  <div className="relative flex items-start gap-4">
                    <div className={`p-3 rounded-xl shrink-0 bg-white/5`}>
                      <IconComponent className={`w-7 h-7 ${feature.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-white">
                        {feature.title}
                      </h3>
                      <p className="mb-2 text-gray-400">
                        {feature.description}
                      </p>
                      <p className={`text-sm font-medium ${feature.iconColor}`}>
                        {feature.details}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="max-w-4xl mx-auto mb-20"
        >
          <div className="rounded-3xl p-8 bg-white/5 backdrop-blur-md border border-white/10">
            <h2 className="text-2xl font-bold text-center mb-8 text-white">
              {t('wallet.stats.title')}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center bg-white/5`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`text-2xl md:text-3xl font-bold mb-1 ${stat.color}`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Security Features */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="rounded-2xl p-6 bg-cyan-500/5 border border-cyan-500/20">
            <h3 className="text-xl font-bold text-center mb-6 text-cyan-400">
              {t('wallet.security_guarantee.title')}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {securityFeatures.map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-2">
                  <item.icon className="w-6 h-6 text-cyan-400" />
                  <span className="text-gray-300 text-sm">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-center"
        >
          <p className="text-gray-500 text-sm">
            {t('wallet.footer_note')}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default QuantumWalletPage;
