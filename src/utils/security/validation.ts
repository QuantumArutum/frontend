// Security Validation Utilities
// 安全验证工具函数

import DOMPurify from 'dompurify';

// Security patterns for validation
export const SECURITY_PATTERNS = {
  NAME: /^[\u4e00-\u9fa5a-zA-Z\s'-]{1,100}$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE_CN: /^1[3-9]\d{9}$/,
  PHONE_INTERNATIONAL: /^\+?[1-9]\d{1,14}$/,
  ETH_ADDRESS: /^0x[a-fA-F0-9]{40}$/,
  BTC_ADDRESS_P2PKH: /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/,
  BTC_ADDRESS_BECH32: /^bc1[a-zA-HJ-NP-Z0-9]{25,90}$/,
  TRON_ADDRESS: /^T[a-zA-Z0-9]{33}$/,
  TRANSACTION_HASH: /^0x[a-fA-F0-9]{64}$/,
  XSS_PATTERNS: [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ],
  SQL_INJECTION: /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE)\b)|(--)|(;)|(')/gi,
};

// Security error codes (not used but kept for compatibility)
export enum SecurityErrorCode {
  INVALID_INPUT = 'INVALID_INPUT',
  XSS_DETECTED = 'XSS_DETECTED',
  SQL_INJECTION_DETECTED = 'SQL_INJECTION_DETECTED',
}

/**
 * Input validation result interface
 * 输入验证结果接口
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
  warnings?: string[];
}

/**
 * Comprehensive input validation result
 * 综合输入验证结果
 */
export interface ComprehensiveValidationResult {
  isValid: boolean;
  errors: Array<{
    field: string;
    message: string;
    code: string;
  }>;
  sanitizedData: Record<string, unknown>;
  riskScore: number; // 0-100, higher is riskier
}

/**
 * Sanitize string input to prevent XSS attacks
 * 清理字符串输入以防止XSS攻击
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Use DOMPurify for HTML sanitization
  const sanitized = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true, // Keep text content
    FORBID_CONTENTS: ['script', 'style', 'iframe', 'object', 'embed']
  });

  // Additional cleaning for common attack vectors
  return sanitized
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/expression\s*\(/gi, '')
    .replace(/@import/gi, '')
    .replace(/binding\s*:/gi, '')
    .trim();
}

/**
 * Validate name input
 * 验证姓名输入
 */
export function validateName(name: string): ValidationResult {
  if (!name || typeof name !== 'string') {
    return {
      isValid: false,
      error: '姓名不能为空'
    };
  }

  const sanitized = sanitizeString(name);
  
  if (sanitized.length < 2) {
    return {
      isValid: false,
      error: '姓名至少需要2个字符'
    };
  }

  if (sanitized.length > 50) {
    return {
      isValid: false,
      error: '姓名不能超过50个字符'
    };
  }

  if (!SECURITY_PATTERNS.NAME.test(sanitized)) {
    return {
      isValid: false,
      error: '姓名只能包含中英文字符、空格和点号'
    };
  }

  // Check for potential XSS
  if (hasXSSPatterns(name)) {
    return {
      isValid: false,
      error: '姓名包含不安全的字符'
    };
  }

  return {
    isValid: true,
    sanitizedValue: sanitized
  };
}

/**
 * Validate email address
 * 验证邮箱地址
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: '邮箱地址不能为空'
    };
  }

  const sanitized = sanitizeString(email);

  if (sanitized.length > 100) {
    return {
      isValid: false,
      error: '邮箱地址不能超过100个字符'
    };
  }

  if (!SECURITY_PATTERNS.EMAIL.test(sanitized)) {
    return {
      isValid: false,
      error: '邮箱地址格式不正确'
    };
  }

  // Check for potential XSS
  if (hasXSSPatterns(email)) {
    return {
      isValid: false,
      error: '邮箱地址包含不安全的字符'
    };
  }

  // Additional email security checks
  const warnings: string[] = [];
  
  // Check for suspicious domains
  const suspiciousDomains = ['tempmail', 'guerrillamail', '10minutemail', 'mailinator'];
  const domain = sanitized.split('@')[1]?.toLowerCase();
  if (domain && suspiciousDomains.some(suspicious => domain.includes(suspicious))) {
    warnings.push('检测到临时邮箱域名，建议使用常用邮箱');
  }

  return {
    isValid: true,
    sanitizedValue: sanitized,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Validate phone number
 * 验证手机号码
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone || typeof phone !== 'string') {
    return {
      isValid: false,
      error: '手机号码不能为空'
    };
  }

  const sanitized = sanitizeString(phone);

  // Remove common formatting characters
  const cleanPhone = sanitized.replace(/[\s\-\(\)]/g, '');

  // Check Chinese mobile number format
  if (SECURITY_PATTERNS.PHONE_CN.test(cleanPhone)) {
    return {
      isValid: true,
      sanitizedValue: cleanPhone
    };
  }

  // Check international format
  if (SECURITY_PATTERNS.PHONE_INTERNATIONAL.test(cleanPhone)) {
    return {
      isValid: true,
      sanitizedValue: cleanPhone,
      warnings: ['国际号码格式，请确认号码正确']
    };
  }

  return {
    isValid: false,
    error: '手机号码格式不正确'
  };
}

/**
 * Validate wallet address with detailed type detection
 * 验证钱包地址并详细检测类型
 */
export function validateWalletAddress(address: string): ValidationResult & { 
  addressType?: string;
  network?: string;
} {
  if (!address || typeof address !== 'string') {
    return {
      isValid: false,
      error: '钱包地址不能为空'
    };
  }

  const sanitized = sanitizeString(address);

  if (sanitized.length > 100) {
    return {
      isValid: false,
      error: '钱包地址不能超过100个字符'
    };
  }

  // Check for potential XSS
  if (hasXSSPatterns(address)) {
    return {
      isValid: false,
      error: '钱包地址包含不安全的字符'
    };
  }

  // Ethereum address validation
  if (SECURITY_PATTERNS.ETH_ADDRESS.test(sanitized)) {
    // Additional checksum validation for Ethereum addresses
    const isValidChecksum = validateEthereumChecksum(sanitized);
    return {
      isValid: true,
      sanitizedValue: sanitized,
      addressType: 'Ethereum',
      network: 'Ethereum',
      warnings: !isValidChecksum ? ['地址校验和可能不正确，请仔细核对'] : undefined
    };
  }

  // Bitcoin P2PKH address validation
  if (SECURITY_PATTERNS.BTC_ADDRESS_P2PKH.test(sanitized)) {
    return {
      isValid: true,
      sanitizedValue: sanitized,
      addressType: 'Bitcoin Legacy',
      network: 'Bitcoin'
    };
  }

  // Bitcoin Bech32 address validation
  if (SECURITY_PATTERNS.BTC_ADDRESS_BECH32.test(sanitized)) {
    return {
      isValid: true,
      sanitizedValue: sanitized,
      addressType: 'Bitcoin Bech32',
      network: 'Bitcoin'
    };
  }

  // TRON address validation
  if (SECURITY_PATTERNS.TRON_ADDRESS.test(sanitized)) {
    return {
      isValid: true,
      sanitizedValue: sanitized,
      addressType: 'TRON',
      network: 'TRON'
    };
  }

  return {
    isValid: false,
    error: '钱包地址格式不正确，请输入有效的以太坊、比特币或TRON地址'
  };
}

/**
 * Validate transaction hash
 * 验证交易哈希
 */
export function validateTransactionHash(hash: string): ValidationResult {
  if (!hash || typeof hash !== 'string') {
    return {
      isValid: false,
      error: '交易哈希不能为空'
    };
  }

  const sanitized = sanitizeString(hash);

  if (!SECURITY_PATTERNS.TRANSACTION_HASH.test(sanitized)) {
    return {
      isValid: false,
      error: '交易哈希格式不正确，应为64位十六进制字符串'
    };
  }

  // Check for potential XSS
  if (hasXSSPatterns(hash)) {
    return {
      isValid: false,
      error: '交易哈希包含不安全的字符'
    };
  }

  return {
    isValid: true,
    sanitizedValue: sanitized
  };
}

/**
 * Validate numeric input with range checking
 * 验证数字输入并检查范围
 */
export function validateNumericInput(
  value: number | string,
  min?: number,
  max?: number,
  fieldName: string = '数值'
): ValidationResult {
  if (value === null || value === undefined || value === '') {
    return {
      isValid: false,
      error: `${fieldName}不能为空`
    };
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return {
      isValid: false,
      error: `${fieldName}必须是有效数字`
    };
  }

  if (min !== undefined && numValue < min) {
    return {
      isValid: false,
      error: `${fieldName}不能小于${min}`
    };
  }

  if (max !== undefined && numValue > max) {
    return {
      isValid: false,
      error: `${fieldName}不能大于${max}`
    };
  }

  return {
    isValid: true,
    sanitizedValue: numValue.toString()
  };
}
/**
 * Comprehensive form validation
 * 综合表单验证
 */
export function validateFormData(
  data: Record<string, unknown>,
  validationRules: Record<string, (value: unknown) => ValidationResult>
): ComprehensiveValidationResult {
  const errors: Array<{ field: string; message: string; code: string }> = [];
  const sanitizedData: Record<string, unknown> = {};
  let riskScore = 0;

  for (const [field, value] of Object.entries(data)) {
    const validator = validationRules[field];
    if (validator) {
      const result = validator(value);
      
      if (!result.isValid) {
        errors.push({
          field,
          message: result.error || '验证失败',
          code: 'VALIDATION_ERROR'
        });
        riskScore += 10; // Each validation error adds to risk score
      } else {
        sanitizedData[field] = result.sanitizedValue || value;
        
        // Add risk score based on warnings
        if (result.warnings && result.warnings.length > 0) {
          riskScore += result.warnings.length * 5;
        }
      }
    } else {
      // No validator defined, just sanitize
      sanitizedData[field] = typeof value === 'string' ? sanitizeString(value) : value;
    }
  }

  // Additional risk assessment
  const allTextValues = Object.values(data)
    .filter(v => typeof v === 'string')
    .join(' ');

  if (hasXSSPatterns(allTextValues)) {
    riskScore += 50;
  }

  if (hasSQLInjectionPatterns(allTextValues)) {
    riskScore += 40;
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData,
    riskScore: Math.min(100, riskScore) // Cap at 100
  };
}

/**
 * Check for XSS attack patterns
 * 检查XSS攻击模式
 */
export function hasXSSPatterns(input: string): boolean {
  if (typeof input !== 'string') return false;

  return SECURITY_PATTERNS.XSS_PATTERNS.some(pattern => pattern.test(input));
}

/**
 * Check for SQL injection patterns
 * 检查SQL注入模式
 */
export function hasSQLInjectionPatterns(input: string): boolean {
  if (typeof input !== 'string') return false;

  return SECURITY_PATTERNS.SQL_INJECTION.test(input);
}

/**
 * Validate Ethereum address checksum
 * 验证以太坊地址校验和
 */
function validateEthereumChecksum(address: string): boolean {
  // This is a simplified checksum validation
  // In production, you might want to use a proper library like ethers.js
  if (!address.startsWith('0x') || address.length !== 42) {
    return false;
  }

  // Check if address is all lowercase or all uppercase (no checksum)
  const addressWithoutPrefix = address.slice(2);
  if (addressWithoutPrefix === addressWithoutPrefix.toLowerCase() ||
      addressWithoutPrefix === addressWithoutPrefix.toUpperCase()) {
    return true; // No checksum to validate
  }

  // For proper checksum validation, you would need to implement EIP-55
  // For now, we'll just check that it contains mixed case
  const hasLowerCase = /[a-f]/.test(addressWithoutPrefix);
  const hasUpperCase = /[A-F]/.test(addressWithoutPrefix);
  
  return hasLowerCase && hasUpperCase;
}

/**
 * Rate limiting helper
 * 频率限制辅助函数
 */
export class ClientRateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();

  /**
   * Check if action is allowed based on rate limit
   * 根据频率限制检查操作是否允许
   */
  isAllowed(
    key: string,
    maxAttempts: number = 5,
    windowMs: number = 60000 // 1 minute
  ): { allowed: boolean; remainingAttempts: number; resetTime?: Date } {
    const now = Date.now();
    const record = this.attempts.get(key);

    if (!record) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return { allowed: true, remainingAttempts: maxAttempts - 1 };
    }

    // Reset if window has passed
    if (now - record.lastAttempt > windowMs) {
      this.attempts.set(key, { count: 1, lastAttempt: now });
      return { allowed: true, remainingAttempts: maxAttempts - 1 };
    }

    // Check if limit exceeded
    if (record.count >= maxAttempts) {
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: new Date(record.lastAttempt + windowMs)
      };
    }

    // Increment count
    record.count++;
    record.lastAttempt = now;

    return {
      allowed: true,
      remainingAttempts: maxAttempts - record.count
    };
  }

  /**
   * Reset rate limit for a key
   * 重置指定键的频率限制
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }

  /**
   * Clear all rate limit records
   * 清除所有频率限制记录
   */
  clear(): void {
    this.attempts.clear();
  }
}

/**
 * Security validation presets for common form fields
 * 常用表单字段的安全验证预设
 */
export const VALIDATION_PRESETS = {
  investorName: (value: unknown) => {
    if (typeof value !== 'string') {
      return { isValid: false, error: '姓名必须是字符串' };
    }
    return validateName(value);
  },
  investorEmail: (value: unknown) => {
    if (typeof value !== 'string') {
      return { isValid: false, error: '邮箱必须是字符串' };
    }
    return validateEmail(value);
  },
  investorPhone: (value: unknown) => {
    if (typeof value !== 'string') {
      return { isValid: false, error: '手机号码必须是字符串' };
    }
    return validatePhone(value);
  },
  walletAddress: (value: unknown) => {
    if (typeof value !== 'string') {
      return { isValid: false, error: '钱包地址必须是字符串' };
    }
    return validateWalletAddress(value);
  },
  transactionHash: (value: unknown) => {
    if (typeof value !== 'string') {
      return { isValid: false, error: '交易哈希必须是字符串' };
    }
    return validateTransactionHash(value);
  },
  nodeCount: (value: unknown) => {
    if (typeof value !== 'number') {
      return { isValid: false, error: '节点数量必须是数字' };
    }
    return validateNumericInput(value, 1, 10, '节点数量');
  },
  investmentAmount: (value: unknown) => {
    if (typeof value !== 'number') {
      return { isValid: false, error: '投资金额必须是数字' };
    }
    return validateNumericInput(value, 1, 10000000, '投资金额');
  }
};

/**
 * Create a comprehensive validator for investor forms
 * 为投资者表单创建综合验证器
 */
export function createInvestorFormValidator() {
  return {
    validateAll: (formData: {
      name: string;
      email: string;
      phone: string;
      walletAddress: string;
      nodeCount: number;
    }) => validateFormData(formData, {
      name: VALIDATION_PRESETS.investorName,
      email: VALIDATION_PRESETS.investorEmail,
      phone: VALIDATION_PRESETS.investorPhone,
      walletAddress: VALIDATION_PRESETS.walletAddress,
      nodeCount: VALIDATION_PRESETS.nodeCount
    })
  };
}

// Export rate limiter instance for global use
export const globalRateLimiter = new ClientRateLimiter();