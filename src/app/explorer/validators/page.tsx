'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, CheckCircle, Activity, Coins, Server, Globe, TrendingUp, RefreshCw, AlertTriangle, Clock, Layers } from 'lucide-react';

interface Validator {
  index: number;
  address: string;
  stake: string;
  stakeFormatted: string;
  status: string;
  active: boolean;
  slashed: boolean;
  isCurrentProposer: boolean;
}

interface ValidatorsData {
  validators: Validator[];
  totalCount: number;
  activeCount: number;
  slashedCount: number;
  inactiveCount: number;
  totalStake: string;
  totalStakeFormatted: string;
  currentEpoch: number;
  currentSlot: number;
}

interface QPOSStatus {
  currentSlot: number;
  currentEpoch: number;
  slotInEpoch: number;
  justifiedEpoch: number;
  finalizedEpoch: number;
  validatorCount: number;
  currentProposer: string | null;
  epochSummary: {
    totalAttestations: number;
    participationRate: number;
  } | null;
}

export default function ValidatorsPage() {
  const router = useRouter();
  const [validatorsData, setValidatorsData] = useState<ValidatorsData | null>(null);
  const [qposStatus, setQposStatus] = useState<QPOSStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [validatorsRes, qposRes] = await Promise.all([
        fetch('/api/explorer/qpos/validators'),
        fetch('/api/explorer/qpos/status'),
      ]);

      if (validatorsRes.ok) {
        const data = await validatorsRes.json();
        setValidatorsData(data);
      }

      if (qposRes.ok) {
        const data = await qposRes.json();
        setQposStatus(data);
      }

      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to load validator data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // 每10秒刷新
    return () => clearInterval(interval);
  }, [loadData]);

  const validators = validatorsData?.validators || [];
  const stats = {
    total: validatorsData?.totalCount || 0,
    active: validatorsData?.activeCount || 0,
    slashed: validatorsData?.slashedCount || 0,
    totalStake: validatorsData?.totalStakeFormatted || '0 QAU',
  };

  return (
    <div className="max-w-7xl mx-auto px-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.push('/explorer')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" /> Back to Explorer
        </button>
        <button onClick={loadData} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all flex items-center gap-2 border border-white/10">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {lastUpdated && <span className="text-xs text-gray-400 hidden md:inline">{lastUpdated.toLocaleTimeString()}</span>}
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Users className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Validators</h1>
          <p className="text-gray-400">Network Validators & Staking Status</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Validators', value: stats.total.toLocaleString(), icon: Users, color: 'text-blue-400' },
          { label: 'Active', value: stats.active.toLocaleString(), icon: CheckCircle, color: 'text-green-400' },
          { label: 'Slashed', value: stats.slashed.toLocaleString(), icon: AlertTriangle, color: 'text-red-400' },
          { label: 'Total Stake', value: stats.totalStake, icon: Coins, color: 'text-yellow-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <p className="text-gray-400 text-xs">{stat.label}</p>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Validators List */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            Validator Nodes
          </h3>
          <span className="text-sm text-gray-400">Showing top validators</span>
        </div>
        
        {loading && validators.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Loading validator data...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Index</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Validator Key</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Stake</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Activity</th>
                </tr>
              </thead>
              <tbody>
                {validators.map((validator) => (
                  <tr key={validator.index} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${validator.isCurrentProposer ? 'bg-cyan-500/10' : ''}`}>
                    <td className="px-6 py-4 font-mono text-gray-300">
                      #{validator.index}
                      {validator.isCurrentProposer && <span className="ml-2 text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/30">Proposer</span>}
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-indigo-400">
                      {validator.address.substring(0, 16)}...{validator.address.substring(validator.address.length - 8)}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {validator.stakeFormatted}
                    </td>
                    <td className="px-6 py-4">
                      {validator.slashed ? (
                        <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs border border-red-500/30 flex items-center w-fit gap-1">
                          <AlertTriangle className="w-3 h-3" /> Slashed
                        </span>
                      ) : validator.active ? (
                        <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs border border-green-500/30 flex items-center w-fit gap-1">
                          <CheckCircle className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-gray-500/20 text-gray-400 text-xs border border-gray-500/30">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${validator.active ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
                        <span className="text-sm text-gray-400">{validator.active ? 'Online' : 'Offline'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {validators.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">No validators found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}

