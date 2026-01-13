'use client';

import React from 'react';
import Link from 'next/link';
import { Card, Button, Row, Col, Typography } from 'antd';
import { RocketOutlined, ShopOutlined, WalletOutlined } from '@ant-design/icons';
import ParticlesBackground from '../components/ParticlesBackground';
import EnhancedNavbar from '../components/EnhancedNavbar';
import EnhancedFooter from '../components/EnhancedFooter';

const { Title, Paragraph } = Typography;

const apps = [
  {
    id: 'travel',
    title: 'Quantum Travel',
    description: 'Book flights and hotels with QAU/USDT. Zero fees, instant confirmation.',
    icon: <RocketOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
    link: '/apps/travel',
    status: 'active'
  },
  {
    id: 'shop',
    title: 'Quantum Mall',
    description: 'Shop for luxury goods using crypto. Global shipping.',
    icon: <ShopOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
    link: '/apps/mall',
    status: 'coming_soon'
  },
  {
    id: 'pay',
    title: 'Quantum Pay',
    description: 'Global payment gateway for merchants.',
    icon: <WalletOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
    link: '/apps/pay',
    status: 'coming_soon'
  }
];

export default function AppsPage() {
  return (
    <div className="min-h-screen relative">
      <ParticlesBackground />
      <EnhancedNavbar />
      <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
      <div className="text-center mb-12">
        <Title level={1}>Quantaureum Ecosystem</Title>
        <Paragraph className="text-lg text-gray-500">
          Discover decentralized applications powered by the Quantum Network.
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
                    {app.status === 'active' ? 'Launch App' : 'Coming Soon'}
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
