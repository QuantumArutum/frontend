'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { explorerService, Transaction, explorerUtils } from '../../../services/explorerService';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

export default function TransactionsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTransactions = useCallback(async () => {
    try {
      const data = await explorerService.transactions.getRecentTransactions(20);
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };

  const getStatusText = (status: string | undefined) => {
    switch (status) {
      case 'success': return t('explorer.transactions.status.success');
      case 'failed': return t('explorer.transactions.status.failed');
      default: return t('explorer.transactions.status.pending');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-5">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => router.push('/explorer')} 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> {t('explorer.transactions.back')}
        </button>
        <button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? t('explorer.transactions.refreshing') : t('explorer.transactions.refresh')}
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="flex items-center gap-4 mb-8"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
          <Activity className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{t('explorer.transactions.title')}</h1>
          <p className="text-gray-400">{t('explorer.transactions.subtitle')}</p>
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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('explorer.transactions.columns.hash')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('explorer.transactions.columns.block')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('explorer.transactions.columns.age')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('explorer.transactions.columns.from')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('explorer.transactions.columns.to')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('explorer.transactions.columns.value')}</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('explorer.transactions.status.title')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-white/10 rounded w-16"></div></td>
                  </tr>
                ))
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.hash} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/explorer/tx/${tx.hash}`} className="text-cyan-400 hover:text-cyan-300 font-medium font-mono">
                        {explorerUtils.truncateHash(tx.hash)}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/explorer/block/${explorerUtils.formatBlockNumber(tx.blockNumber)}`} className="text-indigo-400 hover:text-indigo-300 font-medium">
                        {explorerUtils.formatBlockNumber(tx.blockNumber)}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {explorerUtils.formatRelativeTime(tx.timestamp || '0x0')}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/explorer/address/${tx.from}`} className="text-indigo-400 hover:text-indigo-300 font-mono text-sm">
                        {explorerUtils.truncateHash(tx.from)}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/explorer/address/${tx.to}`} className="text-indigo-400 hover:text-indigo-300 font-mono text-sm">
                        {explorerUtils.truncateHash(tx.to)}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-white text-sm">
                      {explorerUtils.formatWei(tx.value)} QAU
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${
                        tx.status === 'success' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                        tx.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                      }`}>
                        {getStatusText(tx.status)}
                      </span>
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
