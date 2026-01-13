/**
 * Quantaureum 持久化数据库服务
 * 
 * 使用JSON文件存储实现数据持久化
 * 生产环境建议替换为PostgreSQL/MySQL
 */

import fs from 'fs';
import path from 'path';
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

export interface KYCDocument {
  id: string;
  userId: string;
  documentType: string;
  documentNumber: string;
  documentFront?: string;
  documentBack?: string;
  selfie?: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  rejectionReason?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentVerification {
  id: string;
  purchaseId: string;
  paymentMethod: string;
  paymentAddress: string;
  expectedAmount: number;
  receivedAmount?: number;
  paymentTxHash?: string;
  status: 'pending' | 'verified' | 'expired' | 'failed';
  expiresAt: string;
  verifiedAt?: string;
  createdAt: string;
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

export interface BackupCode {
  id: string;
  userId: string;
  codeHash: string;
  used: boolean;
  usedAt?: string;
  createdAt: string;
}

interface DatabaseSchema {
  users: User[];
  purchases: TokenPurchase[];
  kycDocuments: KYCDocument[];
  paymentVerifications: PaymentVerification[];
  sessions: Session[];
  backupCodes: BackupCode[];
}

// ==================== 文件存储 ====================

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// 确保数据目录存在
if (typeof window === 'undefined') {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch {
    console.warn('无法创建数据目录');
  }
}

const defaultData: DatabaseSchema = {
  users: [],
  purchases: [],
  kycDocuments: [],
  paymentVerifications: [],
  sessions: [],
  backupCodes: [],
};

function loadData(): DatabaseSchema {
  try {
    if (typeof window !== 'undefined') return defaultData;
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch {
    console.warn('加载数据库失败');
  }
  return { ...defaultData };
}

function saveData(data: DatabaseSchema): void {
  try {
    if (typeof window !== 'undefined') return;
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch {
    console.warn('保存数据库失败');
  }
}

// ==================== 数据库服务 ====================

class PersistentDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = loadData();
  }

  private save(): void {
    saveData(this.data);
  }

  // ========== 用户操作 ==========

  async createUser(email: string, password: string): Promise<User> {
    const existing = this.data.users.find(u => u.email === email);
    if (existing) throw new Error('邮箱已被注册');

    const user: User = {
      id: CryptoUtils.generateSecureToken(16),
      email,
      passwordHash: await CryptoUtils.hashPassword(password),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isVerified: false,
      isActive: true,
      role: 'user',
      kycStatus: 'none',
      totpEnabled: false,
    };

    this.data.users.push(user);
    this.save();
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.data.users.find(u => u.email === email) || null;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.data.users.find(u => u.id === id) || null;
  }

  async verifyUserPassword(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) return null;

    const valid = await CryptoUtils.verifyPassword(password, user.passwordHash);
    if (!valid) return null;

    user.lastLogin = new Date().toISOString();
    this.save();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return null;

    this.data.users[index] = {
      ...this.data.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.users[index];
  }

  // ========== 2FA操作 ==========

  async enableTOTP(userId: string, secret: string): Promise<void> {
    await this.updateUser(userId, { totpSecret: secret, totpEnabled: true });
  }

  async disableTOTP(userId: string): Promise<void> {
    await this.updateUser(userId, { totpSecret: undefined, totpEnabled: false });
    this.data.backupCodes = this.data.backupCodes.filter(c => c.userId !== userId);
    this.save();
  }

  async saveBackupCodes(userId: string, codes: string[]): Promise<void> {
    for (const code of codes) {
      const hash = await CryptoUtils.hashPassword(code);
      this.data.backupCodes.push({
        id: CryptoUtils.generateSecureToken(8),
        userId,
        codeHash: hash,
        used: false,
        createdAt: new Date().toISOString(),
      });
    }
    this.save();
  }

  async verifyBackupCode(userId: string, code: string): Promise<boolean> {
    const codes = this.data.backupCodes.filter(c => c.userId === userId && !c.used);
    for (const backupCode of codes) {
      const valid = await CryptoUtils.verifyPassword(code, backupCode.codeHash);
      if (valid) {
        backupCode.used = true;
        backupCode.usedAt = new Date().toISOString();
        this.save();
        return true;
      }
    }
    return false;
  }

  // ========== 代币购买操作 ==========

  async createPurchase(data: Omit<TokenPurchase, 'id' | 'createdAt' | 'status'>): Promise<TokenPurchase> {
    const purchase: TokenPurchase = {
      ...data,
      id: CryptoUtils.generateSecureToken(16),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.data.purchases.push(purchase);
    this.save();
    return purchase;
  }

  async findPurchaseById(id: string): Promise<TokenPurchase | null> {
    return this.data.purchases.find(p => p.id === id) || null;
  }

  async findPurchasesByAddress(address: string): Promise<TokenPurchase[]> {
    return this.data.purchases.filter(p => 
      p.buyerAddress.toLowerCase() === address.toLowerCase()
    );
  }

  async updatePurchase(id: string, updates: Partial<TokenPurchase>): Promise<TokenPurchase | null> {
    const index = this.data.purchases.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.data.purchases[index] = { ...this.data.purchases[index], ...updates };
    this.save();
    return this.data.purchases[index];
  }

  async completePurchase(id: string, txHash: string): Promise<TokenPurchase | null> {
    return this.updatePurchase(id, {
      status: 'completed',
      txHash,
      completedAt: new Date().toISOString(),
    });
  }

  async getPurchaseStats() {
    const completed = this.data.purchases.filter(p => p.status === 'completed');
    return {
      totalPurchases: this.data.purchases.length,
      totalRaised: completed.reduce((sum, p) => sum + p.amountUSD, 0),
      totalTokensSold: completed.reduce((sum, p) => sum + p.tokensTotal, 0),
      completedPurchases: completed.length,
    };
  }

  async getRecentPurchases(limit: number = 10): Promise<TokenPurchase[]> {
    return this.data.purchases
      .filter(p => p.status === 'completed')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  // ========== 支付验证操作 ==========

  async createPaymentVerification(data: Omit<PaymentVerification, 'id' | 'createdAt' | 'status'>): Promise<PaymentVerification> {
    const verification: PaymentVerification = {
      ...data,
      id: CryptoUtils.generateSecureToken(16),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    this.data.paymentVerifications.push(verification);
    this.save();
    return verification;
  }

  async findPaymentVerificationById(id: string): Promise<PaymentVerification | null> {
    return this.data.paymentVerifications.find(p => p.id === id) || null;
  }

  async findPaymentVerificationByPurchase(purchaseId: string): Promise<PaymentVerification | null> {
    return this.data.paymentVerifications
      .filter(p => p.purchaseId === purchaseId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
  }

  async verifyPayment(id: string, txHash: string, amount: number): Promise<PaymentVerification | null> {
    const index = this.data.paymentVerifications.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.data.paymentVerifications[index] = {
      ...this.data.paymentVerifications[index],
      paymentTxHash: txHash,
      receivedAmount: amount,
      status: 'verified',
      verifiedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.paymentVerifications[index];
  }

  // ========== KYC操作 ==========

  async createKYCDocument(data: Omit<KYCDocument, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<KYCDocument> {
    const now = new Date().toISOString();
    const doc: KYCDocument = {
      ...data,
      id: CryptoUtils.generateSecureToken(16),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    this.data.kycDocuments.push(doc);
    this.save();
    return doc;
  }

  async findKYCDocumentById(id: string): Promise<KYCDocument | null> {
    return this.data.kycDocuments.find(d => d.id === id) || null;
  }

  async findKYCDocumentsByUser(userId: string): Promise<KYCDocument[]> {
    return this.data.kycDocuments
      .filter(d => d.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateKYCStatus(id: string, status: string, reason?: string): Promise<KYCDocument | null> {
    const index = this.data.kycDocuments.findIndex(d => d.id === id);
    if (index === -1) return null;

    const now = new Date().toISOString();
    this.data.kycDocuments[index] = {
      ...this.data.kycDocuments[index],
      status: status as KYCDocument['status'],
      rejectionReason: reason,
      verifiedAt: status === 'approved' ? now : undefined,
      updatedAt: now,
    };

    // 更新用户KYC状态
    const doc = this.data.kycDocuments[index];
    await this.updateUser(doc.userId, { kycStatus: status as User['kycStatus'] });

    this.save();
    return doc;
  }

  // ========== 会话操作 ==========

  async createSession(userId: string, ip: string, userAgent: string): Promise<Session> {
    const session: Session = {
      id: CryptoUtils.generateSecureToken(16),
      userId,
      token: CryptoUtils.generateSecureToken(32),
      ip,
      userAgent,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      isValid: true,
    };

    this.data.sessions.push(session);
    this.save();
    return session;
  }

  async findSessionByToken(token: string): Promise<Session | null> {
    const session = this.data.sessions.find(s => s.token === token && s.isValid);
    if (!session) return null;

    if (new Date(session.expiresAt) < new Date()) {
      await this.invalidateSession(session.id);
      return null;
    }

    return session;
  }

  async invalidateSession(id: string): Promise<void> {
    const session = this.data.sessions.find(s => s.id === id);
    if (session) {
      session.isValid = false;
      this.save();
    }
  }

  async invalidateAllUserSessions(userId: string): Promise<void> {
    this.data.sessions
      .filter(s => s.userId === userId)
      .forEach(s => s.isValid = false);
    this.save();
  }
}

// ==================== 单例导出 ====================

export const persistentDb = new PersistentDatabase();
export default persistentDb;
