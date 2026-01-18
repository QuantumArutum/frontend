/**
 * Quantaureum 数据库服务
 *
 * 支持 JSON 文件存储（开发）和 PostgreSQL（生产）
 * Vercel 环境使用模拟数据
 */

// 导出类型
export type { User, TokenPurchase, Session } from './postgresql';

export type { KYCDocument, PaymentVerification, BackupCode } from './persistent';

// Vercel 环境检测
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL_ENV !== undefined;

// 模拟数据库（用于 Vercel 无服务器环境）
const mockDb = {
  async createUser() {
    return null;
  },
  async findUserByEmail() {
    return null;
  },
  async findUserById() {
    return null;
  },
  async verifyUserPassword() {
    return null;
  },
  async updateUser() {
    return null;
  },
  async createSession() {
    return {
      id: '',
      userId: '',
      token: '',
      ip: '',
      userAgent: '',
      createdAt: '',
      expiresAt: '',
      isValid: false,
    };
  },
  async findSessionByToken() {
    return null;
  },
  async invalidateSession() {},
  async invalidateAllUserSessions() {},
  async getPosts() {
    return [];
  },
  async createPost() {
    return null;
  },
  async createPurchase() {
    return null;
  },
  async findPurchaseById() {
    return null;
  },
  async findPurchasesByAddress() {
    return [];
  },
  async updatePurchase() {
    return null;
  },
  async getPurchaseStats() {
    return {
      totalRaised: 0,
      totalTokensSold: 0,
      totalOrders: 0,
      totalPurchases: 0,
      completedPurchases: 0,
    };
  },
  async enableTOTP() {},
  async verifyBackupCode() {
    return false;
  },
  async disableTOTP() {},
  async saveBackupCodes() {},
};

// 根据环境选择数据库
let db: any;

if (isVercel) {
  // Vercel 环境使用模拟数据库
  db = mockDb;
  console.log('✓ Vercel 环境: 使用模拟数据库');
} else {
  // 本地环境使用 SQLite
  try {
    const { sqliteDb } = require('./sqlite');
    db = sqliteDb;
    console.log('✓ 本地环境: 使用 SQLite 共享数据库');
  } catch (e) {
    db = mockDb;
    console.log('⚠ SQLite 不可用，使用模拟数据库');
  }
}

export { db };
export default db;
