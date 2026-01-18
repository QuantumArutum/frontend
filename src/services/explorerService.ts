/**
 * Explorer Service - 区块链浏览器API服务
 * 提供区块、交易、地址查询等功能
 */

// 直接使用本地API路由，避免后端API连接问题
const LOCAL_API = '/api/explorer';

// 只使用本地API端点
const EXPLORER_API = LOCAL_API;

// ==================== 类型定义 ====================

export interface Block {
  number: string;
  hash: string;
  parentHash: string;
  timestamp: string;
  miner: string;
  gasUsed: string;
  gasLimit: string;
  difficulty: string;
  totalDifficulty: string;
  size: string;
  nonce: string;
  extraData: string;
  transactions: string[];
  transactionCount: number;
}

export interface Transaction {
  hash: string;
  blockNumber: string;
  blockHash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  gasUsed?: string;
  nonce: string;
  input: string;
  transactionIndex: string;
  timestamp?: string;
  status?: 'success' | 'failed' | 'pending';
}

export interface Address {
  address: string;
  balance: string;
  balanceUSD?: number;
  transactionCount: number;
  isContract: boolean;
  code?: string;
  tokenBalances?: TokenBalance[];
}

export interface TokenBalance {
  token: string;
  symbol: string;
  balance: string;
  decimals: number;
}

export interface TransactionReceipt {
  transactionHash: string;
  blockNumber: string;
  blockHash: string;
  from: string;
  to: string;
  gasUsed: string;
  cumulativeGasUsed: string;
  contractAddress: string | null;
  status: '0x1' | '0x0';
  logs: Array<{
    address: string;
    topics: string[];
    data: string;
    logIndex: string;
    transactionIndex: string;
    blockNumber: string;
    blockHash: string;
  }>;
}

export interface NetworkStats {
  latestBlock: number;
  totalTransactions: number;
  avgBlockTime: number;
  tps: number;
  peerCount: number;
  chainId: number;
  gasPrice: string;
  difficulty: string;
  hashRate: string;
  syncing: boolean;
}

export interface SearchResult {
  type: 'block' | 'transaction' | 'address' | 'token' | 'unknown';
  data: Block | Transaction | Address | null;
}

// ==================== API请求辅助函数 ====================

async function apiRequest<T>(endpoint: string): Promise<T | null> {
  // 直接使用本地API路由
  try {
    const response = await fetch(`${EXPLORER_API}${endpoint}`, {
      signal: AbortSignal.timeout(15000), // 15秒超时
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`Explorer API error: ${endpoint}`, error);
    return null;
  }
}

// ==================== 区块服务 ====================

export const blockService = {
  // 获取最新区块
  getLatestBlock: async (): Promise<Block | null> => {
    const data = await apiRequest<Block>('/block/latest');
    return data || getDefaultLatestBlock();
  },

  // 根据区块号获取区块
  getBlockByNumber: async (blockNumber: number | string): Promise<Block | null> => {
    return await apiRequest<Block>(`/block/${blockNumber}`);
  },

  // 根据区块哈希获取区块
  getBlockByHash: async (blockHash: string): Promise<Block | null> => {
    return await apiRequest<Block>(`/block/hash/${blockHash}`);
  },

  // 获取最近的区块列表
  getRecentBlocks: async (limit: number = 10): Promise<Block[]> => {
    const data = await apiRequest<Block[]>(`/blocks?limit=${limit}`);
    return data || getDefaultRecentBlocks();
  },

  // 获取区块中的交易
  getBlockTransactions: async (blockNumber: number | string): Promise<Transaction[]> => {
    const data = await apiRequest<Transaction[]>(`/block/${blockNumber}/transactions`);
    return data || [];
  },
};

// ==================== 交易服务 ====================

export const transactionService = {
  // 根据哈希获取交易
  getTransaction: async (txHash: string): Promise<Transaction | null> => {
    return await apiRequest<Transaction>(`/tx/${txHash}`);
  },

  // 获取最近的交易列表
  getRecentTransactions: async (limit: number = 10): Promise<Transaction[]> => {
    const data = await apiRequest<Transaction[]>(`/transactions?limit=${limit}`);
    return data || getDefaultRecentTransactions();
  },

  // 获取待处理交易
  getPendingTransactions: async (): Promise<Transaction[]> => {
    const data = await apiRequest<Transaction[]>('/transactions/pending');
    return data || [];
  },

  // 获取交易收据
  getTransactionReceipt: async (txHash: string): Promise<TransactionReceipt | null> => {
    return await apiRequest<TransactionReceipt>(`/tx/${txHash}/receipt`);
  },
};

// ==================== 地址服务 ====================

export const addressService = {
  // 获取地址信息
  getAddress: async (address: string): Promise<Address | null> => {
    const data = await apiRequest<Address>(`/address/${address}`);
    return data || getDefaultAddress(address);
  },

  // 获取地址余额
  getBalance: async (address: string): Promise<string> => {
    const data = await apiRequest<{ balance: string }>(`/address/${address}/balance`);
    return data?.balance || '0';
  },

  // 获取地址交易历史
  getAddressTransactions: async (
    address: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ transactions: Transaction[]; total: number }> => {
    const data = await apiRequest<{ transactions: Transaction[]; total: number }>(
      `/address/${address}/transactions?page=${page}&limit=${limit}`
    );
    return data || { transactions: [], total: 0 };
  },

  // 获取地址代币余额
  getTokenBalances: async (address: string): Promise<TokenBalance[]> => {
    const data = await apiRequest<TokenBalance[]>(`/address/${address}/tokens`);
    return data || [];
  },
};

// ==================== 网络统计服务 ====================

export const statsService = {
  // 获取网络统计
  getNetworkStats: async (): Promise<NetworkStats> => {
    const data = await apiRequest<NetworkStats>('/stats');
    return data || getDefaultNetworkStats();
  },

  // 获取Gas价格
  getGasPrice: async (): Promise<string> => {
    const data = await apiRequest<{ gasPrice: string }>('/gas-price');
    return data?.gasPrice || '0';
  },

  // 获取节点信息
  getPeerCount: async (): Promise<number> => {
    const data = await apiRequest<{ peerCount: string }>('/peers');
    return data ? parseInt(data.peerCount, 16) : 0;
  },
};

// ==================== 搜索服务 ====================

export const searchService = {
  // 智能搜索 - 自动识别搜索类型
  search: async (query: string): Promise<SearchResult> => {
    const trimmed = query.trim();

    // 交易哈希 (66字符，0x开头)
    if (trimmed.startsWith('0x') && trimmed.length === 66) {
      const tx = await transactionService.getTransaction(trimmed);
      if (tx) return { type: 'transaction', data: tx };
      // 可能是区块哈希
      const block = await blockService.getBlockByHash(trimmed);
      if (block) return { type: 'block', data: block };
    }

    // 地址 (42字符，0x开头)
    if (trimmed.startsWith('0x') && trimmed.length === 42) {
      const address = await addressService.getAddress(trimmed);
      return { type: 'address', data: address };
    }

    // 区块号 (纯数字)
    if (/^\d+$/.test(trimmed)) {
      const block = await blockService.getBlockByNumber(parseInt(trimmed));
      if (block) return { type: 'block', data: block };
    }

    return { type: 'unknown', data: null };
  },
};

// ==================== 工具函数 ====================

export const explorerUtils = {
  // 格式化区块号
  formatBlockNumber: (hex: string): number => {
    return parseInt(hex, 16);
  },

  // 格式化Wei为QAU
  formatWei: (wei: string, decimals: number = 4): string => {
    const value = BigInt(wei || '0');
    const divisor = BigInt(10 ** 18);
    const intPart = value / divisor;
    const fracPart = value % divisor;
    const fracStr = fracPart.toString().padStart(18, '0').slice(0, decimals);
    return `${intPart}.${fracStr}`;
  },

  // 格式化Gas
  formatGas: (gas: string): string => {
    const value = parseInt(gas, 16);
    if (value >= 1e9) return (value / 1e9).toFixed(2) + ' Gwei';
    if (value >= 1e6) return (value / 1e6).toFixed(2) + ' Mwei';
    return value.toString() + ' Wei';
  },

  // 格式化时间戳
  // 注意：区块链返回的时间戳可能是纳秒级（很大的数字）或秒级
  formatTimestamp: (hex: string): string => {
    if (!hex || hex === '0x0' || hex === '0x' || hex === '') return 'N/A';
    let timestamp = parseInt(hex, 16);
    if (isNaN(timestamp) || timestamp <= 0) return 'N/A';

    // 如果时间戳大于 1e15，说明是纳秒级，需要转换为毫秒
    // 如果时间戳大于 1e12，说明是毫秒级
    // 否则是秒级
    if (timestamp > 1e15) {
      // 纳秒级 -> 毫秒级
      timestamp = Math.floor(timestamp / 1e6);
    } else if (timestamp > 1e12) {
      // 已经是毫秒级
    } else {
      // 秒级 -> 毫秒级
      timestamp = timestamp * 1000;
    }

    return new Date(timestamp).toLocaleString('zh-CN');
  },

  // 格式化相对时间
  formatRelativeTime: (hex: string): string => {
    if (!hex || hex === '0x0' || hex === '0x' || hex === '') return 'N/A';
    let timestamp = parseInt(hex, 16);
    if (isNaN(timestamp) || timestamp <= 0) return 'N/A';

    // 如果时间戳大于 1e15，说明是纳秒级，需要转换为毫秒
    // 如果时间戳大于 1e12，说明是毫秒级
    // 否则是秒级
    if (timestamp > 1e15) {
      // 纳秒级 -> 毫秒级
      timestamp = Math.floor(timestamp / 1e6);
    } else if (timestamp > 1e12) {
      // 已经是毫秒级
    } else {
      // 秒级 -> 毫秒级
      timestamp = timestamp * 1000;
    }

    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 0) return '刚刚';
    if (diff < 60000) return `${Math.floor(diff / 1000)}秒前`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
    return `${Math.floor(diff / 86400000)}天前`;
  },

  // 截断哈希显示
  truncateHash: (hash: string, start: number = 6, end: number = 4): string => {
    if (!hash || hash.length <= start + end) return hash;
    return `${hash.slice(0, start)}...${hash.slice(-end)}`;
  },

  // 判断是否为合约地址
  isContract: (code: string | undefined): boolean => {
    return !!code && code !== '0x' && code !== '0x0';
  },
};

// ==================== 默认数据（开发环境） ====================

function getDefaultLatestBlock(): Block | null {
  return null;
}

function getDefaultRecentBlocks(): Block[] {
  return [];
}

function getDefaultRecentTransactions(): Transaction[] {
  return [];
}

function getDefaultAddress(address: string): Address | null {
  return null;
}

function getDefaultNetworkStats(): NetworkStats {
  return {
    latestBlock: 0,
    totalTransactions: 0,
    avgBlockTime: 0,
    tps: 0,
    peerCount: 0,
    chainId: 1668,
    gasPrice: '0x0',
    difficulty: '0x0',
    hashRate: '0',
    syncing: false,
  };
}

// ==================== 导出 ====================

export const explorerService = {
  blocks: blockService,
  transactions: transactionService,
  addresses: addressService,
  stats: statsService,
  search: searchService,
  utils: explorerUtils,
};

export default explorerService;
