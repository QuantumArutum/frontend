/**
 * 彩票当前期 API - 生产级安全实现
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse } from '@/lib/security/middleware';

export const GET = createSecureHandler(
  async (_request: NextRequest): Promise<NextResponse> => {
    const mockDraw = {
      draw_id: 'DRAW-2025-001',
      draw_number: '第2025001期',
      status: 'active',
      ticket_price: 2,
      estimated_jackpot: 125000000,
      total_bets: 45000000,
      draw_date: '2025-01-05',
      draw_time: '21:30',
      time_remaining: { days: 6, hours: 12, minutes: 30 }
    };

    return successResponse({
      data: mockDraw,
      timestamp: new Date().toISOString()
    });
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
