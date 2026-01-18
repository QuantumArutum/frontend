'use client';

import React from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import '../../i18n';

const EcosystemSection = () => {
  const { t } = useTranslation();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

  const handleCardHover = (cardIndex) => {
    setHoveredCard(cardIndex);
  };

  const handleCardLeave = () => {
    setHoveredCard(null);
  };

  const handleViewDetails = (app) => {
    setSelectedApp(app);
  };

  const closeModal = () => {
    setSelectedApp(null);
  };

  const getAppRoute = (appId) => {
    const routeMap = {
      wallet: '/wallet',
      exchange: '/trading',
      defi: '/defi',
      sto: '/sto',
      'token-sale': '/token-sale',
      crowdfunding: '/crowdfunding',
      lottery: '/lottery',
      movies: '/movies',
      concerts: '/concerts',
      flights: '/flights',
      hotels: '/hotels',
      utilities: '/utilities',
      forum: '/community',
    };
    return routeMap[appId] || '/';
  };

  const getAppDetails = (app) => {
    const detailsMap = {
      wallet: {
        introduction: t('ecosystem.details.wallet.introduction'),
        features: [
          t('ecosystem.details.wallet.features.key_management'),
          t('ecosystem.details.wallet.features.multi_currency'),
          t('ecosystem.details.wallet.features.hardware_integration'),
          t('ecosystem.details.wallet.features.biometric_auth'),
        ],
        techSpecs: [
          t('ecosystem.details.wallet.techSpecs.dilithium'),
          t('ecosystem.details.wallet.techSpecs.nist_level'),
          t('ecosystem.details.wallet.techSpecs.hardware_support'),
          t('ecosystem.details.wallet.techSpecs.platforms'),
        ],
        stats: { users: '1.2M', transactions: '50M+', security: '100%', uptime: '99.9%' },
      },
      exchange: {
        introduction: t('ecosystem.details.exchange.introduction'),
        features: [
          t('ecosystem.details.exchange.features.quantum_trading'),
          t('ecosystem.details.exchange.features.liquidity_mining'),
          t('ecosystem.details.exchange.features.cross_chain'),
          t('ecosystem.details.exchange.features.smart_routing'),
        ],
        techSpecs: [
          t('ecosystem.details.exchange.techSpecs.tps'),
          t('ecosystem.details.exchange.techSpecs.order_matching'),
          t('ecosystem.details.exchange.techSpecs.trading_pairs'),
          t('ecosystem.details.exchange.techSpecs.fees'),
        ],
        stats: { users: '1.5M', volume: '$2.8B', pairs: '20+', liquidity: '$500M' },
      },
      defi: {
        introduction: t('ecosystem.details.defi.introduction'),
        features: [
          t('ecosystem.details.defi.features.lending'),
          t('ecosystem.details.defi.features.liquidity_mining'),
          t('ecosystem.details.defi.features.yield_farming'),
          t('ecosystem.details.defi.features.insurance'),
        ],
        techSpecs: [
          t('ecosystem.details.defi.techSpecs.automation'),
          t('ecosystem.details.defi.techSpecs.oracle'),
          t('ecosystem.details.defi.techSpecs.cross_chain'),
          t('ecosystem.details.defi.techSpecs.rate_model'),
        ],
        stats: { users: '800K', tvl: '$1.2B', apy: '12.5%', protocols: '8' },
      },
    };
    return (
      detailsMap[app.appId] || {
        introduction: t('ecosystem.details.default.introduction'),
        features: [t('ecosystem.details.default.features')],
        techSpecs: [t('ecosystem.details.default.techSpecs')],
        stats: { users: '0', status: t('ecosystem.details.default.status') },
      }
    );
  };

  const apps = [
    {
      id: 0,
      appId: 'wallet',
      emoji: '👛',
      title: t('ecosystem.apps.wallet.title'),
      status: t('ecosystem.status.online'),
      description: t('ecosystem.apps.wallet.description'),
      users: '1.2M',
      features: '3',
      color: 'purple',
      position: { top: '50px', left: '10%' },
    },
    {
      id: 1,
      appId: 'exchange',
      emoji: '📈',
      title: t('ecosystem.apps.exchange.title'),
      status: t('ecosystem.status.online'),
      description: t('ecosystem.apps.exchange.description'),
      users: '1.5M',
      features: '3',
      color: 'emerald',
      position: { top: '50px', right: '10%' },
    },
    {
      id: 2,
      appId: 'defi',
      emoji: '🔗',
      title: t('ecosystem.apps.defi.title'),
      status: t('ecosystem.status.online'),
      description: t('ecosystem.apps.defi.description'),
      users: '800K',
      features: '3',
      color: 'emerald',
      position: { top: '150px', left: '10%' },
    },
    {
      id: 3,
      appId: 'sto',
      emoji: '🏛️',
      title: t('ecosystem.apps.sto.title'),
      status: t('ecosystem.status.online'),
      description: t('ecosystem.apps.sto.description'),
      users: '700K',
      features: '3',
      color: 'blue',
      position: { top: '150px', right: '10%' },
    },
    {
      id: 4,
      appId: 'crowdfunding',
      emoji: '💰',
      title: t('ecosystem.apps.crowdfunding.title'),
      status: t('ecosystem.status.online'),
      description: t('ecosystem.apps.crowdfunding.description'),
      users: '500K',
      features: '3',
      color: 'orange',
      position: { top: '250px', left: '10%' },
    },
    {
      id: 5,
      appId: 'lottery',
      emoji: '🎲',
      title: t('ecosystem.apps.lottery.title'),
      status: t('ecosystem.status.online'),
      description: t('ecosystem.apps.lottery.description'),
      users: '400K',
      features: '3',
      color: 'purple',
      position: { top: '250px', right: '10%' },
    },
    {
      id: 6,
      appId: 'movies',
      emoji: '🎟️',
      title: t('ecosystem.apps.movies.title'),
      status: t('ecosystem.status.online'),
      description: t('ecosystem.apps.movies.description'),
      users: '300K',
      features: '3',
      color: 'pink',
      position: { top: '350px', left: '10%' },
    },
    {
      id: 7,
      appId: 'concerts',
      emoji: '🎤',
      title: t('ecosystem.apps.concerts.title'),
      status: t('ecosystem.status.online'),
      description: t('ecosystem.apps.concerts.description'),
      users: '250K',
      features: '3',
      color: 'purple',
      position: { top: '350px', right: '10%' },
    },
    {
      id: 8,
      appId: 'flights',
      emoji: '✈️',
      title: t('ecosystem.apps.flights.title'),
      status: t('ecosystem.status.online'),
      description: t('ecosystem.apps.flights.description'),
      users: '200K',
      features: '3',
      color: 'gray',
      position: { top: '450px', left: '10%' },
    },
    {
      id: 9,
      appId: 'hotels',
      emoji: '🏨',
      title: t('ecosystem.apps.hotels.title'),
      status: t('ecosystem.status.online'),
      description: t('ecosystem.apps.hotels.description'),
      users: '180K',
      features: '3',
      color: 'red',
      position: { top: '450px', right: '10%' },
    },
    {
      id: 10,
      appId: 'utilities',
      emoji: '💡',
      title: t('ecosystem.apps.utilities.title'),
      status: t('ecosystem.status.online'),
      description: t('ecosystem.apps.utilities.description'),
      users: '150K',
      features: '3',
      color: 'blue',
      position: { top: '550px', left: '10%' },
    },
    {
      id: 11,
      appId: 'forum',
      emoji: '💬',
      title: t('ecosystem.apps.forum.title'),
      status: t('ecosystem.status.online'),
      description: t('ecosystem.apps.forum.description'),
      users: '120K',
      features: '3',
      color: 'purple',
      position: { top: '550px', right: '10%' },
    },
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      purple: {
        bg: 'from-purple-500/20 to-purple-600/30',
        border: 'border-purple-500/40',
        text: 'text-purple-400',
        button: 'from-purple-500/20 to-purple-600/30 border-purple-500/40',
        dot: 'bg-purple-400',
      },
      emerald: {
        bg: 'from-emerald-500/20 to-emerald-600/30',
        border: 'border-emerald-500/40',
        text: 'text-emerald-400',
        button: 'from-emerald-500/20 to-emerald-600/30 border-emerald-500/40',
        dot: 'bg-emerald-400',
      },
      blue: {
        bg: 'from-blue-500/20 to-blue-600/30',
        border: 'border-blue-500/40',
        text: 'text-blue-400',
        button: 'from-blue-500/20 to-blue-600/30 border-blue-500/40',
        dot: 'bg-blue-400',
      },
      orange: {
        bg: 'from-orange-500/20 to-orange-600/30',
        border: 'border-orange-500/40',
        text: 'text-orange-400',
        button: 'from-orange-500/20 to-orange-600/30 border-orange-500/40',
        dot: 'bg-orange-400',
      },
      pink: {
        bg: 'from-pink-500/20 to-pink-600/30',
        border: 'border-pink-500/40',
        text: 'text-pink-400',
        button: 'from-pink-500/20 to-pink-600/30 border-pink-500/40',
        dot: 'bg-pink-400',
      },
      gray: {
        bg: 'from-gray-500/20 to-gray-600/30',
        border: 'border-gray-500/40',
        text: 'text-gray-400',
        button: 'from-gray-500/20 to-gray-600/30 border-gray-500/40',
        dot: 'bg-gray-400',
      },
      red: {
        bg: 'from-red-500/20 to-red-600/30',
        border: 'border-red-500/40',
        text: 'text-red-400',
        button: 'from-red-500/20 to-red-600/30 border-red-500/40',
        dot: 'bg-red-400',
      },
    };
    return colorMap[color] || colorMap.purple;
  };

  return (
    <>
      <section className="py-24 px-5 bg-white/5">
        <h2 className="section-title text-4xl font-bold mb-5 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] bg-clip-text text-transparent text-center">
          {t('ecosystem.title')}
        </h2>
        <p className="text-center text-gray-300 mb-16 max-w-2xl mx-auto">
          {t('ecosystem.description')}
        </p>

        <div className="relative max-w-7xl mx-auto" style={{ height: '650px' }}>
          {/* 连接线 SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
            {/* 垂直主线 */}
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="100%"
              stroke="url(#gradient-main)"
              strokeWidth="3"
              strokeDasharray="10,5"
              className="animate-pulse"
            />

            {/* 水平连接线 */}
            <line
              x1="50%"
              y1="100"
              x2="35%"
              y2="100"
              stroke="url(#gradient-purple)"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
            <line
              x1="50%"
              y1="100"
              x2="65%"
              y2="100"
              stroke="url(#gradient-emerald)"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
            <line
              x1="50%"
              y1="200"
              x2="35%"
              y2="200"
              stroke="url(#gradient-emerald)"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
            <line
              x1="50%"
              y1="200"
              x2="65%"
              y2="200"
              stroke="url(#gradient-blue)"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
            <line
              x1="50%"
              y1="300"
              x2="35%"
              y2="300"
              stroke="url(#gradient-orange)"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
            <line
              x1="50%"
              y1="300"
              x2="65%"
              y2="300"
              stroke="url(#gradient-purple)"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
            <line
              x1="50%"
              y1="400"
              x2="35%"
              y2="400"
              stroke="url(#gradient-pink)"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
            <line
              x1="50%"
              y1="400"
              x2="65%"
              y2="400"
              stroke="url(#gradient-purple)"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
            <line
              x1="50%"
              y1="500"
              x2="35%"
              y2="500"
              stroke="url(#gradient-gray)"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
            <line
              x1="50%"
              y1="500"
              x2="65%"
              y2="500"
              stroke="url(#gradient-red)"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
            <line
              x1="50%"
              y1="600"
              x2="35%"
              y2="600"
              stroke="url(#gradient-blue)"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-pulse"
            />
            <line
              x1="50%"
              y1="600"
              x2="65%"
              y2="600"
              stroke="url(#gradient-purple)"
              strokeWidth="2"
              strokeDasharray="5,5"
              className="animate-pulse"
            />

            {/* 渐变定义 */}
            <defs>
              <linearGradient id="gradient-main" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6E3CBC" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="gradient-purple" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="gradient-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="gradient-orange" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="gradient-pink" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ec4899" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="gradient-gray" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6b7280" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#6b7280" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="gradient-red" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
              </linearGradient>
            </defs>
          </svg>

          {/* 应用卡片 */}
          {apps.map((app) => {
            const colors = getColorClasses(app.color);
            const isLeft = app.position.left;

            return (
              <div
                key={app.id}
                className="absolute transition-all duration-500 ease-out"
                style={{
                  ...app.position,
                  zIndex: hoveredCard === app.id ? 50 : 10,
                }}
                onMouseEnter={() => handleCardHover(app.id)}
                onMouseLeave={handleCardLeave}
              >
                <div className="relative group cursor-pointer transition-all duration-300 scale-100">
                  <div
                    className={`relative w-80 h-64 p-6 bg-gradient-to-br ${colors.bg} backdrop-blur-sm rounded-2xl border ${colors.border} shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden`}
                  >
                    {/* 量子树背景装饰 */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 320 256" fill="none">
                        {/* 主干 */}
                        <path
                          d="M160 200 L160 120 M160 120 L140 100 M160 120 L180 100 M140 100 L130 80 M140 100 L150 80 M180 100 L170 80 M180 100 L190 80"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className={`${colors.text} opacity-30`}
                          strokeDasharray="3,2"
                        />
                        {/* 量子节点 */}
                        <circle
                          cx="160"
                          cy="120"
                          r="3"
                          fill="currentColor"
                          className={`${colors.text} opacity-40`}
                        />
                        <circle
                          cx="140"
                          cy="100"
                          r="2"
                          fill="currentColor"
                          className={`${colors.text} opacity-40`}
                        />
                        <circle
                          cx="180"
                          cy="100"
                          r="2"
                          fill="currentColor"
                          className={`${colors.text} opacity-40`}
                        />
                        <circle
                          cx="130"
                          cy="80"
                          r="1.5"
                          fill="currentColor"
                          className={`${colors.text} opacity-40`}
                        />
                        <circle
                          cx="150"
                          cy="80"
                          r="1.5"
                          fill="currentColor"
                          className={`${colors.text} opacity-40`}
                        />
                        <circle
                          cx="170"
                          cy="80"
                          r="1.5"
                          fill="currentColor"
                          className={`${colors.text} opacity-40`}
                        />
                        <circle
                          cx="190"
                          cy="80"
                          r="1.5"
                          fill="currentColor"
                          className={`${colors.text} opacity-40`}
                        />
                        {/* 量子连接线 */}
                        <path
                          d="M130 80 Q140 70 150 80 M150 80 Q160 70 170 80 M170 80 Q180 70 190 80"
                          stroke="currentColor"
                          strokeWidth="0.8"
                          className={`${colors.text} opacity-20`}
                          fill="none"
                        />
                        {/* 粒子效果 */}
                        <circle
                          cx="120"
                          cy="90"
                          r="0.8"
                          fill="currentColor"
                          className={`${colors.text} opacity-30 animate-pulse`}
                        />
                        <circle
                          cx="200"
                          cy="110"
                          r="0.8"
                          fill="currentColor"
                          className={`${colors.text} opacity-30 animate-pulse`}
                          style={{ animationDelay: '0.5s' }}
                        />
                        <circle
                          cx="110"
                          cy="140"
                          r="0.8"
                          fill="currentColor"
                          className={`${colors.text} opacity-30 animate-pulse`}
                          style={{ animationDelay: '1s' }}
                        />
                        <circle
                          cx="210"
                          cy="160"
                          r="0.8"
                          fill="currentColor"
                          className={`${colors.text} opacity-30 animate-pulse`}
                          style={{ animationDelay: '1.5s' }}
                        />
                      </svg>
                    </div>

                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg"></div>

                    <div className="relative z-10">
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="text-3xl transform group-hover:scale-110 transition-transform duration-300">
                          {app.emoji}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-white mb-1">{app.title}</h3>
                          <div className="inline-flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium text-green-400 bg-green-400/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            <span>{app.status}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 text-sm mb-3 leading-relaxed line-clamp-2">
                        {app.description}
                      </p>

                      <div className="flex items-center justify-between mb-3">
                        <div className="text-center">
                          <div className={`text-base font-bold ${colors.text}`}>{app.users}</div>
                          <div className="text-gray-400 text-xs">
                            {t('ecosystem.ui.active_users')}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className={`text-base font-bold ${colors.text}`}>{app.features}</div>
                          <div className="text-gray-400 text-xs">
                            {t('ecosystem.ui.core_features')}
                          </div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(app)}
                          className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 text-sm font-medium hover:scale-105 active:scale-95"
                        >
                          {t('ecosystem.ui.view_details')}
                        </button>
                        <Link
                          href={getAppRoute(app.appId)}
                          className={`flex-1 px-4 py-2 bg-gradient-to-r ${colors.button} hover:opacity-80 text-white rounded-lg transition-all duration-200 text-sm font-medium border text-center hover:scale-105 active:scale-95 block`}
                        >
                          {t('ecosystem.ui.use_now')}
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* 连接点 */}
                  <div
                    className={`absolute top-1/2 ${isLeft ? '-right-4' : '-left-4'} w-8 h-8 bg-gradient-to-r ${colors.bg} rounded-full border-2 ${colors.border} transform -translate-y-1/2 flex items-center justify-center`}
                  >
                    <div className={`w-3 h-3 rounded-full ${colors.dot} animate-pulse`}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 详情弹窗 */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl border border-white/20 p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const details = getAppDetails(selectedApp);
                const colors = getColorClasses(selectedApp.color);

                return (
                  <>
                    {/* 头部 */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">{selectedApp.emoji}</div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">{selectedApp.title}</h2>
                          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium text-green-400 bg-green-400/20 mt-2">
                            <span className="w-2 h-2 rounded-full bg-current"></span>
                            <span>{selectedApp.status}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={closeModal}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                      >
                        ✕
                      </button>
                    </div>

                    {/* 应用介绍 */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        {t('ecosystem.modal.introduction')}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">{details.introduction}</p>
                    </div>

                    {/* 核心功能 */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        {t('ecosystem.modal.core_features')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {details.features.map((feature, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
                          >
                            <div className={`w-2 h-2 rounded-full ${colors.dot}`}></div>
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 技术规格 */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        {t('ecosystem.modal.tech_specs')}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {details.techSpecs.map((spec, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
                          >
                            <div className={`w-2 h-2 rounded-full ${colors.dot}`}></div>
                            <span className="text-gray-300">{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 使用统计 */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-white mb-3">
                        {t('ecosystem.modal.usage_stats')}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(details.stats).map(([key, value], index) => (
                          <div key={index} className="text-center p-4 bg-white/5 rounded-lg">
                            <div className={`text-xl font-bold ${colors.text} mb-1`}>{value}</div>
                            <div className="text-gray-400 text-sm capitalize">{key}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex space-x-4">
                      <button
                        onClick={closeModal}
                        className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 font-medium"
                      >
                        {t('ecosystem.modal.close')}
                      </button>
                      <Link
                        href={getAppRoute(selectedApp.appId)}
                        className={`flex-1 px-6 py-3 bg-gradient-to-r ${colors.button} hover:opacity-80 text-white rounded-lg transition-all duration-200 font-medium text-center border`}
                      >
                        {t('ecosystem.modal.use_now')}
                      </Link>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EcosystemSection;
