// 淘宝式拍卖系统类型定义
export type AuctionStatus = 'upcoming' | 'active' | 'ended' | 'settled';
export type NodeTier = 'genesis' | 'premium' | 'standard';
export type BidStatus = 'pending' | 'success' | 'failed' | 'outbid';

// 拍卖商品（节点）
export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  tier: NodeTier;

  // 技术规格
  specifications: {
    location: string;
    datacenter: string;
    hardware: string;
    bandwidth: string;
    uptime: string;
    features: string[];
  };

  // 拍卖信息
  auction: {
    id: string;
    startTime: Date;
    endTime: Date;
    status: AuctionStatus;
    startPrice: number;
    currentPrice: number;
    increment: number;
    reservePrice?: number;
    buyNowPrice?: number;

    // 统计信息
    totalBids: number;
    uniqueBidders: number;
    viewCount: number;
    watchCount: number;

    // 当前领先者
    leadingBidder?: {
      id: string;
      username: string;
      bidTime: Date;
      amount: number;
    };

    // 拍卖设置
    autoExtend: boolean;
    extensionTime: number; // 分钟
    minBidIncrement: number;
  };

  // 卖家信息
  seller: {
    id: string;
    username: string;
    rating: number;
    totalSales: number;
    memberSince: Date;
  };
}

// 出价记录
export interface BidRecord {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderUsername: string;
  amount: number;
  timestamp: Date;
  status: BidStatus;
  isWinning: boolean;
  isAutomatic?: boolean; // 是否为自动出价
}

// 出价结果
export interface BidResult {
  success: boolean;
  message: string;
  newPrice?: number;
  position?: number; // 当前排名
  timeExtended?: boolean;
  nextMinBid?: number;
}

// 自动出价设置
export interface AutoBidSetting {
  id: string;
  auctionId: string;
  userId: string;
  maxAmount: number;
  increment: number;
  isActive: boolean;
  createdAt: Date;
}

// 关注列表项
export interface WatchlistItem {
  id: string;
  userId: string;
  auctionId: string;
  addedAt: Date;
  notifyBeforeEnd: number; // 结束前多少分钟提醒
  notifyOnOutbid: boolean;
}

// 拍卖筛选条件
export interface AuctionFilters {
  category?: string;
  tier?: NodeTier;
  location?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  status?: AuctionStatus;
  endingSoon?: boolean; // 即将结束（24小时内）
  hasReserve?: boolean;
  hasBuyNow?: boolean;
}

// 排序选项
export type SortOption =
  | 'ending_soon'
  | 'newly_listed'
  | 'price_low_high'
  | 'price_high_low'
  | 'most_bids'
  | 'most_watched';

// 拍卖列表查询参数
export interface AuctionQuery {
  page: number;
  limit: number;
  filters?: AuctionFilters;
  sort?: SortOption;
  search?: string;
}

// 用户拍卖活动
export interface UserAuctionActivity {
  bidding: AuctionItem[]; // 正在竞拍的
  watching: AuctionItem[]; // 关注的
  won: AuctionItem[]; // 已赢得的
  lost: AuctionItem[]; // 失败的
}

// 拍卖统计
export interface AuctionStats {
  totalActive: number;
  totalEnded: number;
  averagePrice: number;
  highestPrice: number;
  totalVolume: number;
  popularLocations: Array<{
    location: string;
    count: number;
  }>;
}

// 实时更新事件数据类型
export interface BidEventData {
  bidId: string;
  bidderId: string;
  amount: number;
}

export interface PriceUpdateEventData {
  oldPrice: number;
  newPrice: number;
}

export interface TimeExtensionEventData {
  newEndTime: Date;
  extensionMinutes: number;
}

export interface AuctionEndEventData {
  winnerId?: string;
  finalPrice: number;
}

export type AuctionEventData =
  | BidEventData
  | PriceUpdateEventData
  | TimeExtensionEventData
  | AuctionEndEventData;

// 实时更新事件
export interface AuctionEvent {
  type: 'bid' | 'price_update' | 'time_extension' | 'auction_end';
  auctionId: string;
  data: AuctionEventData;
  timestamp: Date;
}
