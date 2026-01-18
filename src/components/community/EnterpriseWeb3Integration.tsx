'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WalletIcon,
  ShieldCheckIcon,
  TrophyIcon,
  CubeIcon,
  StarIcon,
  BanknotesIcon,
  UserCircleIcon,
  ChartBarIcon,
  GiftIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

// Type definitions
interface UserProfile {
  address?: string;
  username: string;
  avatar?: string;
  level: number;
  reputation: number;
  joinedAt?: string;
  joinDate?: string;
  totalPosts?: number;
  totalLikes?: number;
  stakingPower?: number;
  governanceVotes?: number;
}

interface NFTBadge {
  id: string | number;
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: string;
  earned?: string;
  tokenId?: string;
}

interface Achievement {
  id: string | number;
  title: string;
  description: string;
  icon?: string;
  progress: number;
  maxProgress?: number;
  completed?: boolean;
  unlocked?: boolean;
  reward: string;
}

interface StakingData {
  stakedAmount?: string | number;
  totalStaked?: number;
  rewards?: string;
  stakingRewards?: number;
  apy: number;
  lockPeriod: number | string;
  votingPower?: number;
  nextReward?: string;
}

// Enterprise Web3 Integration Component
export default function EnterpriseWeb3Integration() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [nftBadges, setNftBadges] = useState<NFTBadge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stakingData, setStakingData] = useState<StakingData | null>(null);
  const [loading, setLoading] = useState(false);

  // Supported wallets for enterprise integration
  const supportedWallets = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Most popular Ethereum wallet',
      installed: typeof window !== 'undefined' && window.ethereum?.isMetaMask,
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Connect to mobile wallets',
      installed: true,
    },
    {
      id: 'coinbase',
      name: 'Coinbase Wallet',
      icon: '🔵',
      description: "Coinbase's self-custody wallet",
      installed: typeof window !== 'undefined' && window.ethereum?.isCoinbaseWallet,
    },
    {
      id: 'phantom',
      name: 'Phantom',
      icon: '👻',
      description: 'Solana ecosystem wallet',
      installed: typeof window !== 'undefined' && window.solana?.isPhantom,
    },
  ];

  // NFT Badge rarities and types
  const badgeRarities = {
    common: { color: 'from-gray-400 to-gray-600', glow: 'shadow-gray-500/50' },
    rare: { color: 'from-blue-400 to-blue-600', glow: 'shadow-blue-500/50' },
    epic: { color: 'from-purple-400 to-purple-600', glow: 'shadow-purple-500/50' },
    legendary: { color: 'from-yellow-400 to-yellow-600', glow: 'shadow-yellow-500/50' },
  };

  // Mock data for demonstration
  useEffect(() => {
    if (isConnected) {
      // Simulate loading user data
      setUserProfile({
        username: 'QuantumTrader',
        level: 15,
        reputation: 2847,
        joinDate: '2024-01-15',
        totalPosts: 156,
        totalLikes: 892,
        stakingPower: 15000,
        governanceVotes: 23,
      });

      setNftBadges([
        {
          id: 1,
          name: 'Early Adopter',
          description: 'Joined Quantaureum in the first month',
          rarity: 'legendary',
          image: '🏆',
          earned: '2024-01-15',
          tokenId: 'QAU-BADGE-001',
        },
        {
          id: 2,
          name: 'Community Builder',
          description: 'Created 100+ quality posts',
          rarity: 'epic',
          image: '🏗️',
          earned: '2024-03-20',
          tokenId: 'QAU-BADGE-045',
        },
        {
          id: 3,
          name: 'Governance Participant',
          description: 'Voted on 20+ proposals',
          rarity: 'rare',
          image: '🗳️',
          earned: '2024-05-10',
          tokenId: 'QAU-BADGE-089',
        },
      ]);

      setAchievements([
        {
          id: 1,
          title: 'First Post',
          description: 'Created your first community post',
          icon: '📝',
          progress: 100,
          unlocked: true,
          reward: '10 QAU',
        },
        {
          id: 2,
          title: 'Social Butterfly',
          description: 'Receive 100 likes on your posts',
          icon: '🦋',
          progress: 89,
          unlocked: false,
          reward: '50 QAU',
        },
        {
          id: 3,
          title: 'Quantum Staker',
          description: 'Stake 10,000+ QAU tokens',
          icon: '💎',
          progress: 100,
          unlocked: true,
          reward: 'Staker Badge NFT',
        },
      ]);

      setStakingData({
        totalStaked: 15000,
        stakingRewards: 234.56,
        votingPower: 15000,
        lockPeriod: '90 days',
        apy: 12.5,
        nextReward: '2024-12-01',
      });
    }
  }, [isConnected]);

  const connectWallet = async (walletId: string) => {
    setLoading(true);
    try {
      // Simulate wallet connection
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (walletId === 'metamask' && window.ethereum) {
        const accounts = (await window.ethereum.request({
          method: 'eth_requestAccounts',
        })) as string[];
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      } else {
        // Mock connection for other wallets
        setWalletAddress('0x742d35Cc6634C0532925a3b8D4C9db96590b5b8c');
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
    setUserProfile(null);
    setNftBadges([]);
    setAchievements([]);
    setStakingData(null);
  };

  if (!isConnected) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <WalletIcon className="w-16 h-16 mx-auto mb-4 text-purple-500" />
          <h2 className="text-3xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-gray-300">
            Connect your Web3 wallet to access enterprise features, NFT badges, and governance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {supportedWallets.map((wallet, index) => (
            <motion.button
              key={wallet.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => connectWallet(wallet.id)}
              disabled={loading || !wallet.installed}
              className={`p-6 rounded-xl border transition-all duration-200 ${
                wallet.installed
                  ? 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-purple-500/50'
                  : 'bg-gray-800/50 border-gray-700 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{wallet.icon}</span>
                <div className="text-left">
                  <h3 className="font-semibold text-white">{wallet.name}</h3>
                  <p className="text-sm text-gray-400">{wallet.description}</p>
                  {!wallet.installed && <p className="text-xs text-red-400 mt-1">Not installed</p>}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mt-6"
          >
            <div className="inline-flex items-center gap-2 text-purple-400">
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              Connecting wallet...
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Connected Wallet Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
              <WalletIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Wallet Connected</h3>
              <p className="text-sm text-gray-300">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </p>
            </div>
          </div>
          <button
            onClick={disconnectWallet}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Disconnect
          </button>
        </div>
      </motion.div>

      {/* User Profile Dashboard */}
      {userProfile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white/5 rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <UserCircleIcon className="w-6 h-6 text-purple-400" />
              <h3 className="font-semibold text-white">Profile Stats</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Level</span>
                <span className="text-white font-semibold">{userProfile.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Reputation</span>
                <span className="text-white font-semibold">
                  {userProfile.reputation.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Posts</span>
                <span className="text-white font-semibold">{userProfile.totalPosts}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Likes</span>
                <span className="text-white font-semibold">{userProfile.totalLikes}</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <BanknotesIcon className="w-6 h-6 text-green-400" />
              <h3 className="font-semibold text-white">Staking</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Staked QAU</span>
                <span className="text-white font-semibold">
                  {stakingData?.totalStaked?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Rewards</span>
                <span className="text-green-400 font-semibold">{stakingData?.stakingRewards}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">APY</span>
                <span className="text-white font-semibold">{stakingData?.apy}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Voting Power</span>
                <span className="text-purple-400 font-semibold">
                  {stakingData?.votingPower?.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-6 border border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <ChartBarIcon className="w-6 h-6 text-cyan-400" />
              <h3 className="font-semibold text-white">Governance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Votes Cast</span>
                <span className="text-white font-semibold">{userProfile.governanceVotes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Proposals</span>
                <span className="text-white font-semibold">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Participation</span>
                <span className="text-cyan-400 font-semibold">95.6%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* NFT Badges Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/5 rounded-xl p-6 border border-white/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <TrophyIcon className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-semibold text-white">NFT Badges</h3>
          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
            {nftBadges.length} Earned
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nftBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 rounded-xl bg-gradient-to-br ${badgeRarities[badge.rarity].color} shadow-lg ${badgeRarities[badge.rarity].glow}`}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{badge.image}</div>
                <h4 className="font-semibold text-white mb-1">{badge.name}</h4>
                <p className="text-xs text-white/80 mb-2">{badge.description}</p>
                <div className="text-xs text-white/60">
                  Earned: {badge.earned ? new Date(badge.earned).toLocaleDateString() : 'N/A'}
                </div>
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      badge.rarity === 'legendary'
                        ? 'bg-yellow-500/30 text-yellow-200'
                        : badge.rarity === 'epic'
                          ? 'bg-purple-500/30 text-purple-200'
                          : badge.rarity === 'rare'
                            ? 'bg-blue-500/30 text-blue-200'
                            : 'bg-gray-500/30 text-gray-200'
                    }`}
                  >
                    {badge.rarity}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/5 rounded-xl p-6 border border-white/20"
      >
        <div className="flex items-center gap-3 mb-6">
          <StarIcon className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-semibold text-white">Achievements</h3>
        </div>

        <div className="space-y-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${
                achievement.unlocked
                  ? 'bg-green-500/10 border-green-500/30'
                  : 'bg-white/5 border-white/20'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`text-2xl ${achievement.unlocked ? 'grayscale-0' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white">{achievement.title}</h4>
                    {achievement.unlocked && <ShieldCheckIcon className="w-4 h-4 text-green-400" />}
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{achievement.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            achievement.unlocked ? 'bg-green-500' : 'bg-purple-500'
                          }`}
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-sm text-yellow-400 font-semibold">
                      {achievement.reward}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
