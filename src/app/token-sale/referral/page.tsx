'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Gift,
  Copy,
  Share2,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Award,
  Link as LinkIcon,
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
  const { t } = useTranslation();
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
      setError(t('token_sale.referral.errors.invalid_address'));
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
        setError(data.error || t('token_sale.referral.errors.query_failed'));
      }
    } catch (err: unknown) {
      setError(t('token_sale.referral.errors.network_error') + ': ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [searchAddress, t]);

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
        setError(data.error || t('token_sale.referral.errors.create_failed'));
      }
    } catch (err: unknown) {
      setError(t('token_sale.referral.errors.network_error') + ': ' + (err as Error).message);
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
        return (
          <Badge variant="warning">
            <Award className="w-3 h-3 mr-1" /> {t('token_sale.referral.tiers.ambassador')}
          </Badge>
        );
      case 'vip':
        return (
          <Badge variant="info">
            <TrendingUp className="w-3 h-3 mr-1" /> VIP
          </Badge>
        );
      default:
        return <Badge variant="default">{t('token_sale.referral.tiers.standard')}</Badge>;
    }
  };

  const columns = [
    {
      key: 'refereeAddress',
      header: t('token_sale.referral.columns.referee'),
      render: (_: unknown, record: ReferralRecord) => (
        <span className="font-mono text-sm">{record.refereeAddress}</span>
      ),
    },
    {
      key: 'purchaseAmount',
      header: t('token_sale.referral.columns.purchase_amount'),
      render: (_: unknown, record: ReferralRecord) => (
        <span className="text-white">${record.purchaseAmount.toLocaleString()}</span>
      ),
    },
    {
      key: 'commission',
      header: t('token_sale.referral.columns.commission'),
      render: (_: unknown, record: ReferralRecord) => (
        <span className="text-green-400">${record.commission.toFixed(2)}</span>
      ),
    },
    {
      key: 'status',
      header: t('token_sale.referral.columns.status'),
      render: (_: unknown, record: ReferralRecord) =>
        record.status === 'paid' ? (
          <Badge variant="success">{t('token_sale.referral.status.paid')}</Badge>
        ) : (
          <Badge variant="warning">{t('token_sale.referral.status.pending')}</Badge>
        ),
    },
    {
      key: 'createdAt',
      header: t('token_sale.referral.columns.time'),
      render: (_: unknown, record: ReferralRecord) => (
        <span className="text-gray-400 text-sm">
          {new Date(record.createdAt).toLocaleDateString()}
        </span>
      ),
    },
  ];

  return (
    <PageLayout
      title={t('token_sale.referral.title')}
      subtitle={t('token_sale.referral.subtitle')}
      icon={Gift}
      headerContent={
        <Link href="/token-sale">
          <Button variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('token_sale.referral.back_to_buy')}
          </Button>
        </Link>
      }
    >
      <Card className="mb-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-500/30">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            {t('token_sale.referral.program_title')}
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">5%</div>
              <div className="text-gray-400 text-sm">
                {t('token_sale.referral.commission_rates.standard')}
              </div>
              <div className="text-gray-500 text-xs mt-1">
                {t('token_sale.referral.commission_rates.standard_desc')}
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-blue-500/30">
              <div className="text-3xl font-bold text-blue-400 mb-1">7%</div>
              <div className="text-gray-400 text-sm">
                {t('token_sale.referral.commission_rates.vip')}
              </div>
              <div className="text-gray-500 text-xs mt-1">
                {t('token_sale.referral.commission_rates.vip_desc')}
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-yellow-500/30">
              <div className="text-3xl font-bold text-yellow-400 mb-1">10%</div>
              <div className="text-gray-400 text-sm">
                {t('token_sale.referral.commission_rates.ambassador')}
              </div>
              <div className="text-gray-500 text-xs mt-1">
                {t('token_sale.referral.commission_rates.ambassador_desc')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Input
              placeholder={t('token_sale.referral.search_placeholder')}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 font-mono"
            />
            <Button variant="primary" onClick={handleSearch} disabled={loading}>
              {t('token_sale.referral.search')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Loading text={t('token_sale.referral.loading')} />
      ) : searchAddress ? (
        <>
          <Card className="mb-6">
            <CardHeader
              title={t('token_sale.referral.your_code')}
              icon={LinkIcon}
              iconColor="text-purple-400"
            />
            <CardContent>
              {referralCode ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">
                            {t('token_sale.referral.code_label')}
                          </p>
                          <p className="text-2xl font-bold text-yellow-400 font-mono">
                            {referralCode}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm mb-1">
                            {t('token_sale.referral.tier_label')}
                          </p>
                          {getTierBadge(tier)}
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm mb-1">
                        {t('token_sale.referral.rate_label')}
                      </p>
                      <p className="text-3xl font-bold text-green-400">{commissionRate}%</p>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                    <p className="text-gray-400 text-sm mb-2">
                      {t('token_sale.referral.share_link')}
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-blue-400 text-sm break-all">{shareLink}</code>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(shareLink)}>
                        {copied ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      className="flex-1"
                      onClick={() => copyToClipboard(shareLink)}
                    >
                      <Copy className="w-4 h-4 mr-2" /> {t('token_sale.referral.copy_link')}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() =>
                        window.open(
                          `https://twitter.com/intent/tweet?text=${encodeURIComponent(t('token_sale.referral.share_text'))}${shareLink}`,
                          '_blank'
                        )
                      }
                    >
                      <Share2 className="w-4 h-4 mr-2" /> {t('token_sale.referral.share_twitter')}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎁</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {t('token_sale.referral.no_code')}
                  </h3>
                  <p className="text-gray-400 mb-6">{t('token_sale.referral.no_code_desc')}</p>
                  <Button
                    variant="primary"
                    onClick={handleCreateCode}
                    disabled={creating}
                    loading={creating}
                  >
                    <Gift className="w-4 h-4 mr-2" /> {t('token_sale.referral.generate_code')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                title={t('token_sale.referral.stats.total_referrals')}
                value={stats.totalReferrals.toString()}
                icon={Users}
                color="blue"
              />
              <StatCard
                title={t('token_sale.referral.stats.total_earnings')}
                value={`${stats.totalEarnings.toFixed(2)}`}
                icon={DollarSign}
                color="green"
              />
              <StatCard
                title={t('token_sale.referral.stats.pending')}
                value={`${stats.pendingEarnings.toFixed(2)}`}
                icon={Gift}
                color="orange"
              />
              <StatCard
                title={t('token_sale.referral.stats.paid')}
                value={`${stats.paidEarnings.toFixed(2)}`}
                icon={CheckCircle}
                color="purple"
              />
            </div>
          )}

          {records.length > 0 && (
            <Card>
              <CardHeader title={t('token_sale.referral.records_title')} />
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
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('token_sale.referral.enter_address')}
            </h3>
            <p className="text-gray-400">{t('token_sale.referral.enter_address_desc')}</p>
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
