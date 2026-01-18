'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Activity, ArrowLeft, Copy, CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { explorerService, Transaction, explorerUtils } from '../../../../services/explorerService';

export default function TransactionDetailPage({ params }: { params: Promise<{ txHash: string }> }) {
  const { txHash } = use(params);
  const router = useRouter();
  const [tx, setTx] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTx = async () => {
      setLoading(true);
      try {
        const txData = await explorerService.transactions.getTransaction(txHash);
        setTx(txData);
      } catch (error) {
        console.error('Failed to load transaction:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTx();
  }, [txHash]);

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading transaction...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5">
      <button
        onClick={() => router.push('/explorer')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Explorer
      </button>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
            tx?.status === 'success'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-emerald-500/20'
              : tx?.status === 'failed'
                ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-red-500/20'
                : 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-yellow-500/20'
          }`}
        >
          {tx?.status === 'success' ? (
            <CheckCircle className="w-7 h-7 text-white" />
          ) : tx?.status === 'failed' ? (
            <XCircle className="w-7 h-7 text-white" />
          ) : (
            <Clock className="w-7 h-7 text-white" />
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Transaction Details</h1>
          <p className="text-gray-400 font-mono text-sm">
            {explorerUtils.truncateHash(txHash, 16, 12)}
          </p>
        </div>
        <div className="ml-auto">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              tx?.status === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : tx?.status === 'failed'
                  ? 'bg-red-500/10 text-red-400 border-red-500/30'
                  : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
            }`}
          >
            {tx?.status === 'success' ? 'Success' : tx?.status === 'failed' ? 'Failed' : 'Pending'}
          </span>
        </div>
      </motion.div>

      {tx ? (
        <>
          {/* Transaction Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-8"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" /> Overview
            </h2>
            <div className="space-y-4">
              <DetailRow
                label="Transaction Hash"
                value={tx.hash}
                mono
                copyable
                onCopy={() => copyToClipboard(tx.hash)}
              />
              <DetailRow
                label="Block"
                value={`#${explorerUtils.formatBlockNumber(tx.blockNumber).toLocaleString()}`}
                link
                onClick={() =>
                  router.push(`/explorer/block/${explorerUtils.formatBlockNumber(tx.blockNumber)}`)
                }
              />
              {tx.timestamp && (
                <DetailRow label="Time" value={explorerUtils.formatTimestamp(tx.timestamp)} />
              )}
            </div>
          </motion.div>

          {/* Transfer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-8"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Transfer</h2>
            <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
              <div className="flex-1 text-center md:text-left">
                <p className="text-gray-400 text-sm mb-1">From</p>
                <Link
                  href={`/explorer/address/${tx.from}`}
                  className="text-indigo-400 hover:text-indigo-300 font-mono text-sm break-all block"
                >
                  {tx.from}
                </Link>
              </div>
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div className="flex-1 text-center md:text-right">
                <p className="text-gray-400 text-sm mb-1">To</p>
                {tx.to ? (
                  <Link
                    href={`/explorer/address/${tx.to}`}
                    className="text-indigo-400 hover:text-indigo-300 font-mono text-sm break-all block"
                  >
                    {tx.to}
                  </Link>
                ) : (
                  <span className="text-gray-500 text-sm">Contract Creation</span>
                )}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Value</p>
                <p className="text-xl font-bold text-white">
                  {explorerUtils.formatWei(tx.value, 6)} QAU
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                <p className="text-gray-400 text-sm mb-1">Gas Fee</p>
                <p className="text-xl font-bold text-white">
                  {tx.gasUsed
                    ? ((parseInt(tx.gasUsed, 16) * parseInt(tx.gasPrice, 16)) / 1e18).toFixed(6)
                    : ((parseInt(tx.gas, 16) * parseInt(tx.gasPrice, 16)) / 1e18).toFixed(6)}{' '}
                  QAU
                </p>
              </div>
            </div>
          </motion.div>
        </>
      ) : (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-12 text-center">
          <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Transaction not found</p>
        </div>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
  copyable,
  onCopy,
  link,
  onClick,
}: {
  label: string;
  value: string;
  mono?: boolean;
  copyable?: boolean;
  onCopy?: () => void;
  link?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-white/5 last:border-0">
      <span className="text-gray-400 w-32 text-sm">{label}</span>
      <div className="flex items-center gap-2 flex-1">
        {link ? (
          <button
            onClick={onClick}
            className={`text-sm break-all hover:underline ${mono ? 'font-mono text-cyan-400' : 'text-cyan-400'}`}
          >
            {value}
          </button>
        ) : (
          <span
            className={`text-sm break-all ${mono ? 'font-mono text-indigo-300' : 'text-gray-200'}`}
          >
            {mono && value.length > 40 ? `${value.slice(0, 20)}...${value.slice(-20)}` : value}
          </span>
        )}
        {copyable && onCopy && (
          <button
            onClick={onCopy}
            className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
