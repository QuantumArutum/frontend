/**
 * 创建支付请求API
 * 
 * 生成支付地址和金额
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse, errorResponse, ValidationRule } from '@/lib/security/middleware';
import { SecurityLogger, SecurityEventType, getClientIP, getUserAgent } from '@/lib/security';
import { PaymentVerificationService } from '@/lib/payment/verification';
import { KYCService } from '@/lib/kyc/service';
import { db } from '@/lib/database';

const validationRules: ValidationRule[] = [
  { field: 'buyerAddress', type: 'address', required: true },
  { field: 'amountUSD', type: 'number', required: true, min: 100, max: 100000 },
  { field: 'currency', type: 'string', required: true },
];

export const POST = createSecureHandler(
  async (request: NextRequest, validatedData?: Record<string, unknown>): Promise<NextResponse> => {
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);

    try {
      const { buyerAddress, amountUSD, currency, userId } = validatedData as {
        buyerAddress: string;
        amountUSD: number;
        currency: string;
        userId?: string;
      };

      // 验证支付方式
      if (!['ETH', 'BTC', 'USDT', 'USDC'].includes(currency)) {
        return errorResponse('不支持的支付方式', 400);
      }

      // 如果有用户ID，检查KYC限额
      if (userId) {
        const user = await db.findUserById(userId);
        if (user) {
          const kycLevel = user.kycStatus === 'approved' ? 'standard' : 'basic';
          const limitCheck = await KYCService.checkTransactionLimit(userId, amountUSD, kycLevel);
          
          if (!limitCheck.allowed) {
            return errorResponse(limitCheck.reason || '超出交易限额', 400);
          }
        }
      }

      // 计算代币数量
      const tokenPrice = 0.03; // $0.03 per QAU
      const bonusPercent = 15;
      const tokensBase = amountUSD / tokenPrice;
      const tokensBonus = tokensBase * (bonusPercent / 100);
      const tokensTotal = tokensBase + tokensBonus;

      // 创建购买记录
      const purchase = await db.createPurchase({
        userId: userId || undefined,
        buyerAddress,
        amountUSD,
        tokensBase,
        tokensBonus,
        tokensTotal,
        txHash: '',
        paymentMethod: currency,
        paymentStatus: 'pending',
      });

      // 创建支付请求
      const paymentRequest = await PaymentVerificationService.createPaymentRequest({
        purchaseId: purchase.id,
        amount: amountUSD,
        currency: currency as 'ETH' | 'BTC' | 'USDT' | 'USDC',
        buyerAddress,
      });

      SecurityLogger.log(
        SecurityEventType.PAYMENT_INITIATED,
        'info',
        { purchaseId: purchase.id, amountUSD, currency, buyerAddress },
        userId,
        ip,
        userAgent
      );

      return successResponse({
        purchaseId: purchase.id,
        paymentAddress: paymentRequest.paymentAddress,
        expectedAmount: paymentRequest.expectedAmount,
        currency,
        expiresAt: paymentRequest.expiresAt,
        tokensToReceive: {
          base: tokensBase,
          bonus: tokensBonus,
          total: tokensTotal,
        },
        message: `请发送 ${paymentRequest.expectedAmount} ${currency} 到指定地址`,
      });

    } catch (error: unknown) {
      SecurityLogger.log(
        SecurityEventType.PAYMENT_FAILED,
        'error',
        { error: error instanceof Error ? error.message : 'Unknown error' },
        undefined,
        ip,
        userAgent
      );
      return errorResponse('创建支付请求失败: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
    }
  },
  { rateLimit: true, validateBody: validationRules, logRequest: true }
);
