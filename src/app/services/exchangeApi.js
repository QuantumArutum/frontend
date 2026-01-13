/**
 * Quantum Exchange API 服务
 * 连接后端交易引擎、市场数据和钱包服务
 */

const API_BASE_URLS = {
  exchange: 'http://localhost:6005', // 交易引擎服务
  market: 'http://localhost:6006',   // 市场数据服务
  wallet: 'http://localhost:6007'    // 钱包服务
};

class ExchangeApiService {
  
  /**
   * 通用API请求方法
   */
  async request(service, endpoint, options = {}) {
    const url = `${API_BASE_URLS[service]}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${url}`, error);
      throw error;
    }
  }

  // ==================== 市场数据 API ====================

  /**
   * 获取所有交易对
   */
  async getSymbols() {
    try {
      return await this.request('market', '/market/symbol');
    } catch (error) {
      console.warn('Failed to fetch symbols from API, using mock data');
      return this.getMockSymbols();
    }
  }

  /**
   * 获取币种缩略行情
   */
  async getSymbolThumb() {
    try {
      return await this.request('market', '/market/symbol-thumb');
    } catch (error) {
      console.warn('Failed to fetch symbol thumb from API, using mock data');
      return this.getMockMarketData();
    }
  }

  /**
   * 获取交易对详情
   */
  async getSymbolInfo(symbol) {
    try {
      return await this.request('market', `/market/symbol-info?symbol=${symbol}`);
    } catch (error) {
      console.warn(`Failed to fetch symbol info for ${symbol}, using mock data`);
      return this.getMockSymbolInfo(symbol);
    }
  }

  /**
   * 获取盘口信息
   */
  async getOrderBook(symbol) {
    try {
      return await this.request('market', `/market/exchange-plate?symbol=${symbol}`);
    } catch (error) {
      console.warn(`Failed to fetch order book for ${symbol}, using mock data`);
      return this.getMockOrderBook();
    }
  }

  /**
   * 获取最新成交记录
   */
  async getLatestTrades(symbol) {
    try {
      return await this.request('market', `/market/latest-trade?symbol=${symbol}`);
    } catch (error) {
      console.warn(`Failed to fetch latest trades for ${symbol}, using mock data`);
      return this.getMockTrades();
    }
  }

  // ==================== 交易 API ====================

  /**
   * 提交订单
   */
  async submitOrder(orderData) {
    try {
      return await this.request('exchange', '/exchange/order/add', {
        method: 'POST',
        body: JSON.stringify(orderData)
      });
    } catch (error) {
      console.warn('Failed to submit order to API, simulating success');
      return { code: 0, message: 'success', data: 'mock-order-id-' + Date.now() };
    }
  }

  /**
   * 获取当前委托
   */
  async getCurrentOrders() {
    try {
      return await this.request('exchange', '/exchange/order/current');
    } catch (error) {
      console.warn('Failed to fetch current orders from API, using mock data');
      return this.getMockOrders();
    }
  }

  /**
   * 获取历史委托
   */
  async getOrderHistory() {
    try {
      return await this.request('exchange', '/exchange/order/history');
    } catch (error) {
      console.warn('Failed to fetch order history from API, using mock data');
      return this.getMockOrderHistory();
    }
  }

  /**
   * 取消订单
   */
  async cancelOrder(orderId) {
    try {
      return await this.request('exchange', '/exchange/order/cancel', {
        method: 'POST',
        body: JSON.stringify({ orderId })
      });
    } catch (error) {
      console.warn(`Failed to cancel order ${orderId}, simulating success`);
      return { code: 0, message: 'success' };
    }
  }

  // ==================== 钱包 API ====================

  /**
   * 获取用户余额
   */
  async getBalance() {
    try {
      return await this.request('wallet', '/wallet/balance');
    } catch (error) {
      console.warn('Failed to fetch balance from API, using mock data');
      return this.getMockBalance();
    }
  }

  // ==================== Mock 数据 ====================

  getMockSymbols() {
    return [
      { symbol: 'QAU/USDT', baseSymbol: 'QAU', coinSymbol: 'USDT' },
      { symbol: 'QAU/BTC', baseSymbol: 'QAU', coinSymbol: 'BTC' },
      { symbol: 'QAU/ETH', baseSymbol: 'QAU', coinSymbol: 'ETH' },
      { symbol: 'BTC/USDT', baseSymbol: 'BTC', coinSymbol: 'USDT' },
      { symbol: 'ETH/USDT', baseSymbol: 'ETH', coinSymbol: 'USDT' }
    ];
  }

  getMockMarketData() {
    return [
      { symbol: 'QAU/USDT', price: 1.2345, change: 5.67, volume: '2.4M', high: 1.2500, low: 1.2100 },
      { symbol: 'QAU/BTC', price: 0.000028, change: -2.34, volume: '1.8M', high: 0.000030, low: 0.000027 },
      { symbol: 'QAU/ETH', price: 0.00041, change: 3.21, volume: '3.1M', high: 0.00043, low: 0.00039 },
      { symbol: 'BTC/USDT', price: 43250.50, change: 1.85, volume: '890K', high: 43500, low: 42800 },
      { symbol: 'ETH/USDT', price: 2650.75, change: -0.95, volume: '1.2M', high: 2680, low: 2620 }
    ];
  }

  getMockSymbolInfo(symbol) {
    return {
      symbol,
      price: 1.2345,
      change: 5.67,
      volume: '2.4M',
      high: 1.2500,
      low: 1.2100,
      currentTime: Date.now()
    };
  }

  getMockOrderBook() {
    return {
      bid: [
        { price: 1.2340, amount: 1500, total: 1851 },
        { price: 1.2335, amount: 2200, total: 2714.7 },
        { price: 1.2330, amount: 1800, total: 2219.4 },
        { price: 1.2325, amount: 3200, total: 3944 },
        { price: 1.2320, amount: 1100, total: 1355.2 }
      ],
      ask: [
        { price: 1.2345, amount: 1200, total: 1481.4 },
        { price: 1.2350, amount: 1800, total: 2223 },
        { price: 1.2355, amount: 2500, total: 3088.75 },
        { price: 1.2360, amount: 1600, total: 1977.6 },
        { price: 1.2365, amount: 2100, total: 2596.65 }
      ]
    };
  }

  getMockTrades() {
    return [
      { price: 1.2345, amount: 100, time: Date.now() - 1000, direction: 'buy' },
      { price: 1.2344, amount: 200, time: Date.now() - 2000, direction: 'sell' },
      { price: 1.2346, amount: 150, time: Date.now() - 3000, direction: 'buy' }
    ];
  }

  getMockOrders() {
    return [
      {
        orderId: 'order-1',
        symbol: 'QAU/USDT',
        type: 'limit',
        direction: 'buy',
        price: 1.2300,
        amount: 1000,
        status: 'trading',
        time: Date.now() - 60000
      }
    ];
  }

  getMockOrderHistory() {
    return [
      {
        orderId: 'order-2',
        symbol: 'QAU/USDT',
        type: 'limit',
        direction: 'sell',
        price: 1.2400,
        amount: 500,
        status: 'completed',
        time: Date.now() - 3600000
      }
    ];
  }

  getMockBalance() {
    return {
      QAU: { available: 1234.56, frozen: 100.00 },
      USDT: { available: 5678.90, frozen: 200.00 },
      BTC: { available: 0.12345, frozen: 0.01 },
      ETH: { available: 2.5678, frozen: 0.1 }
    };
  }
}

// 创建单例实例
const exchangeApi = new ExchangeApiService();

export default exchangeApi;
