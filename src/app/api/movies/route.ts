/**
 * 电影列表 API - 生产级安全实现
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse } from '@/lib/security/middleware';

const mockMovies = [
  {
    id: 'MV001',
    title: '量子危机',
    original_title: 'Quantum Crisis',
    genre: ['科幻', '动作'],
    duration: 142,
    rating: 8.5,
    release_date: '2025-01-01',
    director: '张艺谋',
    cast: ['刘德华', '章子怡', '吴京'],
    synopsis: '在量子计算机被黑客入侵后，一位科学家必须阻止全球金融系统崩溃...',
    poster: '/placeholder-movie.svg',
    price: 45,
    currency: 'QAU',
  },
  {
    id: 'MV002',
    title: '星际迷航：新纪元',
    original_title: 'Star Trek: New Era',
    genre: ['科幻', '冒险'],
    duration: 156,
    rating: 8.8,
    release_date: '2024-12-25',
    director: '克里斯托弗·诺兰',
    cast: ['汤姆·汉克斯', '斯嘉丽·约翰逊'],
    synopsis: '人类首次接触外星文明，开启星际探索新篇章...',
    poster: '/placeholder-movie.svg',
    price: 55,
    currency: 'QAU',
  },
  {
    id: 'MV003',
    title: '区块链之王',
    original_title: 'Blockchain King',
    genre: ['剧情', '犯罪'],
    duration: 128,
    rating: 7.9,
    release_date: '2025-01-10',
    director: '大卫·芬奇',
    cast: ['莱昂纳多·迪卡普里奥', '马特·达蒙'],
    synopsis: '一个天才程序员如何创建了改变世界的加密货币...',
    poster: '/placeholder-movie.svg',
    price: 40,
    currency: 'QAU',
  },
];

export const GET = createSecureHandler(
  async (_request: NextRequest): Promise<NextResponse> => {
    return successResponse({
      data: mockMovies,
      total: mockMovies.length,
      timestamp: new Date().toISOString(),
    });
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
