/**
 * 2FA验证API
 *
 * 验证TOTP码并启用2FA
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  createSecureHandler,
  successResponse,
  errorResponse,
  ValidationRule,
} from '@/lib/security/middleware';
import { SecurityLogger, SecurityEventType, getClientIP, getUserAgent } from '@/lib/security';
import { TOTPService } from '@/lib/security/totp';
import { db } from '@/lib/database';

const validationRules: ValidationRule[] = [
  { field: 'userId', type: 'string', required: true },
  { field: 'token', type: 'string', required: true },
];

export const POST = createSecureHandler(
  async (request: NextRequest, validatedData?: Record<string, unknown>): Promise<NextResponse> => {
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);

    try {
      const { userId, token } = validatedData as { userId: string; token: string };

      // 验证token格式
      if (!token || token.length !== 6 || !/^\d{6}$/.test(token)) {
        return errorResponse('请输入6位数字验证码', 400);
      }

      // 获取用户
      const user = await db.findUserById(userId);
      if (!user) {
        return errorResponse('用户不存在', 404);
      }

      if (!user.totpSecret) {
        return errorResponse('请先设置2FA', 400);
      }

      // 验证TOTP码
      const isValid = TOTPService.verify(token, user.totpSecret);
      if (!isValid) {
        SecurityLogger.log(
          SecurityEventType.TWO_FACTOR_FAILED,
          'warning',
          { userId, reason: 'invalid_token' },
          userId,
          ip,
          userAgent
        );
        return errorResponse('验证码无效或已过期', 400);
      }

      // 如果是首次验证，启用2FA并生成备份码
      if (!user.totpEnabled) {
        const backupCodes = TOTPService.generateBackupCodes(10);

        await db.enableTOTP(userId, user.totpSecret);
        await db.saveBackupCodes(userId, backupCodes);

        SecurityLogger.log(
          SecurityEventType.TWO_FACTOR_ENABLED,
          'info',
          { userId },
          userId,
          ip,
          userAgent
        );

        return successResponse({
          enabled: true,
          backupCodes,
          message: '2FA已成功启用！请妥善保管备份码',
        });
      }

      // 已启用2FA，仅验证
      SecurityLogger.log(
        SecurityEventType.TWO_FACTOR_SUCCESS,
        'info',
        { userId },
        userId,
        ip,
        userAgent
      );

      return successResponse({
        verified: true,
        message: '验证成功',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      SecurityLogger.log(
        SecurityEventType.TWO_FACTOR_FAILED,
        'error',
        { error: errorMessage },
        undefined,
        ip,
        userAgent
      );
      return errorResponse('验证失败: ' + errorMessage, 500);
    }
  },
  { rateLimit: true, validateBody: validationRules, logRequest: true }
);
