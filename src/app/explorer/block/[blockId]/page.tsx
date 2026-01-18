'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Box, ArrowLeft, Copy, Layers, Activity, ChevronRight, ChevronLeft } from 'lucide-react';
import {
  explorerService,
  Block,
  Transaction,
  explorerUtils,
} from '../../../../services/explorerService';

export default function BlockDetailPage({ params }: { params: Promise<{ blockId: string }> }) {
  const { blockId } = use(params);
  const router = useRouter();
  const [block, setBlock] = useState<Block | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlock = async () => {
      setLoading(true);
      try {
        const blockData = await explorerService.blocks.getBlockByNumber(blockId);
        setBlock(blockData);
        if (blockData) {
          const txs = await explorerService.blocks.getBlockTransactions(blockId);
          setTransactions(txs);
        }
      } catch (error) {
        console.error('Failed to load block:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBlock();
  }, [blockId]);

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);
  const blockNumber = block ? explorerUtils.formatBlockNumber(block.number) : parseInt(blockId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading block info...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-5">
      {/* Back Button */}
      <button
        onClick={() => router.push('/explorer')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to Explorer
      </button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="w-14 h-14 bg-gradient-to-r from-[#6E3CBC] to-[#00D4FF] rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Box className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Block #{blockNumber.toLocaleString()}</h1>
          <p className="text-gray-400">Block Details</p>
        </div>
        {/* Navigation */}
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => router.push(`/explorer/block/${blockNumber - 1}`)}
            disabled={blockNumber <= 0}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-50 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.push(`/explorer/block/${blockNumber + 1}`)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {block ? (
        <>
          {/* Block Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-8"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" /> Block Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailRow label="Height" value={blockNumber.toLocaleString()} />
              <DetailRow label="Timestamp" value={explorerUtils.formatTimestamp(block.timestamp)} />
              <DetailRow
                label="Hash"
                value={block.hash}
                mono
                copyable
                onCopy={() => copyToClipboard(block.hash)}
              />
              <DetailRow
                label="Parent Hash"
                value={block.parentHash}
                mono
                copyable
                onCopy={() => copyToClipboard(block.parentHash)}
              />
              <DetailRow
                label="Miner"
                value={block.miner}
                mono
                copyable
                onCopy={() => copyToClipboard(block.miner)}
              />
              <DetailRow label="Transactions" value={`${block.transactionCount} txns`} />
              <DetailRow
                label="Gas Used"
                value={`${(parseInt(block.gasUsed, 16) / 1e6).toFixed(2)}M`}
              />
              <DetailRow
                label="Gas Limit"
                value={`${(parseInt(block.gasLimit, 16) / 1e6).toFixed(2)}M`}
              />
              <DetailRow
                label="Size"
                value={`${(parseInt(block.size, 16) / 1024).toFixed(2)} KB`}
              />
              <DetailRow
                label="Difficulty"
                value={parseInt(block.difficulty, 16).toLocaleString()}
              />
            </div>
          </motion.div>

          {/* Transactions List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" /> Transactions (
                {block.transactionCount})
              </h2>
            </div>
            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                        Tx Hash
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                        From
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">To</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                        Value
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                        Gas Fee
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => (
                      <tr
                        key={tx.hash}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="px-6 py-3">
                          <button
                            onClick={() => router.push(`/explorer/tx/${tx.hash}`)}
                            className="text-cyan-400 hover:text-cyan-300 font-mono text-sm"
                          >
                            {explorerUtils.truncateHash(tx.hash, 10, 8)}
                          </button>
                        </td>
                        <td className="px-6 py-3">
                          <Link
                            href={`/explorer/address/${tx.from}`}
                            className="text-indigo-400 hover:text-indigo-300 font-mono text-sm"
                          >
                            {explorerUtils.truncateHash(tx.from, 6, 4)}
                          </Link>
                        </td>
                        <td className="px-6 py-3">
                          {tx.to ? (
                            <Link
                              href={`/explorer/address/${tx.to}`}
                              className="text-indigo-400 hover:text-indigo-300 font-mono text-sm"
                            >
                              {explorerUtils.truncateHash(tx.to, 6, 4)}
                            </Link>
                          ) : (
                            <span className="text-gray-500 text-sm">Contract Creation</span>
                          )}
                        </td>
                        <td className="px-6 py-3 text-white">
                          {explorerUtils.formatWei(tx.value, 4)} QAU
                        </td>
                        <td className="px-6 py-3 text-gray-400 text-sm">
                          {tx.gasUsed
                            ? (
                                (parseInt(tx.gasUsed, 16) * parseInt(tx.gasPrice, 16)) /
                                1e18
                              ).toFixed(6)
                            : ((parseInt(tx.gas, 16) * parseInt(tx.gasPrice, 16)) / 1e18).toFixed(
                                6
                              )}{' '}
                          QAU
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">No transactions in this block</div>
            )}
          </motion.div>
        </>
      ) : (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-12 text-center">
          <Box className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Block #{blockId} not found</p>
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
}: {
  label: string;
  value: string;
  mono?: boolean;
  copyable?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-white/5 last:border-0">
      <span className="text-gray-400 w-32 text-sm">{label}</span>
      <div className="flex items-center gap-2 flex-1">
        <span
          className={`text-sm break-all ${mono ? 'font-mono text-indigo-300' : 'text-gray-200'}`}
        >
          {mono && value.length > 40 ? `${value.slice(0, 20)}...${value.slice(-20)}` : value}
        </span>
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
