'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '../../i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { formatNumber, formatCurrency, formatPercentage } from '@/lib/utils';
import {
  Wallet,
  Send,
  Download,
  Shield,
  Zap,
  Globe,
  Eye,
  EyeOff,
  Copy,
  QrCode,
  History,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  RefreshCw
} from 'lucide-react';

const WalletApp = () => {
  const { t } = useTranslation();

  // 状态管理
  const [selectedNetwork, setSelectedNetwork] = useState('mainnet');
  const [activeTab, setActiveTab] = useState('assets');
  const [showBalance, setShowBalance] = useState(true);
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [selectedAsset, setSelectedAsset] = useState('QAU');
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 网络配置
  const networks = [
    { id: 'mainnet', name: t('wallet.networks.quantum_mainnet'), rpc: 'https://mainnet.quantum.network', chainId: 1 },
    { id: 'testnet', name: t('wallet.networks.quantum_testnet'), rpc: 'https://testnet.quantum.network', chainId: 2 },
    { id: 'ethereum', name: t('wallet.networks.ethereum_mainnet'), rpc: 'https://mainnet.infura.io', chainId: 1 },
    { id: 'polygon', name: t('wallet.networks.polygon_mainnet'), rpc: 'https://polygon-rpc.com', chainId: 137 },
    { id: 'bsc', name: 'BSC 主网', rpc: 'https://bsc-dataseed.binance.org', chainId: 56 },
  ];

  // 资产数据
  const assets = [
    {
      symbol: 'QAU',
      name: 'Quantum Gold',
      balance: 1250.75,
      usdValue: 156844.375,
      price: 125.50,
      change24h: 2.45,
      icon: '🔮'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 2.5,
      usdValue: 6626.875,
      price: 2650.75,
      change24h: 3.67,
      icon: '⟠'
    },
    {
      symbol: 'USDT',
      name: 'Tether USD',
      balance: 5000.00,
      usdValue: 5000.00,
      price: 1.00,
      change24h: 0.01,
      icon: '💵'
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: 0.5,
      usdValue: 21625.00,
      price: 43250.00,
      change24h: -1.23,
      icon: '₿'
    }
  ];

  // 交易历史
  const transactions = [
    {
      id: '1',
      type: 'send',
      asset: 'QAU',
      amount: 100.5,
      to: '0x742d35Cc6634C0532925a3b8D4C2C4e8C9F8E8F8',
      hash: '0x1234...5678',
      status: 'confirmed',
      timestamp: '2024-01-15 14:30:00',
      fee: 0.001
    },
    {
      id: '2',
      type: 'receive',
      asset: 'ETH',
      amount: 1.0,
      from: '0x987f...4321',
      hash: '0x9876...1234',
      status: 'confirmed',
      timestamp: '2024-01-15 12:15:00',
      fee: 0
    },
    {
      id: '3',
      type: 'send',
      asset: 'USDT',
      amount: 500.0,
      to: '0x456a...7890',
      hash: '0x4567...8901',
      status: 'pending',
      timestamp: '2024-01-15 10:45:00',
      fee: 0.5
    }
  ];

  // NFT 数据
  const nfts = [
    {
      id: '1',
      name: 'Quantum Art #001',
      collection: 'Quantum Collection',
      image: '/api/placeholder/150/150',
      value: 2.5,
      currency: 'ETH'
    },
    {
      id: '2',
      name: 'Quantum Art #042',
      collection: 'Quantum Collection',
      image: '/api/placeholder/150/150',
      value: 1.8,
      currency: 'ETH'
    }
  ];

  // 计算总资产价值
  const totalValue = assets.reduce((sum, asset) => sum + asset.usdValue, 0);

  // 处理发送交易
  const handleSend = async () => {
    if (!sendAddress || !sendAmount) return;
    
    setIsLoading(true);
    try {
      // 模拟交易发送
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('交易发送成功！');
      setSendAddress('');
      setSendAmount('');
    } catch (error) {
      alert('交易发送失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 复制地址
  const copyAddress = (address) => {
    navigator.clipboard.writeText(address);
    alert('地址已复制到剪贴板');
  };

  // 获取当前网络信息
  const currentNetwork = networks.find(n => n.id === selectedNetwork);

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
          {/* 页面标题 */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-2">
              <img 
                src="/logos/quantum-aurum-icon-ui.svg" 
                alt="Quantaureum" 
                className="h-10 w-10"
              />
              <h1 className="text-responsive-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
                {t('wallet.title')}
              </h1>
            </div>
            <p className="text-gray-300 mt-2 text-responsive-base">
              {t('wallet.description')}
            </p>
          </div>

          {/* 网络选择器 */}
          <div className="mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-cyan-400" />
                    <span className="font-medium">{t('wallet.current_network')}:</span>
                  </div>
                  <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                    <SelectTrigger className="quantum-input w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {networks.map((network) => (
                        <SelectItem key={network.id} value={network.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              network.id === 'mainnet' ? 'bg-green-400' : 
                              network.id === 'testnet' ? 'bg-yellow-400' : 'bg-blue-400'
                            }`}></div>
                            {network.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：资产总览 */}
            <div className="lg:col-span-2">
              {/* 总资产卡片 */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      总资产
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowBalance(!showBalance)}
                        className="quantum-button-secondary"
                      >
                        {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Badge className="quantum-badge-primary">
                        <Shield className="w-3 h-3" />
                        量子安全
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-responsive-3xl font-bold mb-2 truncate-number">
                      {showBalance ? formatCurrency(totalValue, 'USD') : '****'}
                    </div>
                    <div className="text-gray-400 text-responsive-base">
                      钱包地址: 0x742d...E8F8
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyAddress('0x742d35Cc6634C0532925a3b8D4C2C4e8C9F8E8F8')}
                        className="ml-2 p-1"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 主要功能标签页 */}
              <Card>
                <CardContent className="p-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="p-6 pb-0">
                      <TabsList className="grid w-full grid-cols-4 quantum-tabs">
                        <TabsTrigger value="assets" className="quantum-tab">资产</TabsTrigger>
                        <TabsTrigger value="activity" className="quantum-tab">活动</TabsTrigger>
                        <TabsTrigger value="nfts" className="quantum-tab">NFTs</TabsTrigger>
                        <TabsTrigger value="security" className="quantum-tab">安全</TabsTrigger>
                      </TabsList>
                    </div>

                    <TabsContent value="assets" className="p-6 pt-4">
                      <div className="space-y-4">
                        {assets.map((asset) => (
                          <div
                            key={asset.symbol}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                            onClick={() => setSelectedAsset(asset.symbol)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="text-2xl">{asset.icon}</div>
                              <div>
                                <div className="font-medium text-responsive-base">{asset.symbol}</div>
                                <div className="text-sm text-gray-400">{asset.name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-responsive-base truncate-number">
                                {showBalance ? formatNumber(asset.balance) : '****'} {asset.symbol}
                              </div>
                              <div className="text-sm text-gray-400 truncate-number">
                                {showBalance ? formatCurrency(asset.usdValue, 'USD') : '****'}
                              </div>
                              <div className={`text-xs ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {asset.change24h >= 0 ? '+' : ''}{formatPercentage(asset.change24h)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="activity" className="p-6 pt-4">
                      <div className="space-y-4">
                        {transactions.map((tx) => (
                          <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-4">
                              <div className={`p-2 rounded-full ${
                                tx.type === 'send' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                              }`}>
                                {tx.type === 'send' ? <Send className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                              </div>
                              <div>
                                <div className="font-medium text-responsive-sm">
                                  {tx.type === 'send' ? '发送' : '接收'} {tx.asset}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {tx.type === 'send' ? `到: ${tx.to?.slice(0, 10)}...` : `从: ${tx.from?.slice(0, 10)}...`}
                                </div>
                                <div className="text-xs text-gray-400">{tx.timestamp}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className={`font-medium text-responsive-sm truncate-number ${
                                tx.type === 'send' ? 'text-red-400' : 'text-green-400'
                              }`}>
                                {tx.type === 'send' ? '-' : '+'}{formatNumber(tx.amount)} {tx.asset}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={
                                  tx.status === 'confirmed' ? 'quantum-badge-success' :
                                  tx.status === 'pending' ? 'quantum-badge-warning' : 'quantum-badge-error'
                                }>
                                  {tx.status === 'confirmed' ? (
                                    <><CheckCircle className="w-3 h-3" /> 已确认</>
                                  ) : tx.status === 'pending' ? (
                                    <><Clock className="w-3 h-3" /> 待确认</>
                                  ) : (
                                    <><AlertTriangle className="w-3 h-3" /> 失败</>
                                  )}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="nfts" className="p-6 pt-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {nfts.map((nft) => (
                          <div key={nft.id} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer">
                            <div className="aspect-square bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg mb-3 flex items-center justify-center">
                              <div className="text-4xl">🎨</div>
                            </div>
                            <div className="text-sm font-medium truncate">{nft.name}</div>
                            <div className="text-xs text-gray-400 truncate">{nft.collection}</div>
                            <div className="text-xs text-cyan-400 mt-1 truncate-number">
                              {formatNumber(nft.value)} {nft.currency}
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="security" className="p-6 pt-4">
                      <div className="space-y-6">
                        {/* 量子安全状态 */}
                        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <Shield className="w-5 h-5 text-green-400" />
                            <span className="font-medium text-green-400">量子安全状态</span>
                            <Badge className="quantum-badge-success">活跃</Badge>
                          </div>
                          <div className="text-sm text-gray-300 space-y-2">
                            <div className="flex justify-between">
                              <span>加密算法:</span>
                              <span className="text-green-400">CRYSTALS-Dilithium</span>
                            </div>
                            <div className="flex justify-between">
                              <span>密钥强度:</span>
                              <span className="text-green-400">量子安全级别</span>
                            </div>
                            <div className="flex justify-between">
                              <span>威胁等级:</span>
                              <span className="text-green-400">低</span>
                            </div>
                          </div>
                        </div>

                        {/* 安全设置 */}
                        <div className="space-y-4">
                          <h3 className="font-medium text-responsive-lg">安全设置</h3>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Shield className="w-4 h-4 text-cyan-400" />
                                <span className="text-responsive-sm">助记词备份</span>
                              </div>
                              <Badge className="quantum-badge-success">已备份</Badge>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                <span className="text-responsive-sm">私钥导出</span>
                              </div>
                              <Button variant="outline" size="sm" className="quantum-button-secondary">
                                导出
                              </Button>
                            </div>
                            
                            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                              <div className="flex items-center gap-3">
                                <Settings className="w-4 h-4 text-gray-400" />
                                <span className="text-responsive-sm">网络设置</span>
                              </div>
                              <Button variant="outline" size="sm" className="quantum-button-secondary">
                                配置
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* 右侧：快速操作 */}
            <div className="space-y-6">
              {/* 快速操作按钮 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-responsive-lg">快速操作</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    className="w-full quantum-button-primary"
                    onClick={() => setActiveTab('send')}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    发送
                  </Button>
                  <Button 
                    className="w-full quantum-button-secondary"
                    onClick={() => setShowReceiveModal(true)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    接收
                  </Button>
                  <Button className="w-full quantum-button-secondary">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    刷新余额
                  </Button>
                </CardContent>
              </Card>

              {/* 发送表单 */}
              {activeTab === 'send' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="w-5 h-5" />
                      发送资产
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">选择资产</label>
                      <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                        <SelectTrigger className="quantum-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {assets.map((asset) => (
                            <SelectItem key={asset.symbol} value={asset.symbol}>
                              <div className="flex items-center gap-2">
                                <span>{asset.icon}</span>
                                <span>{asset.symbol}</span>
                                <span className="text-gray-400 truncate-number">
                                  ({formatNumber(asset.balance)})
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">接收地址</label>
                      <Input
                        placeholder="0x..."
                        value={sendAddress}
                        onChange={(e) => setSendAddress(e.target.value)}
                        className="quantum-input"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">发送数量</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={sendAmount}
                        onChange={(e) => setSendAmount(e.target.value)}
                        className="quantum-input"
                      />
                      <div className="flex gap-2 mt-2">
                        {[25, 50, 75, 100].map((percent) => (
                          <Button
                            key={percent}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const asset = assets.find(a => a.symbol === selectedAsset);
                              if (asset) {
                                setSendAmount((asset.balance * percent / 100).toFixed(6));
                              }
                            }}
                            className="quantum-button-secondary text-xs"
                          >
                            {percent}%
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-gray-400 space-y-1">
                      <div className="flex justify-between">
                        <span>网络费用:</span>
                        <span className="truncate-number">~0.001 {selectedAsset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>预计到账:</span>
                        <span className="truncate-number">{formatNumber(parseFloat(sendAmount || 0) - 0.001)} {selectedAsset}</span>
                      </div>
                    </div>

                    <Button
                      onClick={handleSend}
                      disabled={isLoading || !sendAddress || !sendAmount}
                      className="w-full quantum-button-primary"
                    >
                      {isLoading ? (
                        <div className="quantum-loading"></div>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          发送交易
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* 接收模态框 */}
              {showReceiveModal && (
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center gap-2">
                        <Download className="w-5 h-5" />
                        接收资产
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReceiveModal(false)}
                        className="quantum-button-secondary"
                      >
                        ✕
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="w-32 h-32 bg-white mx-auto mb-4 rounded-lg flex items-center justify-center">
                        <QrCode className="w-16 h-16 text-black" />
                      </div>
                      <div className="text-sm text-gray-400 mb-2">您的钱包地址:</div>
                      <div className="text-xs bg-white/5 p-3 rounded-lg break-all">
                        0x742d35Cc6634C0532925a3b8D4C2C4e8C9F8E8F8
                      </div>
                      <Button
                        onClick={() => copyAddress('0x742d35Cc6634C0532925a3b8D4C2C4e8C9F8E8F8')}
                        className="w-full mt-3 quantum-button-secondary"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        复制地址
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 网络状态 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-responsive-lg">网络状态</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">连接状态:</span>
                      <Badge className="quantum-badge-success">
                        <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                        已连接
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">区块高度:</span>
                      <span className="text-sm truncate-number">{formatNumber(18567432)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">Gas 价格:</span>
                      <span className="text-sm truncate-number">25 Gwei</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">网络:</span>
                      <span className="text-sm">{currentNetwork?.name}</span>
                    </div>
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

export default WalletApp;

