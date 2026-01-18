'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuctionItem } from '../../types/auction.types';

interface AuctionCardProps {
  item: AuctionItem;
  onClick: () => void;
  index: number;
  onWatchToggle?: (auctionId: string, isWatched: boolean) => void;
  onQuickBid?: (
    auctionId: string,
    amount: number
  ) => Promise<{ success: boolean; message: string }>;
  onBuyNow?: (auctionId: string) => Promise<{ success: boolean; message: string }>;
  isWatched?: boolean;
}

const AuctionCard: React.FC<AuctionCardProps> = ({
  item,
  onClick,
  index,
  onWatchToggle,
  onQuickBid,
  onBuyNow,
  isWatched = false,
}) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isEnding, setIsEnding] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(item.auction.currentPrice);
  const [isWatchedState, setIsWatchedState] = useState(isWatched);
  const [isQuickBidding, setIsQuickBidding] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [priceAnimation, setPriceAnimation] = useState(false);

  // 实时价格更新模拟
  useEffect(() => {
    if (item.auction.status === 'active') {
      const priceUpdateInterval = setInterval(() => {
        // 模拟价格更新（实际应该通过WebSocket接收）
        if (Math.random() < 0.1) {
          // 10% 概率价格更新
          const increment = item.auction.increment;
          const newPrice = currentPrice + increment;
          setCurrentPrice(newPrice);
          setPriceAnimation(true);
          setTimeout(() => setPriceAnimation(false), 1000);
        }
      }, 5000);

      return () => clearInterval(priceUpdateInterval);
    }
  }, [currentPrice, item.auction.increment, item.auction.status]);

  // 倒计时更新
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const endTime = new Date(item.auction.endTime).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeft(`${days}天 ${hours}小时`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}小时 ${minutes}分钟`);
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
  }, [item.auction.endTime]);

  // 关注功能
  const handleWatchToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const newWatchedState = !isWatchedState;
      setIsWatchedState(newWatchedState);
      onWatchToggle?.(item.id, newWatchedState);
    },
    [isWatchedState, item.id, onWatchToggle]
  );

  // 快速出价
  const handleQuickBid = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isQuickBidding || item.auction.status !== 'active') return;

      setIsQuickBidding(true);
      try {
        const bidAmount = currentPrice + item.auction.increment;
        const result = await onQuickBid?.(item.id, bidAmount);
        if (result?.success) {
          setCurrentPrice(bidAmount);
          setPriceAnimation(true);
          setTimeout(() => setPriceAnimation(false), 1000);
        }
      } catch (error) {
        console.error('Quick bid failed:', error);
      } finally {
        setIsQuickBidding(false);
      }
    },
    [isQuickBidding, item.auction.status, currentPrice, item.auction.increment, item.id, onQuickBid]
  );

  // 一口价购买
  const handleBuyNow = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isBuyingNow || !item.auction.buyNowPrice) return;

      setIsBuyingNow(true);
      try {
        const result = await onBuyNow?.(item.id);
        // 购买成功后的处理逻辑
      } catch (error) {
        console.error('Buy now failed:', error);
      } finally {
        setIsBuyingNow(false);
      }
    },
    [isBuyingNow, item.auction.buyNowPrice, item.id, onBuyNow]
  );

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

  const formatPrice = (price: number) => {
    return `¥${price.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden cursor-pointer hover:bg-white/15 transition-all duration-300 group"
    >
      {/* 商品图片区域 */}
      <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        {/* 节点等级标签 */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${getTierColor(item.tier)}`}
        >
          {getTierLabel(item.tier)}
        </div>

        {/* 关注按钮 */}
        <motion.button
          onClick={handleWatchToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`absolute top-3 right-3 w-8 h-8 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 ${
            isWatchedState ? 'bg-red-500 text-white' : 'bg-black/50 text-white hover:bg-black/70'
          }`}
        >
          <motion.svg
            className="w-4 h-4"
            fill={isWatchedState ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ scale: isWatchedState ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </motion.svg>
        </motion.button>

        {/* 模拟节点图片 */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-6xl opacity-50">🖥️</div>
        </div>

        {/* 即将结束标识 */}
        {isEnding && (
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded animate-pulse">
            即将结束
          </div>
        )}
      </div>

      {/* 商品信息 */}
      <div className="p-4">
        {/* 标题 */}
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors">
          {item.title}
        </h3>

        {/* 位置信息 */}
        <div className="flex items-center text-gray-400 text-sm mb-3">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {item.specifications.location}
        </div>

        {/* 价格信息 */}
        <div className="mb-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-gray-400 text-sm">当前价格</span>
              <motion.div
                className="text-2xl font-bold text-cyan-400"
                animate={
                  priceAnimation
                    ? { scale: [1, 1.1, 1], color: ['#22d3ee', '#10b981', '#22d3ee'] }
                    : {}
                }
                transition={{ duration: 0.5 }}
              >
                {formatPrice(currentPrice)}
              </motion.div>
              {currentPrice > item.auction.startPrice && (
                <div className="text-green-400 text-xs flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17l9.2-9.2M17 17V7H7"
                    />
                  </svg>
                  +{formatPrice(currentPrice - item.auction.startPrice)}
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-gray-400 text-xs">起拍价</div>
              <div className="text-gray-300 text-sm line-through">
                {formatPrice(item.auction.startPrice)}
              </div>
            </div>
          </div>
        </div>

        {/* 竞拍统计 */}
        <div className="flex justify-between text-sm text-gray-400 mb-3">
          <span>{item.auction.totalBids} 次出价</span>
          <span>{item.auction.watchCount} 人关注</span>
        </div>

        {/* 倒计时 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm">
            <svg
              className="w-4 h-4 mr-1 text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className={`font-semibold ${isEnding ? 'text-red-400' : 'text-yellow-400'}`}>
              {timeLeft}
            </span>
          </div>

          {/* 快速出价按钮 */}
          <motion.button
            onClick={handleQuickBid}
            disabled={isQuickBidding || item.auction.status !== 'active'}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 text-sm font-semibold rounded transition-all ${
              isQuickBidding || item.auction.status !== 'active'
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:from-cyan-600 hover:to-purple-600'
            }`}
          >
            {isQuickBidding ? (
              <div className="flex items-center">
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                出价中...
              </div>
            ) : (
              `出价 ${formatPrice(currentPrice + item.auction.increment)}`
            )}
          </motion.button>
        </div>

        {/* 一口价选项 */}
        <AnimatePresence>
          {item.auction.buyNowPrice && item.auction.status === 'active' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-white/10"
            >
              <motion.button
                onClick={handleBuyNow}
                disabled={isBuyingNow}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-2 font-semibold rounded transition-all ${
                  isBuyingNow
                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                }`}
              >
                {isBuyingNow ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    购买中...
                  </div>
                ) : (
                  `一口价 ${formatPrice(item.auction.buyNowPrice)}`
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 拍卖状态指示器 */}
        {item.auction.status !== 'active' && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div
              className={`text-center py-2 rounded font-semibold ${
                item.auction.status === 'upcoming'
                  ? 'bg-blue-500/20 text-blue-400'
                  : item.auction.status === 'ended'
                    ? 'bg-gray-500/20 text-gray-400'
                    : 'bg-purple-500/20 text-purple-400'
              }`}
            >
              {item.auction.status === 'upcoming' && '即将开始'}
              {item.auction.status === 'ended' && '拍卖结束'}
              {item.auction.status === 'settled' && '已结算'}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AuctionCard;
