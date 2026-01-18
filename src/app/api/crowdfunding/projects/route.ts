/**
 * 众筹项目 API - 生产级安全实现
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse, errorResponse } from '@/lib/security/middleware';

const mockProjects = [
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
  {
    id: 'proj-002',
    project_id: 'proj-002',
    title: 'AI Art Generator',
    subtitle: '基于量子AI的艺术创作平台',
    category: 'art',
    images: ['/placeholder-project.svg'],
    featured: true,
    quantum_security: true,
    creator: {
      name: 'Creative AI Studio',
      avatar: '/placeholder-avatar.svg',
      verified: true,
      location: '北京',
    },
    funding: {
      goal: 100000,
      current: 125000,
      backers: 890,
      end_date: '2025-01-20',
      progress: 125,
      raised_amount: 125000,
      backers_count: 890,
      days_left: 8,
    },
    stats: { views: 8900, likes: 560, shares: 178 },
  },
  {
    id: 'proj-003',
    project_id: 'proj-003',
    title: 'Decentralized Music Platform',
    subtitle: '去中心化音乐发行和版税分配平台',
    category: 'music',
    images: ['/placeholder-project.svg'],
    featured: false,
    quantum_security: true,
    creator: {
      name: 'SoundChain',
      avatar: '/placeholder-avatar.svg',
      verified: true,
      location: '深圳',
    },
    funding: {
      goal: 250000,
      current: 180000,
      backers: 1560,
      end_date: '2025-02-28',
      progress: 72,
      raised_amount: 180000,
      backers_count: 1560,
      days_left: 22,
    },
    stats: { views: 6700, likes: 420, shares: 156 },
  },
  {
    id: 'proj-004',
    project_id: 'proj-004',
    title: 'Smart Home Hub',
    subtitle: '量子加密的智能家居控制中心',
    category: 'technology',
    images: ['/placeholder-project.svg'],
    featured: false,
    quantum_security: true,
    creator: {
      name: 'HomeQ',
      avatar: '/placeholder-avatar.svg',
      verified: false,
      location: '杭州',
    },
    funding: {
      goal: 150000,
      current: 95000,
      backers: 720,
      end_date: '2025-03-15',
      progress: 63,
      raised_amount: 95000,
      backers_count: 720,
      days_left: 30,
    },
    stats: { views: 4500, likes: 280, shares: 89 },
  },
  {
    id: 'proj-005',
    project_id: 'proj-005',
    title: 'VR Education Platform',
    subtitle: '沉浸式VR教育体验平台',
    category: 'technology',
    images: ['/placeholder-project.svg'],
    featured: true,
    quantum_security: false,
    creator: {
      name: 'EduVerse',
      avatar: '/placeholder-avatar.svg',
      verified: true,
      location: '广州',
    },
    funding: {
      goal: 300000,
      current: 210000,
      backers: 1890,
      end_date: '2025-02-10',
      progress: 70,
      raised_amount: 210000,
      backers_count: 1890,
      days_left: 18,
    },
    stats: { views: 9800, likes: 670, shares: 245 },
  },
  {
    id: 'proj-006',
    project_id: 'proj-006',
    title: 'Blockchain Gaming NFTs',
    subtitle: '游戏内资产NFT交易平台',
    category: 'games',
    images: ['/placeholder-project.svg'],
    featured: false,
    quantum_security: true,
    creator: {
      name: 'GameFi Labs',
      avatar: '/placeholder-avatar.svg',
      verified: true,
      location: '成都',
    },
    funding: {
      goal: 200000,
      current: 165000,
      backers: 1200,
      end_date: '2025-01-25',
      progress: 82,
      raised_amount: 165000,
      backers_count: 1200,
      days_left: 12,
    },
    stats: { views: 7600, likes: 510, shares: 198 },
  },
];

// 允许的分类列表
const ALLOWED_CATEGORIES = [
  'technology',
  'art',
  'music',
  'games',
  'film',
  'design',
  'food',
  'fashion',
];

export const GET = createSecureHandler(
  async (request: NextRequest): Promise<NextResponse> => {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || '';
    const limitStr = searchParams.get('limit') || '12';

    // 验证 limit 参数
    const limit = parseInt(limitStr);
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return errorResponse('limit 参数必须在 1-100 之间', 400);
    }

    // 验证 category 参数（防止注入）
    if (category && !ALLOWED_CATEGORIES.includes(category)) {
      return errorResponse('无效的分类参数', 400);
    }

    let filtered = mockProjects;
    if (category) {
      filtered = mockProjects.filter((p) => p.category === category);
    }

    return successResponse({
      data: {
        projects: filtered.slice(0, limit),
        total: filtered.length,
      },
      timestamp: new Date().toISOString(),
    });
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
