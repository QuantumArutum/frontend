/**
 * 发送邮箱验证码 API
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/database';

// 验证码存储（生产环境应使用 Redis）
const verificationCodes = new Map<string, { code: string; expires: number; type: string }>();

// 速率限制
const rateLimits = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_HOUR = 5;

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function checkRateLimit(email: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const limit = rateLimits.get(email);
  
  if (!limit || now > limit.resetTime) {
    rateLimits.set(email, { count: 1, resetTime: now + 3600000 }); // 1小时
    return { allowed: true };
  }
  
  if (limit.count >= MAX_REQUESTS_PER_HOUR) {
    const retryAfter = Math.ceil((limit.resetTime - now) / 1000 / 60);
    return { allowed: false, retryAfter };
  }
  
  limit.count++;
  return { allowed: true };
}

export async function POST(request: NextRequest) {
  try {
    const { email, type } = await request.json();
    
    if (!email || !type) {
      return NextResponse.json({ success: false, message: '缺少必要参数' }, { status: 400 });
    }
    
    // 验证邮箱格式
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, message: '邮箱格式不正确' }, { status: 400 });
    }
    
    // 检查速率限制
    const rateCheck = checkRateLimit(email);
    if (!rateCheck.allowed) {
      return NextResponse.json({ 
        success: false, 
        message: `请求过于频繁，请 ${rateCheck.retryAfter} 分钟后再试` 
      }, { status: 429 });
    }
    
    // 如果是注册，检查邮箱是否已存在
    if (type === 'register' && sql) {
      const [existingUser] = await sql`SELECT id FROM users WHERE email = ${email}`;
      if (existingUser) {
        return NextResponse.json({ success: false, message: '该邮箱已被注册' }, { status: 400 });
      }
    }
    
    // 生成验证码
    const code = generateCode();
    const expires = Date.now() + 10 * 60 * 1000; // 10分钟有效期
    
    // 存储验证码
    verificationCodes.set(email, { code, expires, type });
    
    // 在生产环境中，这里应该发送真实的邮件
    // 目前仅在控制台输出验证码（开发模式）
    console.log(`[DEV] Verification code for ${email}: ${code}`);
    
    // TODO: 集成邮件服务（如 SendGrid, AWS SES, Resend 等）
    // await sendEmail({
    //   to: email,
    //   subject: 'Quantaureum 验证码',
    //   html: `您的验证码是: <strong>${code}</strong>，10分钟内有效。`
    // });
    
    return NextResponse.json({ 
      success: true, 
      message: '验证码已发送到您的邮箱',
      // 开发模式下返回验证码，生产环境应移除
      ...(process.env.NODE_ENV === 'development' && { devCode: code })
    });
    
  } catch (error: any) {
    console.error('Send code error:', error);
    return NextResponse.json({ success: false, message: '发送验证码失败' }, { status: 500 });
  }
}

// 验证验证码（供其他 API 调用）
export function verifyCode(email: string, code: string, type: string): boolean {
  const stored = verificationCodes.get(email);
  
  if (!stored) return false;
  if (stored.type !== type) return false;
  if (Date.now() > stored.expires) {
    verificationCodes.delete(email);
    return false;
  }
  if (stored.code !== code) return false;
  
  // 验证成功后删除验证码
  verificationCodes.delete(email);
  return true;
}

// 导出验证函数供注册 API 使用
export { verificationCodes };
