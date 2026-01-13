/**
 * KYC状态查询API
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse, errorResponse } from '@/lib/security/middleware';
import { KYCService } from '@/lib/kyc/service';
import { db } from '@/lib/database';

export const GET = createSecureHandler(
  async (request: NextRequest): Promise<NextResponse> => {
    try {
      const { searchParams } = new URL(request.url);
      const userId = searchParams.get('userId');

      if (!userId) {
        return errorResponse('缺少用户ID', 400);
      }

      // 获取用户
      const user = await db.findUserById(userId);
      if (!user) {
        return errorResponse('用户不存在', 404);
      }

      // 获取KYC文档 - 使用简化的方式
      const documents: Array<{
        id: string;
        documentType: string;
        status: string;
        rejectionReason?: string;
        createdAt: string;
        verifiedAt?: string;
        selfie?: string;
        documentBack?: string;
      }> = [];
      const latestDoc = documents[0];

      // 确定KYC级别
      let level: 'none' | 'basic' | 'standard' | 'advanced' = 'none';
      if (user.kycStatus === 'approved') {
        level = latestDoc?.selfie ? 'advanced' : 
                latestDoc?.documentBack ? 'standard' : 'basic';
      }

      const limits = KYCService.getLimits(level);

      return successResponse({
        status: user.kycStatus,
        level,
        limits,
        documents: documents.map(d => ({
          id: d.id,
          documentType: d.documentType,
          status: d.status,
          rejectionReason: d.rejectionReason,
          submittedAt: d.createdAt,
          verifiedAt: d.verifiedAt,
        })),
        supportedCountries: KYCService.getSupportedCountries(),
      });

    } catch (error: unknown) {
      return errorResponse('获取KYC状态失败: ' + (error instanceof Error ? error.message : 'Unknown error'), 500);
    }
  },
  { rateLimit: true, logRequest: true }
);
