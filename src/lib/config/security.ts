/**
 * 安全配置模块
 *
 * 集中管理所有安全相关的配置
 */

// 环境检测
export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';

// API 配置
export const API_CONFIG = {
  // 区块链 RPC
  BLOCKCHAIN_RPC_URL: process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545',

  // 代币销售服务
  TOKEN_SALE_SERVER: process.env.TOKEN_SALE_SERVER || 'http://localhost:8560',

  // 后端 API
  BACKEND_API_URL: process.env.BACKEND_API_URL || '',

  // 请求超时（毫秒）
  REQUEST_TIMEOUT: parseInt(process.env.REQUEST_TIMEOUT || '5000'),
};

// 速率限制配置
export const RATE_LIMIT_CONFIG = {
  // 通用 API 限制
  DEFAULT: {
    windowMs: 60 * 1000, // 1分钟窗口
    maxRequests: 100, // 每窗口最大请求数
    blockDuration: 15 * 60 * 1000, // 封禁15分钟
  },

  // 认证相关限制（更严格）
  AUTH: {
    windowMs: 60 * 1000,
    maxRequests: 10, // 每分钟最多10次登录尝试
    blockDuration: 30 * 60 * 1000, // 封禁30分钟
  },

  // 交易相关限制
  TRANSACTION: {
    windowMs: 60 * 1000,
    maxRequests: 20, // 每分钟最多20次交易
    blockDuration: 10 * 60 * 1000,
  },

  // 搜索限制
  SEARCH: {
    windowMs: 60 * 1000,
    maxRequests: 30,
    blockDuration: 5 * 60 * 1000,
  },
};

// 密码策略
export const PASSWORD_POLICY = {
  minLength: 12,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecial: true,
  maxAge: 90 * 24 * 60 * 60 * 1000, // 90天
  historyCount: 5, // 不能重复最近5个密码
};

// 会话配置
export const SESSION_CONFIG = {
  maxAge: 24 * 60 * 60 * 1000, // 24小时
  secure: isProduction,
  httpOnly: true,
  sameSite: 'strict' as const,
  name: 'qau_session',
};

// CSRF 配置
export const CSRF_CONFIG = {
  tokenLength: 32,
  cookieName: '_csrf',
  headerName: 'x-csrf-token',
};

// 输入验证限制
export const INPUT_LIMITS = {
  // 字符串长度限制
  MAX_STRING_LENGTH: 10000,
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 5000,
  MAX_COMMENT_LENGTH: 2000,
  MAX_SEARCH_QUERY_LENGTH: 100,

  // 数值限制
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_SIZE: 20,

  // 文件上传限制
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
};

// 代币销售配置
export const TOKEN_SALE_CONFIG = {
  MIN_PURCHASE_USD: 100,
  MAX_PURCHASE_USD: 100000,
  ALLOWED_PAYMENT_METHODS: ['ETH', 'BTC', 'USDT', 'USDC'],
  CURRENT_PRICE: 0.03, // USD per QAU
  BONUS_PERCENT: 15,
};

// 区块链配置
export const BLOCKCHAIN_CONFIG = {
  CHAIN_ID: 1669,
  CHAIN_NAME: 'Quantaureum Testnet',
  BLOCK_TIME: 5, // 秒
  RPC_PORT: 8545,
};

// 安全日志配置
export const LOGGING_CONFIG = {
  MAX_LOGS: 10000,
  LOG_SENSITIVE_DATA: false,
  LOG_TO_CONSOLE: isDevelopment,
  LOG_TO_FILE: isProduction,
};

// 导出所有配置
export default {
  isProduction,
  isDevelopment,
  API_CONFIG,
  RATE_LIMIT_CONFIG,
  PASSWORD_POLICY,
  SESSION_CONFIG,
  CSRF_CONFIG,
  INPUT_LIMITS,
  TOKEN_SALE_CONFIG,
  BLOCKCHAIN_CONFIG,
  LOGGING_CONFIG,
};
