'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Search,
  Box,
  Activity,
  Layers,
  Clock,
  Zap,
  ChevronRight,
  ArrowUpRight,
} from 'lucide-react';
import {
  explorerService,
  Block,
  Transaction,
  NetworkStats,
  explorerUtils,
} from '../../services/explorerService';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import ParticlesBackground from '../components/ParticlesBackground';
import EnhancedNavbar from '../components/EnhancedNavbar';
import EnhancedFooter from '../components/EnhancedFooter';

export default function ExplorerPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [stats, setStats] = useState<NetworkStats | null>(null);
  const [latestBlock, setLatestBlock] = useState<Block | null>(null);
  const [recentBlocks, setRecentBlocks] = useState<Block[]>([]);
  const [recentTxs, setRecentTxs] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [statsData, blockData, blocksData, txsData] = await Promise.all([
        explorerService.stats.getNetworkStats(),
        explorerService.blocks.getLatestBlock(),
        explorerService.blocks.getRecentBlocks(10),
        explorerService.transactions.getRecentTransactions(10),
      ]);
      setStats(statsData);
      setLatestBlock(blockData);
      setRecentBlocks(blocksData);
      setRecentTxs(txsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load explorer data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    setSearchError('');
    try {
      const result = await explorerService.search.search(searchQuery);
      switch (result.type) {
        case 'block':
          router.push(`/explorer/block/${searchQuery}`);
          break;
        case 'transaction':
          router.push(`/explorer/tx/${searchQuery}`);
          break;
        case 'address':
          router.push(`/explorer/address/${searchQuery}`);
          break;
        default:
          setSearchError(t('explorer.errors.not_found'));
      }
    } catch {
      setSearchError(t('explorer.errors.search_failed'));
    } finally {
      setSearching(false);
    }
  };

  const statCards = [
    {
      label: t('explorer.stats.latest_block'),
      value: stats?.latestBlock.toLocaleString() || '-',
      icon: Layers,
      color: 'text-purple-400',
    },
    {
      label: t('explorer.stats.tps'),
      value: stats?.tps.toLocaleString() || '-',
      icon: Zap,
      color: 'text-green-400',
    },
    {
      label: t('explorer.stats.total_txs'),
      value: stats
        ? stats.totalTransactions >= 1e6
          ? `${(stats.totalTransactions / 1e6).toFixed(2)}M`
          : stats.totalTransactions.toLocaleString()
        : '-',
      icon: Activity,
      color: 'text-cyan-400',
    },
    {
      label: t('explorer.stats.block_time'),
      value: stats ? `${stats.avgBlockTime.toFixed(1)}s` : '-',
      icon: Clock,
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <EnhancedNavbar />
      <div className="relative z-10 max-w-7xl mx-auto px-5 py-24">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] bg-clip-text text-transparent"
          >
            {t('explorer.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto mb-8"
          >
            {t('explorer.subtitle')}
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('explorer.search_placeholder')}
                className="w-full h-14 pl-5 pr-14 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50 focus:bg-white/10 transition-all shadow-lg shadow-black/20"
              />
              <button
                type="submit"
                disabled={searching}
                className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] rounded-xl text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {searching ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search size={20} />
                )}
              </button>
            </form>
            {searchError && (
              <p className="absolute left-0 -bottom-6 text-red-400 text-sm">{searchError}</p>
            )}
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400 font-medium">{stat.label}</span>
                <stat.icon
                  className={`w-6 h-6 ${stat.color} group-hover:scale-110 transition-transform`}
                />
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Link
            href="/explorer/validators"
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all hover:scale-105 group"
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-white font-medium">{t('explorer.links.validators')}</span>
            </div>
          </Link>
          <Link
            href="/explorer/contracts"
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all hover:scale-105 group"
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                <Layers className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-white font-medium">{t('explorer.links.contracts')}</span>
            </div>
          </Link>
          <Link
            href="/explorer/qpos"
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all hover:scale-105 group"
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Activity className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-white font-medium">{t('explorer.links.qpos')}</span>
            </div>
          </Link>
          <Link
            href="/explorer/quantum-verify"
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all hover:scale-105 group"
          >
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
                <Box className="w-5 h-5 text-pink-400" />
              </div>
              <span className="text-white font-medium">{t('explorer.links.verify')}</span>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Blocks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Box className="w-5 h-5 text-purple-400" /> {t('explorer.activity.recent_blocks')}
              </h2>
              <Link
                href="/explorer/blocks"
                className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                {t('explorer.activity.view_all')} <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="p-4 flex-grow overflow-auto custom-scrollbar">
              {recentBlocks.map((block) => (
                <div
                  key={block.number}
                  className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 rounded-xl transition-colors mb-2 last:mb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold border border-purple-500/30">
                      Bk
                    </div>
                    <div>
                      <Link
                        href={`/explorer/block/${block.number}`}
                        className="text-cyan-400 hover:text-cyan-300 font-medium block"
                      >
                        #{block.number}
                      </Link>
                      <span className="text-gray-500 text-xs">
                        {explorerUtils.formatTimestamp(block.timestamp)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">
                      {t('explorer.activity.miner')}{' '}
                      <Link
                        href={`/explorer/address/${block.miner}`}
                        className="text-indigo-400 hover:text-indigo-300 font-mono"
                      >
                        {explorerUtils.truncateHash(block.miner)}
                      </Link>
                    </div>
                    <div className="text-xs text-gray-500">
                      {block.transactionCount} {t('explorer.activity.txns')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-400" /> {t('explorer.activity.recent_txs')}
              </h2>
              <Link
                href="/explorer/transactions"
                className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              >
                {t('explorer.activity.view_all')} <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="p-4 flex-grow overflow-auto custom-scrollbar">
              {recentTxs.map((tx) => (
                <div
                  key={tx.hash}
                  className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 rounded-xl transition-colors mb-2 last:mb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 font-bold border border-green-500/30">
                      Tx
                    </div>
                    <div>
                      <Link
                        href={`/explorer/tx/${tx.hash}`}
                        className="text-cyan-400 hover:text-cyan-300 font-medium block font-mono"
                      >
                        {explorerUtils.truncateHash(tx.hash)}
                      </Link>
                      <span className="text-gray-500 text-xs">
                        {explorerUtils.formatTimestamp(String(tx.timestamp) || '0')}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-300">
                      {t('explorer.activity.from')}{' '}
                      <Link
                        href={`/explorer/address/${tx.from}`}
                        className="text-indigo-400 hover:text-indigo-300 font-mono"
                      >
                        {explorerUtils.truncateHash(tx.from)}
                      </Link>
                    </div>
                    <div className="text-xs text-gray-500">
                      {t('explorer.activity.to')}{' '}
                      <Link
                        href={`/explorer/address/${tx.to}`}
                        className="text-indigo-400 hover:text-indigo-300 font-mono"
                      >
                        {explorerUtils.truncateHash(tx.to)}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <EnhancedFooter />
    </div>
  );
}
