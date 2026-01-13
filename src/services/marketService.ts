import { request } from "../utils/request";

const BASE_URL = "http://localhost:8080/api/market"; // 后端服务运行在8080端口

export const marketService = {
  // 列出所有市场
  listMarkets: async () => {
    return request(`${BASE_URL}/markets`);
  },

  // 获取订单簿
  getOrderBook: async (marketID: string) => {
    // 暂时返回模拟数据
    return {
      MarketID: marketID,
      Bids: [
        { Price: 4980000000, Amount: 150000000, OrderCount: 3 },
        { Price: 4975000000, Amount: 200000000, OrderCount: 5 },
        { Price: 4970000000, Amount: 300000000, OrderCount: 8 },
        { Price: 4965000000, Amount: 180000000, OrderCount: 4 },
        { Price: 4960000000, Amount: 250000000, OrderCount: 6 },
        { Price: 4955000000, Amount: 120000000, OrderCount: 2 },
        { Price: 4950000000, Amount: 400000000, OrderCount: 10 },
        { Price: 4945000000, Amount: 160000000, OrderCount: 3 },
        { Price: 4940000000, Amount: 220000000, OrderCount: 7 },
        { Price: 4935000000, Amount: 180000000, OrderCount: 4 }
      ],
      Asks: [
        { Price: 5000000000, Amount: 120000000, OrderCount: 2 },
        { Price: 5005000000, Amount: 180000000, OrderCount: 4 },
        { Price: 5010000000, Amount: 250000000, OrderCount: 6 },
        { Price: 5015000000, Amount: 160000000, OrderCount: 3 },
        { Price: 5020000000, Amount: 300000000, OrderCount: 8 },
        { Price: 5025000000, Amount: 140000000, OrderCount: 2 },
        { Price: 5030000000, Amount: 200000000, OrderCount: 5 },
        { Price: 5035000000, Amount: 170000000, OrderCount: 3 },
        { Price: 5040000000, Amount: 280000000, OrderCount: 7 },
        { Price: 5045000000, Amount: 190000000, OrderCount: 4 }
      ],
      LastUpdated: new Date().toISOString()
    };
  },

  // 列出市场的交易（需要后端实现）
  listTradesByMarket: async (marketID: string) => {
    // 暂时返回模拟数据，等待后端实现
    return [
      {
        ID: "trade1",
        Price: 50000000000,
        Amount: 100000000,
        Side: 0,
        CreatedAt: new Date().toISOString()
      },
      {
        ID: "trade2",
        Price: 49800000000,
        Amount: 50000000,
        Side: 1,
        CreatedAt: new Date(Date.now() - 60000).toISOString()
      },
      {
        ID: "trade3",
        Price: 50200000000,
        Amount: 75000000,
        Side: 0,
        CreatedAt: new Date(Date.now() - 120000).toISOString()
      }
    ];
  },

  // 获取用户余额（需要后端实现）
  getUserBalance: async (userID: string, assetID: string) => {
    // 暂时返回模拟数据
    return {
      Available: 1000000000000,
      Locked: 0
    };
  },

  // 创建订单（需要后端实现）
  createOrder: async (orderData: {
    userID: string;
    marketID: string;
    side: number;
    price: number;
    amount: number;
    timeInForce: number;
    privateKeyID: string;
  }) => {
    // 暂时返回模拟数据
    return {
      ID: "order_" + Date.now(),
      Status: "pending",
      ...orderData
    };
  },

  // 获取市场统计数据
  getMarketStats: async (marketID: string) => {
    // 暂时返回模拟数据
    return {
      volume24h: 1500000000000,
      priceChange24h: 0.025,
      high24h: 52000000000,
      low24h: 48000000000
    };
  },

  // 获取资产
  getAsset: async (assetID: string) => {
    // 暂时返回模拟数据
    return {
      ID: assetID,
      Symbol: assetID === "asset1" ? "QAU" : "USDT",
      Name: assetID === "asset1" ? "Quantum Aurum" : "Tether USD",
      Decimals: assetID === "asset1" ? 8 : 6
    };
  },

  // 获取资产通过符号
  getAssetBySymbol: async (symbol: string) => {
    // 暂时返回模拟数据
    return {
      ID: symbol === "QAU" ? "asset1" : "asset2",
      Symbol: symbol,
      Name: symbol === "QAU" ? "Quantum Aurum" : "Tether USD",
      Decimals: symbol === "QAU" ? 8 : 6
    };
  }
};

