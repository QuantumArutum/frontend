/**
 * 禁用2FA API
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  createSecureHandler,
  successResponse,
  errorResponse,
  ValidationRule,
} from '@/lib/security/middleware';
import {
  SecurityLogger,
  SecurityEventType,
  getClientIP,
  getUserAgent,
  CryptoUtils,
} from '@/lib/security';
import { TOTPService } from '@/lib/security/totp';
import { db } from '@/lib/database';

const validationRules: ValidationRule[] = [
  { field: 'userId', type: 'string', required: true },
  { field: 'token', type: 'string', required: true },
  { field: 'password', type: 'string', required: true },
];

export const POST = createSecureHandler(
  async (request: NextRequest, validatedData?: Record<string, unknown>): Promise<NextResponse> => {
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);

    try {
      const { userId, token, password } = (validatedData || {}) as {
        userId: string;
        token: string;
        password: string;
      };

      // 获取用户
      const user = await db.findUserById(userId);
      if (!user) {
        return errorResponse('用户不存在', 404);
      }

      if (!user.totpEnabled) {
        return errorResponse('2FA未启用', 400);
      }

      // 验证密码
      const passwordValid = await CryptoUtils.verifyPassword(password, user.passwordHash);
      if (!passwordValid) {
        SecurityLogger.log(
          SecurityEventType.TWO_FACTOR_FAILED,
          'warning',
          { userId, reason: 'invalid_password' },
          userId,
          ip,
          userAgent
        );
        return errorResponse('密码错误', 401);
      }

      // 验证TOTP码或备份码
      let tokenValid = false;

      if (/^\d{6}$/.test(token)) {
        // TOTP码
        tokenValid = TOTPService.verify(token, user.totpSecret!);
      } else {
        // 备份码
        tokenValid = await db.verifyBackupCode(userId, token);
      }

      if (!tokenValid) {
        SecurityLogger.log(
          SecurityEventType.TWO_FACTOR_FAILED,
          'warning',
          { userId, reason: 'invalid_token' },
          userId,
          ip,
          userAgent
        );
        return errorResponse('验证码无效', 400);
      }

      // 禁用2FA
      await db.disableTOTP(userId);

      SecurityLogger.log(
        SecurityEventType.TWO_FACTOR_DISABLED,
        'info',
        { userId },
        userId,
        ip,
        userAgent
      );

      return successResponse({
        disabled: true,
        message: '2FA已成功禁用',
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
      return errorResponse('禁用2FA失败: ' + errorMessage, 500);
    }
  },
  { rateLimit: true, validateBody: validationRules, logRequest: true }
);
