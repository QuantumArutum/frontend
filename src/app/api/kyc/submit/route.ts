/**
 * KYC提交API
 * 
 * 处理KYC文档提交和验证
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse, errorResponse, ValidationRule } from '@/lib/security/middleware';
import { SecurityLogger, SecurityEventType, getClientIP, getUserAgent } from '@/lib/security';
import { KYCService } from '@/lib/kyc/service';
import { db } from '@/lib/database';

const validationRules: ValidationRule[] = [
  { field: 'userId', type: 'string', required: true },
  { field: 'documentType', type: 'string', required: true },
  { field: 'documentNumber', type: 'string', required: true },
  { field: 'firstName', type: 'string', required: true },
  { field: 'lastName', type: 'string', required: true },
  { field: 'dateOfBirth', type: 'string', required: true },
  { field: 'nationality', type: 'string', required: true },
];

export const POST = createSecureHandler(
  async (request: NextRequest, validatedData?: Record<string, unknown>): Promise<NextResponse> => {
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);

    try {
      const {
        userId,
        documentType,
        documentNumber,
        firstName,
        lastName,
        dateOfBirth,
        nationality,
        address,
        documentFront,
        documentBack,
        selfie,
      } = validatedData as {
        userId: string;
        documentType: string;
        documentNumber: string;
        firstName: string;
        lastName: string;
        dateOfBirth: string;
        nationality: string;
        address?: string;
        documentFront?: string;
        documentBack?: string;
        selfie?: string;
      };

      // 验证用户存在
      const user = await db.findUserById(userId);
      if (!user) {
        return errorResponse('用户不存在', 404);
      }

      // 检查是否已通过KYC
      if (user.kycStatus === 'approved') {
        return errorResponse('您已通过KYC验证', 400);
      }

      // 提交KYC验证
      const result = await KYCService.submitKYC({
        userId,
        documentType: documentType as 'id_card' | 'passport' | 'drivers_license',
        documentNumber,
        firstName,
        lastName,
        dateOfBirth,
        nationality,
        address: address ? JSON.parse(address) : undefined,
        documentFront,
        documentBack,
        selfie,
      });

      if (!result.success) {
        SecurityLogger.log(
          SecurityEventType.KYC_REJECTED,
          'warning',
          { userId, errors: result.errors, reason: result.rejectionReason },
          userId,
          ip,
          userAgent
        );

        return errorResponse(result.rejectionReason || result.errors?.join(', ') || 'KYC验证失败', 400);
      }

      // 更新用户KYC状态
      await db.updateUser(userId, {
        kycStatus: result.status === 'approved' ? 'approved' : 'none',
      });

      SecurityLogger.log(
        SecurityEventType.KYC_SUBMITTED,
        'info',
        { userId, verificationId: result.verificationId, level: result.level },
        userId,
        ip,
        userAgent
      );

      return successResponse({
        success: true,
        status: result.status,
        level: result.level,
        verificationId: result.verificationId,
        limits: KYCService.getLimits(result.level || 'basic'),
        message: result.status === 'approved' 
          ? 'KYC验证通过！' 
          : 'KYC已提交，正在审核中',
      });

    } catch (error: unknown) {
      SecurityLogger.log(
        SecurityEventType.KYC_REJECTED,
        'error',
        { error: error instanceof Error ? error.message : 'Unknown error' },
        undefined,
        ip,
        userAgent
      );
      return errorResponse('KYC提交失败: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
    }
  },
  { rateLimit: true, validateBody: validationRules, logRequest: true }
);
