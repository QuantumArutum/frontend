'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import QuantumSecurityPanel from '@/app/components/QuantumSecurityPanel';
import { formatNumber, formatCurrency, formatPercentage } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Wallet,
  ArrowUpDown,
  Search,
  Clock,
  Activity,
  Shield,
  Zap
} from 'lucide-react';

// 类型定义
interface TradingPair {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  high: number;
  low: number;
}

interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;
}

interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}

interface Trade {
  price: number;
  amount: number;
  time: string;
  type: 'buy' | 'sell';
}

interface UserOrder {
  id: string;
  pair: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  filled: number;
  status: 'open' | 'partial' | 'filled' | 'cancelled';
  time: string;
}

interface BalanceEntry {
  available: number;
  locked: number;
}

interface Balance {
  [currency: string]: BalanceEntry;
}

interface MarketData {
  symbol?: string;
  price?: number;
  change?: number;
  volume?: number;
  high?: number;
  low?: number;
}

const TradingMarket = () => {
  // 基础状态
  const [selectedPair, setSelectedPair] = useState<string>('QAU/USDT');
  const [orderType, setOrderType] = useState<string>('limit');
  const [tradeType, setTradeType] = useState<string>('spot');
  const [activeTab, setActiveTab] = useState<string>('buy');
  
  // 订单状态
  const [buyAmount, setBuyAmount] = useState<string>('');
  const [buyPrice, setBuyPrice] = useState<string>('');
  const [sellAmount, setSellAmount] = useState<string>('');
  const [sellPrice, setSellPrice] = useState<string>('');
  
  // 数据状态
  const [marketData, setMarketData] = useState<MarketData>({});
  const [orderBook, setOrderBook] = useState<OrderBook>({ bids: [], asks: [] });
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [userOrders, setUserOrders] = useState<UserOrder[]>([]);
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [balance, setBalance] = useState<Balance>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 模拟数据
  const mockTradingPairs: TradingPair[] = [
    { symbol: 'QAU/USDT', price: 125.50, change: 2.45, volume: 1234567, high: 128.90, low: 122.10 },
    { symbol: 'BTC/USDT', price: 43250.00, change: -1.23, volume: 987654, high: 44100.00, low: 42800.00 },
    { symbol: 'ETH/USDT', price: 2650.75, change: 3.67, volume: 2345678, high: 2680.00, low: 2580.50 },
    { symbol: 'BNB/USDT', price: 315.20, change: 1.89, volume: 567890, high: 320.50, low: 310.00 },
  ];

  const mockOrderBook: OrderBook = {
    asks: [
      { price: 125.55, amount: 1250.5, total: 156943.775 },
      { price: 125.60, amount: 890.2, total: 111845.12 },
      { price: 125.65, amount: 2100.8, total: 263975.52 },
      { price: 125.70, amount: 750.3, total: 94312.71 },
      { price: 125.75, amount: 1680.9, total: 211473.175 },
    ],
    bids: [
      { price: 125.50, amount: 1890.7, total: 237282.85 },
      { price: 125.45, amount: 2250.3, total: 282412.135 },
      { price: 125.40, amount: 980.6, total: 122951.24 },
      { price: 125.35, amount: 1560.8, total: 195646.28 },
      { price: 125.30, amount: 2100.5, total: 263152.65 },
    ]
  };

  const mockRecentTrades: Trade[] = [
    { price: 125.50, amount: 45.8, time: '14:32:15', type: 'buy' },
    { price: 125.48, amount: 120.5, time: '14:32:10', type: 'sell' },
    { price: 125.52, amount: 89.2, time: '14:32:05', type: 'buy' },
    { price: 125.49, amount: 200.1, time: '14:32:00', type: 'sell' },
    { price: 125.51, amount: 67.9, time: '14:31:55', type: 'buy' },
  ];

  const mockUserOrders: UserOrder[] = [
    { id: '1', pair: 'QAU/USDT', type: 'buy', amount: 100, price: 125.00, filled: 0, status: 'open', time: '2024-01-15 14:30:00' },
    { id: '2', pair: 'BTC/USDT', type: 'sell', amount: 0.5, price: 43500.00, filled: 0.2, status: 'partial', time: '2024-01-15 14:25:00' },
  ];

  const mockBalance: Balance = {
    QAU: { available: 1250.75, locked: 100.00 },
    USDT: { available: 5000.00, locked: 1250.00 },
    BTC: { available: 0.5, locked: 0.0 },
    ETH: { available: 2.5, locked: 0.0 },
  };

  useEffect(() => {
    setTradingPairs(mockTradingPairs);
    setOrderBook(mockOrderBook);
    setRecentTrades(mockRecentTrades);
    setUserOrders(mockUserOrders);
    setBalance(mockBalance);
    setMarketData(mockTradingPairs[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 处理订单提交
  const handleSubmitOrder = async (side: 'buy' | 'sell'): Promise<void> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (side === 'buy') {
        setBuyAmount('');
        setBuyPrice('');
      } else {
        setSellAmount('');
        setSellPrice('');
      }
      
      alert(`${side === 'buy' ? '买入' : '卖出'}订单提交成功！`);
    } catch {
      alert('订单提交失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 快速填入价格
  const handleQuickPrice = (price: number, side: 'buy' | 'sell'): void => {
    if (side === 'buy') {
      setBuyPrice(price.toString());
    } else {
      setSellPrice(price.toString());
    }
  };

  // 快速设置数量百分比
  const handleQuickAmount = (percentage: number, side: 'buy' | 'sell'): void => {
    const availableBalance = side === 'buy' 
      ? balance.USDT?.available || 0 
      : balance.QAU?.available || 0;
    
    const currentPrice = side === 'buy' 
      ? parseFloat(buyPrice) || marketData.price || 0
      : parseFloat(sellPrice) || marketData.price || 0;
    
    if (side === 'buy' && currentPrice) {
      const amount = (availableBalance * percentage / 100) / currentPrice;
      setBuyAmount(amount.toFixed(6));
    } else if (side === 'sell') {
      const amount = availableBalance * percentage / 100;
      setSellAmount(amount.toFixed(6));
    }
  };

  // 过滤交易对
  const filteredPairs = tradingPairs.filter(pair =>
    pair.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* 量子背景 */}
      <div className="quantum-background">
        <div className="quantum-grid"></div>
        <div className="glow-orb glow-orb-1"></div>
        <div className="glow-orb glow-orb-2"></div>
        <div className="glow-orb glow-orb-3"></div>
      </div>

      <div className="main-content">
        <div className="container mx-auto px-4 py-6">
          {/* 量子安全面板 */}
          <div className="mb-6">
            <QuantumSecurityPanel onSecurityChange={() => {}} />
          </div>

          {/* 页面标题 */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <Image 
                src="/quantaureum-icon.svg" 
                alt="Quantaureum" 
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <h1 className="text-responsive-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                量子交易市场
              </h1>
            </div>
            <p className="text-gray-300 mt-2 text-responsive-base">
              基于量子加密技术的安全交易平台，对标币安交易体验
            </p>
          </div>

          {/* 主要交易界面 */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 左侧：交易对列表 */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    交易对
                  </CardTitle>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="搜索交易对..."
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      className="quantum-input pl-10"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {filteredPairs.map((pair) => (
                      <div
                        key={pair.symbol}
                        onClick={() => {
                          setSelectedPair(pair.symbol);
                          setMarketData(pair);
                        }}
                        onKeyDown={(e: React.KeyboardEvent) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedPair(pair.symbol);
                            setMarketData(pair);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className={`p-3 cursor-pointer transition-colors hover:bg-white/10 ${
                          selectedPair === pair.symbol ? 'bg-white/20' : ''
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-responsive-sm truncate-number">
                              {pair.symbol}
                            </div>
                            <div className="text-xs text-gray-400 truncate-number">
                              Vol: {formatNumber(pair.volume)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-responsive-sm truncate-number">
                              {formatNumber(pair.price)}
                            </div>
                            <div className={`text-xs ${pair.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {pair.change >= 0 ? '+' : ''}{formatPercentage(pair.change)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 中间：价格图表和订单簿 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 价格信息卡片 */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-responsive-xl truncate-number">
                      {selectedPair}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Badge className="quantum-badge-primary">
                        <Shield className="w-3 h-3" />
                        量子安全
                      </Badge>
                      <Badge className="quantum-badge-success">
                        <Activity className="w-3 h-3" />
                        活跃
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-gray-400 text-sm">最新价格</div>
                      <div className="text-responsive-lg font-bold truncate-number">
                        {formatNumber(marketData.price || 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">24h涨跌</div>
                      <div className={`text-responsive-lg font-bold ${(marketData.change || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {(marketData.change || 0) >= 0 ? '+' : ''}{formatPercentage(marketData.change || 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">24h最高</div>
                      <div className="text-responsive-lg font-bold truncate-number">
                        {formatNumber(marketData.high || 0)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-sm">24h最低</div>
                      <div className="text-responsive-lg font-bold truncate-number">
                        {formatNumber(marketData.low || 0)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 订单簿 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    订单簿
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {/* 卖单 */}
                    <div>
                      <div className="text-sm text-gray-400 mb-2">卖单 (Ask)</div>
                      <div className="space-y-1">
                        {orderBook.asks.slice().reverse().map((ask, index) => (
                          <div
                            key={index}
                            onClick={() => handleQuickPrice(ask.price, 'buy')}
                            onKeyDown={(e: React.KeyboardEvent) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                handleQuickPrice(ask.price, 'buy');
                              }
                            }}
                            role="button"
                            tabIndex={0}
                            className="flex justify-between text-xs cursor-pointer hover:bg-red-500/10 p-1 rounded"
                          >
                            <span className="text-red-400 truncate-number">{formatNumber(ask.price)}</span>
                            <span className="text-gray-300 truncate-number">{formatNumber(ask.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 买单 */}
                    <div>
                      <div className="text-sm text-gray-400 mb-2">买单 (Bid)</div>
                      <div className="space-y-1">
                        {orderBook.bids.map((bid, index) => (
                          <div
                            key={index}
                            onClick={() => handleQuickPrice(bid.price, 'sell')}
                            onKeyDown={(e: React.KeyboardEvent) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                handleQuickPrice(bid.price, 'sell');
                              }
                            }}
                            role="button"
                            tabIndex={0}
                            className="flex justify-between text-xs cursor-pointer hover:bg-green-500/10 p-1 rounded"
                          >
                            <span className="text-green-400 truncate-number">{formatNumber(bid.price)}</span>
                            <span className="text-gray-300 truncate-number">{formatNumber(bid.amount)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 最近成交 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    最近成交
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {recentTrades.map((trade, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <span className={trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}>
                          {formatNumber(trade.price)}
                        </span>
                        <span className="text-gray-300 truncate-number">{formatNumber(trade.amount)}</span>
                        <span className="text-gray-400">{trade.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>


            {/* 右侧：交易面板 */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ArrowUpDown className="w-5 h-5" />
                    交易面板
                  </CardTitle>
                  <div className="flex gap-2">
                    <Select value={tradeType} onValueChange={setTradeType}>
                      <SelectTrigger className="quantum-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spot">现货</SelectItem>
                        <SelectItem value="margin">杠杆</SelectItem>
                        <SelectItem value="futures">合约</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 quantum-tabs">
                      <TabsTrigger value="buy" className="quantum-tab">买入</TabsTrigger>
                      <TabsTrigger value="sell" className="quantum-tab">卖出</TabsTrigger>
                    </TabsList>

                    <TabsContent value="buy" className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">订单类型</label>
                        <Select value={orderType} onValueChange={setOrderType}>
                          <SelectTrigger className="quantum-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="market">市价单</SelectItem>
                            <SelectItem value="limit">限价单</SelectItem>
                            <SelectItem value="stop-limit">止损限价</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {orderType !== 'market' && (
                        <div>
                          <label className="text-sm text-gray-400">买入价格</label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={buyPrice}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBuyPrice(e.target.value)}
                            className="quantum-input"
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-sm text-gray-400">买入数量</label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={buyAmount}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBuyAmount(e.target.value)}
                          className="quantum-input"
                        />
                        <div className="flex gap-2 mt-2">
                          {[25, 50, 75, 100].map((percent) => (
                            <Button
                              key={percent}
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickAmount(percent, 'buy')}
                              className="quantum-button-secondary text-xs"
                            >
                              {percent}%
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="text-sm text-gray-400">
                        <div className="flex justify-between">
                          <span>可用余额:</span>
                          <span className="truncate-number">{formatCurrency(balance.USDT?.available || 0, 'USDT')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>预计费用:</span>
                          <span className="truncate-number">
                            {formatCurrency((parseFloat(buyAmount) * parseFloat(buyPrice) * 0.001) || 0, 'USDT')}
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleSubmitOrder('buy')}
                        disabled={isLoading || !buyAmount || (!buyPrice && orderType !== 'market')}
                        className="w-full quantum-button-primary bg-green-600 hover:bg-green-700"
                      >
                        {isLoading ? (
                          <div className="quantum-loading"></div>
                        ) : (
                          <>
                            <TrendingUp className="w-4 h-4 mr-2" />
                            买入 {selectedPair.split('/')[0]}
                          </>
                        )}
                      </Button>
                    </TabsContent>

                    <TabsContent value="sell" className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">订单类型</label>
                        <Select value={orderType} onValueChange={setOrderType}>
                          <SelectTrigger className="quantum-input">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="market">市价单</SelectItem>
                            <SelectItem value="limit">限价单</SelectItem>
                            <SelectItem value="stop-limit">止损限价</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {orderType !== 'market' && (
                        <div>
                          <label className="text-sm text-gray-400">卖出价格</label>
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={sellPrice}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSellPrice(e.target.value)}
                            className="quantum-input"
                          />
                        </div>
                      )}

                      <div>
                        <label className="text-sm text-gray-400">卖出数量</label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={sellAmount}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSellAmount(e.target.value)}
                          className="quantum-input"
                        />
                        <div className="flex gap-2 mt-2">
                          {[25, 50, 75, 100].map((percent) => (
                            <Button
                              key={percent}
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickAmount(percent, 'sell')}
                              className="quantum-button-secondary text-xs"
                            >
                              {percent}%
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="text-sm text-gray-400">
                        <div className="flex justify-between">
                          <span>可用余额:</span>
                          <span className="truncate-number">{formatCurrency(balance.QAU?.available || 0, 'QAU')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>预计收入:</span>
                          <span className="truncate-number">
                            {formatCurrency((parseFloat(sellAmount) * parseFloat(sellPrice) * 0.999) || 0, 'USDT')}
                          </span>
                        </div>
                      </div>

                      <Button
                        onClick={() => handleSubmitOrder('sell')}
                        disabled={isLoading || !sellAmount || (!sellPrice && orderType !== 'market')}
                        className="w-full quantum-button-primary bg-red-600 hover:bg-red-700"
                      >
                        {isLoading ? (
                          <div className="quantum-loading"></div>
                        ) : (
                          <>
                            <TrendingDown className="w-4 h-4 mr-2" />
                            卖出 {selectedPair.split('/')[0]}
                          </>
                        )}
                      </Button>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>


          {/* 底部：用户订单和持仓 */}
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  我的交易
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="orders" className="w-full">
                  <TabsList className="quantum-tabs">
                    <TabsTrigger value="orders" className="quantum-tab">当前委托</TabsTrigger>
                    <TabsTrigger value="history" className="quantum-tab">历史订单</TabsTrigger>
                    <TabsTrigger value="positions" className="quantum-tab">持仓</TabsTrigger>
                    <TabsTrigger value="balance" className="quantum-tab">资产</TabsTrigger>
                  </TabsList>

                  <TabsContent value="orders" className="mt-4">
                    <div className="space-y-2">
                      {userOrders.length > 0 ? (
                        userOrders.map((order) => (
                          <div key={order.id} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-4">
                              <Badge className={order.type === 'buy' ? 'quantum-badge-success' : 'quantum-badge-error'}>
                                {order.type === 'buy' ? '买入' : '卖出'}
                              </Badge>
                              <span className="font-medium truncate-number">{order.pair}</span>
                              <span className="text-gray-400 truncate-number">{formatNumber(order.amount)}</span>
                              <span className="text-gray-400 truncate-number">@{formatNumber(order.price)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-sm text-gray-400">{order.time}</span>
                              <Badge className="quantum-badge-warning">
                                {order.status === 'open' ? '未成交' : '部分成交'}
                              </Badge>
                              <Button variant="outline" size="sm" className="quantum-button-secondary">
                                取消
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          暂无委托订单
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="history" className="mt-4">
                    <div className="text-center py-8 text-gray-400">
                      暂无历史订单
                    </div>
                  </TabsContent>

                  <TabsContent value="positions" className="mt-4">
                    <div className="text-center py-8 text-gray-400">
                      暂无持仓
                    </div>
                  </TabsContent>

                  <TabsContent value="balance" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(balance).map(([currency, data]) => (
                        <div key={currency} className="p-4 bg-white/5 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{currency}</span>
                            <Badge className="quantum-badge-primary">
                              <Zap className="w-3 h-3" />
                              量子安全
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">可用:</span>
                              <span className="truncate-number">{formatNumber(data.available)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-400">冻结:</span>
                              <span className="truncate-number">{formatNumber(data.locked)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-medium">
                              <span>总计:</span>
                              <span className="truncate-number">{formatNumber(data.available + data.locked)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingMarket;

