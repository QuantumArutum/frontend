/**
 * 公共事业服务商 API - 生产级安全实现
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse } from '@/lib/security/middleware';

const mockProviders = [
  {
    id: 'UP001',
    name: '国家电网',
    type: 'electricity',
    icon: '⚡',
    regions: ['全国'],
    payment_methods: ['QAU', '银行卡', '支付宝'],
    min_payment: 10,
    service_fee: 0
  },
  {
    id: 'UP002',
    name: '中国燃气',
    type: 'gas',
    icon: '🔥',
    regions: ['全国'],
    payment_methods: ['QAU', '银行卡', '微信'],
    min_payment: 20,
    service_fee: 0
  },
  {
    id: 'UP003',
    name: '自来水公司',
    type: 'water',
    icon: '💧',
    regions: ['上海', '北京', '广州', '深圳'],
    payment_methods: ['QAU', '银行卡'],
    min_payment: 5,
    service_fee: 0
  },
  {
    id: 'UP004',
    name: '中国移动',
    type: 'mobile',
    icon: '📱',
    regions: ['全国'],
    payment_methods: ['QAU', '银行卡', '支付宝', '微信'],
    min_payment: 10,
    service_fee: 0
  },
  {
    id: 'UP005',
    name: '中国联通',
    type: 'mobile',
    icon: '📱',
    regions: ['全国'],
    payment_methods: ['QAU', '银行卡', '支付宝', '微信'],
    min_payment: 10,
    service_fee: 0
  }
];

export const GET = createSecureHandler(
  async (_request: NextRequest): Promise<NextResponse> => {
    return successResponse({
      data: mockProviders,
      total: mockProviders.length,
      timestamp: new Date().toISOString()
    });
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
