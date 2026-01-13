/**
 * 彩票开奖结果 API - 生产级安全实现
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse } from '@/lib/security/middleware';

const mockResults = [
  { 
    draw_id: 'DRAW-155', 
    draw_number: '第2024155期',
    draw_date: '2024-12-28',
    draw_time: '21:30',
    winning_numbers: { front_zone: [7, 14, 23, 31, 38], back_zone: [5, 12] },
    total_sales: 385000000,
    total_bets: 192500000,
    prize_pool: 650000000
  },
  { 
    draw_id: 'DRAW-154', 
    draw_number: '第2024154期',
    draw_date: '2024-12-25',
    draw_time: '21:30',
    winning_numbers: { front_zone: [3, 18, 22, 29, 36], back_zone: [8, 11] },
    total_sales: 320000000,
    total_bets: 160000000,
    prize_pool: 520000000
  },
  { 
    draw_id: 'DRAW-153', 
    draw_number: '第2024153期',
    draw_date: '2024-12-21',
    draw_time: '21:30',
    winning_numbers: { front_zone: [5, 11, 19, 27, 33], back_zone: [2, 9] },
    total_sales: 298000000,
    total_bets: 149000000,
    prize_pool: 480000000
  }
];

export const GET = createSecureHandler(
  async (_request: NextRequest): Promise<NextResponse> => {
    return successResponse({
      data: { results: mockResults },
      timestamp: new Date().toISOString()
    });
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
