// API配置和环境管理
export const API_CONFIG = {
  // 是否使用模拟API
  USE_MOCK_API: process.env.USE_MOCK_API === 'true',
  
  // 开发环境配置
  DEVELOPMENT: {
    QUANTUM_API: '/api/quantum',
    DEFI_API: '/api/defi',
    BLOCKCHAIN_RPC: 'http://localhost:8545'
  },
  
  // 测试网配置
  TESTNET: {
    QUANTUM_API: process.env.QUANTUM_API_URL || 'https://testnet-api.quantaureum.com/quantum',
    DEFI_API: process.env.DEFI_API_URL || 'https://testnet-api.quantaureum.com/defi',
    BLOCKCHAIN_RPC: process.env.BLOCKCHAIN_RPC_URL || 'https://testnet-rpc.quantaureum.com'
  },
  
  // 主网配置
  MAINNET: {
    QUANTUM_API: process.env.QUANTUM_API_URL || 'https://api.quantaureum.com/quantum',
    DEFI_API: process.env.DEFI_API_URL || 'https://api.quantaureum.com/defi',
    BLOCKCHAIN_RPC: process.env.BLOCKCHAIN_RPC_URL || 'https://rpc.quantaureum.com'
  }
};

// 获取当前环境的API配置
export function getApiConfig() {
  const env = process.env.NODE_ENV;
  const networkEnv = process.env.NETWORK_ENV || 'development';
  
  if (env === 'development' || API_CONFIG.USE_MOCK_API) {
    return API_CONFIG.DEVELOPMENT;
  }
  
  switch (networkEnv) {
    case 'testnet':
      return API_CONFIG.TESTNET;
    case 'mainnet':
      return API_CONFIG.MAINNET;
    default:
      return API_CONFIG.DEVELOPMENT;
  }
}

// 智能合约地址配置
export const CONTRACT_ADDRESSES = {
  DEVELOPMENT: {
    QAU_TOKEN: '0x0000000000000000000000000000000000000000',
    DEFI_ROUTER: '0x0000000000000000000000000000000000000000',
    STAKING_POOL: '0x0000000000000000000000000000000000000000',
    LIQUIDITY_POOL_FACTORY: '0x0000000000000000000000000000000000000000'
  },
  TESTNET: {
    QAU_TOKEN: process.env.CONTRACT_QAU_TOKEN || '0x1234567890123456789012345678901234567890',
    DEFI_ROUTER: process.env.CONTRACT_DEFI_ROUTER || '0x2345678901234567890123456789012345678901',
    STAKING_POOL: process.env.CONTRACT_STAKING || '0x3456789012345678901234567890123456789012',
    LIQUIDITY_POOL_FACTORY: process.env.CONTRACT_FACTORY || '0x4567890123456789012345678901234567890123'
  },
  MAINNET: {
    QAU_TOKEN: process.env.CONTRACT_QAU_TOKEN || '',
    DEFI_ROUTER: process.env.CONTRACT_DEFI_ROUTER || '',
    STAKING_POOL: process.env.CONTRACT_STAKING || '',
    LIQUIDITY_POOL_FACTORY: process.env.CONTRACT_FACTORY || ''
  }
};

// 获取当前环境的合约地址
export function getContractAddresses() {
  const networkEnv = process.env.NETWORK_ENV || 'development';
  
  switch (networkEnv) {
    case 'testnet':
      return CONTRACT_ADDRESSES.TESTNET;
    case 'mainnet':
      return CONTRACT_ADDRESSES.MAINNET;
    default:
      return CONTRACT_ADDRESSES.DEVELOPMENT;
  }
}

// 网络配置
export const NETWORK_CONFIG = {
  DEVELOPMENT: {
    chainId: 1337,
    name: 'Quantaureum Local',
    rpcUrl: 'http://localhost:8545',
    blockExplorer: 'http://localhost:8080'
  },
  TESTNET: {
    chainId: 31337,
    name: 'Quantaureum Testnet',
    rpcUrl: 'https://testnet-rpc.quantaureum.com',
    blockExplorer: 'https://testnet-explorer.quantaureum.com'
  },
  MAINNET: {
    chainId: 1668,
    name: 'Quantaureum Mainnet',
    rpcUrl: 'https://rpc.quantaureum.com',
    blockExplorer: 'https://explorer.quantaureum.com'
  }
};

// 获取当前网络配置
export function getNetworkConfig() {
  const networkEnv = process.env.NETWORK_ENV || 'development';
  
  switch (networkEnv) {
    case 'testnet':
      return NETWORK_CONFIG.TESTNET;
    case 'mainnet':
      return NETWORK_CONFIG.MAINNET;
    default:
      return NETWORK_CONFIG.DEVELOPMENT;
  }
}
