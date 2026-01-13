'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Database, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

interface Contract {
  address: string;
  name: string;
  type: string;
  verified: boolean;
  txCount: number;
  balance: string;
}

const mockContracts = [
  { address: '0x1234567890abcdef1234567890abcdef12345678', name: 'QAU Token', type: 'ERC-20', verified: true, txCount: 15420, balance: '1000000' },
  { address: '0x2345678901abcdef2345678901abcdef23456789', name: 'DEX Router', type: 'DEX', verified: true, txCount: 8930, balance: '500000' },
  { address: '0x3456789012abcdef3456789012abcdef34567890', name: 'Staking Pool', type: 'Staking', verified: true, txCount: 4521, balance: '2500000' },
  { address: '0x4567890123abcdef4567890123abcdef45678901', name: 'NFT Marketplace', type: 'NFT', verified: false, txCount: 2103, balance: '150000' },
  { address: '0x5678901234abcdef5678901234abcdef56789012', name: 'Governance', type: 'DAO', verified: true, txCount: 892, balance: '750000' },
];

export default function ContractsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [contracts] = useState(mockContracts);

  const filteredContracts = contracts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-5">
      {/* Back Button */}
      <button onClick={() => router.push('/explorer')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5" /> {t('explorer.contracts.back')}
      </button>

      {/* Title Section */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Database className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{t('explorer.contracts.title')}</h1>
          <p className="text-gray-400">{t('explorer.contracts.subtitle')}</p>
        </div>
      </motion.div>

      {/* Search */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('explorer.contracts.search_placeholder')}
              className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
            />
          </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: t('explorer.contracts.stats.deployed'), value: '1,234', color: 'text-blue-400' },
          { label: t('explorer.contracts.stats.verified'), value: '892', color: 'text-emerald-400' },
          { label: t('explorer.contracts.stats.interactions'), value: '45.2K', color: 'text-cyan-400' },
          { label: t('explorer.contracts.stats.tvl'), value: '$12.5M', color: 'text-yellow-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Contracts List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">{t('explorer.contracts.columns.name')}</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">{t('explorer.contracts.columns.address')}</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">{t('explorer.contracts.columns.type')}</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">{t('explorer.contracts.columns.status')}</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">{t('explorer.contracts.columns.balance')}</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">{t('explorer.contracts.columns.txns')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.map((contract, i) => (
                <motion.tr key={contract.address} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
                  className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        contract.type === 'ERC-20' ? 'bg-purple-500/20 text-purple-400' :
                        contract.type === 'DEX' ? 'bg-blue-500/20 text-blue-400' :
                        contract.type === 'Staking' ? 'bg-emerald-500/20 text-emerald-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {contract.type === 'ERC-20' ? '$' : contract.type === 'DEX' ? 'D' : contract.type === 'Staking' ? 'S' : '#'}
                      </div>
                      <span className="text-white font-medium">{contract.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-mono text-sm">{contract.address.slice(0, 10)}...{contract.address.slice(-8)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{contract.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    {contract.verified ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-xs bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 w-fit">
                        {t('explorer.contracts.verified')}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">{t('explorer.contracts.unverified')}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-mono text-sm">{contract.balance} QAU</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{contract.txCount.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}$' : contract.type === 'DEX' ? 'D' : contract.type === 'Staking' ? 'S' : '#'}
                      </div>
                      <span className="text-white font-medium">{contract.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer font-mono text-sm">{contract.address.slice(0, 10)}...{contract.address.slice(-8)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-white/10 rounded text-xs text-gray-300">{contract.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    {contract.verified ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-xs bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 w-fit">
                        Verified
                      </span>
                    ) : (
                      <span className="text-gray-500 text-xs">Unverified</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-300 font-mono text-sm">{contract.balance} QAU</td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{contract.txCount.toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
