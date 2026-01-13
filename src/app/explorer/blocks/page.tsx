'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Box, Clock, ArrowLeft, RefreshCw, Layers, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { explorerService, Block, explorerUtils } from '../../../services/explorerService';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

export default function BlocksPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBlocks = useCallback(async () => {
    try {
      const data = await explorerService.blocks.getRecentBlocks(20);
      setBlocks(data);
    } catch (error) {
      console.error('Failed to load blocks:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadBlocks();
  }, [loadBlocks]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadBlocks();
  };

  return (
    <div className="max-w-7xl mx-auto px-5">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => router.push('/explorer')} 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> {t('explorer_page.blocks.back')}
        </button>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? t('explorer_page.blocks.refreshing') : t('explorer_page.blocks.refresh')}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex items-center gap-4 mb-8"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-500 shadow-lg shadow-purple-500/20 flex items-center justify-center">
          <Layers className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{t('explorer_page.blocks.title')}</h1>
          <p className="text-gray-400">{t('explorer_page.blocks.subtitle')}</p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('explorer_page.blocks.columns.block')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('explorer_page.blocks.columns.age')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('explorer_page.blocks.columns.txns')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('explorer_page.blocks.columns.miner')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('explorer_page.blocks.columns.gas_used')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('explorer_page.blocks.columns.limit')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-8"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-20"></div></td>
                  </tr>
                ))
              ) : (
                blocks.map((block) => (
                  <tr key={block.number} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/explorer/block/${block.number}`} className="text-cyan-400 hover:text-cyan-300 font-medium">
                        #{block.number}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {explorerUtils.formatRelativeTime(block.timestamp)}
                    </td>
                    <td className="px-6 py-4 text-white text-sm">
                      {block.transactionCount}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/explorer/address/${block.miner}`} className="text-indigo-400 hover:text-indigo-300 font-mono text-sm">
                        {explorerUtils.truncateHash(block.miner)}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm font-mono">
                      {explorerUtils.formatGas(block.gasUsed)}
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm font-mono">
                      {explorerUtils.formatGas(block.gasLimit)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
