'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Layers, Activity, Clock, CheckCircle, AlertTriangle, 
  RefreshCw, Users, Coins, GitBranch, Shield, Zap, Server
} from 'lucide-react';
import { explorerUtils } from '../../../services/explorerService';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

interface QPOSStatus {
  consensus: string;
  slotDuration: number;
  slotsPerEpoch: number;
  currentSlot: number;
  currentEpoch: number;
  slotInEpoch: number;
  justifiedEpoch: number;
  finalizedEpoch: number;
  validatorCount: number;
  currentProposer: string | null;
  epochSummary: {
    epoch: number;
    startSlot: number;
    endSlot: number;
    totalAttestations: number;
    participationRate: number;
    isJustified: boolean;
    isFinalized: boolean;
  } | null;
  lastEpochRewards: {
    epoch: number;
    totalRewards: string;
    totalPenalties: string;
    participatingStake: string;
    totalStake: string;
  } | null;
  slashedValidators: number[];
  proposerBoost: {
    blockRoot: string;
    slot: number;
  } | null;
  advanced: {
    forkChoice: {
      head: string;
      justifiedRoot: string;
      justifiedEpoch: number;
      finalizedRoot: string;
      finalizedEpoch: number;
      blockCount: number;
      voteCount: number;
    };
    inactivityLeakActive: boolean;
    pendingWithdrawals: number;
  } | null;
  syncCommittee: {
    period: number;
    size: number;
  } | null;
  finality: Record<string, unknown>;
}

interface EpochsData {
  currentEpoch: number;
  currentSlot: number;
  slotInEpoch: number;
  slotDuration: number;
  slotsPerEpoch: number;
  epochDuration: number;
  justifiedEpoch: number;
  finalizedEpoch: number;
  epochsToFinality: number;
  epochs: Array<{
    epoch: number;
    startSlot: number;
    endSlot: number;
    status: string;
    isJustified: boolean;
    isFinalized: boolean;
    isCurrent: boolean;
  }>;
}

export default function QPOSPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [qposStatus, setQposStatus] = useState<QPOSStatus | null>(null);
  const [epochsData, setEpochsData] = useState<EpochsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'epochs' | 'advanced'>('overview');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [statusRes, epochsRes] = await Promise.all([
        fetch('/api/explorer/qpos/status'),
        fetch('/api/explorer/qpos/epochs'),
      ]);

      if (statusRes.ok) {
        setQposStatus(await statusRes.json());
      }
      if (epochsRes.ok) {
        setEpochsData(await epochsRes.json());
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to load QPOS data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, [loadData]);

  // Calculate slot progress
  const slotProgress = qposStatus ? ((qposStatus.slotInEpoch + 1) / qposStatus.slotsPerEpoch) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto px-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => router.push('/explorer')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" /> {t('explorer.qpos.back')}
        </button>
        <button onClick={loadData} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-all flex items-center gap-2 border border-white/10">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {lastUpdated && <span className="text-xs text-gray-400 hidden md:inline">{lastUpdated.toLocaleTimeString()}</span>}
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Layers className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{t('explorer.qpos.title')}</h1>
          <p className="text-gray-400">{t('explorer.qpos.subtitle')}</p>
        </div>
      </motion.div>

      {/* Real-time Status Card */}
        {qposStatus && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                {t('explorer.qpos.live_status')}
              </h3>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                {t('explorer.qpos.live')}
              </span>
            </div>

            {/* Slot Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">{t('explorer.qpos.epoch_progress', { epoch: qposStatus.currentEpoch })}</span>
                <span className="text-purple-400 font-mono text-sm">{t('explorer.qpos.slot_info', { current: qposStatus.slotInEpoch + 1, total: qposStatus.slotsPerEpoch })}</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${slotProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label={t('explorer.qpos.stats.current_slot')} value={qposStatus.currentSlot} icon={Clock} color="text-cyan-400" />
              <StatCard label={t('explorer.qpos.stats.current_epoch')} value={qposStatus.currentEpoch} icon={Layers} color="text-purple-400" />
              <StatCard label={t('explorer.qpos.stats.justified_epoch')} value={qposStatus.justifiedEpoch} icon={CheckCircle} color="text-blue-400" />
              <StatCard label={t('explorer.qpos.stats.finalized_epoch')} value={qposStatus.finalizedEpoch} icon={Shield} color="text-green-400" />
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: t('explorer.qpos.tabs.overview'), icon: Activity },
            { id: 'epochs', label: t('explorer.qpos.tabs.epochs'), icon: Layers },
            { id: 'advanced', label: t('explorer.qpos.tabs.advanced'), icon: Zap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap border ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-transparent shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border-white/10 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && qposStatus && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Epoch Summary */}
            {qposStatus.epochSummary && (
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  {t('explorer.qpos.epoch_summary')}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-gray-400 text-xs">{t('explorer.qpos.attestations')}</p>
                    <p className="text-white font-mono text-lg">{qposStatus.epochSummary.totalAttestations}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-gray-400 text-xs">{t('explorer.qpos.participation_rate')}</p>
                    <p className="text-emerald-400 font-mono text-lg">{(qposStatus.epochSummary.participationRate * 100).toFixed(1)}%</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-gray-400 text-xs">{t('explorer.qpos.justified')}</p>
                    <p className={`font-mono text-lg ${qposStatus.epochSummary.isJustified ? 'text-green-400' : 'text-gray-400'}`}>
                      {qposStatus.epochSummary.isJustified ? t('explorer.qpos.yes') : t('explorer.qpos.no')}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-gray-400 text-xs">{t('explorer.qpos.finalized')}</p>
                    <p className={`font-mono text-lg ${qposStatus.epochSummary.isFinalized ? 'text-green-400' : 'text-gray-400'}`}>
                      {qposStatus.epochSummary.isFinalized ? t('explorer.qpos.yes') : t('explorer.qpos.no')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Validators Info */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                {t('explorer.qpos.validators_title')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <p className="text-gray-400 text-xs">{t('explorer.qpos.total_validators')}</p>
                  <p className="text-white font-mono text-lg">{qposStatus.validatorCount}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <p className="text-gray-400 text-xs">{t('explorer.qpos.current_proposer')}</p>
                  <p className="text-purple-400 font-mono text-sm truncate">
                    {qposStatus.currentProposer ? `0x${qposStatus.currentProposer.slice(0, 8)}...` : '-'}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <p className="text-gray-400 text-xs">{t('explorer.qpos.slashed')}</p>
                  <p className={`font-mono text-lg ${qposStatus.slashedValidators.length > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {qposStatus.slashedValidators.length}
                  </p>
                </div>
              </div>
              <button onClick={() => router.push('/explorer/validators')} 
                className="mt-4 w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-all border border-white/5">
                {t('explorer.qpos.view_all_validators')} →
              </button>
            </div>

            {/* Last Epoch Rewards */}
            {qposStatus.lastEpochRewards && (
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  {t('explorer.qpos.epoch_rewards', { epoch: qposStatus.lastEpochRewards.epoch })}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-gray-400 text-xs">{t('explorer.qpos.total_rewards')}</p>
                    <p className="text-green-400 font-mono">{explorerUtils.formatWei(qposStatus.lastEpochRewards.totalRewards)}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-gray-400 text-xs">{t('explorer.qpos.total_penalties')}</p>
                    <p className="text-red-400 font-mono">{explorerUtils.formatWei(qposStatus.lastEpochRewards.totalPenalties)}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-gray-400 text-xs">{t('explorer.qpos.participating_stake')}</p>
                    <p className="text-cyan-400 font-mono">{explorerUtils.formatWei(qposStatus.lastEpochRewards.participatingStake)}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-gray-400 text-xs">{t('explorer.qpos.total_stake')}</p>
                    <p className="text-white font-mono">{explorerUtils.formatWei(qposStatus.lastEpochRewards.totalStake)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* QPOS Configuration */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">{t('explorer.qpos.configuration')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">{t('explorer.qpos.config.slot_duration')}</p>
                  <p className="text-white font-mono">12 seconds</p>
                </div>
                <div>
                  <p className="text-gray-400">{t('explorer.qpos.config.slots_per_epoch')}</p>
                  <p className="text-white font-mono">32</p>
                </div>
                <div>
                  <p className="text-gray-400">{t('explorer.qpos.config.epoch_duration')}</p>
                  <p className="text-white font-mono">~6.4 minutes</p>
                </div>
                <div>
                  <p className="text-gray-400">{t('explorer.qpos.config.sync_committee')}</p>
                  <p className="text-white font-mono">256 epochs</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Epochs Tab */}
        {activeTab === 'epochs' && epochsData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  {t('explorer.qpos.epochs_history')}
                </h3>
                {epochsData && (
                  <span className="text-gray-400 text-sm">
                    {t('explorer.qpos.finality_behind', { count: epochsData.epochsToFinality })}
                  </span>
                )}
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('explorer.qpos.columns.epoch')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('explorer.qpos.columns.slots')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('explorer.qpos.columns.status')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('explorer.qpos.columns.justified')}</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">{t('explorer.qpos.columns.finalized')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {epochsData?.epochs.map((epoch) => (
                      <tr key={epoch.epoch} className={`hover:bg-white/5 transition-colors ${epoch.isCurrent ? 'bg-purple-500/5' : ''}`}>
                        <td className="px-6 py-4">
                          <span className={`font-mono font-medium ${epoch.isCurrent ? 'text-purple-400' : 'text-cyan-400'}`}>
                            {epoch.epoch}
                          </span>
                          {epoch.isCurrent && <span className="ml-2 text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">{t('explorer.qpos.current')}</span>}
                        </td>
                        <td className="px-6 py-4 text-gray-400 font-mono text-sm">
                          {epoch.startSlot} - {epoch.endSlot}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs border ${
                            epoch.status === 'finalized' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            epoch.status === 'justified' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                            epoch.status === 'completed' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                            'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          }`}>
                            {epoch.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {epoch.isJustified ? (
                            <CheckCircle className="w-4 h-4 text-blue-400" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-600" />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {epoch.isFinalized ? (
                            <Shield className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-600" />
                          )}
                        </td>
                      </tr>
                    ))}
                    {!epochsData && (
                      <tr className="animate-pulse">
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">{t('explorer.qpos.loading_epochs')}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && qposStatus?.advanced && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-pink-400" />
                  {t('explorer.qpos.fork_choice')}
                </h3>
                <div className="space-y-4">
                  <DetailRow label={t('explorer.qpos.head_root')} value={qposStatus.advanced.forkChoice.head} mono />
                  <DetailRow label={t('explorer.qpos.justified_root')} value={qposStatus.advanced.forkChoice.justifiedRoot} mono />
                  <DetailRow label={t('explorer.qpos.finalized_root')} value={qposStatus.advanced.forkChoice.finalizedRoot} mono />
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5 text-orange-400" />
                  {t('explorer.qpos.system_state')}
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">{t('explorer.qpos.inactivity_leak')}</span>
                    <span className={`px-2 py-1 rounded text-xs ${qposStatus.advanced.inactivityLeakActive ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {qposStatus.advanced.inactivityLeakActive ? t('explorer.qpos.active') : t('explorer.qpos.inactive')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-gray-400">{t('explorer.qpos.pending_withdrawals')}</span>
                    <span className="text-white font-mono">{qposStatus.advanced.pendingWithdrawals}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">{t('explorer.qpos.sync_committee_size')}</span>
                    <span className="text-white font-mono">{qposStatus.syncCommittee?.size || 512}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Proposer Boost */}
            {qposStatus.proposerBoost && (
              <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  {t('explorer.qpos.proposer_boost')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-gray-400 text-xs">{t('explorer.qpos.block_root')}</p>
                    <p className="text-yellow-400 font-mono text-sm truncate">{qposStatus.proposerBoost.blockRoot}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                    <p className="text-gray-400 text-xs">{t('explorer.qpos.slot')}</p>
                    <p className="text-white font-mono text-lg">{qposStatus.proposerBoost.slot}</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-gray-400 text-xs">{label}</span>
      </div>
      <div className="text-xl font-bold text-white font-mono">{value}</div>
    </div>
  );
}

function DetailRow({ label, value, mono }: { label: string, value: string | number, mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1 py-2 border-b border-white/5 last:border-0">
      <span className="text-gray-400 text-xs">{label}</span>
      <span className={`text-white text-sm break-all ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

