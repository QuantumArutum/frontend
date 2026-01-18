'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  User,
  ArrowLeft,
  Copy,
  Wallet,
  Activity,
  Code,
  ArrowRight,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import {
  explorerService,
  Address,
  Transaction,
  explorerUtils,
} from '../../../../services/explorerService';

export default function AddressDetailPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);
  const router = useRouter();
  const [addressInfo, setAddressInfo] = useState<Address | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalTxs, setTotalTxs] = useState(0);

  useEffect(() => {
    const loadAddress = async () => {
      setLoading(true);
      try {
        const [addrData, txData] = await Promise.all([
          explorerService.addresses.getAddress(address),
          explorerService.addresses.getAddressTransactions(address, 1, 20),
        ]);
        setAddressInfo(addrData);
        setTransactions(txData.transactions);
        setTotalTxs(txData.total);
      } catch (error) {
        console.error('Failed to load address:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAddress();
  }, [address]);

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading address info...</p>
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
            addressInfo?.isContract
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-purple-500/20'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-500/20'
          }`}
        >
          {addressInfo?.isContract ? (
            <Code className="w-7 h-7 text-white" />
          ) : (
            <User className="w-7 h-7 text-white" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">
              {addressInfo?.isContract ? 'Contract Address' : 'Wallet Address'}
            </h1>
            {addressInfo?.isContract && (
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded border border-purple-500/30">
                Smart Contract
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-400 font-mono text-sm break-all">{address}</p>
            <button
              onClick={() => copyToClipboard(address)}
              className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-white transition-colors"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {addressInfo ? (
        <>
          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md rounded-2xl border border-cyan-500/30 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Wallet className="w-6 h-6 text-cyan-400" />
                <span className="text-gray-400">Balance</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {explorerUtils.formatWei(addressInfo.balance, 4)} QAU
              </p>
              <p className="text-gray-400 text-sm mt-1">
                ≈ ${addressInfo.balanceUSD?.toLocaleString() || '0'} USD
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-6 h-6 text-indigo-400" />
                <span className="text-gray-400">Transactions</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {addressInfo.transactionCount.toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm mt-1">Total Txns</p>
            </div>
            {/* Placeholder for Token Holdings or other stats if needed, or just remove if not available */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 flex items-center justify-center text-gray-400">
              <p>More stats coming soon...</p>
            </div>
          </motion.div>

          {/* Transactions List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Latest Transactions</h2>
              <span className="text-sm text-gray-400">Showing last 20 records</span>
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
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                        Block
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                        From
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">To</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-400">
                        Value
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
                          <Link
                            href={`/explorer/tx/${tx.hash}`}
                            className="text-cyan-400 hover:text-cyan-300 font-mono text-sm"
                          >
                            {explorerUtils.truncateHash(tx.hash, 8, 6)}
                          </Link>
                        </td>
                        <td className="px-6 py-3">
                          <span className="px-2 py-1 rounded bg-white/10 text-xs text-gray-300 border border-white/10">
                            Transfer
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <Link
                            href={`/explorer/block/${explorerUtils.formatBlockNumber(tx.blockNumber)}`}
                            className="text-indigo-400 hover:text-indigo-300 text-sm"
                          >
                            {explorerUtils.formatBlockNumber(tx.blockNumber)}
                          </Link>
                        </td>
                        <td className="px-6 py-3">
                          {tx.from.toLowerCase() === address.toLowerCase() ? (
                            <span className="text-gray-400 text-sm">Self</span>
                          ) : (
                            <Link
                              href={`/explorer/address/${tx.from}`}
                              className="text-indigo-400 hover:text-indigo-300 font-mono text-sm"
                            >
                              {explorerUtils.truncateHash(tx.from, 6, 4)}
                            </Link>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            {tx.from.toLowerCase() === address.toLowerCase() ? (
                              <span className="p-1 rounded bg-orange-500/20 text-orange-400 text-xs font-bold">
                                OUT
                              </span>
                            ) : (
                              <span className="p-1 rounded bg-green-500/20 text-green-400 text-xs font-bold">
                                IN
                              </span>
                            )}
                            {tx.to ? (
                              tx.to.toLowerCase() === address.toLowerCase() ? (
                                <span className="text-gray-400 text-sm">Self</span>
                              ) : (
                                <Link
                                  href={`/explorer/address/${tx.to}`}
                                  className="text-indigo-400 hover:text-indigo-300 font-mono text-sm"
                                >
                                  {explorerUtils.truncateHash(tx.to, 6, 4)}
                                </Link>
                              )
                            ) : (
                              <span className="text-gray-500 text-sm">Contract Creation</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-3 text-white text-sm">
                          {explorerUtils.formatWei(tx.value, 4)} QAU
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-gray-400">
                <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No transactions found for this address</p>
              </div>
            )}
          </motion.div>
        </>
      ) : (
        <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-12 text-center">
          <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Address not found</p>
        </div>
      )}
    </div>
  );
}
