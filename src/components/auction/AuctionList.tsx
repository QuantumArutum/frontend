'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AuctionItem, AuctionFilters as AuctionFiltersType, SortOption, NodeTier, AuctionStatus } from '../../types/auction.types';
import AuctionCard from './AuctionCard';
import AuctionFilters from './AuctionFilters';

interface AuctionListProps {
  onItemSelect: (item: AuctionItem) => void;
}

const AuctionList: React.FC<AuctionListProps> = ({ onItemSelect }) => {
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AuctionFiltersType>({});
  const [sortBy, setSortBy] = useState<SortOption>('ending_soon');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [watchedItems, setWatchedItems] = useState<Set<string>>(new Set());
  const itemsPerPage = 12;

  const generateAuctionData = useCallback((): AuctionItem[] => {
    const locations = [
      '新加坡', '香港', '东京', '首尔', '悉尼', '伦敦', '法兰克福', '纽约',
      '洛杉矶', '多伦多', '阿姆斯特丹', '苏黎世', '斯德哥尔摩', '迪拜'
    ];
    
    const tiers: NodeTier[] = ['genesis', 'premium', 'standard'];
    const statuses: AuctionStatus[] = ['active', 'upcoming'];
    
    return Array.from({ length: 50 }, (_, index) => {
      const nodeId = String(index + 1).padStart(3, '0');
      const tier = tiers[index % tiers.length];
      const location = locations[index % locations.length];
      const status = statuses[index % statuses.length];
      
      const basePrice = tier === 'genesis' ? 80000 : tier === 'premium' ? 50000 : 30000;
      const currentPrice = basePrice + Math.floor(Math.random() * basePrice * 0.5);
      const endTime = new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000);
      
      return {
        id: `node-${nodeId}`,
        title: `${tier === 'genesis' ? '创世' : tier === 'premium' ? '高级' : '标准'}验证节点 #${nodeId}`,
        description: `位于${location}的高性能验证节点，提供稳定的区块链验证服务`,
        images: [`/node-images/node-${nodeId}.jpg`],
        category: 'validator-node',
        tier,
        
        specifications: {
          location,
          datacenter: `${location} T3+ 数据中心`,
          hardware: tier === 'genesis' ? 'AMD EPYC 7763 (64核)' : 
                   tier === 'premium' ? 'Intel Xeon Gold 6248R (24核)' : 
                   'Intel Xeon Silver 4314 (16核)',
          bandwidth: tier === 'genesis' ? '100Gbps' : tier === 'premium' ? '25Gbps' : '10Gbps',
          uptime: tier === 'genesis' ? '99.999%' : tier === 'premium' ? '99.99%' : '99.9%',
          features: [
            '量子安全加密',
            '自动故障转移',
            '实时监控',
            '7x24技术支持'
          ]
        },
        
        auction: {
          id: `auction-${nodeId}`,
          startTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          endTime,
          status,
          startPrice: basePrice,
          currentPrice,
          increment: Math.floor(basePrice * 0.02),
          reservePrice: basePrice * 1.2,
          buyNowPrice: currentPrice * 1.5,
          
          totalBids: Math.floor(Math.random() * 50) + 1,
          uniqueBidders: Math.floor(Math.random() * 20) + 1,
          viewCount: Math.floor(Math.random() * 500) + 50,
          watchCount: Math.floor(Math.random() * 30) + 5,
          
          leadingBidder: {
            id: `user-${Math.floor(Math.random() * 1000)}`,
            username: `用户${Math.floor(Math.random() * 1000)}`,
            bidTime: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
            amount: currentPrice
          },
          
          autoExtend: true,
          extensionTime: 10,
          minBidIncrement: Math.floor(basePrice * 0.01)
        },
        
        seller: {
          id: 'quantaureum-official',
          username: 'Quantaureum官方',
          rating: 5.0,
          totalSales: 1000,
          memberSince: new Date('2024-01-01')
        }
      };
    });
  }, []);

  const applyFilters = useCallback((data: AuctionItem[], currentFilters: AuctionFiltersType): AuctionItem[] => {
    return data.filter(item => {
      if (currentFilters.tier && item.tier !== currentFilters.tier) return false;
      if (currentFilters.location && item.specifications.location !== currentFilters.location) return false;
      if (currentFilters.status && item.auction.status !== currentFilters.status) return false;
      if (currentFilters.priceRange) {
        if (item.auction.currentPrice < currentFilters.priceRange.min || 
            item.auction.currentPrice > currentFilters.priceRange.max) return false;
      }
      if (currentFilters.endingSoon) {
        const hoursLeft = (item.auction.endTime.getTime() - Date.now()) / (1000 * 60 * 60);
        if (hoursLeft > 24) return false;
      }
      return true;
    });
  }, []);

  const applySorting = useCallback((data: AuctionItem[], sort: SortOption): AuctionItem[] => {
    const sorted = [...data];
    
    switch (sort) {
      case 'ending_soon':
        return sorted.sort((a, b) => a.auction.endTime.getTime() - b.auction.endTime.getTime());
      case 'newly_listed':
        return sorted.sort((a, b) => b.auction.startTime.getTime() - a.auction.startTime.getTime());
      case 'price_low_high':
        return sorted.sort((a, b) => a.auction.currentPrice - b.auction.currentPrice);
      case 'price_high_low':
        return sorted.sort((a, b) => b.auction.currentPrice - a.auction.currentPrice);
      case 'most_bids':
        return sorted.sort((a, b) => b.auction.totalBids - a.auction.totalBids);
      case 'most_watched':
        return sorted.sort((a, b) => b.auction.watchCount - a.auction.watchCount);
      default:
        return sorted;
    }
  }, []);

  // Initialize auction data on mount and when filters/sort/page change
  useEffect(() => {
    setLoading(true);
    const allData = generateAuctionData();
    const filtered = applyFilters(allData, filters);
    const sorted = applySorting(filtered, sortBy);
    
    // Paginate
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = sorted.slice(startIndex, startIndex + itemsPerPage);
    
    setAuctions(paginatedData);
    setTotalPages(Math.ceil(sorted.length / itemsPerPage));
    setLoading(false);
  }, [filters, sortBy, currentPage, generateAuctionData, applyFilters, applySorting]);

  const handleFilterChange = (newFilters: AuctionFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  // 关注功能处理
  const handleWatchToggle = (auctionId: string, isWatched: boolean) => {
    const newWatchedItems = new Set(watchedItems);
    if (isWatched) {
      newWatchedItems.add(auctionId);
    } else {
      newWatchedItems.delete(auctionId);
    }
    setWatchedItems(newWatchedItems);

    // 这里可以调用API保存到后端
    console.log(`${isWatched ? '关注' : '取消关注'} 拍卖: ${auctionId}`);
  };

  // 快速出价处理
  const handleQuickBid = async (auctionId: string, amount: number): Promise<{ success: boolean; message: string }> => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 更新本地状态
      setAuctions(prev => prev.map(auction =>
        auction.id === auctionId
          ? {
              ...auction,
              auction: {
                ...auction.auction,
                currentPrice: amount,
                totalBids: auction.auction.totalBids + 1,
                leadingBidder: {
                  id: 'current-user',
                  username: '当前用户',
                  bidTime: new Date(),
                  amount
                }
              }
            }
          : auction
      ));

      if (Math.random() > 0.1) { // 90% 成功率
        return {
          success: true,
          message: `成功出价 ¥${amount.toLocaleString()}！`
        };
      } else {
        return {
          success: false,
          message: '出价失败，可能被其他用户超越，请重试'
        };
      }
    } catch {
      return {
        success: false,
        message: '网络错误，请重试'
      };
    }
  };

  // 一口价购买处理
  const handleBuyNow = async (auctionId: string): Promise<{ success: boolean; message: string }> => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 更新拍卖状态为已结束
      setAuctions(prev => prev.map(auction =>
        auction.id === auctionId
          ? {
              ...auction,
              auction: {
                ...auction.auction,
                status: 'ended' as const,
                leadingBidder: {
                  id: 'current-user',
                  username: '当前用户',
                  bidTime: new Date(),
                  amount: auction.auction.buyNowPrice || auction.auction.currentPrice
                }
              }
            }
          : auction
      ));

      return {
        success: true,
        message: '购买成功！'
      };
    } catch {
      return {
        success: false,
        message: '购买失败，请重试'
      };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🏆 节点拍卖大厅
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            参与全球验证节点竞拍，获得稳定收益和网络治理权
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左侧筛选器 */}
          <div className="lg:w-1/4">
            <AuctionFilters
              filters={filters}
              onFiltersChange={handleFilterChange}
            />
          </div>

          {/* 右侧商品列表 */}
          <div className="lg:w-3/4">
            {/* 排序和统计 */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-gray-300">
                共找到 <span className="text-cyan-400 font-semibold">{auctions.length}</span> 个拍卖商品
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-400"
              >
                <option value="ending_soon">即将结束</option>
                <option value="newly_listed">最新上架</option>
                <option value="price_low_high">价格从低到高</option>
                <option value="price_high_low">价格从高到低</option>
                <option value="most_bids">竞拍最多</option>
                <option value="most_watched">关注最多</option>
              </select>
            </div>

            {/* 商品网格 */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-white/10 rounded-xl p-6 animate-pulse">
                    <div className="h-48 bg-white/20 rounded-lg mb-4"></div>
                    <div className="h-4 bg-white/20 rounded mb-2"></div>
                    <div className="h-4 bg-white/20 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {auctions.map((auction, index) => (
                  <AuctionCard
                    key={auction.id}
                    item={auction}
                    onClick={() => onItemSelect(auction)}
                    index={index}
                    isWatched={watchedItems.has(auction.id)}
                    onWatchToggle={handleWatchToggle}
                    onQuickBid={handleQuickBid}
                    onBuyNow={handleBuyNow}
                  />
                ))}
              </div>
            )}

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionList;
