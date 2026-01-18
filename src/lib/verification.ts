/**
 * 验证码存储和验证工具
 * 使用数据库存储验证码，支持 Vercel serverless 环境
 */

import { sql } from './database';

export const MAX_REQUESTS_PER_HOUR = 5;

export function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 检查速率限制（使用数据库）
export async function checkRateLimitAsync(
  email: string
): Promise<{ allowed: boolean; retryAfter?: number }> {
  if (!sql) {
    return { allowed: true }; // 无数据库时跳过限制
  }

  try {
    const oneHourAgo = new Date(Date.now() - 3600000).toISOString();
    const result = await sql`
      SELECT COUNT(*) as count FROM verification_codes 
      WHERE email = ${email} AND created_at > ${oneHourAgo}
    `;

    const count = parseInt(result[0]?.count || '0');
    if (count >= MAX_REQUESTS_PER_HOUR) {
      return { allowed: false, retryAfter: 60 };
    }
    return { allowed: true };
  } catch {
    return { allowed: true };
  }
}

// 兼容旧接口
export function checkRateLimit(email: string): { allowed: boolean; retryAfter?: number } {
  return { allowed: true }; // 同步版本总是允许，实际限制在异步版本中
}

// 存储验证码到数据库
export async function storeCodeAsync(email: string, code: string, type: string): Promise<void> {
  if (!sql) {
    console.log(`[DEV] Store code for ${email}: ${code}`);
    return;
  }

  try {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10分钟

    // 删除旧验证码
    await sql`DELETE FROM verification_codes WHERE email = ${email} AND type = ${type}`;

    // 插入新验证码
    await sql`
      INSERT INTO verification_codes (email, code, type, expires_at, created_at)
      VALUES (${email}, ${code}, ${type}, ${expiresAt}, NOW())
    `;
  } catch (error) {
    console.error('Store code error:', error);
  }
}

// 兼容旧接口
export function storeCode(email: string, code: string, type: string): void {
  storeCodeAsync(email, code, type).catch(console.error);
}

// 验证验证码（数据库版本）
export async function verifyCodeAsync(
  email: string,
  code: string,
  type: string
): Promise<{ valid: boolean; message?: string }> {
  if (!sql) {
    return { valid: false, message: '数据库未配置' };
  }

  try {
    const result = await sql`
      SELECT code, expires_at FROM verification_codes 
      WHERE email = ${email} AND type = ${type}
      ORDER BY created_at DESC LIMIT 1
    `;

    if (!result || result.length === 0) {
      return { valid: false, message: '请先获取验证码' };
    }

    const stored = result[0];

    if (new Date() > new Date(stored.expires_at)) {
      await sql`DELETE FROM verification_codes WHERE email = ${email} AND type = ${type}`;
      return { valid: false, message: '验证码已过期，请重新获取' };
    }

    if (stored.code !== code) {
      return { valid: false, message: '验证码错误' };
    }

    return { valid: true };
  } catch (error) {
    console.error('Verify code error:', error);
    return { valid: false, message: '验证失败' };
  }
}

// 兼容旧接口（同步版本，不推荐使用）
export function verifyCode(
  email: string,
  code: string,
  type: string
): { valid: boolean; message?: string } {
  return { valid: false, message: '请使用 verifyCodeAsync' };
}

// 删除验证码
export async function deleteCodeAsync(email: string, type?: string): Promise<void> {
  if (!sql) return;

  try {
    if (type) {
      await sql`DELETE FROM verification_codes WHERE email = ${email} AND type = ${type}`;
    } else {
      await sql`DELETE FROM verification_codes WHERE email = ${email}`;
    }
  } catch (error) {
    console.error('Delete code error:', error);
  }
}

// 兼容旧接口
export function deleteCode(email: string): void {
  deleteCodeAsync(email).catch(console.error);
}
