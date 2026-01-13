'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Droplets, Landmark, Lock, Sprout, TrendingUp, DollarSign, 
  Percent, Clock, AlertCircle, Wallet, Plus, ArrowUpDown, RefreshCw
} from 'lucide-react';
import { PageLayout } from '@/components/ui/PageLayout';
import { Card, CardHeader, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Loading } from '@/components/ui/Loading';
import { useTranslation } from 'react-i18next';
import ParticlesBackground from '../components/ParticlesBackground';
import EnhancedNavbar from '../components/EnhancedNavbar';
import EnhancedFooter from '../components/EnhancedFooter';

// Auto refresh interval (30 seconds)
const AUTO_REFRESH_INTERVAL = 30000;

interface LiquidityPool {
  pool_id: string;
  token_a: string;
  token_b: string;
  reserve_a: number;
  reserve_b: number;
  total_liquidity: number;
  fee_rate: number;
  price: number;
  apy: number;
}

interface LendingPool {
  pool_id: string;
  asset: string;
  total_supply: number;
  total_borrowed: number;
  supply_rate: number;
  borrow_rate: number;
  utilization_rate: number;
  collateral_factor: number;
}

interface StakingPool {
  pool_id: string;
  token: string;
  reward_token: string;
  total_staked: number;
  reward_rate: number;
  duration_days: number;
  min_stake_amount: number;
  apy: number;
}

interface YieldFarm {
  farm_id: string;
  name: string;
  lp_token: string;
  reward_token: string;
  total_staked: number;
  apy: number;
  multiplier: number;
  status: string;
}

export default function DeFiPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('liquidity');
  const [liquidityPools, setLiquidityPools] = useState<LiquidityPool[]>([]);
  const [lendingPools, setLendingPools] = useState<LendingPool[]>([]);
  const [stakingPools, setStakingPools] = useState<StakingPool[]>([]);
  const [yieldFarms, setYieldFarms] = useState<YieldFarm[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'liquidity' | 'lending' | 'staking' | 'farm'>('liquidity');
  const [selectedPool, setSelectedPool] = useState<LiquidityPool | LendingPool | StakingPool | YieldFarm | null>(null);
  const [amount, setAmount] = useState('');
  const [amountB, setAmountB] = useState('');
  
  // Auto refresh ref
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const [poolsRes, lendingRes, stakingRes, farmsRes] = await Promise.all([
        fetch('/api/defi/pools'),
        fetch('/api/defi/lending/pools'),
        fetch('/api/defi/staking/pools'),
        fetch('/api/defi/farms'),
      ]);

      const [poolsData, lendingData, stakingData, farmsData] = await Promise.all([
        poolsRes.json(),
        lendingRes.json(),
        stakingRes.json(),
        farmsRes.json(),
      ]);

      if (poolsData.success) setLiquidityPools(poolsData.data?.pools || []);
      if (lendingData.success) setLendingPools(lendingData.data?.pools || []);
      if (stakingData.success) setStakingPools(stakingData.data?.pools || []);
      if (farmsData.success) setYieldFarms(farmsData.data?.farms || []);
      
      setError('');
      setLastUpdated(new Date());
    } catch {
      setError(t('defi_page.error'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t]);

  // Manual refresh
  const handleManualRefresh = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Retry loading
  const handleRetry = useCallback(() => {
    setError('');
    fetchData(false);
  }, [fetchData]);

  // Initial load and auto refresh
  useEffect(() => {
    fetchData();
    
    // Set auto refresh
    refreshIntervalRef.current = setInterval(() => {
      fetchData(true);
    }, AUTO_REFRESH_INTERVAL);
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchData]);

  // Format last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return '';
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);
    if (diff < 60) return `${t('defi_page.updated')} ${diff}${t('defi_page.seconds_ago')}`;
    if (diff < 3600) return `${t('defi_page.updated')} ${Math.floor(diff / 60)}${t('defi_page.minutes_ago')}`;
    return lastUpdated.toLocaleTimeString();
  };

  const getTVL = () => {
    const liquidityTVL = liquidityPools.reduce((sum, p) => sum + (p.total_liquidity || 0), 0);
    const lendingTVL = lendingPools.reduce((sum, p) => sum + (p.total_supply || 0), 0);
    const stakingTVL = stakingPools.reduce((sum, p) => sum + (p.total_staked || 0), 0);
    const farmTVL = yieldFarms.reduce((sum, f) => sum + (f.total_staked || 0), 0);
    return (liquidityTVL + lendingTVL + stakingTVL + farmTVL) * 0.03; // QAU price placeholder
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K';
    return num.toFixed(2);
  };

  const openModal = (type: typeof modalType, pool: LiquidityPool | LendingPool | StakingPool | YieldFarm) => {
    setModalType(type);
    setSelectedPool(pool);
    setAmount('');
    setAmountB('');
    setShowModal(true);
  };

  const handleAction = () => {
    alert(`${t('defi_page.modal.action_success')}\nType: ${modalType}\nAmount: ${amount}\n\n${t('defi_page.modal.demo_mode')}`);
    setShowModal(false);
  };

  const tabs = [
    { id: 'liquidity', label: t('defi_page.tabs.liquidity'), icon: <Droplets className="w-4 h-4" /> },
    { id: 'lending', label: t('defi_page.tabs.lending'), icon: <Landmark className="w-4 h-4" /> },
    { id: 'staking', label: t('defi_page.tabs.staking'), icon: <Lock className="w-4 h-4" /> },
    { id: 'farming', label: t('defi_page.tabs.farming'), icon: <Sprout className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
           <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <EnhancedNavbar />
      <div className="relative z-10 pt-24 pb-12 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            {t('defi_page.title')}
          </h1>
          <p className="text-gray-400">{t('defi_page.subtitle')}</p>
        </div>

        <div className="flex items-center gap-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4">
          <div className="text-right">
            <p className="text-gray-400 text-sm">{t('defi_page.tvl')}</p>
            <p className="text-2xl font-bold text-cyan-400">${formatNumber(getTVL())}</p>
          </div>
          <div className="h-10 w-px bg-white/10"></div>
          <div className="flex flex-col items-end gap-1">
            <button 
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 text-sm text-white hover:text-cyan-400 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? t('defi_page.refreshing') : t('defi_page.refresh')}
            </button>
            {lastUpdated && (
              <span className="text-gray-500 text-xs">{formatLastUpdated()}</span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
          <button onClick={handleRetry} className="text-sm text-red-400 hover:text-white transition-colors flex items-center gap-1">
            <RefreshCw className="w-4 h-4" /> {t('defi_page.retry')}
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: t('defi_page.stats.liquidity'), value: liquidityPools.length, icon: Droplets, color: 'text-blue-400' },
          { label: t('defi_page.stats.lending'), value: lendingPools.length, icon: Landmark, color: 'text-green-400' },
          { label: t('defi_page.stats.staking'), value: stakingPools.length, icon: Lock, color: 'text-purple-400' },
          { label: t('defi_page.stats.farms'), value: yieldFarms.length, icon: Sprout, color: 'text-orange-400' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <p className="text-gray-400 text-xs">{stat.label}</p>
            </div>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 whitespace-nowrap border ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-transparent shadow-lg shadow-cyan-500/20'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border-white/10 hover:text-white'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {/* Liquidity Pools */}
        {activeTab === 'liquidity' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liquidityPools.map((pool, index) => (
              <motion.div
                key={pool.pool_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold border-2 border-gray-900 shadow-lg">
                        {pool.token_a?.slice(0, 2)}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold border-2 border-gray-900 shadow-lg">
                        {pool.token_b?.slice(0, 2)}
                      </div>
                    </div>
                    <span className="text-white font-bold text-lg">{pool.token_a}/{pool.token_b}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium border border-green-500/30">
                    {pool.apy?.toFixed(1)}% APY
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('defi_page.liquidity.total_liquidity')}</span>
                    <span className="text-white font-mono">${formatNumber(pool.total_liquidity || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('defi_page.liquidity.price')}</span>
                    <span className="text-white font-mono">{pool.price?.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('defi_page.liquidity.fee_rate')}</span>
                    <span className="text-white font-mono">{((pool.fee_rate || 0) * 100).toFixed(2)}%</span>
                  </div>
                </div>

                <button
                  onClick={() => openModal('liquidity', pool)}
                  className="w-full py-3 bg-white/5 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 rounded-xl border border-cyan-500/30 transition-all flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-4 h-4" /> {t('defi_page.liquidity.add_liquidity')}
                </button>
              </motion.div>
            ))}
            {liquidityPools.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                <Droplets className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">{t('defi_page.liquidity.no_pools')}</p>
              </div>
            )}
          </div>
        )}

        {/* Lending Market */}
        {activeTab === 'lending' && (
          <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">{t('defi_page.lending.asset')}</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">{t('defi_page.lending.total_supply')}</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">{t('defi_page.lending.total_borrowed')}</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">{t('defi_page.lending.supply_apy')}</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">{t('defi_page.lending.borrow_apy')}</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">{t('defi_page.lending.utilization')}</th>
                    <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">{t('defi_page.lending.action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {lendingPools.map((pool, index) => (
                    <motion.tr
                      key={pool.pool_id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                            {pool.asset?.slice(0, 2)}
                          </div>
                          <span className="text-white font-medium">{pool.asset}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-white font-mono">{formatNumber(pool.total_supply || 0)}</td>
                      <td className="py-4 px-6 text-white font-mono">{formatNumber(pool.total_borrowed || 0)}</td>
                      <td className="py-4 px-6 text-green-400 font-medium">{((pool.supply_rate || 0) * 100).toFixed(2)}%</td>
                      <td className="py-4 px-6 text-red-400 font-medium">{((pool.borrow_rate || 0) * 100).toFixed(2)}%</td>
                      <td className="py-4 px-6 text-yellow-400 font-medium">{((pool.utilization_rate || 0) * 100).toFixed(1)}%</td>
                      <td className="py-4 px-6">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openModal('lending', pool)}
                            className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg text-sm transition-colors border border-green-500/30"
                          >
                            {t('defi_page.lending.supply')}
                          </button>
                          <button 
                            onClick={() => openModal('lending', pool)}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition-colors border border-white/10"
                          >
                            {t('defi_page.lending.borrow')}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {lendingPools.length === 0 && (
                <div className="text-center py-20 text-gray-400">{t('defi_page.lending.no_assets')}</div>
              )}
            </div>
          </div>
        )}

        {/* Staking Pools */}
        {activeTab === 'staking' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stakingPools.map((pool, index) => (
              <motion.div
                key={pool.pool_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold shadow-lg shadow-purple-500/20">
                      {pool.token?.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg">{pool.token}</p>
                      <p className="text-purple-400 text-xs font-medium bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20 inline-block mt-1">
                        {t('defi_page.staking.reward')}: {pool.reward_token}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm font-medium border border-purple-500/30">
                    {pool.apy?.toFixed(1)}% APY
                  </span>
                </div>

                <div className="space-y-3 mb-6 bg-white/5 rounded-xl p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('defi_page.staking.total_staked')}</span>
                    <span className="text-white font-mono">{formatNumber(pool.total_staked || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('defi_page.staking.lock_period')}</span>
                    <span className="text-white font-mono">{pool.duration_days} {t('defi_page.staking.days')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">{t('defi_page.staking.min_stake')}</span>
                    <span className="text-white font-mono">{pool.min_stake_amount}</span>
                  </div>
                </div>

                <button
                  onClick={() => openModal('staking', pool)}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-medium shadow-lg shadow-purple-500/25"
                >
                  <Lock className="w-4 h-4" /> {t('defi_page.staking.stake_tokens')}
                </button>
              </motion.div>
            ))}
            {stakingPools.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                <Lock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">{t('defi_page.staking.no_pools')}</p>
              </div>
            )}
          </div>
        )}

        {/* Yield Farms */}
        {activeTab === 'farming' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {yieldFarms.map((farm, index) => (
              <motion.div
                key={farm.farm_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-white font-bold text-xl mb-1">{farm.name}</h3>
                    <p className="text-gray-400 text-sm font-mono">{t('defi_page.farming.lp')}: {farm.lp_token}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${farm.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                      {farm.status}
                    </span>
                    <span className="px-2 py-1 rounded text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      {farm.apy?.toFixed(1)}% APY
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center mb-6 bg-white/5 rounded-xl p-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">{t('defi_page.farming.total_staked')}</p>
                    <p className="text-white font-mono font-medium">{formatNumber(farm.total_staked || 0)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">{t('defi_page.farming.reward_token')}</p>
                    <p className="text-white font-mono font-medium">{farm.reward_token}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">{t('defi_page.farming.multiplier')}</p>
                    <p className="text-white font-mono font-medium">{farm.multiplier}x</p>
                  </div>
                </div>

                <button
                  onClick={() => openModal('farm', farm)}
                  disabled={farm.status !== 'ACTIVE'}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-medium shadow-lg shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sprout className="w-4 h-4" />
                  {farm.status === 'ACTIVE' ? t('defi_page.farming.stake_lp') : t('defi_page.farming.farm_ended')}
                </button>
              </motion.div>
            ))}
            {yieldFarms.length === 0 && (
              <div className="col-span-full text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                <Sprout className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">{t('defi_page.farming.no_farms')}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showModal && selectedPool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-[#121218] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl"
          >
            <h3 className="text-xl font-bold text-white mb-4">
              {modalType === 'liquidity' ? t('defi_page.modal.add_liquidity') :
               modalType === 'lending' ? t('defi_page.modal.lending_action') :
               modalType === 'staking' ? t('defi_page.modal.stake_tokens') : t('defi_page.modal.stake_lp')}
            </h3>
            
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                {modalType === 'liquidity' && (
                  <p className="text-cyan-400 font-medium text-lg">{(selectedPool as LiquidityPool).token_a}/{(selectedPool as LiquidityPool).token_b}</p>
                )}
                {modalType === 'lending' && (
                  <p className="text-green-400 font-medium text-lg">{(selectedPool as LendingPool).asset}</p>
                )}
                {modalType === 'staking' && (
                  <p className="text-purple-400 font-medium text-lg">{(selectedPool as StakingPool).token}</p>
                )}
                {modalType === 'farm' && (
                  <p className="text-orange-400 font-medium text-lg">{(selectedPool as YieldFarm).name}</p>
                )}
                <p className="text-gray-400 text-sm mt-1 font-mono">
                  {modalType === 'lending' 
                    ? `${t('defi_page.lending.supply_apy')}: ${(selectedPool as LendingPool).supply_rate?.toFixed(2)}%`
                    : `APY: ${(selectedPool as StakingPool | YieldFarm | LiquidityPool).apy?.toFixed(2)}%`
                  }
                </p>
              </div>

              {modalType === 'liquidity' ? (
                <>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">{(selectedPool as LiquidityPool).token_a} {t('defi_page.modal.amount')}</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">{(selectedPool as LiquidityPool).token_b} {t('defi_page.modal.amount')}</label>
                    <input
                      type="number"
                      value={amountB}
                      onChange={(e) => setAmountB(e.target.value)}
                      placeholder="0.0"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-gray-400 text-sm mb-2">{t('defi_page.modal.amount')}</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors border border-white/10"
                >
                  {t('defi_page.modal.cancel')}
                </button>
                <button 
                  onClick={handleAction}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:opacity-90 transition-opacity font-medium shadow-lg shadow-cyan-500/20"
                >
                  {t('defi_page.modal.confirm')}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      </div>
      <EnhancedFooter />
    </div>
  );
}