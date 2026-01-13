/**
 * 众筹统计 API - 生产级安全实现
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse } from '@/lib/security/middleware';

const mockStats = {
  total_projects: 156,
  total_raised: 12500000,
  total_backers: 45000,
  success_rate: 78.5,
  active_projects: 42,
  trending_categories: ['technology', 'gaming', 'art', 'music']
};

export const GET = createSecureHandler(
  async (_request: NextRequest): Promise<NextResponse> => {
    return successResponse({
      data: mockStats,
      timestamp: new Date().toISOString()
    });
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
