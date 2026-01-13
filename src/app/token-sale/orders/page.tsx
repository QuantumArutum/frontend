'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, Clock, CheckCircle, XCircle, AlertCircle, 
  Search, RefreshCw, ExternalLink, Copy, ArrowLeft 
} from 'lucide-react';
import Link from 'next/link';
import { PageLayout } from '@/components/ui/PageLayout';
import { Card, CardHeader, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Loading } from '@/components/ui/Loading';

interface Order {
  id: string;
  amountUSD: number;
  tokensTotal: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  txHash: string;
  createdAt: string;
}

interface OrderStats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalSpent: number;
  totalTokens: number;
}

export default function OrdersPage() {
  const [address, setAddress] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    if (!searchAddress) return;
    
    if (!/^0x[a-fA-F0-9]{40}$/.test(searchAddress)) {
      setError('请输入有效的钱包地址');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/token-sale/orders?address=${searchAddress}`);
      const data = await response.json();

      if (data.success) {
        setOrders(data.data.orders || []);
        setStats(data.data.stats || null);
      } else {
        setError(data.error || '查询失败');
      }
    } catch (err: unknown) {
      setError('网络错误: ' + (err instanceof Error ? err.message : '未知错误'));
    } finally {
      setLoading(false);
    }
  }, [searchAddress]);

  const handleSearch = () => {
    setSearchAddress(address);
  };

  useEffect(() => {
    if (searchAddress) {
      fetchOrders();
    }
  }, [searchAddress, fetchOrders]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" /> 已完成</Badge>;
      case 'pending':
        return <Badge variant="warning"><Clock className="w-3 h-3 mr-1" /> 处理中</Badge>;
      case 'failed':
        return <Badge variant="danger"><XCircle className="w-3 h-3 mr-1" /> 失败</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const columns = [
    {
      key: 'id',
      header: '订单ID',
      render: (_: unknown, order: Order) => (
        <span className="font-mono text-xs">{order.id.slice(0, 8)}...</span>
      ),
    },
    {
      key: 'amountUSD',
      header: '金额',
      render: (_: unknown, order: Order) => (
        <span className="text-white font-medium">${order.amountUSD.toLocaleString()}</span>
      ),
    },
    {
      key: 'tokensTotal',
      header: '代币数量',
      render: (_: unknown, order: Order) => (
        <span className="text-yellow-400">{order.tokensTotal.toLocaleString()} QAU</span>
      ),
    },
    {
      key: 'paymentMethod',
      header: '支付方式',
      render: (_: unknown, order: Order) => (
        <Badge variant="default">{order.paymentMethod}</Badge>
      ),
    },
    {
      key: 'status',
      header: '状态',
      render: (_: unknown, order: Order) => getStatusBadge(order.status),
    },
    {
      key: 'txHash',
      header: '交易哈希',
      render: (_: unknown, order: Order) => order.txHash ? (
        <div className="flex items-center gap-1">
          <span className="font-mono text-xs text-blue-400">
            {order.txHash.slice(0, 10)}...
          </span>
          <button onClick={() => copyToClipboard(order.txHash)} className="text-gray-400 hover:text-white">
            <Copy className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <span className="text-gray-500">-</span>
      ),
    },
    {
      key: 'createdAt',
      header: '时间',
      render: (_: unknown, order: Order) => (
        <span className="text-gray-400 text-sm">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <PageLayout
      title="购买记录"
      subtitle="查看您的代币购买历史"
      icon={ShoppingCart}
      headerContent={
        <Link href="/token-sale">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" /> 返回购买
          </Button>
        </Link>
      }
    >
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
              icon={<Search className="w-4 h-4" />}
            />
            <Button variant="primary" onClick={handleSearch} disabled={loading}>
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : '查询'}
            </Button>
          </div>
          {error && (
            <div className="mt-3 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 统计卡片 */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatCard title="总订单" value={stats.totalOrders.toString()} icon={ShoppingCart} color="blue" />
          <StatCard title="已完成" value={stats.completedOrders.toString()} icon={CheckCircle} color="green" />
          <StatCard title="处理中" value={stats.pendingOrders.toString()} icon={Clock} color="orange" />
          <StatCard title="总花费" value={`$${stats.totalSpent.toLocaleString()}`} icon={ShoppingCart} color="purple" />
          <StatCard title="总代币" value={`${stats.totalTokens.toLocaleString()}`} icon={ShoppingCart} color="purple" />
        </div>
      )}

      {/* 订单列表 */}
      {loading ? (
        <Loading text="加载订单中..." />
      ) : orders.length > 0 ? (
        <Card>
          <CardHeader title="订单列表" />
          <CardContent>
            <Table columns={columns} data={orders} />
          </CardContent>
        </Card>
      ) : searchAddress ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-white mb-2">暂无订单</h3>
            <p className="text-gray-400 mb-6">该地址还没有购买记录</p>
            <Link href="/token-sale">
              <Button variant="primary">立即购买</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">输入钱包地址</h3>
            <p className="text-gray-400">请在上方输入您的钱包地址查询购买记录</p>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}

