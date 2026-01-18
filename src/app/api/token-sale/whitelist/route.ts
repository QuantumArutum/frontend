/**
 * 代币销售白名单API
 *
 * 管理私募/公募白名单
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  createSecureHandler,
  successResponse,
  errorResponse,
  ValidationRule,
} from '@/lib/security/middleware';
import { SecurityLogger, SecurityEventType, getClientIP, getUserAgent } from '@/lib/security';

// 白名单存储（生产环境应使用数据库）
const whitelist: Map<
  string,
  {
    address: string;
    tier: 'seed' | 'private' | 'public';
    maxAllocation: number;
    usedAllocation: number;
    addedAt: string;
    kycVerified: boolean;
  }
> = new Map();

// 初始化一些测试白名单
const initWhitelist = () => {
  if (whitelist.size === 0) {
    // 添加测试地址
    whitelist.set('0x742d35Cc6634C0532925a3b844Bc9e7595f5bE21'.toLowerCase(), {
      address: '0x742d35Cc6634C0532925a3b844Bc9e7595f5bE21',
      tier: 'public',
      maxAllocation: 100000,
      usedAllocation: 0,
      addedAt: new Date().toISOString(),
      kycVerified: true,
    });
  }
};
initWhitelist();

// GET: 检查白名单状态
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return errorResponse('请提供钱包地址', 400);
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return errorResponse('无效的钱包地址', 400);
    }

    const entry = whitelist.get(address.toLowerCase());

    if (!entry) {
      return successResponse({
        whitelisted: false,
        message: '该地址未在白名单中',
      });
    }

    const remainingAllocation = entry.maxAllocation - entry.usedAllocation;

    return successResponse({
      whitelisted: true,
      tier: entry.tier,
      maxAllocation: entry.maxAllocation,
      usedAllocation: entry.usedAllocation,
      remainingAllocation,
      kycVerified: entry.kycVerified,
      addedAt: entry.addedAt,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '未知错误';
    return errorResponse('查询白名单失败: ' + message, 500);
  }
}

// POST: 申请加入白名单
const applyValidationRules: ValidationRule[] = [
  { field: 'address', type: 'address', required: true },
  { field: 'email', type: 'email', required: true },
  { field: 'tier', type: 'string', required: true },
  { field: 'intendedAmount', type: 'number', required: true, min: 100 },
];

export const POST = createSecureHandler(
  async (request: NextRequest, validatedData?: Record<string, unknown>): Promise<NextResponse> => {
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);

    try {
      const { address, email, tier, intendedAmount, referralCode } = validatedData as {
        address: string;
        email: string;
        tier: string;
        intendedAmount: number;
        referralCode?: string;
      };

      // 验证tier
      if (!['seed', 'private', 'public'].includes(tier)) {
        return errorResponse('无效的销售轮次', 400);
      }

      // 检查是否已在白名单
      if (whitelist.has(address.toLowerCase())) {
        return errorResponse('该地址已在白名单中', 400);
      }

      // 根据tier设置最大配额
      const maxAllocations: Record<string, number> = {
        seed: 50000,
        private: 25000,
        public: 10000,
      };

      // 种子轮和私募轮需要KYC
      const requiresKYC = tier === 'seed' || tier === 'private';

      // 添加到白名单（待审核状态）
      const entry = {
        address,
        tier: tier as 'seed' | 'private' | 'public',
        maxAllocation: Math.min(intendedAmount, maxAllocations[tier]),
        usedAllocation: 0,
        addedAt: new Date().toISOString(),
        kycVerified: !requiresKYC, // 公募轮自动通过
        email,
        referralCode,
        status: requiresKYC ? 'pending_kyc' : 'approved',
      };

      // 公募轮直接加入白名单
      if (!requiresKYC) {
        whitelist.set(address.toLowerCase(), entry);
      }

      SecurityLogger.log(
        SecurityEventType.WHITELIST_APPLICATION,
        'info',
        { address, tier, intendedAmount, requiresKYC },
        undefined,
        ip,
        userAgent
      );

      return successResponse({
        success: true,
        message: requiresKYC ? '申请已提交，请完成KYC验证后等待审核' : '已成功加入白名单',
        requiresKYC,
        maxAllocation: entry.maxAllocation,
        tier,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '未知错误';
      return errorResponse('申请白名单失败: ' + message, 500);
    }
  },
  { rateLimit: true, validateBody: applyValidationRules, logRequest: true }
);
