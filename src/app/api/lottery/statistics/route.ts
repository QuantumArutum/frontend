/**
 * 彩票统计 API - 生产级安全实现
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse } from '@/lib/security/middleware';

const mockStats = {
  total_draws: 155,
  total_sales: 58500000000,
  total_prizes: 42000000000,
  total_players: 12500000,
  number_frequency: {
    front_zone: {
      '01': 45,
      '02': 38,
      '03': 52,
      '04': 41,
      '05': 48,
      '06': 39,
      '07': 55,
      '08': 42,
      '09': 36,
      '10': 44,
      '11': 50,
      '12': 37,
      '13': 43,
      '14': 51,
      '15': 40,
      '16': 46,
      '17': 35,
      '18': 49,
      '19': 47,
      '20': 38,
      '21': 42,
      '22': 53,
      '23': 45,
      '24': 39,
      '25': 41,
      '26': 44,
      '27': 48,
      '28': 36,
      '29': 50,
      '30': 43,
      '31': 47,
      '32': 40,
      '33': 46,
      '34': 38,
      '35': 42,
    },
    back_zone: {
      '01': 68,
      '02': 72,
      '03': 65,
      '04': 70,
      '05': 75,
      '06': 63,
      '07': 78,
      '08': 66,
      '09': 71,
      '10': 69,
      '11': 74,
      '12': 67,
    },
  },
};

export const GET = createSecureHandler(
  async (_request: NextRequest): Promise<NextResponse> => {
    return successResponse({
      data: mockStats,
      timestamp: new Date().toISOString(),
    });
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
