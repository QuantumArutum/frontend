/**
 * 用户登出 API - 生产级实现
 */

import { NextRequest } from 'next/server';
import { createSecureHandler, errorResponse, successResponse } from '@/lib/security/middleware';
import { SecurityLogger, SecurityEventType, getClientIP, getUserAgent } from '@/lib/security';
import { db } from '@/lib/database';

export const POST = createSecureHandler(
  async (request: NextRequest) => {
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);

    // 从请求头获取 token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return errorResponse('未提供认证令牌', 401);
    }

    try {
      // 查找会话
      const session = await db.findSessionByToken(token);

      if (!session) {
        return errorResponse('无效的会话', 401);
      }

      // 使会话失效
      await db.invalidateSession(session.id);

      SecurityLogger.log(
        SecurityEventType.LOGOUT,
        'info',
        { sessionId: session.id },
        session.userId,
        ip,
        userAgent
      );

      return successResponse({ message: '已成功登出' });
    } catch (_error: unknown) {
      return errorResponse('登出失败', 500);
    }
  },
  {
    rateLimit: true,
    allowedMethods: ['POST'],
  }
);
