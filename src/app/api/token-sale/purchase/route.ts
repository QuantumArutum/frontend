/**
 * 代币销售 API - 生产级实现
 * 
 * 安全特性：
 * - 输入验证
 * - 速率限制
 * - 交易记录持久化
 * - 安全日志
 * - 错误处理
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  createSecureHandler, 
  ValidationRule,
  errorResponse,
  successResponse 
} from '@/lib/security/middleware';
import { 
  SecurityLogger, 
  SecurityEventType,
  InputValidator,
  getClientIP,
  getUserAgent 
} from '@/lib/security';
import { db } from '@/lib/database';

// ==================== 配置 ====================

const TOKEN_SALE_SERVER = process.env.TOKEN_SALE_SERVER || 'http://localhost:8560';
const MIN_PURCHASE_USD = 1;

// ==================== 验证规则 ====================

const purchaseValidationRules: ValidationRule[] = [
  { 
    field: 'buyerAddress', 
    type: 'address', 
    required: true 
  },
  { 
    field: 'amountUSD', 
    type: 'number', 
    required: true, 
    min: MIN_PURCHASE_USD
  },
  { 
    field: 'paymentMethod', 
    type: 'string', 
    required: false,
    custom: (v: unknown) => !v || (typeof v === 'string' && ['ETH', 'BTC', 'USDT', 'USDC'].includes(v))
  },
];

// ==================== POST: 购买代币 ====================

export const POST = createSecureHandler(
  async (request: NextRequest, validatedData?: Record<string, unknown>): Promise<NextResponse> => {
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);
    
    const { buyerAddress, amountUSD, paymentMethod = 'USDT' } = validatedData as {
      buyerAddress: string;
      amountUSD: number;
      paymentMethod?: string;
    };
    
    // 额外的地址验证
    if (!InputValidator.isValidAddress(buyerAddress)) {
      SecurityLogger.log(
        SecurityEventType.INVALID_INPUT,
        'warning',
        { reason: 'Invalid address format', address: buyerAddress },
        undefined,
        ip,
        userAgent
      );
      return errorResponse('无效的钱包地址格式', 400);
    }
    
    // 检查是否有未完成的购买
    const pendingPurchases = await db.findPurchasesByAddress(buyerAddress);
    const hasPending = pendingPurchases.some(p => p.status === 'pending');
    if (hasPending) {
      return errorResponse('您有未完成的购买订单，请等待处理完成', 400);
    }
    
    // 记录购买请求
    SecurityLogger.log(
      SecurityEventType.TRANSACTION_INITIATED,
      'info',
      { buyerAddress, amountUSD, paymentMethod },
      undefined,
      ip,
      userAgent
    );
    
    try {
      // 调用后端服务发送代币
      const response = await fetch(`${TOKEN_SALE_SERVER}/api/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerAddress, amountUSD }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || '后端服务错误');
      }
      
      const result = await response.json();
      
      if (!result.success || !result.data?.txHash) {
        throw new Error(result.error || '交易失败');
      }
      
      // 保存购买记录到数据库
      const purchase = await db.createPurchase({
        buyerAddress,
        amountUSD,
        tokensBase: result.data.tokensBase,
        tokensBonus: result.data.tokensBonus,
        tokensTotal: result.data.tokensReceived,
        txHash: result.data.txHash,
        paymentMethod,
        paymentStatus: 'pending',
      });
      
      await db.updatePurchase(purchase.id, {
        status: 'completed',
        txHash: result.data.txHash,
        completedAt: new Date().toISOString(),
      });
      
      // 记录成功
      SecurityLogger.log(
        SecurityEventType.TRANSACTION_COMPLETED,
        'info',
        { 
          purchaseId: purchase.id,
          txHash: result.data.txHash,
          tokensTotal: result.data.tokensReceived 
        },
        undefined,
        ip,
        userAgent
      );
      
      return successResponse({
        message: '购买成功！代币已发送到您的钱包',
        data: {
          purchaseId: purchase.id,
          txHash: result.data.txHash,
          tokensReceived: result.data.tokensReceived,
          tokensBase: result.data.tokensBase,
          tokensBonus: result.data.tokensBonus,
          buyerAddress,
          amountUSD,
        }
      });
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '未知错误';
      SecurityLogger.log(
        SecurityEventType.TRANSACTION_FAILED,
        'error',
        { error: message, buyerAddress, amountUSD },
        undefined,
        ip,
        userAgent
      );
      
      return errorResponse('购买失败: ' + message, 500);
    }
  },
  {
    rateLimit: true,
    validateBody: purchaseValidationRules,
    logRequest: true,
    allowedMethods: ['POST', 'GET'],
  }
);


// ==================== GET: 获取销售统计 ====================

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // 从后端获取实时数据
    const backendResponse = await fetch(`${TOKEN_SALE_SERVER}/api/stats`);
    let backendStats = null;
    
    if (backendResponse.ok) {
      backendStats = await backendResponse.json();
    }
    
    // 从数据库获取统计
    const dbStats = await db.getPurchaseStats();
    
    // 合并数据
    const stats = {
      // 后端数据（实时余额等）
      saleWallet: backendStats?.saleWallet || 'N/A',
      availableTokens: backendStats?.availableTokens || 0,
      currentPrice: backendStats?.currentPrice || 0.03,
      bonusPercent: backendStats?.bonusPercent || 15,
      
      // 数据库统计
      totalPurchases: dbStats.totalPurchases,
      totalRaised: dbStats.totalRaised,
      totalTokensSold: dbStats.totalTokensSold,
      completedPurchases: dbStats.completedPurchases,
      
      // 最近购买（暂不可用）
      recentPurchases: [],
    };
    
    return successResponse(stats);
    
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '未知错误';
    SecurityLogger.log(
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      'error',
      { error: message, endpoint: '/api/token-sale/purchase' },
      undefined,
      getClientIP(request),
      getUserAgent(request)
    );
    
    return errorResponse('获取统计数据失败', 500);
  }
}

// ==================== 辅助函数 ====================

function maskAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
