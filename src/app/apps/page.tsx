'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Button, Row, Col, Typography } from 'antd';
import { RocketOutlined, ShopOutlined, WalletOutlined } from '@ant-design/icons';
import ParticlesBackground from '../components/ParticlesBackground';
import EnhancedNavbar from '../components/EnhancedNavbar';
import EnhancedFooter from '../components/EnhancedFooter';
import { useTranslation } from 'react-i18next';
import '../../i18n';

const { Title, Paragraph } = Typography;

export default function AppsPage() {
  const { t } = useTranslation();
  
  const apps = [
    {
      id: 'travel',
      title: t('apps_page.apps.travel.title'),
      description: t('apps_page.apps.travel.description'),
      icon: <RocketOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      link: '/apps/travel',
      status: 'active'
    },
    {
      id: 'shop',
      title: t('apps_page.apps.mall.title'),
      description: t('apps_page.apps.mall.description'),
      icon: <ShopOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      link: '/apps/mall',
      status: 'coming_soon'
    },
    {
      id: 'pay',
      title: t('apps_page.apps.pay.title'),
      description: t('apps_page.apps.pay.description'),
      icon: <WalletOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
      link: '/apps/pay',
      status: 'coming_soon'
    }
  ];

  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <EnhancedNavbar />
      <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
      <div className="text-center mb-12">
        <Title level={1}>{t('apps_page.title')}</Title>
        <Paragraph className="text-lg text-gray-500">
          {t('apps_page.subtitle')}
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {apps.map(app => (
          <Col xs={24} sm={12} md={8} key={app.id}>
            <Card hoverable className="h-full">
              <div className="text-center mb-6">{app.icon}</div>
              <Title level={3} className="text-center mb-4">{app.title}</Title>
              <Paragraph className="text-center text-gray-500 mb-6 min-h-[60px]">
                {app.description}
              </Paragraph>
              <div className="text-center">
                <Link href={app.link}>
                  <Button type="primary" size="large" disabled={app.status !== 'active'}>
                    {app.status === 'active' ? t('apps_page.launch_app') : t('apps_page.coming_soon')}
                  </Button>
                </Link>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      </div>
      <EnhancedFooter />
    </div>
  );
}
