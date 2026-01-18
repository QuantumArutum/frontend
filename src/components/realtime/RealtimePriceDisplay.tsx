import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuctionDetails } from '../../hooks/useAuctionWebSocket';

interface RealtimePriceDisplayProps {
  auctionId: string;
  initialPrice: number;
  currency?: string;
  showTrend?: boolean;
  showBidCount?: boolean;
  size?: 'small' | 'medium' | 'large';
  onPriceChange?: (newPrice: number, oldPrice: number) => void;
}

const RealtimePriceDisplay: React.FC<RealtimePriceDisplayProps> = ({
  auctionId,
  initialPrice,
  currency = '¥',
  showTrend = true,
  showBidCount = true,
  size = 'medium',
  onPriceChange,
}) => {
  const { currentPrice, totalBids, latestBid, connected } = useAuctionDetails(auctionId);
  const [displayPrice, setDisplayPrice] = useState(initialPrice);
  const [priceHistory, setPriceHistory] = useState<number[]>([initialPrice]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [priceDirection, setPriceDirection] = useState<'up' | 'down' | 'stable'>('stable');

  // 更新价格
  useEffect(() => {
    if (currentPrice && currentPrice !== displayPrice) {
      const oldPrice = displayPrice;
      const newPrice = currentPrice;

      // 确定价格方向
      if (newPrice > oldPrice) {
        setPriceDirection('up');
      } else if (newPrice < oldPrice) {
        setPriceDirection('down');
      } else {
        setPriceDirection('stable');
      }

      // 触发动画
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);

      // 更新价格和历史
      setDisplayPrice(newPrice);
      setPriceHistory((prev) => [...prev.slice(-9), newPrice]); // 保留最新10个价格

      // 回调
      onPriceChange?.(newPrice, oldPrice);
    }
  }, [currentPrice, displayPrice, onPriceChange]);

  // 格式化价格
  const formatPrice = (price: number) => {
    if (price >= 10000) {
      return `${currency}${(price / 10000).toFixed(1)}万`;
    }
    return `${currency}${price.toLocaleString()}`;
  };

  // 计算价格变化百分比
  const getPriceChangePercentage = () => {
    if (priceHistory.length < 2) return 0;
    const firstPrice = priceHistory[0];
    const currentPrice = priceHistory[priceHistory.length - 1];
    return ((currentPrice - firstPrice) / firstPrice) * 100;
  };

  // 获取尺寸样式
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          priceText: 'text-lg',
          container: 'p-2',
          badge: 'text-xs px-2 py-1',
        };
      case 'large':
        return {
          priceText: 'text-4xl',
          container: 'p-6',
          badge: 'text-sm px-3 py-1',
        };
      default:
        return {
          priceText: 'text-2xl',
          container: 'p-4',
          badge: 'text-xs px-2 py-1',
        };
    }
  };

  const styles = getSizeStyles();
  const priceChangePercentage = getPriceChangePercentage();

  return (
    <div className={`relative ${styles.container}`}>
      {/* 连接状态指示器 */}
      <div className="absolute top-2 right-2">
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>

      {/* 主要价格显示 */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <motion.div
            key={displayPrice}
            initial={{ scale: 1 }}
            animate={{
              scale: isAnimating ? [1, 1.1, 1] : 1,
              color: isAnimating
                ? priceDirection === 'up'
                  ? '#10b981'
                  : priceDirection === 'down'
                    ? '#ef4444'
                    : '#6b7280'
                : '#1f2937',
            }}
            transition={{ duration: 0.5 }}
            className={`font-bold ${styles.priceText}`}
          >
            {formatPrice(displayPrice)}
          </motion.div>

          {/* 价格趋势 */}
          {showTrend && priceHistory.length > 1 && (
            <div className="flex items-center space-x-2 mt-1">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center space-x-1 ${styles.badge} rounded-full ${
                  priceChangePercentage > 0
                    ? 'bg-green-100 text-green-800'
                    : priceChangePercentage < 0
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                }`}
              >
                <span>
                  {priceChangePercentage > 0 ? '↗️' : priceChangePercentage < 0 ? '↘️' : '➡️'}
                </span>
                <span>
                  {priceChangePercentage > 0 ? '+' : ''}
                  {priceChangePercentage.toFixed(1)}%
                </span>
              </motion.div>

              {/* 实时标识 */}
              {connected && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xs text-green-600 font-medium"
                >
                  LIVE
                </motion.div>
              )}
            </div>
          )}
        </div>

        {/* 出价次数 */}
        {showBidCount && (
          <div className="text-right">
            <motion.div
              key={totalBids}
              initial={{ scale: 1 }}
              animate={{ scale: totalBids > 0 ? [1, 1.2, 1] : 1 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-gray-600"
            >
              {totalBids} 次出价
            </motion.div>

            {/* 最新出价者 */}
            {latestBid && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-gray-500 mt-1"
              >
                最新: {latestBid.bidderUsername}
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* 价格历史迷你图表 */}
      {showTrend && priceHistory.length > 2 && (
        <div className="mt-3">
          <div className="h-8 flex items-end space-x-1">
            {priceHistory.slice(-10).map((price, index) => {
              const maxPrice = Math.max(...priceHistory);
              const minPrice = Math.min(...priceHistory);
              const height =
                maxPrice === minPrice ? 50 : ((price - minPrice) / (maxPrice - minPrice)) * 100;

              return (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 10)}%` }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex-1 rounded-t ${
                    index === priceHistory.length - 1 ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  style={{ minHeight: '4px' }}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 价格变化动画效果 */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: -40 }}
            exit={{ opacity: 0, scale: 0.8, y: -60 }}
            transition={{ duration: 1 }}
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 ${
              priceDirection === 'up'
                ? 'text-green-500'
                : priceDirection === 'down'
                  ? 'text-red-500'
                  : 'text-gray-500'
            } font-bold text-lg pointer-events-none`}
          >
            {priceDirection === 'up' ? '+' : priceDirection === 'down' ? '-' : ''}
            {formatPrice(Math.abs(currentPrice - (priceHistory[priceHistory.length - 2] || 0)))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RealtimePriceDisplay;
