'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Unlink } from 'lucide-react';

interface WalletInfo {
  address: string;
  balance: string;
  network: string;
  isConnected: boolean;
}

interface NFTBadge {
  id: string;
  name: string;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  earnedDate: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  points: number;
  badge: NFTBadge;
  progress: number;
  maxProgress: number;
  isCompleted: boolean;
}

interface UserProfile {
  address: string;
  username: string;
  avatar: string;
  level: number;
  reputation: number;
  badges: NFTBadge[];
  achievements: Achievement[];
  stakedAmount: string;
  votingPower: number;
}

export default function Web3Integration() {
  const [wallet, setWallet] = useState<WalletInfo>({
    address: '',
    balance: '0',
    network: 'Ethereum',
    isConnected: false,
  });

  const [userProfile] = useState<UserProfile>({
    address: '0x1234...5678',
    username: 'QuantumUser',
    avatar: '🦄',
    level: 15,
    reputation: 8750,
    badges: [
      {
        id: '1',
        name: '创世成员',
        description: '社区早期支持者',
        image: '🌟',
        rarity: 'legendary',
        category: 'Community',
        earnedDate: '2024-01-15',
      },
      {
        id: '2',
        name: '治理专家',
        description: '参与50+治理投票',
        image: '🏛️',
        rarity: 'epic',
        category: 'Governance',
        earnedDate: '2024-03-20',
      },
      {
        id: '3',
        name: '技术先锋',
        description: '贡献优质技术内容',
        image: '⚙️',
        rarity: 'rare',
        category: 'Technical',
        earnedDate: '2024-05-10',
      },
    ],
    achievements: [
      {
        id: '1',
        title: '社区建设者',
        description: '发布100+高质量帖子',
        points: 500,
        badge: {
          id: '4',
          name: '建设者勋章',
          description: '内容创作达人',
          image: '👷',
          rarity: 'epic',
          category: 'Content',
          earnedDate: '2024-06-01',
        },
        progress: 78,
        maxProgress: 100,
        isCompleted: false,
      },
      {
        id: '2',
        title: '治理达人',
        description: '参与25次治理投票',
        points: 300,
        badge: {
          id: '5',
          name: '治理之星',
          description: '积极参与社区治理',
          image: '⭐',
          rarity: 'rare',
          category: 'Governance',
          earnedDate: '2024-04-15',
        },
        progress: 25,
        maxProgress: 25,
        isCompleted: true,
      },
    ],
    stakedAmount: '15,000 QAU',
    votingPower: 15000,
  });

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'profile' | 'badges' | 'achievements' | 'staking'>(
    'profile'
  );

  const connectWallet = async () => {
    // 模拟钱包连接
    setWallet({
      address: '0x742d35Cc6634C0532925a3b8D4e6D3b6e8d3e8A0',
      balance: '1,234.56 QAU',
      network: 'Quantaureum Mainnet',
      isConnected: true,
    });
    setShowWalletModal(false);
  };

  const disconnectWallet = () => {
    setWallet({
      address: '',
      balance: '0',
      network: 'Ethereum',
      isConnected: false,
    });
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-500';
      case 'rare':
        return 'from-blue-500 to-cyan-500';
      case 'epic':
        return 'from-purple-500 to-pink-500';
      case 'legendary':
        return 'from-yellow-500 to-orange-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return '⚪';
      case 'rare':
        return '🔵';
      case 'epic':
        return '🟣';
      case 'legendary':
        return '🟡';
      default:
        return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      {/* 钱包连接区域 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Web3 身份</h3>
            <p className="text-gray-400">连接钱包解锁完整社区功能</p>
          </div>
          {!wallet.isConnected ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowWalletModal(true)}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-cyan-600 transition-all flex items-center gap-2"
            >
              <Wallet className="h-5 w-5" />
              连接钱包
            </motion.button>
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-400">{wallet.network}</div>
                <div className="text-white font-medium">{wallet.address}</div>
                <div className="text-purple-400 text-sm">{wallet.balance}</div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={disconnectWallet}
                className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-all"
              >
                <Unlink className="h-4 w-4" />
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {wallet.isConnected && (
        <>
          {/* 用户资料卡片 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">用户档案</h3>
              <div className="flex gap-2">
                {(['profile', 'badges', 'achievements', 'staking'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTab === tab
                        ? 'bg-gradient-to-r from-purple-500 to-cyan-500 text-white'
                        : 'bg-white/10 text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selectedTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">{userProfile.avatar}</div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{userProfile.username}</h4>
                        <p className="text-gray-400">等级 {userProfile.level}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">声望值</span>
                        <span className="text-white font-medium">
                          {userProfile.reputation.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">质押数量</span>
                        <span className="text-purple-400 font-medium">
                          {userProfile.stakedAmount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">投票力</span>
                        <span className="text-green-400 font-medium">
                          {userProfile.votingPower.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-white font-medium mb-3">等级进度</h5>
                    <div className="w-full bg-white/20 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-cyan-500 h-3 rounded-full"
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-400 mt-2">15级 - 距离16级还需2,500经验</p>
                  </div>
                </motion.div>
              )}

              {selectedTab === 'badges' && (
                <motion.div
                  key="badges"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {userProfile.badges.map((badge) => (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/5 rounded-xl p-4 border border-white/10 text-center"
                    >
                      <div className="text-3xl mb-2">{badge.image}</div>
                      <h5 className="text-white font-medium text-sm mb-1">{badge.name}</h5>
                      <p className="text-xs text-gray-400 mb-2">{badge.description}</p>
                      <span
                        className={`px-2 py-1 bg-gradient-to-r ${getRarityColor(badge.rarity)} text-white text-xs rounded-full`}
                      >
                        {getRarityIcon(badge.rarity)} {badge.rarity}
                      </span>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {selectedTab === 'achievements' && (
                <motion.div
                  key="achievements"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {userProfile.achievements.map((achievement) => (
                    <div key={achievement.id} className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="text-white font-medium">{achievement.title}</h5>
                        <span className="text-purple-400 font-medium">
                          +{achievement.points} XP
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{achievement.description}</p>
                      <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                        <div
                          className={`h-2 rounded-full ${achievement.isCompleted ? 'bg-green-500' : 'bg-gradient-to-r from-purple-500 to-cyan-500'}`}
                          style={{
                            width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">
                          {achievement.progress}/{achievement.maxProgress}
                        </span>
                        <span
                          className={achievement.isCompleted ? 'text-green-400' : 'text-gray-400'}
                        >
                          {achievement.isCompleted ? '已完成' : '进行中'}
                        </span>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {selectedTab === 'staking' && (
                <motion.div
                  key="staking"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="bg-white/5 rounded-xl p-4">
                    <h5 className="text-white font-medium mb-3">质押收益</h5>
                    <div className="text-2xl font-bold text-green-400 mb-1">12.5%</div>
                    <p className="text-sm text-gray-400">年化收益率</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <h5 className="text-white font-medium mb-3">治理权重</h5>
                    <div className="text-2xl font-bold text-purple-400 mb-1">15,000</div>
                    <p className="text-sm text-gray-400">投票权重值</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}

      {/* 钱包连接模态框 */}
      <AnimatePresence>
        {showWalletModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowWalletModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900/95 rounded-2xl p-8 border border-white/20 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-white mb-6 text-center">连接钱包</h3>
              <div className="space-y-4">
                {['MetaMask', 'WalletConnect', 'Coinbase Wallet', 'Phantom'].map((walletName) => (
                  <motion.button
                    key={walletName}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={connectWallet}
                    className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-xl transition-all flex items-center justify-center gap-3"
                  >
                    <Wallet className="h-5 w-5" />
                    {walletName}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
