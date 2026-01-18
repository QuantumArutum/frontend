'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  ExternalLink,
  Play,
  Shield,
  Zap,
  Globe,
  Users,
  DollarSign,
  Activity,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EnhancedNavbar from '@/app/components/EnhancedNavbar';
import EnhancedFooter from '../components/EnhancedFooter';
import ParticlesBackground from '../components/ParticlesBackground';
import '../../i18n';

const TradingPage = () => {
  const { t } = useTranslation();
  const [marketData, setMarketData] = useState([
    { symbol: 'QAU/USDT', price: 1.2345, change: 5.67, volume: '2.4M' },
    { symbol: 'QAU/BTC', price: 0.000028, change: -2.34, volume: '1.8M' },
    { symbol: 'QAU/ETH', price: 0.00041, change: 3.21, volume: '3.1M' },
    { symbol: 'BTC/USDT', price: 43250.0, change: 1.85, volume: '45.2M' },
    { symbol: 'ETH/USDT', price: 2680.5, change: -0.92, volume: '28.7M' },
  ]);

  const features = [
    {
      icon: Shield,
      title: t('trading_page.features.quantum_security.title'),
      description: t('trading_page.features.quantum_security.description'),
      color: 'text-green-400',
    },
    {
      icon: Zap,
      title: t('trading_page.features.high_frequency.title'),
      description: t('trading_page.features.high_frequency.description'),
      color: 'text-yellow-400',
    },
    {
      icon: Globe,
      title: t('trading_page.features.global_liquidity.title'),
      description: t('trading_page.features.global_liquidity.description'),
      color: 'text-blue-400',
    },
    {
      icon: Users,
      title: t('trading_page.features.institutional.title'),
      description: t('trading_page.features.institutional.description'),
      color: 'text-purple-400',
    },
  ];

  const stats = [
    {
      label: t('trading_page.stats.volume_24h'),
      value: '$125.6M',
      icon: DollarSign,
      color: 'text-green-400',
    },
    {
      label: t('trading_page.stats.trading_pairs'),
      value: '150+',
      icon: Activity,
      color: 'text-blue-400',
    },
    {
      label: t('trading_page.stats.registered_users'),
      value: '500K+',
      icon: Users,
      color: 'text-purple-400',
    },
    {
      label: t('trading_page.stats.avg_latency'),
      value: '<10ms',
      icon: Zap,
      color: 'text-yellow-400',
    },
  ];

  const handleLaunchExchange = () => {
    // Open full exchange in new window
    window.open('/exchange', '_blank');
  };

  const handleStartTrading = () => {
    // Navigate to trading interface
    window.location.href = '/exchange';
  };

  return (
    <>
      <ParticlesBackground />
      <EnhancedNavbar />
      <div className="min-h-screen relative z-10">
        <div className="container mx-auto px-4 py-24">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex justify-center items-center mb-6">
              <div className="relative">
                <BarChart3 className="w-20 h-20 text-purple-400" />
                <Shield className="w-8 h-8 text-green-400 absolute -top-2 -right-2" />
              </div>
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
              {t('trading_page.title')}
            </h1>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto mb-8">
              {t('trading_page.subtitle')}
            </p>
            <div className="flex justify-center items-center space-x-4 mb-8">
              <div className="flex items-center space-x-2 bg-green-500/20 px-4 py-2 rounded-full">
                <Shield className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-semibold">
                  {t('trading_page.badges.quantum_secure')}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-500/20 px-4 py-2 rounded-full">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="text-blue-400 font-semibold">
                  {t('trading_page.badges.high_frequency')}
                </span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-500/20 px-4 py-2 rounded-full">
                <Globe className="w-5 h-5 text-purple-400" />
                <span className="text-purple-400 font-semibold">
                  {t('trading_page.badges.global_liquidity')}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Launch Exchange */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-2xl p-8 text-center">
              <Play className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-4">
                {t('trading_page.launch.title')}
              </h3>
              <p className="text-gray-300 mb-6 text-lg">{t('trading_page.launch.description')}</p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleLaunchExchange}
                  className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <ExternalLink className="w-6 h-6" />
                  <span>{t('trading_page.launch.launch_button')}</span>
                </button>
                <button
                  onClick={handleStartTrading}
                  className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                >
                  <BarChart3 className="w-6 h-6" />
                  <span>{t('trading_page.launch.start_trading')}</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Market Data */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-6xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              {t('trading_page.market.title')}
            </h2>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-4 px-4 text-gray-300">
                        {t('trading_page.market.pair')}
                      </th>
                      <th className="text-right py-4 px-4 text-gray-300">
                        {t('trading_page.market.price')}
                      </th>
                      <th className="text-right py-4 px-4 text-gray-300">
                        {t('trading_page.market.change_24h')}
                      </th>
                      <th className="text-right py-4 px-4 text-gray-300">
                        {t('trading_page.market.volume_24h')}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketData.map((item, index) => (
                      <motion.tr
                        key={item.symbol}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        className="border-b border-white/10 hover:bg-white/5 transition-colors cursor-pointer"
                        onClick={handleStartTrading}
                      >
                        <td className="py-4 px-4">
                          <div className="font-semibold text-white">{item.symbol}</div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="font-mono text-white">
                            ${item.price.toFixed(item.price < 1 ? 6 : 2)}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div
                            className={`flex items-center justify-end space-x-1 ${
                              item.change >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}
                          >
                            {item.change >= 0 ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            <span className="font-semibold">
                              {item.change >= 0 ? '+' : ''}
                              {item.change.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-gray-300">{item.volume}</div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* Core Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-6xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-bold text-center text-white mb-12">
              {t('trading_page.features.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-purple-500/50 transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-purple-500/20 p-3 rounded-xl">
                        <IconComponent className={`w-8 h-8 ${feature.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-gray-300">{feature.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h2 className="text-3xl font-bold text-center text-white mb-8">
                {t('trading_page.stats.title')}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, index) => {
                  const IconComponent = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                      className="text-center"
                    >
                      <div className="flex justify-center mb-3">
                        <IconComponent className={`w-8 h-8 ${stat.color}`} />
                      </div>
                      <div className={`text-3xl font-bold mb-2 ${stat.color}`}>{stat.value}</div>
                      <div className="text-gray-400">{stat.label}</div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="text-center"
          >
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-2xl p-6 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-blue-400 mb-2">
                {t('trading_page.web_platform.title')}
              </h3>
              <p className="text-gray-300">{t('trading_page.web_platform.description')}</p>
            </div>
          </motion.div>
        </div>
      </div>
      <EnhancedFooter />
    </>
  );
};

export default TradingPage;
