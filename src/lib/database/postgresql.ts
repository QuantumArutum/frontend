/**
 * Quantaureum PostgreSQL 数据库服务
 * 
 * 生产级数据持久化层 - 支持全球分布式部署
 */

import { Pool, PoolClient } from 'pg';
import { CryptoUtils } from '../security';

// ==================== 类型定义 ====================

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  walletAddress?: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  isVerified: boolean;
  isActive: boolean;
  role: 'user' | 'admin';
  kycStatus: 'none' | 'pending' | 'approved' | 'rejected';
  kycData?: Record<string, unknown>;
  totpSecret?: string;
  totpEnabled: boolean;
}

export interface TokenPurchase {
  id: string;
  userId?: string;
  buyerAddress: string;
  amountUSD: number;
  tokensBase: number;
  tokensBonus: number;
  tokensTotal: number;
  txHash: string;
  paymentMethod: string;
  paymentTxHash?: string;
  paymentStatus: 'pending' | 'confirmed' | 'failed';
  paymentVerifiedAt?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  completedAt?: string;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  ip: string;
  userAgent: string;
  createdAt: string;
  expiresAt: string;
  isValid: boolean;
}

// ==================== 数据库连接池 ====================

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'quantaureum',
  user: process.env.POSTGRES_USER || 'qau_admin',
  password: process.env.POSTGRES_PASSWORD || 'Qau@2026Secure!',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// ==================== 初始化表结构 ====================

export async function initDatabase(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        wallet_address VARCHAR(42),
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        role VARCHAR(20) DEFAULT 'user',
        kyc_status VARCHAR(20) DEFAULT 'none',
        kyc_data JSONB,
        totp_secret VARCHAR(64),
        totp_enabled BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id),
        token VARCHAR(128) UNIQUE NOT NULL,
        ip VARCHAR(45),
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL,
        is_valid BOOLEAN DEFAULT TRUE
      );

      CREATE TABLE IF NOT EXISTS token_purchases (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id),
        buyer_address VARCHAR(42) NOT NULL,
        amount_usd DECIMAL(18,2) NOT NULL,
        tokens_base DECIMAL(18,6) NOT NULL,
        tokens_bonus DECIMAL(18,6) DEFAULT 0,
        tokens_total DECIMAL(18,6) NOT NULL,
        tx_hash VARCHAR(66),
        payment_method VARCHAR(20),
        payment_tx_hash VARCHAR(66),
        payment_status VARCHAR(20) DEFAULT 'pending',
        payment_verified_at TIMESTAMP,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS backup_codes (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) REFERENCES users(id),
        code_hash TEXT NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        used_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
      CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_purchases_address ON token_purchases(buyer_address);
    `);
    console.log('PostgreSQL 数据库表初始化完成');
  } finally {
    client.release();
  }
}

// ==================== 数据库服务类 ====================

class PostgresDatabase {
  // ========== 用户操作 ==========

  async createUser(email: string, password: string): Promise<User> {
    const id = CryptoUtils.generateSecureToken(16);
    const passwordHash = await CryptoUtils.hashPassword(password);
    const now = new Date().toISOString();

    const result = await pool.query(
      `INSERT INTO users (id, email, password_hash, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, email, passwordHash, now, now]
    );

    return this.mapUser(result.rows[0]);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] ? this.mapUser(result.rows[0]) : null;
  }

  async findUserById(id: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] ? this.mapUser(result.rows[0]) : null;
  }

  async verifyUserPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) return null;

    const valid = await CryptoUtils.verifyPassword(password, user.passwordHash);
    if (!valid) return null;

    await pool.query(
      'UPDATE users SET last_login = $1 WHERE id = $2',
      [new Date().toISOString(), user.id]
    );

    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    const fieldMap: Record<string, string> = {
      walletAddress: 'wallet_address',
      isVerified: 'is_verified',
      isActive: 'is_active',
      kycStatus: 'kyc_status',
      totpSecret: 'totp_secret',
      totpEnabled: 'totp_enabled',
    };

    for (const [key, value] of Object.entries(updates)) {
      const dbField = fieldMap[key] || key;
      fields.push(`${dbField} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }

    fields.push(`updated_at = $${paramIndex}`);
    values.push(new Date().toISOString());
    values.push(id);

    const result = await pool.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex + 1} RETURNING *`,
      values
    );

    return result.rows[0] ? this.mapUser(result.rows[0]) : null;
  }

  // ========== 会话操作 ==========

  async createSession(userId: string, ip: string, userAgent: string): Promise<Session> {
    const id = CryptoUtils.generateSecureToken(16);
    const token = CryptoUtils.generateSecureToken(32);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const result = await pool.query(
      `INSERT INTO sessions (id, user_id, token, ip, user_agent, created_at, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, userId, token, ip, userAgent, now.toISOString(), expiresAt.toISOString()]
    );

    return this.mapSession(result.rows[0]);
  }

  async findSessionByToken(token: string): Promise<Session | null> {
    const result = await pool.query(
      'SELECT * FROM sessions WHERE token = $1 AND is_valid = TRUE AND expires_at > NOW()',
      [token]
    );
    return result.rows[0] ? this.mapSession(result.rows[0]) : null;
  }

  async invalidateSession(id: string): Promise<void> {
    await pool.query('UPDATE sessions SET is_valid = FALSE WHERE id = $1', [id]);
  }

  async invalidateAllUserSessions(userId: string): Promise<void> {
    await pool.query('UPDATE sessions SET is_valid = FALSE WHERE user_id = $1', [userId]);
  }

  // ========== 2FA操作 ==========

  async enableTOTP(userId: string, secret: string): Promise<void> {
    await this.updateUser(userId, { totpSecret: secret, totpEnabled: true });
  }

  async disableTOTP(userId: string): Promise<void> {
    await this.updateUser(userId, { totpSecret: undefined, totpEnabled: false });
    await pool.query('DELETE FROM backup_codes WHERE user_id = $1', [userId]);
  }

  async saveBackupCodes(userId: string, codes: string[]): Promise<void> {
    for (const code of codes) {
      const id = CryptoUtils.generateSecureToken(8);
      const hash = await CryptoUtils.hashPassword(code);
      await pool.query(
        'INSERT INTO backup_codes (id, user_id, code_hash) VALUES ($1, $2, $3)',
        [id, userId, hash]
      );
    }
  }

  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const result = await pool.query(
      'SELECT * FROM backup_codes WHERE user_id = $1 AND used = FALSE',
      [userId]
    );

    for (const row of result.rows) {
      const valid = await CryptoUtils.verifyPassword(code, row.code_hash);
      if (valid) {
        await pool.query(
          'UPDATE backup_codes SET used = TRUE, used_at = NOW() WHERE id = $1',
          [row.id]
        );
        return true;
      }
    }
    return false;
  }

  // ========== 代币购买操作 ==========

  async createPurchase(data: Omit<TokenPurchase, 'id' | 'createdAt' | 'status'>): Promise<TokenPurchase> {
    const id = CryptoUtils.generateSecureToken(16);

    const result = await pool.query(
      `INSERT INTO token_purchases 
       (id, user_id, buyer_address, amount_usd, tokens_base, tokens_bonus, tokens_total, tx_hash, payment_method, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [id, data.userId, data.buyerAddress, data.amountUSD, data.tokensBase, data.tokensBonus, data.tokensTotal, data.txHash, data.paymentMethod, data.paymentStatus]
    );

    return this.mapPurchase(result.rows[0]);
  }

  async findPurchaseById(id: string): Promise<TokenPurchase | null> {
    const result = await pool.query('SELECT * FROM token_purchases WHERE id = $1', [id]);
    return result.rows[0] ? this.mapPurchase(result.rows[0]) : null;
  }

  async findPurchasesByAddress(address: string): Promise<TokenPurchase[]> {
    const result = await pool.query(
      'SELECT * FROM token_purchases WHERE LOWER(buyer_address) = LOWER($1) ORDER BY created_at DESC',
      [address]
    );
    return result.rows.map(row => this.mapPurchase(row));
  }

  async getPurchaseStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_purchases,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN amount_usd ELSE 0 END), 0) as total_raised,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN tokens_total ELSE 0 END), 0) as total_tokens_sold,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_purchases
      FROM token_purchases
    `);

    const row = result.rows[0];
    return {
      totalPurchases: parseInt(row.total_purchases),
      totalRaised: parseFloat(row.total_raised),
      totalTokensSold: parseFloat(row.total_tokens_sold),
      completedPurchases: parseInt(row.completed_purchases),
    };
  }

  async updatePurchase(id: string, updates: Partial<TokenPurchase>): Promise<TokenPurchase | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    const fieldMap: Record<string, string> = {
      paymentTxHash: 'payment_tx_hash',
      paymentStatus: 'payment_status',
      paymentVerifiedAt: 'payment_verified_at',
      completedAt: 'completed_at',
    };

    for (const [key, value] of Object.entries(updates)) {
      if (key === 'id') continue;
      const dbField = fieldMap[key] || key;
      fields.push(`${dbField} = $${paramIndex}`);
      values.push(value);
      paramIndex++;
    }

    if (fields.length === 0) return this.findPurchaseById(id);

    values.push(id);
    const result = await pool.query(
      `UPDATE token_purchases SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    return result.rows[0] ? this.mapPurchase(result.rows[0]) : null;
  }

  // ========== 辅助方法 ==========

  private mapUser(row: Record<string, unknown>): User {
    return {
      id: row.id as string,
      email: row.email as string,
      passwordHash: row.password_hash as string,
      walletAddress: row.wallet_address as string | undefined,
      phone: row.phone as string | undefined,
      createdAt: (row.created_at as Date).toISOString(),
      updatedAt: (row.updated_at as Date).toISOString(),
      lastLogin: row.last_login ? (row.last_login as Date).toISOString() : undefined,
      isVerified: row.is_verified as boolean,
      isActive: row.is_active as boolean,
      role: row.role as 'user' | 'admin',
      kycStatus: row.kyc_status as User['kycStatus'],
      kycData: row.kyc_data as Record<string, unknown> | undefined,
      totpSecret: row.totp_secret as string | undefined,
      totpEnabled: row.totp_enabled as boolean,
    };
  }

  private mapSession(row: Record<string, unknown>): Session {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      token: row.token as string,
      ip: row.ip as string,
      userAgent: row.user_agent as string,
      createdAt: (row.created_at as Date).toISOString(),
      expiresAt: (row.expires_at as Date).toISOString(),
      isValid: row.is_valid as boolean,
    };
  }

  private mapPurchase(row: Record<string, unknown>): TokenPurchase {
    return {
      id: row.id as string,
      userId: row.user_id as string | undefined,
      buyerAddress: row.buyer_address as string,
      amountUSD: parseFloat(row.amount_usd as string),
      tokensBase: parseFloat(row.tokens_base as string),
      tokensBonus: parseFloat(row.tokens_bonus as string),
      tokensTotal: parseFloat(row.tokens_total as string),
      txHash: row.tx_hash as string,
      paymentMethod: row.payment_method as string,
      paymentTxHash: row.payment_tx_hash as string | undefined,
      paymentStatus: row.payment_status as TokenPurchase['paymentStatus'],
      paymentVerifiedAt: row.payment_verified_at ? (row.payment_verified_at as Date).toISOString() : undefined,
      status: row.status as TokenPurchase['status'],
      createdAt: (row.created_at as Date).toISOString(),
      completedAt: row.completed_at ? (row.completed_at as Date).toISOString() : undefined,
    };
  }
}

export const postgresDb = new PostgresDatabase();
export default postgresDb;
