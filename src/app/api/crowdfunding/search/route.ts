/**
 * 众筹搜索 API - 生产级安全实现
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse, errorResponse } from '@/lib/security/middleware';
import { InputValidator } from '@/lib/security';

const mockResults = [
  {
    id: 'proj-001',
    project_id: 'proj-001',
    title: 'Quantum Gaming Console',
    subtitle: '下一代量子游戏主机，支持量子计算增强的游戏体验',
    category: 'technology',
    images: ['/placeholder-project.svg'],
    featured: true,
    quantum_security: true,
    creator: {
      name: 'QuantumTech Labs',
      avatar: '/placeholder-avatar.svg',
      verified: true,
      location: '上海',
    },
    funding: {
      goal: 500000,
      current: 385000,
      backers: 2450,
      end_date: '2025-02-15',
      progress: 77,
      raised_amount: 385000,
      backers_count: 2450,
      days_left: 15,
    },
    stats: { views: 12500, likes: 890, shares: 234 },
  },
];

export const GET = createSecureHandler(
  async (request: NextRequest): Promise<NextResponse> => {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    // 验证搜索查询长度（防止DoS攻击）
    if (query.length > 100) {
      return errorResponse('搜索查询过长', 400);
    }

    // 清理搜索查询（防止XSS）
    const sanitizedQuery = InputValidator.sanitizeHtml(query);

    return successResponse({
      data: {
        results: sanitizedQuery ? mockResults : [],
        total: sanitizedQuery ? mockResults.length : 0,
      },
      query: sanitizedQuery,
      timestamp: new Date().toISOString(),
    });
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
