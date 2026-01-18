'use client';
import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Table,
  Tabs,
  Statistic,
  Row,
  Col,
  message,
  Tag,
  Modal,
  Input,
  Typography,
} from 'antd';
import { BankOutlined, HistoryOutlined, WalletOutlined } from '@ant-design/icons';
import { barongAPI } from '@/api/client';
import ParticlesBackground from '../components/ParticlesBackground';
import EnhancedNavbar from '../components/EnhancedNavbar';
import EnhancedFooter from '../components/EnhancedFooter';
import { useTranslation } from 'react-i18next';

const { Title, Paragraph } = Typography;

export default function StakingPage() {
  const { t } = useTranslation();
  const [pools, setPools] = useState<any[]>([]);
  const [myStakes, setMyStakes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stakeModalVisible, setStakeModalVisible] = useState(false);
  const [selectedPool, setSelectedPool] = useState<any>(null);
  const [stakeAmount, setStakeAmount] = useState('');

  const fetchPools = async () => {
    try {
      const res = await barongAPI.get('/public/staking/pools');
      if (res.data.success) setPools(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyStakes = async () => {
    try {
      const res = await barongAPI.get('/market/staking/my-stakes');
      if (res.data.success) setMyStakes(res.data.data);
    } catch (err) {
      console.error(err);
      // Fail silently if not logged in
    }
  };

  useEffect(() => {
    fetchPools();
    fetchMyStakes();
  }, []);

  const handleStake = async () => {
    if (!stakeAmount || !selectedPool) return;
    try {
      const res = await barongAPI.post('/market/staking/stake', {
        pool_id: selectedPool.id,
        amount: Number(stakeAmount),
      });
      if (res.data.success) {
        message.success(t('staking_page.staked_success'));
        setStakeModalVisible(false);
        setStakeAmount('');
        fetchPools(); // Refresh total staked
        fetchMyStakes(); // Refresh my stakes
      } else {
        message.error(res.data.message);
      }
    } catch (err: any) {
      message.error(err.response?.data?.message || t('staking_page.staking_failed'));
    }
  };

  const openStakeModal = (pool: any) => {
    setSelectedPool(pool);
    setStakeModalVisible(true);
  };

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <EnhancedNavbar />
      <div className="relative z-10 container mx-auto px-4 py-12 pt-24">
        <div className="text-center mb-12">
          <Title level={1} className="text-white">
            {t('staking_page.title')}
          </Title>
          <Paragraph className="text-lg text-gray-400">{t('staking_page.subtitle')}</Paragraph>
        </div>

        <Title level={2} className="text-white mb-6">
          {t('staking_page.active_pools')}
        </Title>
        <Row gutter={[24, 24]}>
          {pools.map((pool) => (
            <Col xs={24} md={8} key={pool.id}>
              <Card className="bg-gray-900 border-gray-800 text-white h-full">
                <div className="flex justify-between items-center mb-4">
                  <Title level={3} className="text-white m-0">
                    {pool.token_id}
                  </Title>
                  <Tag color="green" className="text-lg py-1 px-3">
                    {pool.apy}% APY
                  </Tag>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-gray-400">
                    <span>{t('staking_page.duration')}</span>
                    <span className="text-white">
                      {pool.duration_days} {t('staking_page.days')}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>{t('staking_page.min_stake')}</span>
                    <span className="text-white">
                      {pool.min_stake} {pool.token_id}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>{t('staking_page.total_staked')}</span>
                    <span className="text-white">
                      {pool.total_staked} {pool.token_id}
                    </span>
                  </div>
                </div>
                <Button
                  type="primary"
                  block
                  size="large"
                  icon={<BankOutlined />}
                  onClick={() => openStakeModal(pool)}
                >
                  {t('staking_page.stake_now')}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

        {myStakes.length > 0 && (
          <div className="mt-16">
            <Title level={2} className="text-white mb-6">
              {t('staking_page.my_stakes')}
            </Title>
            <Card className="bg-gray-900 border-gray-800">
              <Row gutter={[16, 16]}>
                {myStakes.map((stake) => (
                  <Col span={24} key={stake.id}>
                    <div className="flex justify-between items-center p-4 bg-gray-800 rounded">
                      <div>
                        <div className="text-white font-bold text-lg">
                          {stake.amount} {stake.token_id}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {t('staking_page.unlocks')}:{' '}
                          {new Date(stake.unlock_date).toLocaleDateString()}
                        </div>
                      </div>
                      <Tag color="blue">{t('staking_page.active')}</Tag>
                    </div>
                  </Col>
                ))}
              </Row>
            </Card>
          </div>
        )}

        <Modal
          title={`${t('staking_page.stake')} ${selectedPool?.token_id}`}
          open={stakeModalVisible}
          onCancel={() => setStakeModalVisible(false)}
          onOk={handleStake}
          okText={t('staking_page.confirm_stake')}
          cancelText={t('staking_page.cancel')}
        >
          <p>
            {t('staking_page.available_balance')}: 10,000 {selectedPool?.token_id} (
            {t('staking_page.mock')})
          </p>
          <Input
            prefix={<WalletOutlined />}
            placeholder={t('staking_page.amount_placeholder')}
            value={stakeAmount}
            onChange={(e) => setStakeAmount(e.target.value)}
            type="number"
          />
          <div className="mt-4 text-gray-500 text-sm">
            {t('staking_page.lock_period')}: {selectedPool?.duration_days} {t('staking_page.days')}.{' '}
            {t('staking_page.early_withdrawal_warning')}
          </div>
        </Modal>
      </div>
      <EnhancedFooter />
    </div>
  );
}
