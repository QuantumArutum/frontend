import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import QuantumSecurityPanel from '@/app/components/QuantumSecurityPanel';
import { formatNumber, formatCurrency, formatPercentage } from '@/lib/utils';
import {
  Ticket,
  Trophy,
  Clock,
  Calendar,
  DollarSign,
  Users,
  Star,
  Gift,
  Zap,
  Target,
  TrendingUp,
  History,
  Settings,
  Info,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Plus,
  Minus,
  Eye,
  Download,
  Share2,
  Heart,
  Sparkles,
  Crown,
  Award,
  Coins,
  Calculator,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';

const QuantumLottery = () => {
  // 大乐透对标的核心状态
  const [selectedFrontNumbers, setSelectedFrontNumbers] = useState([]); // 前区号码 (1-35选5)
  const [selectedBackNumbers, setSelectedBackNumbers] = useState([]); // 后区号码 (1-12选2)
  const [betAmount, setBetAmount] = useState(2); // 投注金额，大乐透基础投注2元
  const [betMultiple, setBetMultiple] = useState(1); // 投注倍数
  const [activeTab, setActiveTab] = useState('buy'); // 当前标签页
  const [showRules, setShowRules] = useState(false); // 显示规则
  const [isLoading, setIsLoading] = useState(false);

  // 大乐透期号和开奖信息
  const [currentPeriod, setCurrentPeriod] = useState('24001');
  const [nextDrawTime, setNextDrawTime] = useState('2024-01-15 21:30:00');
  const [jackpotPool, setJackpotPool] = useState(850000000); // 奖池金额
  const [totalSales, setTotalSales] = useState(125000000); // 销售总额

  // 用户彩票记录
  const [userTickets, setUserTickets] = useState([
    {
      id: '1',
      period: '24001',
      frontNumbers: [3, 8, 15, 22, 31],
      backNumbers: [5, 9],
      multiple: 1,
      amount: 2,
      status: 'waiting',
      purchaseTime: '2024-01-15 14:30:00',
    },
    {
      id: '2',
      period: '23365',
      frontNumbers: [7, 14, 18, 25, 33],
      backNumbers: [2, 11],
      multiple: 2,
      amount: 4,
      status: 'drawn',
      prize: 0,
      purchaseTime: '2024-01-13 16:45:00',
    },
  ]);

  // 历史开奖记录
  const [drawHistory, setDrawHistory] = useState([
    {
      period: '23365',
      drawDate: '2024-01-13',
      frontNumbers: [5, 12, 19, 28, 34],
      backNumbers: [3, 8],
      jackpotWinners: 2,
      jackpotPrize: 12500000,
      totalPrize: 45600000,
      sales: 98500000,
    },
    {
      period: '23364',
      drawDate: '2024-01-11',
      frontNumbers: [2, 9, 16, 23, 30],
      backNumbers: [1, 7],
      jackpotWinners: 0,
      jackpotPrize: 0,
      totalPrize: 28900000,
      sales: 87200000,
    },
  ]);

  // 奖项设置（对标大乐透）
  const prizeStructure = [
    {
      level: '一等奖',
      condition: '5+2',
      baseAmount: 10000000,
      description: '前区5个号码+后区2个号码',
    },
    {
      level: '二等奖',
      condition: '5+1',
      baseAmount: 500000,
      description: '前区5个号码+后区1个号码',
    },
    { level: '三等奖', condition: '5+0', baseAmount: 10000, description: '前区5个号码' },
    { level: '四等奖', condition: '4+2', baseAmount: 3000, description: '前区4个号码+后区2个号码' },
    { level: '五等奖', condition: '4+1', baseAmount: 300, description: '前区4个号码+后区1个号码' },
    { level: '六等奖', condition: '3+2', baseAmount: 200, description: '前区3个号码+后区2个号码' },
    { level: '七等奖', condition: '4+0', baseAmount: 100, description: '前区4个号码' },
    { level: '八等奖', condition: '3+1', baseAmount: 15, description: '前区3个号码+后区1个号码' },
    { level: '九等奖', condition: '2+2', baseAmount: 5, description: '前区2个号码+后区2个号码' },
  ];

  // 生成号码数组
  const frontNumbers = Array.from({ length: 35 }, (_, i) => i + 1);
  const backNumbers = Array.from({ length: 12 }, (_, i) => i + 1);

  // 处理前区号码选择
  const handleFrontNumberSelect = (number) => {
    if (selectedFrontNumbers.includes(number)) {
      setSelectedFrontNumbers(selectedFrontNumbers.filter((n) => n !== number));
    } else if (selectedFrontNumbers.length < 5) {
      setSelectedFrontNumbers([...selectedFrontNumbers, number].sort((a, b) => a - b));
    }
  };

  // 处理后区号码选择
  const handleBackNumberSelect = (number) => {
    if (selectedBackNumbers.includes(number)) {
      setSelectedBackNumbers(selectedBackNumbers.filter((n) => n !== number));
    } else if (selectedBackNumbers.length < 2) {
      setSelectedBackNumbers([...selectedBackNumbers, number].sort((a, b) => a - b));
    }
  };

  // 机选功能
  const handleRandomSelect = () => {
    // 前区随机选5个
    const randomFront = [];
    while (randomFront.length < 5) {
      const num = Math.floor(Math.random() * 35) + 1;
      if (!randomFront.includes(num)) {
        randomFront.push(num);
      }
    }

    // 后区随机选2个
    const randomBack = [];
    while (randomBack.length < 2) {
      const num = Math.floor(Math.random() * 12) + 1;
      if (!randomBack.includes(num)) {
        randomBack.push(num);
      }
    }

    setSelectedFrontNumbers(randomFront.sort((a, b) => a - b));
    setSelectedBackNumbers(randomBack.sort((a, b) => a - b));
  };

  // 清空选号
  const handleClearSelection = () => {
    setSelectedFrontNumbers([]);
    setSelectedBackNumbers([]);
  };

  // 计算投注金额
  const calculateTotalAmount = () => {
    if (selectedFrontNumbers.length === 5 && selectedBackNumbers.length === 2) {
      return betAmount * betMultiple;
    }
    return 0;
  };

  // 提交投注
  const handleSubmitBet = async () => {
    if (selectedFrontNumbers.length !== 5 || selectedBackNumbers.length !== 2) {
      alert('请选择5个前区号码和2个后区号码');
      return;
    }

    setIsLoading(true);
    try {
      // 模拟投注提交
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newTicket = {
        id: Date.now().toString(),
        period: currentPeriod,
        frontNumbers: [...selectedFrontNumbers],
        backNumbers: [...selectedBackNumbers],
        multiple: betMultiple,
        amount: calculateTotalAmount(),
        status: 'waiting',
        purchaseTime: new Date().toLocaleString(),
      };

      setUserTickets([newTicket, ...userTickets]);
      handleClearSelection();
      setBetMultiple(1);

      alert('投注成功！祝您好运！');
    } catch (error) {
      alert('投注失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 格式化号码显示
  const formatNumber = (num) => num.toString().padStart(2, '0');

  // 计算倒计时
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const drawTime = new Date(nextDrawTime);
      const diff = drawTime - now;

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(
          `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      } else {
        setTimeLeft('开奖中...');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextDrawTime]);

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
            <h1 className="text-responsive-3xl font-bold bg-gradient-to-r from-cyan-500 to-purple-500 bg-clip-text text-transparent">
              量子大乐透
            </h1>
            <p className="text-gray-300 mt-2 text-responsive-base">
              基于量子随机数的公平彩票系统，对标中国体彩大乐透玩法
            </p>
          </div>

          {/* 顶部信息栏 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-sm text-gray-400">当前期号</div>
                    <div className="font-bold text-responsive-lg truncate-number">
                      {currentPeriod}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <div>
                    <div className="text-sm text-gray-400">开奖倒计时</div>
                    <div className="font-bold text-responsive-lg text-yellow-400 truncate-number">
                      {timeLeft}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-sm text-gray-400">奖池金额</div>
                    <div className="font-bold text-responsive-lg text-purple-400 truncate-number">
                      {formatCurrency(jackpotPool, 'QAU')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-green-400" />
                  <div>
                    <div className="text-sm text-gray-400">销售总额</div>
                    <div className="font-bold text-responsive-lg text-green-400 truncate-number">
                      {formatCurrency(totalSales, 'QAU')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 主要内容区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：选号区域 */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="p-6 pb-0">
                      <div className="flex justify-between items-center mb-4">
                        <TabsList className="grid w-full max-w-md grid-cols-3 quantum-tabs">
                          <TabsTrigger value="buy" className="quantum-tab">
                            购买彩票
                          </TabsTrigger>
                          <TabsTrigger value="my-tickets" className="quantum-tab">
                            我的彩票
                          </TabsTrigger>
                          <TabsTrigger value="history" className="quantum-tab">
                            开奖历史
                          </TabsTrigger>
                        </TabsList>

                        <Dialog open={showRules} onOpenChange={setShowRules}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="quantum-button-secondary">
                              <Info className="w-4 h-4 mr-2" />
                              玩法规则
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5" />
                                量子大乐透玩法规则
                              </DialogTitle>
                              <DialogDescription>
                                完全对标中国体彩大乐透的玩法和奖项设置
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <h3 className="font-medium mb-2">投注方式</h3>
                                <p className="text-sm text-gray-400">
                                  从前区35个号码中选择5个号码，从后区12个号码中选择2个号码，组成一注。
                                  每注基本投注金额为2 QAU。
                                </p>
                              </div>

                              <div>
                                <h3 className="font-medium mb-2">奖项设置</h3>
                                <div className="space-y-2">
                                  {prizeStructure.map((prize, index) => (
                                    <div
                                      key={index}
                                      className="flex justify-between items-center text-sm p-2 bg-white/5 rounded"
                                    >
                                      <span className="font-medium">{prize.level}</span>
                                      <span className="text-gray-400">{prize.condition}</span>
                                      <span className="text-cyan-400 truncate-number">
                                        {formatCurrency(prize.baseAmount, 'QAU')}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h3 className="font-medium mb-2">开奖时间</h3>
                                <p className="text-sm text-gray-400">
                                  每周一、三、六晚上21:30开奖，使用量子随机数生成器确保公平性。
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>

                    <TabsContent value="buy" className="p-6 pt-0">
                      <div className="space-y-6">
                        {/* 前区选号 */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <h3 className="font-medium text-responsive-lg">前区号码</h3>
                            <Badge className="quantum-badge-primary">35选5</Badge>
                            <span className="text-sm text-gray-400">
                              已选 {selectedFrontNumbers.length}/5
                            </span>
                          </div>
                          <div className="grid grid-cols-7 gap-2">
                            {frontNumbers.map((number) => (
                              <Button
                                key={number}
                                variant={
                                  selectedFrontNumbers.includes(number) ? 'default' : 'outline'
                                }
                                className={`aspect-square p-0 text-sm font-bold ${
                                  selectedFrontNumbers.includes(number)
                                    ? 'bg-red-600 hover:bg-red-700 text-white'
                                    : 'quantum-button-secondary hover:bg-red-600/20'
                                }`}
                                onClick={() => handleFrontNumberSelect(number)}
                              >
                                {formatNumber(number)}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* 后区选号 */}
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <h3 className="font-medium text-responsive-lg">后区号码</h3>
                            <Badge className="quantum-badge-secondary">12选2</Badge>
                            <span className="text-sm text-gray-400">
                              已选 {selectedBackNumbers.length}/2
                            </span>
                          </div>
                          <div className="grid grid-cols-6 gap-2">
                            {backNumbers.map((number) => (
                              <Button
                                key={number}
                                variant={
                                  selectedBackNumbers.includes(number) ? 'default' : 'outline'
                                }
                                className={`aspect-square p-0 text-sm font-bold ${
                                  selectedBackNumbers.includes(number)
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'quantum-button-secondary hover:bg-blue-600/20'
                                }`}
                                onClick={() => handleBackNumberSelect(number)}
                              >
                                {formatNumber(number)}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* 选号工具 */}
                        <div className="flex gap-4">
                          <Button onClick={handleRandomSelect} className="quantum-button-primary">
                            <Zap className="w-4 h-4 mr-2" />
                            机选
                          </Button>
                          <Button
                            onClick={handleClearSelection}
                            variant="outline"
                            className="quantum-button-secondary"
                          >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            清空
                          </Button>
                        </div>

                        {/* 投注设置 */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">投注倍数</label>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setBetMultiple(Math.max(1, betMultiple - 1))}
                                className="quantum-button-secondary"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <Input
                                type="number"
                                value={betMultiple}
                                onChange={(e) =>
                                  setBetMultiple(Math.max(1, parseInt(e.target.value) || 1))
                                }
                                className="quantum-input text-center"
                                min="1"
                                max="99"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setBetMultiple(Math.min(99, betMultiple + 1))}
                                className="quantum-button-secondary"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm text-gray-400 mb-2 block">投注金额</label>
                            <div className="text-responsive-xl font-bold text-cyan-400 truncate-number">
                              {formatCurrency(calculateTotalAmount(), 'QAU')}
                            </div>
                            <div className="text-xs text-gray-400">
                              单注 {formatCurrency(betAmount, 'QAU')} × {betMultiple} 倍
                            </div>
                          </div>
                        </div>

                        {/* 投注按钮 */}
                        <Button
                          onClick={handleSubmitBet}
                          disabled={
                            isLoading ||
                            selectedFrontNumbers.length !== 5 ||
                            selectedBackNumbers.length !== 2
                          }
                          className="w-full quantum-button-primary bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                        >
                          {isLoading ? (
                            <div className="quantum-loading"></div>
                          ) : (
                            <>
                              <Ticket className="w-4 h-4 mr-2" />
                              立即投注
                            </>
                          )}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="my-tickets" className="p-6 pt-0">
                      <div className="space-y-4">
                        {userTickets.length > 0 ? (
                          userTickets.map((ticket) => (
                            <Card key={ticket.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <div className="font-medium text-responsive-base">
                                      期号: {ticket.period}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                      {ticket.purchaseTime}
                                    </div>
                                  </div>
                                  <Badge
                                    className={
                                      ticket.status === 'waiting'
                                        ? 'quantum-badge-warning'
                                        : ticket.status === 'drawn'
                                          ? 'quantum-badge-primary'
                                          : 'quantum-badge-success'
                                    }
                                  >
                                    {ticket.status === 'waiting'
                                      ? '待开奖'
                                      : ticket.status === 'drawn'
                                        ? '已开奖'
                                        : '已中奖'}
                                  </Badge>
                                </div>

                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400">前区:</span>
                                    <div className="flex gap-1">
                                      {ticket.frontNumbers.map((num, index) => (
                                        <div
                                          key={index}
                                          className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold"
                                        >
                                          {formatNumber(num)}
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400">后区:</span>
                                    <div className="flex gap-1">
                                      {ticket.backNumbers.map((num, index) => (
                                        <div
                                          key={index}
                                          className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold"
                                        >
                                          {formatNumber(num)}
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">投注金额:</span>
                                    <span className="font-medium truncate-number">
                                      {formatCurrency(ticket.amount, 'QAU')}
                                    </span>
                                  </div>

                                  {ticket.prize !== undefined && (
                                    <div className="flex justify-between items-center text-sm">
                                      <span className="text-gray-400">中奖金额:</span>
                                      <span
                                        className={`font-medium truncate-number ${ticket.prize > 0 ? 'text-green-400' : 'text-gray-400'}`}
                                      >
                                        {ticket.prize > 0
                                          ? formatCurrency(ticket.prize, 'QAU')
                                          : '未中奖'}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-400">
                            <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>暂无彩票记录</p>
                            <p className="text-sm">快去购买您的第一张彩票吧！</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="history" className="p-6 pt-0">
                      <div className="space-y-4">
                        {drawHistory.map((draw) => (
                          <Card key={draw.period}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <div className="font-medium text-responsive-base">
                                    第 {draw.period} 期
                                  </div>
                                  <div className="text-sm text-gray-400">{draw.drawDate} 开奖</div>
                                </div>
                                <Badge className="quantum-badge-primary">
                                  <Trophy className="w-3 h-3 mr-1" />
                                  已开奖
                                </Badge>
                              </div>

                              <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-400">开奖号码:</span>
                                  <div className="flex gap-1">
                                    {draw.frontNumbers.map((num, index) => (
                                      <div
                                        key={index}
                                        className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold"
                                      >
                                        {formatNumber(num)}
                                      </div>
                                    ))}
                                    <div className="mx-2 text-gray-400">+</div>
                                    {draw.backNumbers.map((num, index) => (
                                      <div
                                        key={index}
                                        className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold"
                                      >
                                        {formatNumber(num)}
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div>
                                    <div className="text-gray-400">一等奖</div>
                                    <div className="font-medium truncate-number">
                                      {draw.jackpotWinners} 注
                                    </div>
                                    <div className="text-cyan-400 truncate-number">
                                      {draw.jackpotPrize > 0
                                        ? formatCurrency(draw.jackpotPrize, 'QAU')
                                        : '滚存'}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-gray-400">总奖金</div>
                                    <div className="font-medium text-purple-400 truncate-number">
                                      {formatCurrency(draw.totalPrize, 'QAU')}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-gray-400">销售额</div>
                                    <div className="font-medium text-green-400 truncate-number">
                                      {formatCurrency(draw.sales, 'QAU')}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            {/* 右侧：信息面板 */}
            <div className="space-y-6">
              {/* 当前选号显示 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    当前选号
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-2">
                        前区号码 ({selectedFrontNumbers.length}/5)
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {selectedFrontNumbers.length > 0 ? (
                          selectedFrontNumbers.map((num, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-xs font-bold"
                            >
                              {formatNumber(num)}
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-sm">请选择5个号码</div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-400 mb-2">
                        后区号码 ({selectedBackNumbers.length}/2)
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {selectedBackNumbers.length > 0 ? (
                          selectedBackNumbers.map((num, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold"
                            >
                              {formatNumber(num)}
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-sm">请选择2个号码</div>
                        )}
                      </div>
                    </div>

                    {selectedFrontNumbers.length === 5 && selectedBackNumbers.length === 2 && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          选号完成！投注金额: {formatCurrency(calculateTotalAmount(), 'QAU')}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 量子安全特性 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    量子安全特性
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <div className="font-medium text-sm">量子随机数</div>
                        <div className="text-xs text-gray-400">真随机开奖号码</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                      <div>
                        <div className="font-medium text-sm">区块链存证</div>
                        <div className="text-xs text-gray-400">投注记录不可篡改</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-purple-400" />
                      <div>
                        <div className="font-medium text-sm">智能合约</div>
                        <div className="text-xs text-gray-400">自动派奖无人工干预</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 统计信息 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    统计信息
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">本期销量:</span>
                      <span className="font-medium truncate-number">
                        {formatCurrency(totalSales, 'QAU')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">奖池滚存:</span>
                      <span className="font-medium text-purple-400 truncate-number">
                        {formatCurrency(jackpotPool, 'QAU')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">参与人数:</span>
                      <span className="font-medium truncate-number">{formatNumber(62500)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">中奖概率:</span>
                      <span className="font-medium text-cyan-400">1/21,425,712</span>
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

export default QuantumLottery;
