/**
 * Quantaureum SQLite Database Service (Shared with Backend)
 *
 * Production-ready shared database access
 */

import Database from 'better-sqlite3';
import path from 'path';
import { CryptoUtils } from '../security';
import { User, TokenPurchase, Session } from './postgresql'; // Import types

// Path to shared database
const DB_PATH = path.resolve(process.cwd(), '../backend/quantaureum.db');
const db = new Database(DB_PATH);

// ==================== Database Service Class ====================

class SQLiteDatabase {
  // ========== User Operations ==========

  async createUser(email: string, password: string): Promise<User> {
    const id = CryptoUtils.generateSecureToken(16);
    const passwordHash = await CryptoUtils.hashPassword(password);
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO users (id, email, password_hash, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, email, passwordHash, now, now);

    return this.findUserById(id) as Promise<User>;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    return row ? this.mapUser(row) : null;
  }

  async findUserById(id: string): Promise<User | null> {
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(id);
    return row ? this.mapUser(row) : null;
  }

  async verifyUserPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) return null;

    const valid = await CryptoUtils.verifyPassword(password, user.passwordHash);
    if (!valid) return null;

    db.prepare('UPDATE users SET last_login = ? WHERE id = ?').run(
      new Date().toISOString(),
      user.id
    );

    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

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
      fields.push(`${dbField} = ?`);
      // Convert booleans to 1/0 for SQLite
      values.push(typeof value === 'boolean' ? (value ? 1 : 0) : value);
    }

    fields.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...values);

    return this.findUserById(id);
  }

  // ========== Session Operations ==========

  async createSession(userId: string, ip: string, userAgent: string): Promise<Session> {
    const id = CryptoUtils.generateSecureToken(16);
    const token = CryptoUtils.generateSecureToken(32);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const stmt = db.prepare(`
      INSERT INTO sessions (id, user_id, token, ip, user_agent, created_at, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, userId, token, ip, userAgent, now.toISOString(), expiresAt.toISOString());

    return this.mapSession({
      id,
      user_id: userId,
      token,
      ip,
      user_agent: userAgent,
      created_at: now.toISOString(),
      expires_at: expiresAt.toISOString(),
      is_valid: 1,
    });
  }

  async findSessionByToken(token: string): Promise<Session | null> {
    const row = db
      .prepare(
        `
      SELECT * FROM sessions 
      WHERE token = ? AND is_valid = 1 AND expires_at > ?
    `
      )
      .get(token, new Date().toISOString());

    return row ? this.mapSession(row) : null;
  }

  async invalidateSession(id: string): Promise<void> {
    db.prepare('UPDATE sessions SET is_valid = 0 WHERE id = ?').run(id);
  }

  async invalidateAllUserSessions(userId: string): Promise<void> {
    db.prepare('UPDATE sessions SET is_valid = 0 WHERE user_id = ?').run(userId);
  }

  // ========== Community Operations ==========

  async getPosts(params: {
    limit: number;
    offset: number;
    category?: string;
    id?: string;
  }): Promise<any[]> {
    let query = `
      SELECT p.*, c.slug as category_slug, u.email as user_email 
      FROM community_posts p
      JOIN users u ON p.user_id = u.id
      JOIN community_categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const args: (string | number | boolean)[] = [];

    if (params.id) {
      query += ` AND p.id = ?`;
      args.push(params.id);
    } else if (params.category) {
      query += ` AND c.slug = ?`;
      args.push(params.category);
    }

    query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    args.push(params.limit, params.offset);

    const rows = db.prepare(query).all(...args);
    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      content: row.content,
      category: row.category_slug,
      userId: row.user_id,
      userName: row.user_email.split('@')[0], // Simple username from email
      userAvatar: null,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      isPinned: Boolean(row.is_pinned),
      isLocked: Boolean(row.is_locked),
      likeCount: row.like_count,
      commentCount: row.comment_count,
    }));
  }

  async createPost(data: {
    userId: string;
    title: string;
    content: string;
    categorySlug: string;
  }): Promise<any> {
    const category = db
      .prepare('SELECT id FROM community_categories WHERE slug = ?')
      .get(data.categorySlug) as any;
    if (!category) throw new Error('Invalid category');

    const id = 'post_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const now = new Date().toISOString();

    db.prepare(
      `
      INSERT INTO community_posts (id, user_id, category_id, title, content, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
    ).run(id, data.userId, category.id, data.title, data.content, now, now);

    return {
      id,
      title: data.title,
      content: data.content,
      category: data.categorySlug,
      userId: data.userId,
      createdAt: now,
      updatedAt: now,
      isPinned: false,
      isLocked: false,
      userName: 'You',
      userAvatar: null,
    };
  }

  // ========== Purchase Operations ==========

  async createPurchase(data: {
    userId?: string;
    buyerAddress: string;
    amountUSD: number;
    tokensBase: number;
    tokensBonus?: number;
    tokensTotal: number;
    currency?: string;
    referralCode?: string;
    txHash?: string;
    paymentMethod?: string;
    paymentStatus?: string;
  }): Promise<TokenPurchase> {
    const id = 'ord_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const now = new Date().toISOString();

    db.prepare(
      `
      INSERT INTO token_purchases (id, user_id, buyer_address, amount_usd, tokens_base, tokens_bonus, tokens_total, currency, status, tx_hash, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `
    ).run(
      id,
      data.userId || null,
      data.buyerAddress,
      data.amountUSD,
      data.tokensBase,
      data.tokensBonus || 0,
      data.tokensTotal,
      data.currency || data.paymentMethod || 'USDT',
      data.paymentStatus || 'pending',
      data.txHash || null,
      now
    );

    return this.findPurchaseById(id) as Promise<TokenPurchase>;
  }

  async findPurchaseById(id: string): Promise<TokenPurchase | null> {
    const row = db.prepare('SELECT * FROM token_purchases WHERE id = ?').get(id) as any;
    return row ? this.mapPurchase(row) : null;
  }

  async findPurchasesByAddress(address: string): Promise<TokenPurchase[]> {
    const rows = db
      .prepare('SELECT * FROM token_purchases WHERE buyer_address = ? ORDER BY created_at DESC')
      .all(address) as any[];
    return rows.map((row) => this.mapPurchase(row));
  }

  async updatePurchase(id: string, updates: Partial<TokenPurchase>): Promise<TokenPurchase | null> {
    const fields: string[] = [];
    const values: unknown[] = [];

    const fieldMap: Record<string, string> = {
      txHash: 'tx_hash',
      paymentTxHash: 'payment_tx_hash',
      paymentStatus: 'payment_status',
      completedAt: 'completed_at',
    };

    for (const [key, value] of Object.entries(updates)) {
      const dbField = fieldMap[key] || key;
      fields.push(`${dbField} = ?`);
      values.push(value);
    }

    if (fields.length === 0) return this.findPurchaseById(id);

    values.push(id);
    const query = `UPDATE token_purchases SET ${fields.join(', ')} WHERE id = ?`;
    db.prepare(query).run(...values);

    return this.findPurchaseById(id);
  }

  async getPurchaseStats(): Promise<{
    totalRaised: number;
    totalTokensSold: number;
    totalOrders: number;
    totalPurchases: number;
    completedPurchases: number;
  }> {
    const row = db
      .prepare(
        `
      SELECT 
        COALESCE(SUM(amount_usd), 0) as total_raised,
        COALESCE(SUM(tokens_total), 0) as total_tokens_sold,
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_purchases
      FROM token_purchases
    `
      )
      .get() as any;

    return {
      totalRaised: Number(row.total_raised) || 0,
      totalTokensSold: Number(row.total_tokens_sold) || 0,
      totalOrders: row.total_orders || 0,
      totalPurchases: row.total_orders || 0,
      completedPurchases: row.completed_purchases || 0,
    };
  }

  private mapPurchase(row: any): TokenPurchase {
    return {
      id: row.id,
      userId: row.user_id || undefined,
      buyerAddress: row.buyer_address,
      amountUSD: row.amount_usd,
      tokensBase: row.tokens_base,
      tokensBonus: row.tokens_bonus || 0,
      tokensTotal: row.tokens_total,
      txHash: row.tx_hash || '',
      paymentMethod: row.currency || 'USDT',
      paymentTxHash: row.payment_tx_hash || undefined,
      paymentStatus: (row.payment_status || 'pending') as TokenPurchase['paymentStatus'],
      paymentVerifiedAt: row.payment_verified_at || undefined,
      status: row.status as TokenPurchase['status'],
      createdAt: row.created_at,
      completedAt: row.completed_at || undefined,
    };
  }

  // ========== 2FA Operations ==========

  async enableTOTP(userId: string, secret: string): Promise<void> {
    db.prepare(
      `
      UPDATE users 
      SET totp_secret = ?, totp_enabled = 1, updated_at = ?
      WHERE id = ?
    `
    ).run(secret, new Date().toISOString(), userId);
  }

  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    // Check if backup_codes table exists, if not return false
    try {
      const backupCode = db
        .prepare(
          `
        SELECT * FROM backup_codes 
        WHERE user_id = ? AND code = ? AND used = 0
      `
        )
        .get(userId, code) as any;

      if (backupCode) {
        // Mark the code as used
        db.prepare('UPDATE backup_codes SET used = 1, used_at = ? WHERE id = ?').run(
          new Date().toISOString(),
          backupCode.id
        );
        return true;
      }
      return false;
    } catch {
      // Table doesn't exist or other error
      return false;
    }
  }

  async disableTOTP(userId: string): Promise<void> {
    db.prepare(
      `
      UPDATE users 
      SET totp_secret = NULL, totp_enabled = 0, updated_at = ?
      WHERE id = ?
    `
    ).run(new Date().toISOString(), userId);
  }

  async saveBackupCodes(userId: string, codes: string[]): Promise<void> {
    // Create backup_codes table if not exists
    db.prepare(
      `
      CREATE TABLE IF NOT EXISTS backup_codes (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        code TEXT NOT NULL,
        used INTEGER DEFAULT 0,
        used_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `
    ).run();

    // Delete existing codes for user
    db.prepare('DELETE FROM backup_codes WHERE user_id = ?').run(userId);

    // Insert new codes
    const stmt = db.prepare(`
      INSERT INTO backup_codes (id, user_id, code, created_at)
      VALUES (?, ?, ?, ?)
    `);

    const now = new Date().toISOString();
    for (const code of codes) {
      const id = 'bc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      stmt.run(id, userId, code, now);
    }
  }

  // ========== Helpers ==========

  private mapUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      walletAddress: row.wallet_address || undefined,
      phone: row.phone || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastLogin: row.last_login || undefined,
      isVerified: Boolean(row.is_verified),
      isActive: Boolean(row.is_active),
      role: row.role as 'user' | 'admin',
      kycStatus: row.kyc_status as User['kycStatus'],
      kycData: row.kyc_data ? JSON.parse(row.kyc_data) : undefined,
      totpSecret: row.totp_secret || undefined,
      totpEnabled: Boolean(row.totp_enabled),
    };
  }

  private mapSession(row: any): Session {
    return {
      id: row.id,
      userId: row.user_id,
      token: row.token,
      ip: row.ip,
      userAgent: row.user_agent,
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      isValid: Boolean(row.is_valid),
    };
  }
}

export const sqliteDb = new SQLiteDatabase();
export default sqliteDb;
