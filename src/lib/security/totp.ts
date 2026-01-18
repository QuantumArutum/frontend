/**
 * Quantaureum 2FA双因素认证服务
 *
 * 基于TOTP (Time-based One-Time Password) 实现
 * 兼容 Google Authenticator, Authy 等应用
 */

import crypto from 'crypto';

// ==================== 配置 ====================

const TOTP_CONFIG = {
  issuer: 'Quantaureum',
  algorithm: 'SHA1',
  digits: 6,
  period: 30, // 秒
  window: 1, // 允许前后1个时间窗口
};

// ==================== TOTP服务 ====================

export class TOTPService {
  /**
   * 生成TOTP密钥
   */
  static generateSecret(): string {
    const buffer = crypto.randomBytes(20);
    return this.base32Encode(buffer);
  }

  /**
   * 生成TOTP URI (用于二维码)
   */
  static generateURI(secret: string, email: string): string {
    const params = new URLSearchParams({
      secret,
      issuer: TOTP_CONFIG.issuer,
      algorithm: TOTP_CONFIG.algorithm,
      digits: TOTP_CONFIG.digits.toString(),
      period: TOTP_CONFIG.period.toString(),
    });

    return `otpauth://totp/${encodeURIComponent(TOTP_CONFIG.issuer)}:${encodeURIComponent(email)}?${params.toString()}`;
  }

  /**
   * 验证TOTP码
   */
  static verify(token: string, secret: string): boolean {
    if (!token || !secret) return false;
    if (!/^\d{6}$/.test(token)) return false;

    const now = Math.floor(Date.now() / 1000);
    const timeStep = TOTP_CONFIG.period;

    // 检查当前时间窗口和前后窗口
    for (let i = -TOTP_CONFIG.window; i <= TOTP_CONFIG.window; i++) {
      const counter = Math.floor((now + i * timeStep) / timeStep);
      const expectedToken = this.generateTOTP(secret, counter);
      if (this.timingSafeEqual(token, expectedToken)) {
        return true;
      }
    }

    return false;
  }

  /**
   * 生成当前TOTP码 (用于测试)
   */
  static generate(secret: string): string {
    const counter = Math.floor(Date.now() / 1000 / TOTP_CONFIG.period);
    return this.generateTOTP(secret, counter);
  }

  /**
   * 生成备份码
   */
  static generateBackupCodes(count: number = 10): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
    }
    return codes;
  }

  /**
   * 获取剩余有效时间（秒）
   */
  static getRemainingTime(): number {
    const now = Math.floor(Date.now() / 1000);
    return TOTP_CONFIG.period - (now % TOTP_CONFIG.period);
  }

  // ==================== 私有方法 ====================

  private static generateTOTP(secret: string, counter: number): string {
    const decodedSecret = this.base32Decode(secret);
    const buffer = Buffer.alloc(8);

    for (let i = 7; i >= 0; i--) {
      buffer[i] = counter & 0xff;
      counter = Math.floor(counter / 256);
    }

    const hmac = crypto.createHmac('sha1', decodedSecret);
    hmac.update(buffer);
    const hash = hmac.digest();

    const offset = hash[hash.length - 1] & 0x0f;
    const binary =
      ((hash[offset] & 0x7f) << 24) |
      ((hash[offset + 1] & 0xff) << 16) |
      ((hash[offset + 2] & 0xff) << 8) |
      (hash[offset + 3] & 0xff);

    const otp = binary % Math.pow(10, TOTP_CONFIG.digits);
    return otp.toString().padStart(TOTP_CONFIG.digits, '0');
  }

  private static base32Encode(buffer: Buffer): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    let bits = 0;
    let value = 0;

    for (const byte of buffer) {
      value = (value << 8) | byte;
      bits += 8;

      while (bits >= 5) {
        result += alphabet[(value >>> (bits - 5)) & 31];
        bits -= 5;
      }
    }

    if (bits > 0) {
      result += alphabet[(value << (5 - bits)) & 31];
    }

    return result;
  }

  private static base32Decode(encoded: string): Buffer {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    const cleanedInput = encoded.toUpperCase().replace(/[^A-Z2-7]/g, '');

    let bits = 0;
    let value = 0;
    const output: number[] = [];

    for (const char of cleanedInput) {
      const index = alphabet.indexOf(char);
      if (index === -1) continue;

      value = (value << 5) | index;
      bits += 5;

      if (bits >= 8) {
        output.push((value >>> (bits - 8)) & 255);
        bits -= 8;
      }
    }

    return Buffer.from(output);
  }

  private static timingSafeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) return false;

    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);

    return crypto.timingSafeEqual(bufA, bufB);
  }
}

// ==================== 导出 ====================

export default TOTPService;
