'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuctionItem, BidRecord, AutoBidSetting } from '../../types/auction.types';

// Use type assertion for ethereum access instead of redeclaring Window interface
// The ethereum property is already declared in staking/page.tsx

interface AuctionDetailProps {
  auction: AuctionItem;
  onBack: () => void;
  onBid: (amount: number) => Promise<{ success: boolean; message: string }>;
  onBuyNow?: (auctionId: string) => Promise<{ success: boolean; message: string }>;
  onWatchToggle?: (auctionId: string, isWatched: boolean) => void;
  isWatched?: boolean;
}

const AuctionDetail: React.FC<AuctionDetailProps> = ({
  auction,
  onBack,
  onBid,
  onBuyNow,
  onWatchToggle,
  isWatched = false
}) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isEnding, setIsEnding] = useState(false);
  const [bidAmount, setBidAmount] = useState(auction.auction.currentPrice + auction.auction.minBidIncrement);
  const [bidHistory, setBidHistory] = useState<BidRecord[]>([]);
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [showBidForm, setShowBidForm] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(auction.auction.currentPrice);
  const [isWatchedState, setIsWatchedState] = useState(isWatched);
  const [showAutoBidForm, setShowAutoBidForm] = useState(false);
  const [autoBidSetting, setAutoBidSetting] = useState<AutoBidSetting | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info' | 'warning'; message: string } | null>(null);

  // 通知系统 - 必须在 useEffect 之前定义
  const showNotification = useCallback((type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  // 实时价格更新模拟
  useEffect(() => {
    if (auction.auction.status === 'active') {
      const priceUpdateInterval = setInterval(() => {
        // 模拟价格更新（实际应该通过WebSocket接收）
        if (Math.random() < 0.15) { // 15% 概率价格更新
          const increment = auction.auction.increment;
          const newPrice = currentPrice + increment;
          setCurrentPrice(newPrice);
          setBidAmount(newPrice + auction.auction.minBidIncrement);

          // 显示价格更新通知
          showNotification('info', `价格已更新至 ¥${newPrice.toLocaleString()}`);
        }
      }, 3000);

      return () => clearInterval(priceUpdateInterval);
    }
  }, [currentPrice, auction.auction.increment, auction.auction.status, auction.auction.minBidIncrement, showNotification]);

  // 倒计时更新
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const endTime = new Date(auction.auction.endTime).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeft(`${days}天 ${hours}小时 ${minutes}分钟`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}小时 ${minutes}分钟 ${seconds}秒`);
        } else {
          setTimeLeft(`${minutes}分钟 ${seconds}秒`);
          setIsEnding(true);
        }
      } else {
        setTimeLeft('已结束');
        setIsEnding(false);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [auction.auction.endTime]);

  // 检查钱包连接状态
  const checkWalletConnection = useCallback((): boolean => {
    // 检查是否有连接的钱包
    if (typeof window !== 'undefined') {
      // 检查 MetaMask
      if (window.ethereum && window.ethereum.selectedAddress) {
        return true;
      }
      // 检查其他钱包连接状态
      const walletAddress = localStorage.getItem('walletAddress');
      if (walletAddress) {
        return true;
      }
    }
    return false;
  }, []);

  // 触发钱包连接
  const triggerWalletConnection = useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        showNotification('success', '钱包连接成功！');
      } else {
        showNotification('error', '请安装 MetaMask 或其他支持的钱包');
      }
    } catch (error) {
      showNotification('error', '钱包连接失败，请重试');
    }
  }, [showNotification]);

  // 显示确认对话框
  const showConfirmDialog = useCallback((options: {
    title: string;
    content: string;
    okText: string;
    cancelText: string;
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      // 这里可以使用 Ant Design 的 Modal.confirm 或自定义确认对话框
      const confirmed = window.confirm(`${options.title}\n\n${options.content}`);
      resolve(confirmed);
    });
  }, []);

  // 关注功能
  const handleWatchToggle = useCallback(() => {
    const newWatchedState = !isWatchedState;
    setIsWatchedState(newWatchedState);
    onWatchToggle?.(auction.id, newWatchedState);
    showNotification('success', newWatchedState ? '已添加到关注列表' : '已从关注列表移除');
  }, [isWatchedState, auction.id, onWatchToggle, showNotification]);

  // 生成模拟出价历史
  useEffect(() => {
    const generateBidHistory = () => {
      const history: BidRecord[] = [];
      const totalBids = auction.auction.totalBids;
      const startPrice = auction.auction.startPrice;
      const currentPrice = auction.auction.currentPrice;
      const increment = (currentPrice - startPrice) / Math.max(totalBids - 1, 1);

      for (let i = 0; i < Math.min(totalBids, 10); i++) {
        const bidAmount = startPrice + increment * (totalBids - i - 1);
        const bidTime = new Date(Date.now() - (i + 1) * 60 * 60 * 1000); // 每小时一次出价
        history.push({
          id: `bid-${i}`,
          auctionId: auction.auction.id,
          bidderId: `user-${Math.floor(Math.random() * 1000)}`,
          bidderUsername: `用户${Math.floor(Math.random() * 1000)}`,
          amount: Math.round(bidAmount),
          timestamp: bidTime,
          status: 'success',
          isWinning: i === 0
        });
      }

      setBidHistory(history);
    };

    generateBidHistory();
  }, [auction]);

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'genesis':
        return 'from-yellow-500 to-orange-500';
      case 'premium':
        return 'from-purple-500 to-pink-500';
      default:
        return 'from-blue-500 to-cyan-500';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'genesis':
        return '创世节点';
      case 'premium':
        return '高级节点';
      default:
        return '标准节点';
    }
  };

  const handleQuickBid = (amount: number) => {
    // 检查钱包连接状态
    const isWalletConnected = checkWalletConnection();
    if (!isWalletConnected) {
      showNotification('warning', '请先连接钱包才能进行出价');
      triggerWalletConnection();
      return;
    }

    setBidAmount(amount);
    setShowBidForm(true);
  };

  const handleSubmitBid = async () => {
    // 检查钱包连接状态
    const isWalletConnected = checkWalletConnection();
    if (!isWalletConnected) {
      showNotification('warning', '请先连接钱包才能进行出价');
      triggerWalletConnection();
      return;
    }

    if (bidAmount < currentPrice + auction.auction.minBidIncrement) {
      showNotification('error', `出价必须至少为 ${formatPrice(currentPrice + auction.auction.minBidIncrement)}`);
      return;
    }

    setIsSubmittingBid(true);
    try {
      const result = await onBid(bidAmount);
      if (result.success) {
        showNotification('success', result.message);
        setShowBidForm(false);
        setCurrentPrice(bidAmount);
        setBidAmount(bidAmount + auction.auction.minBidIncrement);

        // 更新出价历史
        const newBid: BidRecord = {
          id: `bid-${Date.now()}`,
          auctionId: auction.auction.id,
          bidderId: 'current-user',
          bidderUsername: '我',
          amount: bidAmount,
          timestamp: new Date(),
          status: 'success',
          isWinning: true
        };
        setBidHistory(prev => [newBid, ...prev.map(bid => ({ ...bid, isWinning: false }))]);
      } else {
        showNotification('error', result.message);
      }
    } catch (error) {
      showNotification('error', '出价失败，请重试');
    } finally {
      setIsSubmittingBid(false);
    }
  };

  const handleBuyNow = async () => {
    if (!auction.auction.buyNowPrice) return;

    // 检查钱包连接状态
    const isWalletConnected = checkWalletConnection();
    if (!isWalletConnected) {
      showNotification('warning', '请先连接钱包才能进行一口价购买');
      // 可以在这里触发钱包连接弹窗
      triggerWalletConnection();
      return;
    }

    // 确认一口价购买
    const confirmed = await showConfirmDialog({
      title: '确认一口价购买',
      content: `确定要以 ${formatPrice(auction.auction.buyNowPrice)} 的价格立即购买此节点吗？`,
      okText: '确认购买',
      cancelText: '取消'
    });

    if (!confirmed) return;

    setIsSubmittingBid(true);
    try {
      const result = await onBuyNow?.(auction.id);
      if (result?.success) {
        showNotification('success', '购买成功！');
        setShowBidForm(false);
      } else {
        showNotification('error', result?.message || '购买失败');
      }
    } catch (error) {
      showNotification('error', '购买失败，请重试');
    } finally {
      setIsSubmittingBid(false);
    }
  };

  // 自动出价设置
  const handleSetAutoBid = useCallback((maxAmount: number, increment: number) => {
    const newAutoBidSetting: AutoBidSetting = {
      id: `auto-bid-${Date.now()}`,
      auctionId: auction.auction.id,
      userId: 'current-user',
      maxAmount,
      increment,
      isActive: true,
      createdAt: new Date()
    };
    setAutoBidSetting(newAutoBidSetting);
    setShowAutoBidForm(false);
    showNotification('success', `已设置自动出价，最高 ${formatPrice(maxAmount)}`);
  }, [auction.auction.id, showNotification]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 py-8">
      <div className="container mx-auto px-4">
        {/* 返回按钮 */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={onBack}
          className="flex items-center text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回拍卖列表
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：商品信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 商品图片和基本信息 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6"
            >
              <div className="flex flex-col md:flex-row gap-6">
                {/* 商品图片 */}
                <div className="md:w-1/2">
                  <div className="relative h-64 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden">
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold text-white bg-gradient-to-r ${getTierColor(auction.tier)}`}>
                      {getTierLabel(auction.tier)}
                    </div>
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-8xl opacity-50">🖥️</div>
                    </div>
                  </div>
                </div>

                {/* 基本信息 */}
                <div className="md:w-1/2">
                  <h1 className="text-2xl font-bold text-white mb-4">{auction.title}</h1>
                  <p className="text-gray-300 mb-4">{auction.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">位置:</span>
                      <span className="text-white">{auction.specifications.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">数据中心:</span>
                      <span className="text-white">{auction.specifications.datacenter}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">硬件配置:</span>
                      <span className="text-white">{auction.specifications.hardware}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">网络带宽:</span>
                      <span className="text-white">{auction.specifications.bandwidth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">可用性:</span>
                      <span className="text-white">{auction.specifications.uptime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 技术规格 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">技术规格</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auction.specifications.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* 出价历史 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">出价历史</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {bidHistory.map((bid, index) => (
                  <div key={bid.id} className="flex items-center justify-between py-2 border-b border-white/10 last:border-b-0">
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-3 ${bid.isWinning ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <div>
                        <div className="text-white font-semibold">{bid.bidderUsername}</div>
                        <div className="text-gray-400 text-sm">
                          {new Date(bid.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-cyan-400 font-bold">{formatPrice(bid.amount)}</div>
                      {bid.isWinning && (
                        <div className="text-green-400 text-sm">当前最高</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 右侧：出价区域 */}
          <div className="space-y-6">
            {/* 当前价格和倒计时 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 sticky top-6"
            >
              <div className="text-center mb-6">
                <div className="text-gray-400 text-sm mb-1">当前价格</div>
                <div className="text-3xl font-bold text-cyan-400 mb-4">
                  {formatPrice(auction.auction.currentPrice)}
                </div>

                <div className="flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className={`font-semibold ${isEnding ? 'text-red-400' : 'text-yellow-400'}`}>
                    {timeLeft}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-400">出价次数</div>
                    <div className="text-white font-semibold">{auction.auction.totalBids}</div>
                  </div>
                  <div>
                    <div className="text-gray-400">参与人数</div>
                    <div className="text-white font-semibold">{auction.auction.uniqueBidders}</div>
                  </div>
                </div>
              </div>

              {/* 快速出价按钮 */}
              {auction.auction.status === 'active' && (
                <div className="space-y-3 mb-6">
                  <div className="text-white font-semibold mb-2">快速出价</div>
                  {[
                    auction.auction.currentPrice + auction.auction.minBidIncrement,
                    auction.auction.currentPrice + auction.auction.minBidIncrement * 2,
                    auction.auction.currentPrice + auction.auction.minBidIncrement * 5
                  ].map((amount, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickBid(amount)}
                      className="w-full py-2 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all"
                    >
                      {formatPrice(amount)}
                    </button>
                  ))}
                </div>
              )}

              {/* 关注和自动出价按钮 */}
              <div className="flex space-x-3 mb-4">
                <motion.button
                  onClick={handleWatchToggle}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                    isWatchedState
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <svg className="w-4 h-4 mr-2" fill={isWatchedState ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    {isWatchedState ? '已关注' : '关注'}
                  </div>
                </motion.button>

                {auction.auction.status === 'active' && (
                  <motion.button
                    onClick={() => setShowAutoBidForm(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                      autoBidSetting?.isActive
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {autoBidSetting?.isActive ? '自动出价中' : '自动出价'}
                    </div>
                  </motion.button>
                )}
              </div>

              {/* 自定义出价 */}
              {auction.auction.status === 'active' && (
                <div className="space-y-3">
                  <button
                    onClick={() => setShowBidForm(!showBidForm)}
                    className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
                  >
                    自定义出价
                  </button>

                  {showBidForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3"
                    >
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">
                          出价金额 (最低: {formatPrice(auction.auction.currentPrice + auction.auction.minBidIncrement)})
                        </label>
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) => setBidAmount(parseInt(e.target.value) || 0)}
                          min={auction.auction.currentPrice + auction.auction.minBidIncrement}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <button
                        onClick={handleSubmitBid}
                        disabled={isSubmittingBid}
                        className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmittingBid ? '提交中...' : '确认出价'}
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* 一口价 */}
              {auction.auction.buyNowPrice && auction.auction.status === 'active' && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <button
                    onClick={handleBuyNow}
                    disabled={isSubmittingBid}
                    className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    一口价 {formatPrice(auction.auction.buyNowPrice)}
                  </button>
                </div>
              )}

              {/* 状态提示 */}
              {auction.auction.status === 'upcoming' && (
                <div className="text-center py-4 text-yellow-400">
                  拍卖尚未开始
                </div>
              )}

              {auction.auction.status === 'ended' && (
                <div className="text-center py-4 text-gray-400">
                  拍卖已结束
                </div>
              )}
            </motion.div>

            {/* 卖家信息 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6"
            >
              <h3 className="text-lg font-bold text-white mb-4">卖家信息</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">卖家</span>
                  <span className="text-white font-semibold">{auction.seller.username}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">评分</span>
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">⭐</span>
                    <span className="text-white">{auction.seller.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">成交数</span>
                  <span className="text-white">{auction.seller.totalSales}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">加入时间</span>
                  <span className="text-white">
                    {new Date(auction.seller.memberSince).getFullYear()}年
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* 通知组件 */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -50, x: '-50%' }}
              className={`fixed top-4 left-1/2 transform z-50 px-6 py-3 rounded-lg shadow-lg ${
                notification.type === 'success'
                  ? 'bg-green-500 text-white'
                  : notification.type === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}
            >
              <div className="flex items-center">
                {notification.type === 'success' && (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {notification.type === 'error' && (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                {notification.type === 'info' && (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {notification.message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 自动出价表单模态框 */}
        <AnimatePresence>
          {showAutoBidForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowAutoBidForm(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-4">设置自动出价</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">最高出价金额</label>
                    <input
                      type="number"
                      min={currentPrice + auction.auction.minBidIncrement}
                      step={auction.auction.minBidIncrement}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                      placeholder={`最低: ${formatPrice(currentPrice + auction.auction.minBidIncrement)}`}
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">出价增量</label>
                    <select className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-cyan-400">
                      <option value={auction.auction.minBidIncrement}>
                        {formatPrice(auction.auction.minBidIncrement)} (最小增量)
                      </option>
                      <option value={auction.auction.minBidIncrement * 2}>
                        {formatPrice(auction.auction.minBidIncrement * 2)}
                      </option>
                      <option value={auction.auction.minBidIncrement * 5}>
                        {formatPrice(auction.auction.minBidIncrement * 5)}
                      </option>
                    </select>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setShowAutoBidForm(false)}
                      className="flex-1 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      onClick={() => {
                        // 这里应该获取表单值并调用 handleSetAutoBid
                        handleSetAutoBid(currentPrice + auction.auction.minBidIncrement * 10, auction.auction.minBidIncrement);
                      }}
                      className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg hover:from-cyan-600 hover:to-purple-600 transition-all"
                    >
                      设置
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AuctionDetail;
