// 钱包API工具函数
const API_BASE_URL = 'http://localhost:5001/api';

export const walletApi = {
  // 创建新钱包
  async createWallet(password) {
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      return await response.json();
    } catch (error) {
      console.error('创建钱包失败:', error);
      throw error;
    }
  },

  // 获取钱包账户列表
  async getAccounts(walletAddress) {
    try {
      const response = await fetch(`${API_BASE_URL}/wallet/${walletAddress}/accounts`);
      return await response.json();
    } catch (error) {
      console.error('获取账户列表失败:', error);
      throw error;
    }
  },

  // 获取账户资产
  async getAssets(accountId) {
    try {
      const response = await fetch(`${API_BASE_URL}/account/${accountId}/assets`);
      return await response.json();
    } catch (error) {
      console.error('获取资产列表失败:', error);
      throw error;
    }
  },

  // 获取交易历史
  async getTransactions(accountId) {
    try {
      const response = await fetch(`${API_BASE_URL}/account/${accountId}/transactions`);
      return await response.json();
    } catch (error) {
      console.error('获取交易历史失败:', error);
      throw error;
    }
  },

  // 发送交易
  async sendTransaction(transactionData) {
    try {
      const response = await fetch(`${API_BASE_URL}/transaction/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
      return await response.json();
    } catch (error) {
      console.error('发送交易失败:', error);
      throw error;
    }
  },

  // 获取量子安全状态
  async getQuantumStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/quantum/status`);
      return await response.json();
    } catch (error) {
      console.error('获取量子安全状态失败:', error);
      throw error;
    }
  },

  // 获取支持的网络
  async getNetworks() {
    try {
      const response = await fetch(`${API_BASE_URL}/networks`);
      return await response.json();
    } catch (error) {
      console.error('获取网络列表失败:', error);
      throw error;
    }
  },

  // 验证地址格式
  validateAddress(address) {
    // quantaureum地址格式验证
    const qaPattern = /^QA[a-fA-F0-9]{40}$/;
    const ethPattern = /^0x[a-fA-F0-9]{40}$/;
    const btcPattern = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    
    return qaPattern.test(address) || ethPattern.test(address) || btcPattern.test(address);
  },

  // 格式化余额显示
  formatBalance(balance, decimals = 6) {
    if (balance === 0) return '0';
    if (balance < 0.000001) return '< 0.000001';
    return parseFloat(balance).toFixed(decimals).replace(/\.?0+$/, '');
  },

  // 格式化地址显示
  formatAddress(address, startLength = 6, endLength = 4) {
    if (!address) return '';
    if (address.length <= startLength + endLength) return address;
    return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
  },

  // 计算交易费用
  calculateFee(amount, currency) {
    const feeRates = {
      QAU: 0.001,  // 0.1%
      BTC: 0.0005, // 0.05%
      ETH: 0.002,  // 0.2%
      USDT: 0.001  // 0.1%
    };
    
    const rate = feeRates[currency] || 0.001;
    return amount * rate;
  },

  // 生成二维码数据
  generateQRData(address, amount = null, currency = null) {
    let qrData = address;
    if (amount && currency) {
      qrData = `${address}?amount=${amount}&currency=${currency}`;
    }
    return qrData;
  }
};

// 量子安全工具函数
export const quantumUtils = {
  // 生成量子安全随机数
  generateSecureRandom(length = 32) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  // 验证量子签名
  async verifyQuantumSignature(data, signature, publicKey) {
    // 模拟量子签名验证
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data + publicKey);
      const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      return hashHex === signature;
    } catch (error) {
      console.error('量子签名验证失败:', error);
      return false;
    }
  },

  // 加密敏感数据
  async encryptSensitiveData(data, password) {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      const passwordBuffer = encoder.encode(password);
      
      // 生成密钥
      const keyMaterial = await crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
      );
      
      const key = await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: encoder.encode('quantum-salt'),
          iterations: 100000,
          hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt']
      );
      
      // 加密数据
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        dataBuffer
      );
      
      return {
        encrypted: Array.from(new Uint8Array(encrypted)),
        iv: Array.from(iv)
      };
    } catch (error) {
      console.error('数据加密失败:', error);
      throw error;
    }
  }
};

export default walletApi;

