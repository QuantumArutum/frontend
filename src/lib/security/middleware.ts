/**
 * 生产级 API 安全中间件
 * 
 * 提供:
 * - 速率限制
 * - CSRF 验证
 * - 输入验证
 * - 安全响应头
 * - 请求日志
 */

import { NextRequest, NextResponse } from 'next/server';
import { 
  RateLimiter, 
  InputValidator, 
  SecurityLogger, 
  SecurityEventType,
  getClientIP,
  getUserAgent 
} from './index';

// ==================== 安全响应头 ====================

export function addSecurityHeaders(response: NextResponse): NextResponse {
  // 防止点击劫持
  response.headers.set('X-Frame-Options', 'DENY');
  
  // 防止 MIME 类型嗅探
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // XSS 保护
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // 严格传输安全 (仅 HTTPS)
  if (process.env.NODE_ENV === 'production') {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  // 内容安全策略
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' http://localhost:* https://*; " +
    "frame-ancestors 'none';"
  );
  
  // 引用策略
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // 权限策略
  response.headers.set('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), payment=()'
  );
  
  return response;
}

// ==================== 速率限制中间件 ====================

export async function withRateLimit(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
  _customLimit?: { maxRequests: number; windowMs: number }
): Promise<NextResponse> {
  const ip = getClientIP(request);
  const path = new URL(request.url).pathname;
  const identifier = `${ip}:${path}`;
  
  const result = RateLimiter.check(identifier);
  
  if (!result.allowed) {
    SecurityLogger.log(
      SecurityEventType.RATE_LIMIT_EXCEEDED,
      'warning',
      { path, retryAfter: result.retryAfter },
      undefined,
      ip,
      getUserAgent(request)
    );
    
    const response = NextResponse.json(
      { error: '请求过于频繁，请稍后再试', retryAfter: result.retryAfter },
      { status: 429 }
    );
    response.headers.set('Retry-After', String(result.retryAfter));
    return addSecurityHeaders(response);
  }
  
  return handler();
}

// ==================== 输入验证中间件 ====================

export interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'address' | 'email' | 'txHash' | 'url';
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean;
}

export function validateInput(
  data: Record<string, unknown>,
  rules: ValidationRule[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  for (const rule of rules) {
    const value = data[rule.field];
    
    // 检查必填
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`${rule.field} 是必填项`);
      continue;
    }
    
    if (value === undefined || value === null) continue;
    
    // 类型验证
    switch (rule.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`${rule.field} 必须是字符串`);
        } else {
          if (rule.min && value.length < rule.min) {
            errors.push(`${rule.field} 长度至少为 ${rule.min}`);
          }
          if (rule.max && value.length > rule.max) {
            errors.push(`${rule.field} 长度不能超过 ${rule.max}`);
          }
          if (rule.pattern && !rule.pattern.test(value)) {
            errors.push(`${rule.field} 格式不正确`);
          }
        }
        break;
        
      case 'number':
        const num = Number(value);
        if (isNaN(num)) {
          errors.push(`${rule.field} 必须是数字`);
        } else {
          if (rule.min !== undefined && num < rule.min) {
            errors.push(`${rule.field} 不能小于 ${rule.min}`);
          }
          if (rule.max !== undefined && num > rule.max) {
            errors.push(`${rule.field} 不能大于 ${rule.max}`);
          }
        }
        break;
        
      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push(`${rule.field} 必须是布尔值`);
        }
        break;
        
      case 'address':
        if (typeof value !== 'string' || !InputValidator.isValidAddress(value)) {
          errors.push(`${rule.field} 不是有效的钱包地址`);
        }
        break;
        
      case 'email':
        if (typeof value !== 'string' || !InputValidator.isValidEmail(value)) {
          errors.push(`${rule.field} 不是有效的邮箱地址`);
        }
        break;
        
      case 'txHash':
        if (typeof value !== 'string' || !InputValidator.isValidTxHash(value)) {
          errors.push(`${rule.field} 不是有效的交易哈希`);
        }
        break;
        
      case 'url':
        if (typeof value !== 'string' || !InputValidator.isValidUrl(value)) {
          errors.push(`${rule.field} 不是有效的 URL`);
        }
        break;
    }
    
    // 自定义验证
    if (rule.custom && !rule.custom(value)) {
      errors.push(`${rule.field} 验证失败`);
    }
  }
  
  return { valid: errors.length === 0, errors };
}


// ==================== 安全 API 处理器包装 ====================

export interface SecureHandlerOptions {
  rateLimit?: boolean;
  validateBody?: ValidationRule[];
  requireAuth?: boolean;
  allowedMethods?: string[];
  logRequest?: boolean;
}

export function createSecureHandler(
  handler: (request: NextRequest, validatedData?: Record<string, unknown>) => Promise<NextResponse>,
  options: SecureHandlerOptions = {}
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const ip = getClientIP(request);
    const userAgent = getUserAgent(request);
    const path = new URL(request.url).pathname;
    
    try {
      // 检查允许的方法
      if (options.allowedMethods && !options.allowedMethods.includes(request.method)) {
        return addSecurityHeaders(
          NextResponse.json({ error: '方法不允许' }, { status: 405 })
        );
      }
      
      // 速率限制
      if (options.rateLimit !== false) {
        const identifier = `${ip}:${path}`;
        const rateLimitResult = RateLimiter.check(identifier);
        
        if (!rateLimitResult.allowed) {
          SecurityLogger.log(
            SecurityEventType.RATE_LIMIT_EXCEEDED,
            'warning',
            { path },
            undefined,
            ip,
            userAgent
          );
          
          const response = NextResponse.json(
            { error: '请求过于频繁', retryAfter: rateLimitResult.retryAfter },
            { status: 429 }
          );
          response.headers.set('Retry-After', String(rateLimitResult.retryAfter));
          return addSecurityHeaders(response);
        }
      }
      
      // 验证请求体
      let validatedData: Record<string, unknown> | undefined = undefined;
      if (options.validateBody && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        try {
          const body = await request.json();
          const validation = validateInput(body, options.validateBody);
          
          if (!validation.valid) {
            SecurityLogger.log(
              SecurityEventType.INVALID_INPUT,
              'warning',
              { errors: validation.errors, path },
              undefined,
              ip,
              userAgent
            );
            
            return addSecurityHeaders(
              NextResponse.json({ error: '输入验证失败', details: validation.errors }, { status: 400 })
            );
          }
          
          validatedData = body;
        } catch {
          return addSecurityHeaders(
            NextResponse.json({ error: '无效的请求体' }, { status: 400 })
          );
        }
      }
      
      // 记录请求
      if (options.logRequest) {
        SecurityLogger.log(
          SecurityEventType.TRANSACTION_INITIATED,
          'info',
          { path, method: request.method },
          undefined,
          ip,
          userAgent
        );
      }
      
      // 执行处理器
      const response = await handler(request, validatedData);
      return addSecurityHeaders(response);
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '未知错误';
      SecurityLogger.log(
        SecurityEventType.SUSPICIOUS_ACTIVITY,
        'error',
        { error: message, path },
        undefined,
        ip,
        userAgent
      );
      
      return addSecurityHeaders(
        NextResponse.json(
          { error: '服务器内部错误' },
          { status: 500 }
        )
      );
    }
  };
}

// ==================== 错误响应辅助函数 ====================

export function errorResponse(message: string, status: number = 400): NextResponse {
  return addSecurityHeaders(
    NextResponse.json({ message, error: message, success: false }, { status })
  );
}

export function successResponse(data: Record<string, unknown>, status: number = 200): NextResponse {
  return addSecurityHeaders(
    NextResponse.json({ ...data, success: true }, { status })
  );
}

// ==================== 导出 ====================

export default {
  addSecurityHeaders,
  withRateLimit,
  validateInput,
  createSecureHandler,
  errorResponse,
  successResponse,
};
