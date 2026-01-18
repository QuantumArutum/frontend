import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { Progress } from '@/components/ui/progress';
import QuantumSecurityPanel from '@/app/components/QuantumSecurityPanel';
import { formatNumber, formatCurrency, formatPercentage } from '@/lib/utils';
import {
  Coins,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  Users,
  Lock,
  Unlock,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
  Minus,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle,
  Zap,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Wallet,
  Shield,
  Clock,
  Star,
  Gift,
  Sparkles,
  Crown,
  Award,
  Calculator,
  Eye,
  Settings,
  History,
  Download,
  Share2,
  Heart,
  Flame,
  Droplets,
  Layers,
  Gauge
} from 'lucide-react';

const QuantumDeFi = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('swap');
  const [isLoading, setIsLoading] = useState(false);
  
  // 交换相关状态
  const [fromToken, setFromToken] = useState('QAU');
  const [toToken, setToToken] = useState('USDT');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [priceImpact, setPriceImpact] = useState(0.12);
  
  // 流动性相关状态
  const [liquidityPair, setLiquidityPair] = useState('QAU/USDT');
  const [liquidityAmount1, setLiquidityAmount1] = useState('');
  const [liquidityAmount2, setLiquidityAmount2] = useState('');
  const [lpTokens, setLpTokens] = useState(0);
  
  // 借贷相关状态
  const [collateralAsset, setCollateralAsset] = useState('QAU');
  const [borrowAsset, setBorrowAsset] = useState('USDT');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [borrowAmount, setBorrowAmount] = useState('');
  const [healthFactor, setHealthFactor] = useState(2.15);
  
  // 收益农场状态
  const [selectedFarm, setSelectedFarm] = useState('QAU-USDT LP');
  const [farmStakeAmount, setFarmStakeAmount] = useState('');
  
  // 投资组合状态
  const [portfolioValue, setPortfolioValue] = useState(1234.56);
  const [totalEarnings, setTotalEarnings] = useState(152.34);
  const [apy, setApy] = useState(12.34);

  // 代币列表
  const tokens = [
    { symbol: 'QAU', name: 'Quantum Gold', balance: 1250.75, price: 125.50, change: 2.34 },
    { symbol: 'USDT', name: 'Tether USD', balance: 5000.00, price: 1.00, change: 0.01 },
    { symbol: 'ETH', name: 'Ethereum', balance: 2.5, price: 2450.80, change: -1.23 },
    { symbol: 'BTC', name: 'Bitcoin', balance: 0.15, price: 43250.00, change: 3.45 }
  ];

  // 流动性池
  const liquidityPools = [
    {
      pair: 'QAU/USDT',
      tvl: 12500000,
      apy: 45.67,
      volume24h: 2500000,
      fees24h: 7500,
      userLiquidity: 5000,
      userShare: 0.04
    },
    {
      pair: 'QAU/ETH',
      tvl: 8750000,
      apy: 38.92,
      volume24h: 1800000,
      fees24h: 5400,
      userLiquidity: 2500,
      userShare: 0.029
    },
    {
      pair: 'USDT/ETH',
      tvl: 15600000,
      apy: 28.45,
      volume24h: 3200000,
      fees24h: 9600,
      userLiquidity: 0,
      userShare: 0
    }
  ];

  // 借贷市场
  const lendingMarkets = [
    {
      asset: 'QAU',
      totalSupply: 5600000,
      totalBorrow: 3200000,
      supplyAPY: 8.45,
      borrowAPY: 12.67,
      utilizationRate: 57.14,
      userSupply: 1000,
      userBorrow: 0
    },
    {
      asset: 'USDT',
      totalSupply: 12800000,
      totalBorrow: 8900000,
      supplyAPY: 6.23,
      borrowAPY: 9.87,
      utilizationRate: 69.53,
      userSupply: 2500,
      userBorrow: 800
    },
    {
      asset: 'ETH',
      totalSupply: 2500,
      totalBorrow: 1650,
      supplyAPY: 4.56,
      borrowAPY: 7.89,
      utilizationRate: 66.00,
      userSupply: 0.5,
      userBorrow: 0
    }
  ];

  // 收益农场
  const yieldFarms = [
    {
      name: 'QAU-USDT LP',
      apy: 67.89,
      tvl: 8500000,
      multiplier: '3x',
      userStaked: 2500,
      pendingRewards: 45.67,
      lockPeriod: '无锁定'
    },
    {
      name: 'QAU-ETH LP',
      apy: 45.67,
      tvl: 6200000,
      multiplier: '2x',
      userStaked: 1200,
      pendingRewards: 23.45,
      lockPeriod: '7天'
    },
    {
      name: 'USDT Single',
      apy: 12.34,
      tvl: 15600000,
      multiplier: '1x',
      userStaked: 5000,
      pendingRewards: 67.89,
      lockPeriod: '无锁定'
    }
  ];

  // 计算交换汇率
  const calculateSwapRate = () => {
    if (!fromAmount || fromAmount === '0') return '0';
    const rate = fromToken === 'QAU' ? 125.50 : 1/125.50;
    const result = parseFloat(fromAmount) * rate;
    setToAmount(result.toFixed(6));
    setPriceImpact(parseFloat(fromAmount) > 1000 ? 0.25 : 0.12);
  };

  useEffect(() => {
    calculateSwapRate();
  }, [fromAmount, fromToken, toToken]);

  // 执行交换
  const handleSwap = async () => {
    if (!fromAmount || !toAmount) {
      alert(t('defi.swap.enter_amount'));
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(t('defi.swap.success', { fromAmount, fromToken, toAmount, toToken }));
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      alert(t('defi.swap.failed'));
    } finally {
      setIsLoading(false);
    }
  };

  // 添加流动性
  const handleAddLiquidity = async () => {
    if (!liquidityAmount1 || !liquidityAmount2) {
      alert('请输入流动性数量');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newLpTokens = parseFloat(liquidityAmount1) * 0.1;
      setLpTokens(lpTokens + newLpTokens);
      alert(`成功添加流动性，获得 ${newLpTokens.toFixed(4)} LP代币`);
      setLiquidityAmount1('');
      setLiquidityAmount2('');
    } catch (error) {
      alert('添加流动性失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 供应资产
  const handleSupply = async (asset, amount) => {
    if (!amount) {
      alert('请输入供应数量');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`成功供应 ${amount} ${asset}`);
    } catch (error) {
      alert('供应失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 借款
  const handleBorrow = async (asset, amount) => {
    if (!amount) {
      alert('请输入借款数量');
      return;
    }

    if (healthFactor < 1.5) {
      alert('健康因子过低，无法借款');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`成功借款 ${amount} ${asset}`);
      setHealthFactor(healthFactor - 0.3);
    } catch (error) {
      alert('借款失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 质押到农场
  const handleStakeFarm = async (farmName, amount) => {
    if (!amount) {
      alert('请输入质押数量');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`成功质押 ${amount} 到 ${farmName}`);
    } catch (error) {
      alert('质押失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

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
            <QuantumSecurityPanel />
          </div>

          {/* 页面标题 */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <Image 
                src="/logos/quantum-aurum-icon-ui.svg" 
                alt="Quantaureum" 
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <h1 className="text-responsive-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                量子DeFi协议
              </h1>
            </div>
            <p className="text-gray-300 mt-2 text-responsive-base">
              去中心化金融服务平台，对标Uniswap和Aave的完整DeFi生态
            </p>
          </div>

          {/* 顶部统计 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Droplets className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-sm text-gray-400">总锁定价值</div>
                    <div className="font-bold text-responsive-lg text-cyan-400 truncate-number">
                      {formatCurrency(125600000, 'QAU')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-sm text-gray-400">24h交易量</div>
                    <div className="font-bold text-responsive-lg text-purple-400 truncate-number">
                      {formatCurrency(8750000, 'QAU')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-sm text-gray-400">活跃用户</div>
                    <div className="font-bold text-responsive-lg text-green-400 truncate-number">
                      {formatNumber(12847)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Percent className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-sm text-gray-400">平均APY</div>
                    <div className="font-bold text-responsive-lg text-yellow-400 truncate-number">
                      {formatPercentage(34.56)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：DeFi功能 */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="p-6 pb-0">
                      <TabsList className="grid w-full grid-cols-5 quantum-tabs">
                        <TabsTrigger value="swap" className="quantum-tab">交换</TabsTrigger>
                        <TabsTrigger value="liquidity" className="quantum-tab">流动性</TabsTrigger>
                        <TabsTrigger value="lending" className="quantum-tab">借贷</TabsTrigger>
                        <TabsTrigger value="farming" className="quantum-tab">农场</TabsTrigger>
                        <TabsTrigger value="portfolio" className="quantum-tab">组合</TabsTrigger>
                      </TabsList>
                    </div>

                    {/* 代币交换 */}
                    <TabsContent value="swap" className="p-6 pt-0">
                      <div className="space-y-6">
                        <div className="text-center">
                          <h2 className="text-responsive-xl font-bold mb-2">代币交换</h2>
                          <p className="text-gray-400 text-sm">基于AMM的去中心化交换协议</p>
                        </div>

                        <div className="space-y-4">
                          {/* 卖出代币 */}
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-400">卖出</span>
                              <span className="text-sm text-gray-400">
                                余额: {formatNumber(tokens.find(t => t.symbol === fromToken)?.balance || 0)}
                              </span>
                            </div>
                            <div className="flex gap-3">
                              <Input
                                type="number"
                                placeholder="0.0"
                                value={fromAmount}
                                onChange={(e) => setFromAmount(e.target.value)}
                                className="quantum-input flex-1"
                              />
                              <Select value={fromToken} onValueChange={setFromToken}>
                                <SelectTrigger className="w-32 quantum-select">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {tokens.map((token) => (
                                    <SelectItem key={token.symbol} value={token.symbol}>
                                      {token.symbol}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* 交换按钮 */}
                          <div className="flex justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const temp = fromToken;
                                setFromToken(toToken);
                                setToToken(temp);
                                setFromAmount(toAmount);
                                setToAmount(fromAmount);
                              }}
                              className="quantum-button-secondary"
                            >
                              <ArrowUpDown className="w-4 h-4" />
                            </Button>
                          </div>

                          {/* 买入代币 */}
                          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-400">买入</span>
                              <span className="text-sm text-gray-400">
                                余额: {formatNumber(tokens.find(t => t.symbol === toToken)?.balance || 0)}
                              </span>
                            </div>
                            <div className="flex gap-3">
                              <Input
                                type="number"
                                placeholder="0.0"
                                value={toAmount}
                                readOnly
                                className="quantum-input flex-1"
                              />
                              <Select value={toToken} onValueChange={setToToken}>
                                <SelectTrigger className="w-32 quantum-select">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {tokens.map((token) => (
                                    <SelectItem key={token.symbol} value={token.symbol}>
                                      {token.symbol}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* 交换信息 */}
                          {fromAmount && toAmount && (
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-400">汇率:</span>
                                <span className="truncate-number">
                                  1 {fromToken} = {(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} {toToken}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">价格影响:</span>
                                <span className={`truncate-number ${priceImpact > 0.2 ? 'text-red-400' : 'text-green-400'}`}>
                                  {formatPercentage(priceImpact)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-400">滑点容忍:</span>
                                <div className="flex gap-2">
                                  {[0.1, 0.5, 1.0].map((value) => (
                                    <Button
                                      key={value}
                                      variant={slippage === value ? "default" : "outline"}
                                      size="sm"
                                      onClick={() => setSlippage(value)}
                                      className="quantum-button-secondary text-xs"
                                    >
                                      {formatPercentage(value)}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}

                          <Button
                            onClick={handleSwap}
                            disabled={isLoading || !fromAmount || !toAmount}
                            className="w-full quantum-button-primary"
                          >
                            {isLoading ? (
                              <div className="quantum-loading"></div>
                            ) : (
                              <>
                                <ArrowUpDown className="w-4 h-4 mr-2" />
                                交换代币
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    {/* 流动性管理 */}
                    <TabsContent value="liquidity" className="p-6 pt-0">
                      <div className="space-y-6">
                        <div className="text-center">
                          <h2 className="text-responsive-xl font-bold mb-2">流动性管理</h2>
                          <p className="text-gray-400 text-sm">提供流动性赚取交易手续费</p>
                        </div>

                        {/* 流动性池列表 */}
                        <div className="space-y-4">
                          {liquidityPools.map((pool, index) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <div className="font-medium text-responsive-base">{pool.pair}</div>
                                    <div className="text-sm text-gray-400">
                                      TVL: {formatCurrency(pool.tvl, 'QAU')}
                                    </div>
                                  </div>
                                  <Badge className="quantum-badge-primary">
                                    APY {formatPercentage(pool.apy)}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                                  <div>
                                    <div className="text-gray-400">24h交易量</div>
                                    <div className="font-medium truncate-number">
                                      {formatCurrency(pool.volume24h, 'QAU')}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-gray-400">24h手续费</div>
                                    <div className="font-medium text-green-400 truncate-number">
                                      {formatCurrency(pool.fees24h, 'QAU')}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-gray-400">我的流动性</div>
                                    <div className="font-medium text-cyan-400 truncate-number">
                                      {formatCurrency(pool.userLiquidity, 'QAU')}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="quantum-button-primary flex-1"
                                    onClick={() => setLiquidityPair(pool.pair)}
                                  >
                                    <Plus className="w-4 h-4 mr-1" />
                                    添加
                                  </Button>
                                  {pool.userLiquidity > 0 && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="quantum-button-secondary flex-1"
                                    >
                                      <Minus className="w-4 h-4 mr-1" />
                                      移除
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>

                        {/* 添加流动性表单 */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-responsive-lg">添加流动性</CardTitle>
                            <CardDescription>选择的交易对: {liquidityPair}</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="text-sm text-gray-400 mb-2 block">
                                  {liquidityPair.split('/')[0]} 数量
                                </label>
                                <Input
                                  type="number"
                                  placeholder="0.0"
                                  value={liquidityAmount1}
                                  onChange={(e) => setLiquidityAmount1(e.target.value)}
                                  className="quantum-input"
                                />
                              </div>
                              <div>
                                <label className="text-sm text-gray-400 mb-2 block">
                                  {liquidityPair.split('/')[1]} 数量
                                </label>
                                <Input
                                  type="number"
                                  placeholder="0.0"
                                  value={liquidityAmount2}
                                  onChange={(e) => setLiquidityAmount2(e.target.value)}
                                  className="quantum-input"
                                />
                              </div>
                            </div>

                            <Button
                              onClick={handleAddLiquidity}
                              disabled={isLoading || !liquidityAmount1 || !liquidityAmount2}
                              className="w-full quantum-button-primary"
                            >
                              {isLoading ? (
                                <div className="quantum-loading"></div>
                              ) : (
                                <>
                                  <Plus className="w-4 h-4 mr-2" />
                                  添加流动性
                                </>
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    {/* 借贷市场 */}
                    <TabsContent value="lending" className="p-6 pt-0">
                      <div className="space-y-6">
                        <div className="text-center">
                          <h2 className="text-responsive-xl font-bold mb-2">借贷市场</h2>
                          <p className="text-gray-400 text-sm">超额抵押借贷协议</p>
                        </div>

                        {/* 健康因子 */}
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-400">健康因子</span>
                              <span className={`font-bold text-responsive-lg truncate-number ${
                                healthFactor > 2 ? 'text-green-400' :
                                healthFactor > 1.5 ? 'text-yellow-400' : 'text-red-400'
                              }`}>
                                {healthFactor.toFixed(2)}
                              </span>
                            </div>
                            <Progress 
                              value={Math.min(100, (healthFactor / 3) * 100)} 
                              className="h-2"
                            />
                            <div className="text-xs text-gray-400 mt-1">
                              健康因子低于1.0将被清算
                            </div>
                          </CardContent>
                        </Card>

                        {/* 借贷市场列表 */}
                        <div className="space-y-4">
                          {lendingMarkets.map((market, index) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <div className="font-medium text-responsive-base">{market.asset}</div>
                                    <div className="text-sm text-gray-400">
                                      利用率: {formatPercentage(market.utilizationRate)}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-sm text-green-400">
                                      供应APY: {formatPercentage(market.supplyAPY)}
                                    </div>
                                    <div className="text-sm text-red-400">
                                      借款APY: {formatPercentage(market.borrowAPY)}
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                  <div>
                                    <div className="text-gray-400">总供应</div>
                                    <div className="font-medium truncate-number">
                                      {formatNumber(market.totalSupply)} {market.asset}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-gray-400">总借款</div>
                                    <div className="font-medium truncate-number">
                                      {formatNumber(market.totalBorrow)} {market.asset}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-gray-400">我的供应</div>
                                    <div className="font-medium text-cyan-400 truncate-number">
                                      {formatNumber(market.userSupply)} {market.asset}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-gray-400">我的借款</div>
                                    <div className="font-medium text-purple-400 truncate-number">
                                      {formatNumber(market.userBorrow)} {market.asset}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="quantum-button-primary flex-1"
                                    onClick={() => handleSupply(market.asset, '100')}
                                  >
                                    <ArrowUp className="w-4 h-4 mr-1" />
                                    供应
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="quantum-button-secondary flex-1"
                                    onClick={() => handleBorrow(market.asset, '50')}
                                  >
                                    <ArrowDown className="w-4 h-4 mr-1" />
                                    借款
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* 收益农场 */}
                    <TabsContent value="farming" className="p-6 pt-0">
                      <div className="space-y-6">
                        <div className="text-center">
                          <h2 className="text-responsive-xl font-bold mb-2">收益农场</h2>
                          <p className="text-gray-400 text-sm">质押LP代币获得额外奖励</p>
                        </div>

                        <div className="space-y-4">
                          {yieldFarms.map((farm, index) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <div className="font-medium text-responsive-base">{farm.name}</div>
                                    <div className="text-sm text-gray-400">
                                      锁定期: {farm.lockPeriod}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <Badge className="quantum-badge-primary mb-1">
                                      APY {formatPercentage(farm.apy)}
                                    </Badge>
                                    <div className="text-sm text-yellow-400">
                                      {farm.multiplier} 奖励倍数
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                                  <div>
                                    <div className="text-gray-400">TVL</div>
                                    <div className="font-medium truncate-number">
                                      {formatCurrency(farm.tvl, 'QAU')}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-gray-400">我的质押</div>
                                    <div className="font-medium text-cyan-400 truncate-number">
                                      {formatCurrency(farm.userStaked, 'QAU')}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-gray-400">待领取奖励</div>
                                    <div className="font-medium text-green-400 truncate-number">
                                      {formatNumber(farm.pendingRewards)} QAU
                                    </div>
                                  </div>
                                </div>

                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    className="quantum-button-primary flex-1"
                                    onClick={() => handleStakeFarm(farm.name, '100')}
                                  >
                                    <Plus className="w-4 h-4 mr-1" />
                                    质押
                                  </Button>
                                  {farm.userStaked > 0 && (
                                    <>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="quantum-button-secondary flex-1"
                                      >
                                        <Minus className="w-4 h-4 mr-1" />
                                        取消质押
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="quantum-button-primary flex-1"
                                      >
                                        <Gift className="w-4 h-4 mr-1" />
                                        领取奖励
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    {/* 投资组合 */}
                    <TabsContent value="portfolio" className="p-6 pt-0">
                      <div className="space-y-6">
                        <div className="text-center">
                          <h2 className="text-responsive-xl font-bold mb-2">投资组合</h2>
                          <p className="text-gray-400 text-sm">您的DeFi资产总览</p>
                        </div>

                        {/* 总览统计 */}
                        <div className="grid grid-cols-3 gap-4">
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-sm text-gray-400 mb-1">总资产价值</div>
                              <div className="font-bold text-responsive-lg text-cyan-400 truncate-number">
                                {formatCurrency(portfolioValue, 'QAU')}
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-sm text-gray-400 mb-1">总收益</div>
                              <div className="font-bold text-responsive-lg text-green-400 truncate-number">
                                +{formatCurrency(totalEarnings, 'QAU')}
                              </div>
                            </CardContent>
                          </Card>
                          <Card>
                            <CardContent className="p-4 text-center">
                              <div className="text-sm text-gray-400 mb-1">年化收益率</div>
                              <div className="font-bold text-responsive-lg text-purple-400 truncate-number">
                                {formatPercentage(apy)}
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* 资产分布 */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-responsive-lg">资产分布</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {tokens.map((token, index) => (
                                <div key={index} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                                      {token.symbol.charAt(0)}
                                    </div>
                                    <div>
                                      <div className="font-medium">{token.symbol}</div>
                                      <div className="text-sm text-gray-400">{token.name}</div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-medium truncate-number">
                                      {formatNumber(token.balance)} {token.symbol}
                                    </div>
                                    <div className="text-sm text-gray-400 truncate-number">
                                      ≈ {formatCurrency(token.balance * token.price, 'USD')}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* 收益历史 */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-responsive-lg">收益历史</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between items-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <div>
                                  <div className="font-medium">流动性挖矿奖励</div>
                                  <div className="text-sm text-gray-400">QAU-USDT LP</div>
                                </div>
                                <div className="text-green-400 font-medium truncate-number">
                                  +{formatNumber(45.67)} QAU
                                </div>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <div>
                                  <div className="font-medium">借贷利息收入</div>
                                  <div className="text-sm text-gray-400">USDT供应</div>
                                </div>
                                <div className="text-blue-400 font-medium truncate-number">
                                  +{formatNumber(23.45)} USDT
                                </div>
                              </div>
                              <div className="flex justify-between items-center p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                <div>
                                  <div className="font-medium">收益农场奖励</div>
                                  <div className="text-sm text-gray-400">QAU-ETH LP</div>
                                </div>
                                <div className="text-purple-400 font-medium truncate-number">
                                  +{formatNumber(67.89)} QAU
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* 右侧：信息面板 */}
            <div className="space-y-6">
              {/* 市场概览 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    市场概览
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tokens.slice(0, 3).map((token, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold">
                            {token.symbol.charAt(0)}
                          </div>
                          <span className="font-medium">{token.symbol}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium truncate-number">
                            {formatCurrency(token.price, 'USD')}
                          </div>
                          <div className={`text-sm truncate-number ${
                            token.change > 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {token.change > 0 ? '+' : ''}{formatPercentage(token.change)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 热门池子 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="w-5 h-5" />
                    热门池子
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {liquidityPools.slice(0, 3).map((pool, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{pool.pair}</span>
                          <Badge className="quantum-badge-primary text-xs">
                            {formatPercentage(pool.apy)}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-400 truncate-number">
                          TVL: {formatCurrency(pool.tvl, 'QAU')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 量子DeFi特性 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    量子DeFi特性
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="font-medium text-sm">量子随机性</div>
                        <div className="text-xs text-gray-400">真随机清算保护</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="font-medium text-sm">量子加密</div>
                        <div className="text-xs text-gray-400">资产安全保护</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <Gauge className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="font-medium text-sm">智能优化</div>
                        <div className="text-xs text-gray-400">量子算法优化收益</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 快速操作 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    快速操作
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full quantum-button-primary" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      一键添加流动性
                    </Button>
                    <Button className="w-full quantum-button-secondary" size="sm" variant="outline">
                      <Gift className="w-4 h-4 mr-2" />
                      领取所有奖励
                    </Button>
                    <Button className="w-full quantum-button-secondary" size="sm" variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      重新平衡投资组合
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumDeFi;

