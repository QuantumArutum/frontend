'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  RefreshCw,
  Copy,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { PageLayout } from '@/components/ui/PageLayout';
import { Card, CardHeader, CardContent, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Table } from '@/components/ui/Table';
import { Loading } from '@/components/ui/Loading';
import { useTranslation } from 'react-i18next';
import '../../../i18n';

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
  const { t } = useTranslation();
  const [address, setAddress] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = useCallback(async () => {
    if (!searchAddress) return;

    if (!/^0x[a-fA-F0-9]{40}$/.test(searchAddress)) {
      setError(t('token_sale.orders.errors.invalid_address'));
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
        setError(data.error || t('token_sale.orders.errors.query_failed'));
      }
    } catch (err: unknown) {
      setError(
        t('token_sale.orders.errors.network_error') +
          ': ' +
          (err instanceof Error ? err.message : t('token_sale.orders.errors.unknown'))
      );
    } finally {
      setLoading(false);
    }
  }, [searchAddress, t]);

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
        return (
          <Badge variant="success">
            <CheckCircle className="w-3 h-3 mr-1" /> {t('token_sale.orders.status.completed')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="warning">
            <Clock className="w-3 h-3 mr-1" /> {t('token_sale.orders.status.pending')}
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="danger">
            <XCircle className="w-3 h-3 mr-1" /> {t('token_sale.orders.status.failed')}
          </Badge>
        );
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
      header: t('token_sale.orders.columns.order_id'),
      render: (_: unknown, order: Order) => (
        <span className="font-mono text-xs">{order.id.slice(0, 8)}...</span>
      ),
    },
    {
      key: 'amountUSD',
      header: t('token_sale.orders.columns.amount'),
      render: (_: unknown, order: Order) => (
        <span className="text-white font-medium">${order.amountUSD.toLocaleString()}</span>
      ),
    },
    {
      key: 'tokensTotal',
      header: t('token_sale.orders.columns.tokens'),
      render: (_: unknown, order: Order) => (
        <span className="text-yellow-400">{order.tokensTotal.toLocaleString()} QAU</span>
      ),
    },
    {
      key: 'paymentMethod',
      header: t('token_sale.orders.columns.payment_method'),
      render: (_: unknown, order: Order) => <Badge variant="default">{order.paymentMethod}</Badge>,
    },
    {
      key: 'status',
      header: t('token_sale.orders.columns.status'),
      render: (_: unknown, order: Order) => getStatusBadge(order.status),
    },
    {
      key: 'txHash',
      header: t('token_sale.orders.columns.tx_hash'),
      render: (_: unknown, order: Order) =>
        order.txHash ? (
          <div className="flex items-center gap-1">
            <span className="font-mono text-xs text-blue-400">{order.txHash.slice(0, 10)}...</span>
            <button
              onClick={() => copyToClipboard(order.txHash)}
              className="text-gray-400 hover:text-white"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <span className="text-gray-500">-</span>
        ),
    },
    {
      key: 'createdAt',
      header: t('token_sale.orders.columns.time'),
      render: (_: unknown, order: Order) => (
        <span className="text-gray-400 text-sm">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <PageLayout
      title={t('token_sale.orders.title')}
      subtitle={t('token_sale.orders.subtitle')}
      icon={ShoppingCart}
      headerContent={
        <Link href="/token-sale">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('token_sale.orders.back_to_buy')}
          </Button>
        </Link>
      }
    >
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Input
              placeholder={t('token_sale.orders.search_placeholder')}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 font-mono"
              icon={<Search className="w-4 h-4" />}
            />
            <Button variant="primary" onClick={handleSearch} disabled={loading}>
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                t('token_sale.orders.search')
              )}
            </Button>
          </div>
          {error && (
            <div className="mt-3 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
        </CardContent>
      </Card>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatCard
            title={t('token_sale.orders.stats.total_orders')}
            value={stats.totalOrders.toString()}
            icon={ShoppingCart}
            color="blue"
          />
          <StatCard
            title={t('token_sale.orders.stats.completed')}
            value={stats.completedOrders.toString()}
            icon={CheckCircle}
            color="green"
          />
          <StatCard
            title={t('token_sale.orders.stats.pending')}
            value={stats.pendingOrders.toString()}
            icon={Clock}
            color="orange"
          />
          <StatCard
            title={t('token_sale.orders.stats.total_spent')}
            value={`${stats.totalSpent.toLocaleString()}`}
            icon={ShoppingCart}
            color="purple"
          />
          <StatCard
            title={t('token_sale.orders.stats.total_tokens')}
            value={`${stats.totalTokens.toLocaleString()}`}
            icon={ShoppingCart}
            color="purple"
          />
        </div>
      )}

      {loading ? (
        <Loading text={t('token_sale.orders.loading')} />
      ) : orders.length > 0 ? (
        <Card>
          <CardHeader title={t('token_sale.orders.list_title')} />
          <CardContent>
            <Table columns={columns} data={orders} />
          </CardContent>
        </Card>
      ) : searchAddress ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('token_sale.orders.no_orders')}
            </h3>
            <p className="text-gray-400 mb-6">{t('token_sale.orders.no_orders_desc')}</p>
            <Link href="/token-sale">
              <Button variant="primary">{t('token_sale.orders.buy_now')}</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('token_sale.orders.enter_address')}
            </h3>
            <p className="text-gray-400">{t('token_sale.orders.enter_address_desc')}</p>
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}
