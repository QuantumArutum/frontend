/**
 * 2FA设置API
 * 
 * 生成TOTP密钥和二维码URI
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse, errorResponse } from '@/lib/security/middleware';
import { SecurityLogger, SecurityEventType, getClientIP, getUserAgent } from '@/lib/security';
import { TOTPService } from '@/lib/security/totp';
import { db } from '@/lib/database';

export const POST = createSecureHandler(
  async (request: NextRequest): Promise<NextResponse> => {
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);

    try {
      const body = await request.json();
      const { userId, email } = body;

      if (!userId || !email) {
        return errorResponse('缺少必要参数', 400);
      }

      // 验证用户存在
      const user = await db.findUserById(userId);
      if (!user) {
        return errorResponse('用户不存在', 404);
      }

      // 检查是否已启用2FA
      if (user.totpEnabled) {
        return errorResponse('2FA已启用，请先禁用后再重新设置', 400);
      }

      // 生成TOTP密钥
      const secret = TOTPService.generateSecret();
      const uri = TOTPService.generateURI(secret, email);

      // 临时保存密钥（未验证状态）
      await db.updateUser(userId, { totpSecret: secret });

      SecurityLogger.log(
        SecurityEventType.TWO_FACTOR_SETUP,
        'info',
        { userId, action: 'setup_initiated' },
        userId,
        ip,
        userAgent
      );

      return successResponse({
        secret,
        uri,
        message: '请使用身份验证器应用扫描二维码，然后输入验证码完成设置',
      });

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      SecurityLogger.log(
        SecurityEventType.TWO_FACTOR_SETUP,
        'error',
        { error: errorMessage },
        undefined,
        ip,
        userAgent
      );
      return errorResponse('设置2FA失败: ' + errorMessage, 500);
    }
  },
  { rateLimit: true, logRequest: true }
);
