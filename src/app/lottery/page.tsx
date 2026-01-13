'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, DollarSign, Award, Users, Dice6, RefreshCw, Gift, Trophy, Target, TrendingUp, Calendar } from 'lucide-react';
import { PageLayout } from '@/components/ui/PageLayout';
import { Card, CardHeader, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LotteryData = Record<string, any>;

const QuantumLotteryPage = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<{
    frontZone: number[];
    backZone: number[];
  }>({ frontZone: [], backZone: [] });
  const [currentDraw, setCurrentDraw] = useState<LotteryData | null>(null);
  const [drawResults, setDrawResults] = useState<LotteryData[]>([]);
  const [statistics, setStatistics] = useState<LotteryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('buy');

  useEffect(() => {
    fetchCurrentDraw();
    fetchDrawResults();
    fetchStatistics();
  }, []);

  const fetchCurrentDraw = async () => {
    try {
      const response = await fetch('/api/lottery/current-draw');
      const data = await response.json();
      if (data.success) setCurrentDraw(data.data);
    } catch (error) {
      console.error('获取当前期次失败:', error);
    }
  };

  const fetchDrawResults = async () => {
    try {
      const response = await fetch('/api/lottery/draw-results?limit=10');
      const data = await response.json();
      if (data.success) setDrawResults(data.data.results);
    } catch (error) {
      console.error('获取开奖结果失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/lottery/statistics');
      const data = await response.json();
      if (data.success) setStatistics(data.data);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  const generateRandomNumbers = async () => {
    try {
      const response = await fetch('/api/lottery/random-numbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bet_count: 1 })
      });
      const data = await response.json();
      if (data.success && data.data.bets.length > 0) {
        const bet = data.data.bets[0];
        setSelectedNumbers({
          frontZone: bet.front_zone.map((num: string) => parseInt(num)),
          backZone: bet.back_zone.map((num: string) => parseInt(num))
        });
      }
    } catch (error) {
      console.error('生成随机号码失败:', error);
    }
  };

  const handleNumberSelect = (zone: string, number: number) => {
    setSelectedNumbers(prev => {
      const newNumbers = { ...prev };
      if (zone === 'front') {
        if (newNumbers.frontZone.includes(number)) {
          newNumbers.frontZone = newNumbers.frontZone.filter(n => n !== number);
        } else if (newNumbers.frontZone.length < 5) {
          newNumbers.frontZone = [...newNumbers.frontZone, number].sort((a, b) => a - b);
        }
      } else {
        if (newNumbers.backZone.includes(number)) {
          newNumbers.backZone = newNumbers.backZone.filter(n => n !== number);
        } else if (newNumbers.backZone.length < 2) {
          newNumbers.backZone = [...newNumbers.backZone, number].sort((a, b) => a - b);
        }
      }
      return newNumbers;
    });
  };

  const clearSelection = () => setSelectedNumbers({ frontZone: [], backZone: [] });
  const isSelectionComplete = () => selectedNumbers.frontZone.length === 5 && selectedNumbers.backZone.length === 2;

  const formatCurrency = (amount: number): string => {
    if (amount >= 1e9) return (amount / 1e9).toFixed(1) + 'B QAU';
    if (amount >= 1e6) return (amount / 1e6).toFixed(1) + 'M QAU';
    return amount.toLocaleString() + ' QAU';
  };

  const formatTimeRemaining = (timeRemaining: { days: number; hours: number; minutes: number } | null): string => {
    if (!timeRemaining) return '计算中...';
    return `${timeRemaining.days}天${timeRemaining.hours}时${timeRemaining.minutes}分`;
  };

  const NumberGrid = ({ zone, range, selected, maxSelect }: { zone: string; range: number; selected: number[]; maxSelect: number }) => (
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: range }, (_, i) => i + 1).map(number => {
        const isSelected = selected.includes(number);
        const isDisabled = !isSelected && selected.length >= maxSelect;
        return (
          <motion.button
            key={number}
            whileHover={!isDisabled ? { scale: 1.1 } : {}}
            whileTap={!isDisabled ? { scale: 0.95 } : {}}
            onClick={() => !isDisabled && handleNumberSelect(zone, number)}
            disabled={isDisabled}
            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
              isSelected 
                ? zone === 'front' 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' 
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : isDisabled
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-gray-300 border border-gray-600 hover:border-blue-400 hover:bg-gray-600'
            }`}
          >
            {number.toString().padStart(2, '0')}
          </motion.button>
        );
      })}
    </div>
  );

  const PrizeLevel = ({ level, condition, probability, prize }: { level: number; condition: string; probability: string; prize: string }) => (
    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
          level <= 3 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
          level <= 6 ? 'bg-gradient-to-r from-blue-400 to-purple-500' :
          'bg-gradient-to-r from-gray-500 to-gray-600'
        }`}>
          {level}
        </div>
        <div>
          <div className="font-medium text-white text-sm">{condition}</div>
          <div className="text-xs text-gray-500">概率: {probability}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-bold text-green-400 text-sm">{prize}</div>
      </div>
    </div>
  );

  const DrawResultCard = ({ result }: { result: LotteryData }) => (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold text-white">{result.draw_number}</h3>
          <p className="text-gray-400 text-sm">{result.draw_date}</p>
        </div>
        <Badge variant="info" className="flex items-center gap-1">
          <Shield className="w-3 h-3" /> 量子验证
        </Badge>
      </div>
      
      <div className="mb-3">
        <div className="text-sm text-gray-400 mb-2">开奖号码</div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {result.winning_numbers.front_zone.map((num: number, index: number) => (
              <div key={index} className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {num}
              </div>
            ))}
          </div>
          <div className="text-gray-500">+</div>
          <div className="flex gap-1">
            {result.winning_numbers.back_zone.map((num: number, index: number) => (
              <div key={index} className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-center text-sm">
        <div>
          <div className="font-bold text-white">{formatCurrency(result.total_sales)}</div>
          <div className="text-xs text-gray-500">销售额</div>
        </div>
        <div>
          <div className="font-bold text-white">{result.total_bets.toLocaleString()}</div>
          <div className="text-xs text-gray-500">投注数</div>
        </div>
        <div>
          <div className="font-bold text-white">{formatCurrency(result.prize_pool)}</div>
          <div className="text-xs text-gray-500">奖池</div>
        </div>
      </div>
    </Card>
  );

  const tabs = [
    { id: 'buy', label: '购买彩票', icon: <Dice6 className="w-4 h-4" /> },
    { id: 'results', label: '开奖结果', icon: <Trophy className="w-4 h-4" /> },
    { id: 'mybets', label: '我的投注', icon: <Target className="w-4 h-4" /> },
    { id: 'stats', label: '统计分析', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <PageLayout
      title="量子彩票"
      subtitle="基于量子随机数的超级大乐透"
      icon={Zap}
      headerStats={currentDraw ? [
        { label: '当前期次', value: currentDraw.draw_number, color: 'text-yellow-400' },
        { label: '预估奖池', value: formatCurrency(currentDraw.estimated_jackpot), color: 'text-green-400' },
        { label: '距离开奖', value: formatTimeRemaining(currentDraw.time_remaining), color: 'text-blue-400' },
        { label: '已投注数', value: currentDraw.total_bets?.toLocaleString() || '0', color: 'text-pink-400' },
      ] : undefined}
    >
      {/* 导航标签 */}
      <div className="mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* 购买彩票 */}
      {activeTab === 'buy' && (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="选择您的幸运号码"
              icon={Dice6}
              iconColor="text-purple-400"
              action={
                <div className="flex gap-2">
                  <Button variant="success" size="sm" onClick={generateRandomNumbers}>
                    <RefreshCw className="w-4 h-4 mr-1" /> 机选
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearSelection}>清空</Button>
                </div>
              }
            />
            <CardContent>
              {/* 前区选号 */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-white">前区号码</h3>
                  <Badge variant="error">从1-35中选择5个 ({selectedNumbers.frontZone.length}/5)</Badge>
                </div>
                <NumberGrid zone="front" range={35} selected={selectedNumbers.frontZone} maxSelect={5} />
              </div>

              {/* 后区选号 */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-white">后区号码</h3>
                  <Badge variant="info">从1-12中选择2个 ({selectedNumbers.backZone.length}/2)</Badge>
                </div>
                <NumberGrid zone="back" range={12} selected={selectedNumbers.backZone} maxSelect={2} />
              </div>

              {/* 投注信息 */}
              <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-4 border border-purple-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">投注信息</h3>
                  <Badge variant="info" className="flex items-center gap-1">
                    <Shield className="w-3 h-3" /> 量子安全
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-white">1 注</div>
                    <div className="text-gray-400 text-sm">投注注数</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">2.0 QAU</div>
                    <div className="text-gray-400 text-sm">单注金额</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">2.0 QAU</div>
                    <div className="text-gray-400 text-sm">总计金额</div>
                  </div>
                </div>

                {/* 选中的号码显示 */}
                {(selectedNumbers.frontZone.length > 0 || selectedNumbers.backZone.length > 0) && (
                  <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
                    <div className="text-sm text-gray-400 mb-2">已选号码</div>
                    <div className="flex items-center gap-3">
                      {selectedNumbers.frontZone.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">前区:</span>
                          {selectedNumbers.frontZone.map((num, index) => (
                            <div key={index} className="w-7 h-7 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {num.toString().padStart(2, '0')}
                            </div>
                          ))}
                        </div>
                      )}
                      {selectedNumbers.backZone.length > 0 && (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-gray-500">后区:</span>
                          {selectedNumbers.backZone.map((num, index) => (
                            <div key={index} className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {num.toString().padStart(2, '0')}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={!isSelectionComplete()}
                >
                  {isSelectionComplete() ? (
                    <><Gift className="w-5 h-5 mr-2" /> 立即投注 - 2.0 QAU</>
                  ) : (
                    '请选择完整的号码组合'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 奖级说明 */}
          <Card>
            <CardHeader title="奖级设置" icon={Award} iconColor="text-yellow-400" />
            <CardContent className="space-y-2">
              <PrizeLevel level={1} condition="前区5个 + 后区2个" probability="1/21,425,712" prize="浮动奖金" />
              <PrizeLevel level={2} condition="前区5个 + 后区1个" probability="1/1,785,476" prize="浮动奖金" />
              <PrizeLevel level={3} condition="前区5个 + 后区0个" probability="1/109,389" prize="10,000 QAU" />
              <PrizeLevel level={4} condition="前区4个 + 后区2个" probability="1/2,669" prize="3,000 QAU" />
              <PrizeLevel level={5} condition="前区4个 + 后区1个" probability="1/640" prize="300 QAU" />
              <PrizeLevel level={6} condition="前区3个 + 后区2个" probability="1/175" prize="200 QAU" />
              <PrizeLevel level={7} condition="前区4个 + 后区0个" probability="1/39" prize="100 QAU" />
              <PrizeLevel level={8} condition="前区3个+后区1个 或 前区2个+后区2个" probability="1/17" prize="15 QAU" />
              <PrizeLevel level={9} condition="其他中奖组合" probability="1/7.2" prize="5 QAU" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* 开奖结果 */}
      {activeTab === 'results' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" /> 历史开奖结果
          </h2>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="animate-pulse p-4">
                  <div className="h-6 bg-gray-700 rounded mb-3" />
                  <div className="h-4 bg-gray-700 rounded mb-3" />
                  <div className="flex gap-2 mb-3">
                    {[...Array(7)].map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-gray-700 rounded-full" />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {drawResults.map((result, index) => (
                <motion.div
                  key={result.draw_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DrawResultCard result={result} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 我的投注 */}
      {activeTab === 'mybets' && (
        <Card className="text-center py-16">
          <CardContent>
            <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">暂无投注记录</h3>
            <p className="text-gray-400 mb-6">连接钱包后可查看您的投注历史</p>
            <Button variant="primary" onClick={() => setActiveTab('buy')}>
              立即投注
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 统计分析 */}
      {activeTab === 'stats' && statistics && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="总期数" value={statistics.total_draws.toLocaleString()} icon={Calendar} color="blue" />
            <StatCard title="总销售额" value={`${(statistics.total_sales / 1e9).toFixed(1)}B`} icon={DollarSign} color="green" />
            <StatCard title="总奖金" value={`${(statistics.total_prizes / 1e9).toFixed(1)}B`} icon={Gift} color="purple" />
            <StatCard title="总玩家" value={`${(statistics.total_players / 1e6).toFixed(1)}M`} icon={Users} color="orange" />
          </div>

          <Card>
            <CardHeader title="号码出现频率" icon={TrendingUp} iconColor="text-blue-400" />
            <CardContent>
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-3">前区号码 (01-35)</h4>
                <div className="grid grid-cols-7 gap-2">
                  {Object.entries(statistics.number_frequency.front_zone as Record<string, number>).map(([num, freq]) => (
                    <div key={num} className="text-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full flex items-center justify-center text-sm font-bold mb-1">
                        {num}
                      </div>
                      <div className="text-xs text-gray-400">{freq}次</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-3">后区号码 (01-12)</h4>
                <div className="grid grid-cols-6 gap-2">
                  {Object.entries(statistics.number_frequency.back_zone as Record<string, number>).map(([num, freq]) => (
                    <div key={num} className="text-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mb-1">
                        {num}
                      </div>
                      <div className="text-xs text-gray-400">{freq}次</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 量子安全说明 */}
      <Card className="mt-8 bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/20">
        <CardContent className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-blue-400" />
            <h3 className="text-xl font-bold text-white">量子安全保障</h3>
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            采用量子随机数生成器确保开奖结果的真随机性，使用后量子密码学技术保护所有投注和开奖过程
          </p>
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            <div className="text-center">
              <Zap className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
              <h4 className="font-bold text-white text-sm">量子随机数</h4>
            </div>
            <div className="text-center">
              <Shield className="w-10 h-10 text-blue-400 mx-auto mb-2" />
              <h4 className="font-bold text-white text-sm">量子加密</h4>
            </div>
            <div className="text-center">
              <Award className="w-10 h-10 text-green-400 mx-auto mb-2" />
              <h4 className="font-bold text-white text-sm">量子验证</h4>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default QuantumLotteryPage;

