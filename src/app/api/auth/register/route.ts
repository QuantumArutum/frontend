/**
 * 用户注册 API - 生产级实现
 */

import { NextRequest } from 'next/server';
import { 
  createSecureHandler, 
  ValidationRule,
  errorResponse,
  successResponse 
} from '@/lib/security/middleware';
import { 
  SecurityLogger, 
  SecurityEventType,
  InputValidator,
  getClientIP,
  getUserAgent 
} from '@/lib/security';
import { db } from '@/lib/database';

const registerValidationRules: ValidationRule[] = [
  { field: 'email', type: 'email', required: true },
  { field: 'password', type: 'string', required: true, min: 12, max: 128 },
  { field: 'confirmPassword', type: 'string', required: true },
  { field: 'walletAddress', type: 'address', required: false },
  { field: 'acceptTerms', type: 'boolean', required: true, custom: (v) => v === true },
];

export const POST = createSecureHandler(
  async (request: NextRequest, data?: Record<string, unknown>) => {
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);
    
    const email = (data?.email || '') as string;
    const password = (data?.password || '') as string;
    const confirmPassword = (data?.confirmPassword || '') as string;
    const walletAddress = data?.walletAddress as string | undefined;
    
    // 验证密码匹配
    if (password !== confirmPassword) {
      return errorResponse('两次输入的密码不一致', 400);
    }
    
    // 验证密码强度
    const passwordCheck = InputValidator.isStrongPassword(password);
    if (!passwordCheck.valid) {
      return errorResponse('密码强度不足: ' + passwordCheck.errors.join(', '), 400);
    }
    
    // 检查邮箱是否已注册
    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      SecurityLogger.log(
        SecurityEventType.SUSPICIOUS_ACTIVITY,
        'warning',
        { reason: 'Duplicate registration attempt', email },
        undefined,
        ip,
        userAgent
      );
      return errorResponse('该邮箱已被注册', 400);
    }
    
    try {
      // 创建用户 - 需要先对密码进行哈希处理
      const bcrypt = require('bcryptjs');
      const password_hash = await bcrypt.hash(password, 12);
      const uid = 'user_' + Date.now() + '_' + Math.random().toString(36).substring(7);
      
      const user = await db.createUser({
        uid,
        email,
        password_hash,
        role: 'user',
        level: 1,
        status: 'active',
        is_verified: false,
        profile_data: walletAddress ? { walletAddress } : {},
      });
      
      // 如果提供了钱包地址，更新用户
      if (walletAddress && user) {
        await db.updateUser(user.uid, { profile_data: { walletAddress } });
      }
      
      SecurityLogger.log(
        SecurityEventType.LOGIN_SUCCESS,
        'info',
        { userId: user?.uid || user?.id, email },
        user?.uid || user?.id,
        ip,
        userAgent
      );
      
      // 创建会话
      const session = await db.createSession(user?.uid || user?.id, ip, userAgent);
      
      return successResponse({
        message: '注册成功',
        user: {
          id: user?.uid || user?.id,
          email: user?.email,
          isVerified: user?.is_verified,
        },
        token: session.token,
      });
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      SecurityLogger.log(
        SecurityEventType.LOGIN_FAILED,
        'error',
        { error: errorMessage, email },
        undefined,
        ip,
        userAgent
      );
      
      return errorResponse('注册失败: ' + errorMessage, 500);
    }
  },
  {
    rateLimit: true,
    validateBody: registerValidationRules,
    allowedMethods: ['POST'],
  }
);
