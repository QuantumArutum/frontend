'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { usePageContent } from '../../hooks/useSiteConfig';
import '../../i18n';

// Quantaureum network config - using environment variable for RPC URL
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545';

const QUANTAUREUM_NETWORK = {
  chainId: '0x684', // 1668 in hex
  chainName: 'Quantaureum Mainnet',
  nativeCurrency: {
    name: 'Quantaureum',
    symbol: 'QAU',
    decimals: 18,
  },
  rpcUrls: [RPC_URL],
  blockExplorerUrls: ['/explorer'],
};

// Interface for parsed hero content
interface HeroContent {
  badge?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  highlight?: string;
  cta_experience?: string;
  cta_token_sale?: string;
  cta_docs?: string;
}

const ResponsiveHeroSection = () => {
  const { t } = useTranslation();
  const [currentStat, setCurrentStat] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showMetaMaskModal, setShowMetaMaskModal] = useState(false);
  const [walletStatus, setWalletStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>(
    'idle'
  );
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Fetch dynamic hero content from API (Requirements 4.2, 4.3, 4.4)
  const { page: heroPage, loading: heroLoading } = usePageContent('home-hero');

  // Parse hero content from API or use defaults
  const heroContent: HeroContent = useMemo(() => {
    if (heroLoading || !heroPage?.content) {
      return {};
    }

    try {
      // Try to parse as JSON first
      return JSON.parse(heroPage.content);
    } catch {
      // If not JSON, return empty object (use defaults)
      return {};
    }
  }, [heroPage, heroLoading]);

  // Use dynamic content or fall back to translations
  const badge = heroContent.badge || t('hero.badge');
  const title = heroContent.title || t('hero.title');
  const subtitle = heroContent.subtitle || t('hero.subtitle');
  const description = heroContent.description || t('hero.description');
  const highlight = heroContent.highlight || t('hero.highlight');
  const ctaExperience = heroContent.cta_experience || t('hero.cta.experience');
  const ctaTokenSale = heroContent.cta_token_sale || t('hero.cta.token_sale');
  const ctaDocs = heroContent.cta_docs || t('hero.cta.docs');

  const stats = [
    {
      value: t('hero.stats.tps.value'),
      label: t('hero.stats.tps.label'),
      unit: t('hero.stats.tps.unit'),
      color: 'from-blue-400 to-cyan-400',
    },
    {
      value: t('hero.stats.score.value'),
      label: t('hero.stats.score.label'),
      unit: t('hero.stats.score.unit'),
      color: 'from-green-400 to-emerald-400',
    },
    {
      value: t('hero.stats.coverage.value'),
      label: t('hero.stats.coverage.label'),
      unit: t('hero.stats.coverage.unit'),
      color: 'from-purple-400 to-pink-400',
    },
    {
      value: t('hero.stats.languages.value'),
      label: t('hero.stats.languages.label'),
      unit: t('hero.stats.languages.unit'),
      color: 'from-orange-400 to-red-400',
    },
    {
      value: t('hero.stats.vulnerabilities.value'),
      label: t('hero.stats.vulnerabilities.label'),
      unit: t('hero.stats.vulnerabilities.unit'),
      color: 'from-teal-400 to-blue-400',
    },
    {
      value: t('hero.stats.availability.value'),
      label: t('hero.stats.availability.label'),
      unit: t('hero.stats.availability.unit'),
      color: 'from-indigo-400 to-purple-400',
    },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 5000); // 改为5秒，减少更新频率
    return () => clearInterval(interval);
  }, [stats.length]);

  // Check if MetaMask is installed
  const isMetaMaskInstalled = () => {
    return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
  };

  // Add Quantaureum network to MetaMask
  const addQuantaureumNetwork = async () => {
    if (!isMetaMaskInstalled()) {
      window.open('https://metamask.io/download/', '_blank');
      return;
    }

    setWalletStatus('connecting');
    setErrorMessage('');

    try {
      try {
        await window.ethereum!.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: QUANTAUREUM_NETWORK.chainId }],
        });
        setWalletStatus('connected');
      } catch (switchError: unknown) {
        if ((switchError as { code?: number })?.code === 4902) {
          await window.ethereum!.request({
            method: 'wallet_addEthereumChain',
            params: [QUANTAUREUM_NETWORK],
          });
          setWalletStatus('connected');
        } else {
          throw switchError;
        }
      }

      const accounts = (await window.ethereum!.request({
        method: 'eth_requestAccounts',
      })) as string[];

      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setWalletStatus('connected');
      }
    } catch (error: unknown) {
      console.error('MetaMask connection error:', error);
      setWalletStatus('error');
      setErrorMessage(
        (error as { message?: string })?.message || 'Connection failed, please try again'
      );
    }
  };

  const handleExperienceClick = () => {
    setShowMetaMaskModal(true);
    setWalletStatus('idle');
    setErrorMessage('');
  };

  const handleTokenSaleClick = () => {
    window.location.href = '/token-sale';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center py-24 px-5 relative overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? 'visible' : 'hidden'}
        className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10"
      >
        {/* Content Side */}
        <div className="hero-content order-2 lg:order-1">
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-[#6E3CBC]/20 to-[#00D4FF]/20 border border-cyan-500/30 rounded-full text-cyan-400 text-sm font-semibold mb-4">
              {badge}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] bg-clip-text text-transparent">
              {title}
            </span>
            <br />
            <span className="text-white">{subtitle}</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-2xl"
          >
            {description}
            <span className="text-cyan-400 font-semibold">{highlight}</span>
          </motion.p>

          {/* Dynamic Stats Display */}
          <motion.div
            variants={itemVariants}
            className="mb-8 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{t('hero.stats.realtime')}</h3>
              <div className="flex gap-1">
                {stats.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentStat ? 'bg-cyan-400' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
            <motion.div
              key={currentStat}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <div
                className={`text-4xl font-bold bg-gradient-to-r ${stats[currentStat].color} bg-clip-text text-transparent`}
              >
                {stats[currentStat].value}
                <span className="text-lg">{stats[currentStat].unit}</span>
              </div>
              <div className="text-gray-300">{stats[currentStat].label}</div>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-8">
            <motion.button
              onClick={handleExperienceClick}
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0, 212, 255, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] text-white rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
            >
              {ctaExperience}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleTokenSaleClick}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full font-bold text-lg text-white shadow-lg shadow-orange-500/30 border border-white/10 hover:shadow-orange-500/50 transition-all duration-300 backdrop-blur-sm"
            >
              {ctaTokenSale}
            </motion.button>
            <motion.button
              onClick={() => (window.location.href = '/developers')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-transparent text-white rounded-lg font-semibold text-lg border-2 border-[#00D4FF] hover:bg-cyan-500/10 transition-all duration-300"
            >
              {ctaDocs}
            </motion.button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 text-sm text-gray-400"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{t('hero.trust.nist')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>{t('hero.trust.audit')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>{t('hero.trust.enterprise')}</span>
            </div>
          </motion.div>
        </div>

        {/* Visual Side */}
        <div className="hero-visual order-1 lg:order-2 flex justify-center items-center relative">
          <motion.div variants={itemVariants} className="relative w-full max-w-lg">
            {/* Central Logo */}
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="relative z-10 w-72 h-72 mx-auto"
            >
              <div className="w-full h-full bg-gradient-to-br from-[#6E3CBC] to-[#00D4FF] rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/50">
                <span className="text-6xl">&#9883;</span>
              </div>
            </motion.div>

            {/* Orbital Rings */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
                transition={{
                  duration: 15 + ring * 5,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className={`absolute top-1/2 left-1/2 border-2 border-cyan-500/20 rounded-full`}
                style={{
                  width: `${300 + ring * 60}px`,
                  height: `${300 + ring * 60}px`,
                  marginTop: `-${(300 + ring * 60) / 2}px`,
                  marginLeft: `-${(300 + ring * 60) / 2}px`,
                }}
              >
                {/* Orbital Dots */}
                <motion.div
                  animate={{ rotate: ring % 2 === 0 ? -360 : 360 }}
                  transition={{
                    duration: 15 + ring * 5,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="absolute top-0 left-1/2 w-3 h-3 bg-cyan-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-cyan-400/50"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 text-gray-400 cursor-pointer hover:text-white transition-colors duration-300"
          onClick={() => {
            const element = document.getElementById('features');
            if (element) element.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span className="text-sm">{t('hero.scroll_down')}</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-3 bg-gray-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </motion.div>

      {/* MetaMask Connection Modal */}
      {showMetaMaskModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowMetaMaskModal(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-white/20 p-8 max-w-md w-full mx-4 shadow-2xl"
          >
            <button
              onClick={() => setShowMetaMaskModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center">
                <svg className="w-12 h-12" viewBox="0 0 318.6 318.6">
                  <path fill="#E2761B" d="M274.1 35.5l-99.5 73.9L193 65.8z" />
                  <path
                    fill="#E4761B"
                    d="M44.4 35.5l98.7 74.6-17.5-44.3zm193.9 171.3l-26.5 40.6 56.7 15.6 16.3-55.3zm-204.4.9L50.1 263l56.7-15.6-26.5-40.6z"
                  />
                  <path
                    fill="#E4761B"
                    d="M103.6 138.2l-15.8 23.9 56.3 2.5-2-60.5zm111.3 0l-39-34.8-1.3 61.2 56.2-2.5zM106.8 247.4l33.8-16.5-29.2-22.8zm71.1-16.5l33.9 16.5-4.7-39.3z"
                  />
                  <path
                    fill="#D7C1B3"
                    d="M211.8 247.4l-33.9-16.5 2.7 22.1-.3 9.3zm-105 0l31.5 14.9-.2-9.3 2.5-22.1z"
                  />
                  <path
                    fill="#233447"
                    d="M138.8 193.5l-28.2-8.3 19.9-9.1zm40.9 0l8.3-17.4 20 9.1z"
                  />
                  <path
                    fill="#CD6116"
                    d="M106.8 247.4l4.8-40.6-31.3.9zm100.2-40.6l4.8 40.6 26.5-39.7zm23.8-44.7l-56.2 2.5 5.2 28.9 8.3-17.4 20 9.1zm-120.2 23.1l20-9.1 8.2 17.4 5.3-28.9-56.3-2.5z"
                  />
                  <path
                    fill="#E4751F"
                    d="M87.8 162.1l23.6 46-.8-22.9zm120.3 23.1l-1 22.9 23.7-46zm-64-20.6l-5.3 28.9 6.6 34.1 1.5-44.9zm30.5 0l-2.7 18 1.2 45 6.7-34.1z"
                  />
                  <path
                    fill="#F6851B"
                    d="M179.8 193.5l-6.7 34.1 4.8 3.3 29.2-22.8 1-22.9zm-69.2-8.3l.8 22.9 29.2 22.8 4.8-3.3-6.6-34.1z"
                  />
                  <path
                    fill="#C0AD9E"
                    d="M180.3 262.3l.3-9.3-2.5-2.2h-37.7l-2.3 2.2.2 9.3-31.5-14.9 11 9 22.3 15.5h38.3l22.4-15.5 11-9z"
                  />
                  <path
                    fill="#161616"
                    d="M177.9 230.9l-4.8-3.3h-27.7l-4.8 3.3-2.5 22.1 2.3-2.2h37.7l2.5 2.2z"
                  />
                  <path
                    fill="#763D16"
                    d="M278.3 114.2l8.5-40.8-12.7-37.9-96.2 71.4 37 31.3 52.3 15.3 11.6-13.5-5-3.6 8-7.3-6.2-4.8 8-6.1zM31.8 73.4l8.5 40.8-5.4 4 8 6.1-6.1 4.8 8 7.3-5 3.6 11.5 13.5 52.3-15.3 37-31.3-96.2-71.4z"
                  />
                  <path
                    fill="#F6851B"
                    d="M267.2 153.5l-52.3-15.3 15.9 23.9-23.7 46 31.2-.4h46.5zm-163.6-15.3l-52.3 15.3-17.4 54.2h46.4l31.1.4-23.6-46zm71 26.4l3.3-57.7 15.2-41.1h-67.5l15 41.1 3.5 57.7 1.2 18.2.1 44.8h27.7l.2-44.8z"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-2">
              {t('hero.modal.title')}
            </h2>
            <p className="text-gray-400 text-center mb-6">{t('hero.modal.description')}</p>

            {/* Network Info - Horizontal Layout */}
            <div className="bg-black/30 rounded-xl p-4 mb-6">
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-gray-400 text-xs block mb-1">
                    {t('hero.modal.network')}
                  </span>
                  <span className="text-white font-medium text-sm">Quantaureum</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-gray-400 text-xs block mb-1">
                    {t('hero.modal.chainId')}
                  </span>
                  <span className="text-white font-medium text-sm">1668</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-gray-400 text-xs block mb-1">{t('hero.modal.symbol')}</span>
                  <span className="text-white font-medium text-sm">QAU</span>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <span className="text-gray-400 text-xs block mb-1">{t('hero.modal.rpc')}</span>
                  <span className="text-cyan-400 font-medium text-xs">:8545</span>
                </div>
              </div>
            </div>

            {walletStatus === 'connected' && walletAddress && (
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="font-medium">{t('hero.modal.connected')}</span>
                </div>
                <p className="text-sm text-gray-300 break-all">{walletAddress}</p>
              </div>
            )}

            {walletStatus === 'error' && errorMessage && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 text-red-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <span className="text-sm">{errorMessage}</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={addQuantaureumNetwork}
                disabled={walletStatus === 'connecting'}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {walletStatus === 'connecting' ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t('hero.modal.connecting')}
                  </>
                ) : walletStatus === 'connected' ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {t('hero.modal.added')}
                  </>
                ) : (
                  <>
                    {isMetaMaskInstalled()
                      ? t('hero.modal.add_to_metamask')
                      : t('hero.modal.install_metamask')}
                  </>
                )}
              </button>

              {walletStatus === 'connected' && (
                <a
                  href="/wallet"
                  className="block w-full py-3 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] text-white rounded-xl font-semibold text-center hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
                >
                  {t('hero.modal.enter_wallet')}
                </a>
              )}
            </div>

            <div className="mt-6 text-center">
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
              >
                {t('hero.modal.download_metamask')}
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default ResponsiveHeroSection;
