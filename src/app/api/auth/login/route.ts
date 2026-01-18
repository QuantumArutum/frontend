/**
 * 用户登录 API - 生产级实现
 */

import { NextRequest } from 'next/server';
import {
  createSecureHandler,
  ValidationRule,
  errorResponse,
  successResponse,
} from '@/lib/security/middleware';
import { SecurityLogger, SecurityEventType, getClientIP, getUserAgent } from '@/lib/security';
import { db } from '@/lib/database';
import { generateToken } from '@/lib/auth';

const loginValidationRules: ValidationRule[] = [
  { field: 'email', type: 'email', required: true },
  { field: 'password', type: 'string', required: true, min: 1, max: 128 },
];

// 登录失败计数器（防止暴力破解）
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15分钟

export const POST = createSecureHandler(
  async (request: NextRequest, data?: Record<string, unknown>) => {
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);
    const email = (data?.email || '') as string;
    const password = (data?.password || '') as string;

    // 检查是否被锁定
    const attemptKey = `${ip}:${email}`;
    const attempts = loginAttempts.get(attemptKey);

    if (attempts && attempts.count >= MAX_LOGIN_ATTEMPTS) {
      const timeSinceLastAttempt = Date.now() - attempts.lastAttempt;
      if (timeSinceLastAttempt < LOCKOUT_DURATION) {
        const remainingTime = Math.ceil((LOCKOUT_DURATION - timeSinceLastAttempt) / 1000 / 60);

        SecurityLogger.log(
          SecurityEventType.RATE_LIMIT_EXCEEDED,
          'warning',
          { reason: 'Login lockout', email, remainingMinutes: remainingTime },
          undefined,
          ip,
          userAgent
        );

        return errorResponse(`登录尝试次数过多，请 ${remainingTime} 分钟后再试`, 429);
      } else {
        // 重置计数器
        loginAttempts.delete(attemptKey);
      }
    }

    try {
      // 验证用户凭据
      const user = await db.verifyUserPassword(email, password);

      if (!user) {
        // 记录失败尝试
        const currentAttempts = loginAttempts.get(attemptKey) || { count: 0, lastAttempt: 0 };
        loginAttempts.set(attemptKey, {
          count: currentAttempts.count + 1,
          lastAttempt: Date.now(),
        });

        SecurityLogger.log(
          SecurityEventType.LOGIN_FAILED,
          'warning',
          { email, attemptCount: currentAttempts.count + 1 },
          undefined,
          ip,
          userAgent
        );

        return errorResponse('邮箱或密码错误', 401);
      }

      // 检查账户状态
      if (!user.isActive) {
        return errorResponse('账户已被禁用，请联系客服', 403);
      }

      // 清除失败计数
      loginAttempts.delete(attemptKey);

      // 创建数据库会话（用于服务端验证）
      await db.createSession(user.id, ip, userAgent);

      // 生成 JWT token（用于 API 认证）
      const jwtToken = generateToken({
        uid: user.id,
        email: user.email,
        role: user.role || 'user',
      });

      SecurityLogger.log(
        SecurityEventType.LOGIN_SUCCESS,
        'info',
        { userId: user.id },
        user.id,
        ip,
        userAgent
      );

      // 生成显示名称：优先使用邮箱前缀
      const displayName = user.email.split('@')[0];

      return successResponse({
        message: '登录成功',
        user: {
          id: user.id,
          email: user.email,
          name: displayName, // 添加 name 字段用于社区显示
          walletAddress: user.walletAddress,
          isVerified: user.isVerified,
          kycStatus: user.kycStatus,
          role: user.role,
        },
        token: jwtToken,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
    } catch (error: unknown) {
      SecurityLogger.log(
        SecurityEventType.LOGIN_FAILED,
        'error',
        { error: error instanceof Error ? error.message : 'Unknown error', email },
        undefined,
        ip,
        userAgent
      );

      return errorResponse('登录失败', 500);
    }
  },
  {
    rateLimit: true,
    validateBody: loginValidationRules,
    allowedMethods: ['POST'],
  }
);
