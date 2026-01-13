/**
 * 代币销售推荐奖励API
 * 
 * 推荐返佣机制
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse, errorResponse, ValidationRule } from '@/lib/security/middleware';
import { SecurityLogger, SecurityEventType, getClientIP, getUserAgent, CryptoUtils } from '@/lib/security';
import { db } from '@/lib/database';

// 推荐码存储（生产环境应使用数据库）
interface ReferralCode {
  code: string;
  ownerAddress: string;
  ownerEmail?: string;
  createdAt: string;
  totalReferrals: number;
  totalEarnings: number;
  tier: 'standard' | 'vip' | 'ambassador';
  commissionRate: number; // 百分比
}

interface ReferralRecord {
  id: string;
  referralCode: string;
  referrerAddress: string;
  refereeAddress: string;
  purchaseId: string;
  purchaseAmount: number;
  commission: number;
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
  paidAt?: string;
}

const referralCodes: Map<string, ReferralCode> = new Map();
const referralRecords: ReferralRecord[] = [];

// 佣金比例配置
const COMMISSION_RATES = {
  standard: 5,  // 5%
  vip: 7,       // 7%
  ambassador: 10, // 10%
};

// GET: 获取推荐信息
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const code = searchParams.get('code');

    // 验证推荐码
    if (code) {
      const referral = referralCodes.get(code.toUpperCase());
      if (!referral) {
        return successResponse({
          valid: false,
          message: '推荐码无效',
        });
      }

      return successResponse({
        valid: true,
        tier: referral.tier,
        discount: referral.tier === 'ambassador' ? 3 : referral.tier === 'vip' ? 2 : 1, // 额外折扣百分比
      });
    }

    // 获取用户推荐信息
    if (!address) {
      return errorResponse('请提供钱包地址或推荐码', 400);
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return errorResponse('无效的钱包地址', 400);
    }

    // 查找用户的推荐码
    let userCode: ReferralCode | undefined;
    for (const [, code] of referralCodes) {
      if (code.ownerAddress.toLowerCase() === address.toLowerCase()) {
        userCode = code;
        break;
      }
    }

    // 获取推荐记录
    const userRecords = referralRecords.filter(
      r => r.referrerAddress.toLowerCase() === address.toLowerCase()
    );

    const pendingEarnings = userRecords
      .filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + r.commission, 0);

    const paidEarnings = userRecords
      .filter(r => r.status === 'paid')
      .reduce((sum, r) => sum + r.commission, 0);

    return successResponse({
      hasCode: !!userCode,
      code: userCode?.code,
      tier: userCode?.tier || 'standard',
      commissionRate: userCode?.commissionRate || COMMISSION_RATES.standard,
      stats: {
        totalReferrals: userCode?.totalReferrals || 0,
        totalEarnings: userCode?.totalEarnings || 0,
        pendingEarnings,
        paidEarnings,
      },
      recentReferrals: userRecords.slice(0, 10).map(r => ({
        id: r.id,
        refereeAddress: maskAddress(r.refereeAddress),
        purchaseAmount: r.purchaseAmount,
        commission: r.commission,
        status: r.status,
        createdAt: r.createdAt,
      })),
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '未知错误';
    return errorResponse('获取推荐信息失败: ' + message, 500);
  }
}

// POST: 创建推荐码
const createCodeRules: ValidationRule[] = [
  { field: 'address', type: 'address', required: true },
  { field: 'email', type: 'email', required: false },
];

export const POST = createSecureHandler(
  async (request: NextRequest, validatedData?: Record<string, unknown>): Promise<NextResponse> => {
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);

    try {
      const { address, email } = validatedData as { address: string; email?: string };

      // 检查是否已有推荐码
      for (const [, code] of referralCodes) {
        if (code.ownerAddress.toLowerCase() === address.toLowerCase()) {
          return successResponse({
            success: true,
            code: code.code,
            message: '您已有推荐码',
            tier: code.tier,
            commissionRate: code.commissionRate,
          });
        }
      }

      // 生成唯一推荐码
      let newCode: string;
      do {
        newCode = generateReferralCode();
      } while (referralCodes.has(newCode));

      // 确定tier（可以根据用户购买历史等条件升级）
      const purchases = await db.findPurchasesByAddress(address);
      const totalPurchased = purchases
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amountUSD, 0);

      let tier: 'standard' | 'vip' | 'ambassador' = 'standard';
      if (totalPurchased >= 10000) tier = 'ambassador';
      else if (totalPurchased >= 5000) tier = 'vip';

      const referralCode: ReferralCode = {
        code: newCode,
        ownerAddress: address,
        ownerEmail: email,
        createdAt: new Date().toISOString(),
        totalReferrals: 0,
        totalEarnings: 0,
        tier,
        commissionRate: COMMISSION_RATES[tier],
      };

      referralCodes.set(newCode, referralCode);

      SecurityLogger.log(
        SecurityEventType.REFERRAL_CODE_CREATED,
        'info',
        { address, code: newCode, tier },
        undefined,
        ip,
        userAgent
      );

      return successResponse({
        success: true,
        code: newCode,
        tier,
        commissionRate: COMMISSION_RATES[tier],
        message: '推荐码创建成功',
        shareLink: `https://quantaureum.io/token-sale?ref=${newCode}`,
      });

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '未知错误';
      return errorResponse('创建推荐码失败: ' + message, 500);
    }
  },
  { rateLimit: true, validateBody: createCodeRules, logRequest: true }
);

// 辅助函数
function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'QAU';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function maskAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// 处理推荐奖励（供其他API调用）
// 注意：此函数不应从 route 文件导出，应该移到单独的服务文件中
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function processReferralReward(
  referralCode: string,
  refereeAddress: string,
  purchaseId: string,
  purchaseAmount: number
): Promise<{ success: boolean; commission?: number }> {
  const code = referralCodes.get(referralCode.toUpperCase());
  if (!code) {
    return { success: false };
  }

  // 不能自己推荐自己
  if (code.ownerAddress.toLowerCase() === refereeAddress.toLowerCase()) {
    return { success: false };
  }

  const commission = purchaseAmount * (code.commissionRate / 100);

  const record: ReferralRecord = {
    id: CryptoUtils.generateSecureToken(8),
    referralCode: code.code,
    referrerAddress: code.ownerAddress,
    refereeAddress,
    purchaseId,
    purchaseAmount,
    commission,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  referralRecords.push(record);

  // 更新推荐码统计
  code.totalReferrals++;
  code.totalEarnings += commission;

  return { success: true, commission };
}
