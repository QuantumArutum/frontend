'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Gift, Copy, Share2, CheckCircle, DollarSign, 
  TrendingUp, Award, Link as LinkIcon, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';
import { PageLayout } from '@/components/ui/PageLayout';
import { Card, CardHeader, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Loading } from '@/components/ui/Loading';

interface ReferralStats {
  totalReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  paidEarnings: number;
}

interface ReferralRecord {
  id: string;
  refereeAddress: string;
  purchaseAmount: number;
  commission: number;
  status: string;
  createdAt: string;
}

export default function ReferralPage() {
  const [address, setAddress] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [tier, setTier] = useState('standard');
  const [commissionRate, setCommissionRate] = useState(5);
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [records, setRecords] = useState<ReferralRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchReferralInfo = useCallback(async () => {
    if (!searchAddress) return;
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(searchAddress)) {
      setError('请输入有效的钱包地址');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/token-sale/referral?address=${searchAddress}`);
      const data = await response.json();

      if (data.success) {
        setReferralCode(data.data.code || '');
        setTier(data.data.tier || 'standard');
        setCommissionRate(data.data.commissionRate || 5);
        setStats(data.data.stats || null);
        setRecords(data.data.recentReferrals || []);
      } else {
        setError(data.error || '查询失败');
      }
    } catch (err: unknown) {
      setError('网络错误: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [searchAddress]);

  const handleSearch = () => {
    setSearchAddress(address);
  };

  const handleCreateCode = async () => {
    if (!searchAddress) return;

    setCreating(true);
    setError('');

    try {
      const response = await fetch('/api/token-sale/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: searchAddress }),
      });
      const data = await response.json();

      if (data.success) {
        setReferralCode(data.data.code);
        setTier(data.data.tier);
        setCommissionRate(data.data.commissionRate);
      } else {
        setError(data.error || '创建失败');
      }
    } catch (err: unknown) {
      setError('网络错误: ' + (err as Error).message);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    if (searchAddress) {
      fetchReferralInfo();
    }
  }, [searchAddress, fetchReferralInfo]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = referralCode ? `https://quantaureum.io/token-sale?ref=${referralCode}` : '';

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'ambassador':
        return <Badge variant="warning"><Award className="w-3 h-3 mr-1" /> 大使</Badge>;
      case 'vip':
        return <Badge variant="info"><TrendingUp className="w-3 h-3 mr-1" /> VIP</Badge>;
      default:
        return <Badge variant="default">标准</Badge>;
    }
  };

  const columns = [
    {
      key: 'refereeAddress',
      header: '被推荐人',
      render: (_: unknown, record: ReferralRecord) => (
        <span className="font-mono text-sm">{record.refereeAddress}</span>
      ),
    },
    {
      key: 'purchaseAmount',
      header: '购买金额',
      render: (_: unknown, record: ReferralRecord) => (
        <span className="text-white">${record.purchaseAmount.toLocaleString()}</span>
      ),
    },
    {
      key: 'commission',
      header: '佣金',
      render: (_: unknown, record: ReferralRecord) => (
        <span className="text-green-400">${record.commission.toFixed(2)}</span>
      ),
    },
    {
      key: 'status',
      header: '状态',
      render: (_: unknown, record: ReferralRecord) => (
        record.status === 'paid' 
          ? <Badge variant="success">已支付</Badge>
          : <Badge variant="warning">待支付</Badge>
      ),
    },
    {
      key: 'createdAt',
      header: '时间',
      render: (_: unknown, record: ReferralRecord) => (
        <span className="text-gray-400 text-sm">
          {new Date(record.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <PageLayout
      title="推荐奖励"
      subtitle="邀请好友购买代币，获得丰厚佣金"
      icon={Gift}
      headerContent={
        <Link href="/token-sale">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" /> 返回购买
          </Button>
        </Link>
      }
    >
      {/* 佣金说明 */}
      <Card className="mb-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">推荐奖励计划</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">5%</div>
              <div className="text-gray-400 text-sm">标准佣金</div>
              <div className="text-gray-500 text-xs mt-1">所有用户</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-blue-500/30">
              <div className="text-3xl font-bold text-blue-400 mb-1">7%</div>
              <div className="text-gray-400 text-sm">VIP佣金</div>
              <div className="text-gray-500 text-xs mt-1">推荐满$5,000</div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-yellow-500/30">
              <div className="text-3xl font-bold text-yellow-400 mb-1">10%</div>
              <div className="text-gray-400 text-sm">大使佣金</div>
              <div className="text-gray-500 text-xs mt-1">推荐满$10,000</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 搜索框 */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Input
              placeholder="输入您的钱包地址 (0x...)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 font-mono"
            />
            <Button variant="primary" onClick={handleSearch} disabled={loading}>
              查询
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Loading text="加载中..." />
      ) : searchAddress ? (
        <>
          {/* 推荐码卡片 */}
          <Card className="mb-6">
            <CardHeader title="您的推荐码" icon={LinkIcon} iconColor="text-purple-400" />
            <CardContent>
              {referralCode ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">推荐码</p>
                          <p className="text-2xl font-bold text-yellow-400 font-mono">{referralCode}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm mb-1">等级</p>
                          {getTierBadge(tier)}
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm mb-1">佣金比例</p>
                      <p className="text-3xl font-bold text-green-400">{commissionRate}%</p>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <p className="text-gray-400 text-sm mb-2">分享链接</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-blue-400 text-sm break-all">{shareLink}</code>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => copyToClipboard(shareLink)}
                      >
                        {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="primary" 
                      className="flex-1"
                      onClick={() => copyToClipboard(shareLink)}
                    >
                      <Copy className="w-4 h-4 mr-2" /> 复制链接
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => window.open(`https://twitter.com/intent/tweet?text=使用我的推荐码购买QAU代币，享受额外优惠！${shareLink}`, '_blank')}
                    >
                      <Share2 className="w-4 h-4 mr-2" /> 分享到Twitter
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎁</div>
                  <h3 className="text-xl font-semibold text-white mb-2">还没有推荐码</h3>
                  <p className="text-gray-400 mb-6">开始邀请好友，赚取佣金吧！</p>
                  <Button 
                    variant="primary" 
                    onClick={handleCreateCode}
                    disabled={creating}
                    loading={creating}
                  >
                    <Gift className="w-4 h-4 mr-2" /> 生成推荐码
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 统计卡片 */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard title="总推荐" value={stats.totalReferrals.toString()} icon={Users} color="blue" />
              <StatCard title="总收益" value={`$${stats.totalEarnings.toFixed(2)}`} icon={DollarSign} color="green" />
              <StatCard title="待支付" value={`$${stats.pendingEarnings.toFixed(2)}`} icon={Gift} color="orange" />
              <StatCard title="已支付" value={`$${stats.paidEarnings.toFixed(2)}`} icon={CheckCircle} color="purple" />
            </div>
          )}

          {/* 推荐记录 */}
          {records.length > 0 && (
            <Card>
              <CardHeader title="推荐记录" />
              <CardContent>
                <Table columns={columns} data={records} />
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">输入钱包地址</h3>
            <p className="text-gray-400">请在上方输入您的钱包地址查看推荐信息</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-500/30 rounded-xl text-red-400">
          {error}
        </div>
      )}
    </PageLayout>
  );
}
