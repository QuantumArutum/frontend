/**
 * 验证码存储和验证工具
 */

// 验证码存储（生产环境应使用 Redis）
export const verificationCodes = new Map<string, { code: string; expires: number; type: string }>();

// 速率限制
export const rateLimits = new Map<string, { count: number; resetTime: number }>();
export const MAX_REQUESTS_PER_HOUR = 5;

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function checkRateLimit(email: string): { allowed: boolean; retryAfter?: number } {
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

// 验证验证码
export function verifyCode(email: string, code: string, type: string): { valid: boolean; message?: string } {
  const stored = verificationCodes.get(email);
  
  if (!stored) {
    return { valid: false, message: '请先获取验证码' };
  }
  if (stored.type !== type) {
    return { valid: false, message: '验证码类型错误' };
  }
  if (Date.now() > stored.expires) {
    verificationCodes.delete(email);
    return { valid: false, message: '验证码已过期，请重新获取' };
  }
  if (stored.code !== code) {
    return { valid: false, message: '验证码错误' };
  }
  
  return { valid: true };
}

// 删除验证码
export function deleteCode(email: string): void {
  verificationCodes.delete(email);
}

// 存储验证码
export function storeCode(email: string, code: string, type: string): void {
  const expires = Date.now() + 10 * 60 * 1000; // 10分钟有效期
  verificationCodes.set(email, { code, expires, type });
}
