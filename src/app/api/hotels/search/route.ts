/**
 * 酒店搜索 API - 生产级安全实现
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse } from '@/lib/security/middleware';

const mockHotels = [
  {
    id: 'HT001',
    name: '量子大酒店',
    star_rating: 5,
    location: { city: '上海', district: '浦东新区', address: '陆家嘴金融中心' },
    price_per_night: 888,
    currency: 'QAU',
    rating: 4.8,
    reviews_count: 2560,
    amenities: ['免费WiFi', '游泳池', '健身房', '餐厅', 'SPA'],
    image: '/placeholder-hotel.svg',
    rooms_available: 15
  },
  {
    id: 'HT002',
    name: '星际商务酒店',
    star_rating: 4,
    location: { city: '上海', district: '静安区', address: '南京西路商圈' },
    price_per_night: 568,
    currency: 'QAU',
    rating: 4.5,
    reviews_count: 1890,
    amenities: ['免费WiFi', '健身房', '餐厅', '会议室'],
    image: '/placeholder-hotel.svg',
    rooms_available: 28
  },
  {
    id: 'HT003',
    name: '未来精品酒店',
    star_rating: 4,
    location: { city: '上海', district: '徐汇区', address: '徐家汇商圈' },
    price_per_night: 428,
    currency: 'QAU',
    rating: 4.6,
    reviews_count: 1250,
    amenities: ['免费WiFi', '餐厅', '停车场'],
    image: '/placeholder-hotel.svg',
    rooms_available: 42
  }
];

export const GET = createSecureHandler(
  async (_request: NextRequest): Promise<NextResponse> => {
    return successResponse({
      data: mockHotels,
      total: mockHotels.length,
      timestamp: new Date().toISOString()
    });
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
