/**
 * 认证中间件
 *
 * 提供：
 * - Token 验证
 * - 用户会话管理
 * - 权限检查
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, User, Session } from '../database';
import { SecurityLogger, SecurityEventType, getClientIP, getUserAgent } from './index';
import { errorResponse } from './middleware';

// ==================== 认证上下文 ====================

export interface AuthContext {
  user: User;
  session: Session;
}

// ==================== 认证验证 ====================

export async function validateAuth(request: NextRequest): Promise<AuthContext | null> {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  try {
    // 查找会话
    const session = (await db.findSessionByToken(token)) as Session | null;
    if (!session) {
      return null;
    }

    // 查找用户
    const user = (await db.findUserById(session.userId)) as User | null;
    if (!user || !user.isActive) {
      return null;
    }

    return { user, session };
  } catch (error) {
    return null;
  }
}

// ==================== 需要认证的处理器包装 ====================

export function withAuth(
  handler: (request: NextRequest, auth: AuthContext) => Promise<NextResponse>,
  options?: { requireVerified?: boolean; requireKYC?: boolean; requireAdmin?: boolean }
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);

    const auth = await validateAuth(request);

    if (!auth) {
      SecurityLogger.log(
        SecurityEventType.UNAUTHORIZED_ACCESS,
        'warning',
        { path: new URL(request.url).pathname },
        undefined,
        ip,
        userAgent
      );
      return errorResponse('未授权访问', 401);
    }

    // 检查邮箱验证
    if (options?.requireVerified && !auth.user.isVerified) {
      return errorResponse('请先验证您的邮箱', 403);
    }

    // 检查 KYC
    if (options?.requireKYC && auth.user.kycStatus !== 'approved') {
      return errorResponse('请先完成身份验证 (KYC)', 403);
    }

    // 检查管理员权限
    if (options?.requireAdmin && auth.user.role !== 'admin') {
      SecurityLogger.log(
        SecurityEventType.UNAUTHORIZED_ACCESS,
        'warning',
        { path: new URL(request.url).pathname, reason: 'Admin required' },
        auth.user.id,
        ip,
        userAgent
      );
      return errorResponse('需要管理员权限', 403);
    }

    return handler(request, auth);
  };
}

// ==================== 获取当前用户 ====================

export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  const auth = await validateAuth(request);
  return auth?.user || null;
}

// ==================== 导出 ====================

export default {
  validateAuth,
  withAuth,
  getCurrentUser,
};
