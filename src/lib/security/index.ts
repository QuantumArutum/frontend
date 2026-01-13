/**
 * Quantaureum 生产级安全模块
 * 
 * 提供全面的安全功能：
 * - 输入验证和清理
 * - CSRF 保护
 * - 速率限制
 * - 加密工具
 * - 安全日志
 */

import crypto from 'crypto';

// ==================== 配置 ====================

export const SecurityConfig = {
  // 速率限制配置
  rateLimit: {
    windowMs: 60 * 1000, // 1分钟窗口
    maxRequests: 100,    // 每窗口最大请求数
    blockDuration: 15 * 60 * 1000, // 封禁15分钟
  },
  
  // CSRF 配置
  csrf: {
    tokenLength: 32,
    cookieName: '_csrf',
    headerName: 'x-csrf-token',
  },
  
  // 会话配置
  session: {
    maxAge: 24 * 60 * 60 * 1000, // 24小时
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict' as const,
  },
  
  // 密码策略
  password: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: true,
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90天
  },
};

// ==================== 输入验证 ====================

export class InputValidator {
  // 验证以太坊地址
  static isValidAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
  
  // 验证交易哈希
  static isValidTxHash(hash: string): boolean {
    return /^0x[a-fA-F0-9]{64}$/.test(hash);
  }
  
  // 验证邮箱
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }
  
  // 验证密码强度
  static isStrongPassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    const { minLength, requireUppercase, requireLowercase, requireNumbers, requireSpecial } = SecurityConfig.password;
    
    if (password.length < minLength) errors.push(`密码至少需要 ${minLength} 个字符`);
    if (requireUppercase && !/[A-Z]/.test(password)) errors.push('需要包含大写字母');
    if (requireLowercase && !/[a-z]/.test(password)) errors.push('需要包含小写字母');
    if (requireNumbers && !/\d/.test(password)) errors.push('需要包含数字');
    if (requireSpecial && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('需要包含特殊字符');
    
    return { valid: errors.length === 0, errors };
  }
  
  // 清理 HTML 防止 XSS
  static sanitizeHtml(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  // 验证数字范围
  static isValidNumber(value: number, min: number, max: number): boolean {
    return !isNaN(value) && isFinite(value) && value >= min && value <= max;
  }
  
  // 验证 URL
  static isValidUrl(url: string): boolean {
    try {
      const parsed = new URL(url);
      return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
      return false;
    }
  }
}


// ==================== 速率限制 ====================

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  blocked: boolean;
  blockedUntil?: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export class RateLimiter {
  static check(identifier: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const { windowMs, maxRequests, blockDuration } = SecurityConfig.rateLimit;
    
    let entry = rateLimitStore.get(identifier);
    
    // 检查是否被封禁
    if (entry?.blocked && entry.blockedUntil && entry.blockedUntil > now) {
      return { allowed: false, retryAfter: Math.ceil((entry.blockedUntil - now) / 1000) };
    }
    
    // 重置过期的窗口
    if (!entry || now - entry.firstRequest > windowMs) {
      entry = { count: 0, firstRequest: now, blocked: false };
    }
    
    entry.count++;
    
    // 检查是否超过限制
    if (entry.count > maxRequests) {
      entry.blocked = true;
      entry.blockedUntil = now + blockDuration;
      rateLimitStore.set(identifier, entry);
      return { allowed: false, retryAfter: Math.ceil(blockDuration / 1000) };
    }
    
    rateLimitStore.set(identifier, entry);
    return { allowed: true };
  }
  
  static reset(identifier: string): void {
    rateLimitStore.delete(identifier);
  }
  
  // 清理过期条目
  static cleanup(): void {
    const now = Date.now();
    const { windowMs } = SecurityConfig.rateLimit;
    
    for (const [key, entry] of rateLimitStore.entries()) {
      if (now - entry.firstRequest > windowMs && !entry.blocked) {
        rateLimitStore.delete(key);
      }
      if (entry.blockedUntil && entry.blockedUntil < now) {
        rateLimitStore.delete(key);
      }
    }
  }
}

// 定期清理
if (typeof setInterval !== 'undefined') {
  setInterval(() => RateLimiter.cleanup(), 60000);
}

// ==================== CSRF 保护 ====================

export class CSRFProtection {
  static generateToken(): string {
    return crypto.randomBytes(SecurityConfig.csrf.tokenLength).toString('hex');
  }
  
  static validateToken(token: string, storedToken: string): boolean {
    if (!token || !storedToken) return false;
    // 使用时间安全的比较防止时序攻击
    return crypto.timingSafeEqual(
      Buffer.from(token),
      Buffer.from(storedToken)
    );
  }
}

// ==================== 加密工具 ====================

export class CryptoUtils {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly IV_LENGTH = 16;
  private static readonly AUTH_TAG_LENGTH = 16;
  
  // 加密数据
  static encrypt(data: string, key: string): string {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const keyBuffer = crypto.scryptSync(key, 'salt', 32);
    const cipher = crypto.createCipheriv(this.ALGORITHM, keyBuffer, iv);
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
  }
  
  // 解密数据
  static decrypt(encryptedData: string, key: string): string {
    const parts = encryptedData.split(':');
    if (parts.length !== 3) throw new Error('Invalid encrypted data format');
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const keyBuffer = crypto.scryptSync(key, 'salt', 32);
    const decipher = crypto.createDecipheriv(this.ALGORITHM, keyBuffer, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }
  
  // 哈希密码
  static async hashPassword(password: string): Promise<string> {
    const salt = crypto.randomBytes(16).toString('hex');
    return new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(salt + ':' + derivedKey.toString('hex'));
      });
    });
  }
  
  // 验证密码
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    const [salt, key] = hash.split(':');
    return new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(crypto.timingSafeEqual(Buffer.from(key, 'hex'), derivedKey));
      });
    });
  }
  
  // 生成安全随机字符串
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }
}


// ==================== 安全日志 ====================

export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  CSRF_VIOLATION = 'CSRF_VIOLATION',
  INVALID_INPUT = 'INVALID_INPUT',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  TRANSACTION_INITIATED = 'TRANSACTION_INITIATED',
  TRANSACTION_COMPLETED = 'TRANSACTION_COMPLETED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  // 2FA事件
  TWO_FACTOR_SETUP = 'TWO_FACTOR_SETUP',
  TWO_FACTOR_ENABLED = 'TWO_FACTOR_ENABLED',
  TWO_FACTOR_DISABLED = 'TWO_FACTOR_DISABLED',
  TWO_FACTOR_SUCCESS = 'TWO_FACTOR_SUCCESS',
  TWO_FACTOR_FAILED = 'TWO_FACTOR_FAILED',
  // KYC事件
  KYC_SUBMITTED = 'KYC_SUBMITTED',
  KYC_APPROVED = 'KYC_APPROVED',
  KYC_REJECTED = 'KYC_REJECTED',
  // 支付事件
  PAYMENT_INITIATED = 'PAYMENT_INITIATED',
  PAYMENT_VERIFIED = 'PAYMENT_VERIFIED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  // 白名单事件
  WHITELIST_APPLICATION = 'WHITELIST_APPLICATION',
  WHITELIST_APPROVED = 'WHITELIST_APPROVED',
  WHITELIST_REJECTED = 'WHITELIST_REJECTED',
  // 推荐事件
  REFERRAL_CODE_CREATED = 'REFERRAL_CODE_CREATED',
  REFERRAL_REWARD_EARNED = 'REFERRAL_REWARD_EARNED',
  REFERRAL_REWARD_PAID = 'REFERRAL_REWARD_PAID',
}

interface SecurityLogEntry {
  timestamp: string;
  eventType: SecurityEventType;
  userId?: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, unknown>;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export class SecurityLogger {
  private static logs: SecurityLogEntry[] = [];
  private static readonly MAX_LOGS = 10000;
  
  static log(
    eventType: SecurityEventType,
    severity: SecurityLogEntry['severity'],
    details?: Record<string, unknown>,
    userId?: string,
    ip?: string,
    userAgent?: string
  ): void {
    const entry: SecurityLogEntry = {
      timestamp: new Date().toISOString(),
      eventType,
      severity,
      details: this.sanitizeDetails(details),
      userId,
      ip: this.maskIP(ip),
      userAgent,
    };
    
    this.logs.push(entry);
    
    // 保持日志大小在限制内
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(-this.MAX_LOGS);
    }
    
    // 在生产环境中，这里应该发送到日志服务
    if (severity === 'critical' || severity === 'error') {
      console.error('[SECURITY]', JSON.stringify(entry));
    } else if (process.env.NODE_ENV !== 'production') {
      console.log('[SECURITY]', JSON.stringify(entry));
    }
  }
  
  // 清理敏感信息
  private static sanitizeDetails(details?: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!details) return undefined;
    
    const sensitiveKeys = ['password', 'privateKey', 'secret', 'token', 'apiKey'];
    const sanitized = { ...details };
    
    for (const key of Object.keys(sanitized)) {
      if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
        sanitized[key] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }
  
  // 部分隐藏 IP 地址
  private static maskIP(ip?: string): string | undefined {
    if (!ip) return undefined;
    const parts = ip.split('.');
    if (parts.length === 4) {
      return `${parts[0]}.${parts[1]}.xxx.xxx`;
    }
    return ip.substring(0, ip.length / 2) + '...';
  }
  
  static getRecentLogs(count: number = 100): SecurityLogEntry[] {
    return this.logs.slice(-count);
  }
  
  static getLogsByType(eventType: SecurityEventType): SecurityLogEntry[] {
    return this.logs.filter(log => log.eventType === eventType);
  }
}

// ==================== 安全中间件辅助函数 ====================

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }
  return 'unknown';
}

export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown';
}

// ==================== 导出 ====================

export default {
  SecurityConfig,
  InputValidator,
  RateLimiter,
  CSRFProtection,
  CryptoUtils,
  SecurityLogger,
  SecurityEventType,
  getClientIP,
  getUserAgent,
};
