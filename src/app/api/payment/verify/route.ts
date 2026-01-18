/**
 * 支付验证API
 *
 * 验证加密货币支付
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  createSecureHandler,
  successResponse,
  errorResponse,
  ValidationRule,
} from '@/lib/security/middleware';
import { SecurityLogger, SecurityEventType, getClientIP, getUserAgent } from '@/lib/security';
import { PaymentVerificationService } from '@/lib/payment/verification';
import { db } from '@/lib/database';

const validationRules: ValidationRule[] = [
  { field: 'purchaseId', type: 'string', required: true },
  { field: 'txHash', type: 'string', required: true },
];

export const POST = createSecureHandler(
  async (request: NextRequest, validatedData?: Record<string, unknown>): Promise<NextResponse> => {
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);

    try {
      const { purchaseId, txHash } = validatedData as { purchaseId: string; txHash: string };

      // 获取购买记录
      const purchase = await db.findPurchaseById(purchaseId);
      if (!purchase) {
        return errorResponse('购买记录不存在', 404);
      }

      if (purchase.paymentStatus === 'confirmed') {
        return errorResponse('支付已验证', 400);
      }

      // 验证支付 - 简化处理，直接使用购买记录中的信息
      const result = await PaymentVerificationService.verifyPayment(
        purchase.paymentMethod,
        txHash,
        purchase.amountUSD,
        purchase.buyerAddress
      );

      if (!result.verified) {
        SecurityLogger.log(
          SecurityEventType.PAYMENT_FAILED,
          'warning',
          { purchaseId, txHash, error: result.error },
          purchase.userId || undefined,
          ip,
          userAgent
        );

        return errorResponse(result.error || '支付验证失败', 400);
      }

      // 更新购买记录
      await db.updatePurchase(purchaseId, {
        paymentTxHash: txHash,
        paymentStatus: 'confirmed',
      });

      SecurityLogger.log(
        SecurityEventType.PAYMENT_VERIFIED,
        'info',
        { purchaseId, txHash, amount: result.amount, confirmations: result.confirmations },
        purchase.userId || undefined,
        ip,
        userAgent
      );

      return successResponse({
        verified: true,
        txHash,
        amount: result.amount,
        confirmations: result.confirmations,
        message: '支付验证成功！代币将在确认后发放',
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
      return errorResponse(
        '支付验证失败: ' + (error instanceof Error ? error.message : 'Unknown error'),
        500
      );
    }
  },
  { rateLimit: true, validateBody: validationRules, logRequest: true }
);
