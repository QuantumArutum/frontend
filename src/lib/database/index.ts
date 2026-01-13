/**
 * Quantaureum 数据库服务
 * 
 * 支持 JSON 文件存储（开发）和 PostgreSQL（生产）
 */

import { persistentDb } from './persistent';
import { postgresDb, initDatabase } from './postgresql';
import { sqliteDb } from './sqlite';

// 导出类型
export type {
  User,
  TokenPurchase,
  Session,
} from './postgresql';

export type {
  KYCDocument,
  PaymentVerification,
  BackupCode,
} from './persistent';

// 强制使用 SQLite 共享数据库（与后端共享）
export const db = sqliteDb;
console.log('✓ 使用 SQLite 共享数据库');

export default db;
