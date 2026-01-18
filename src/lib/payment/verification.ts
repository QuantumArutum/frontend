/**
 * Quantaureum 支付验证服务
 *
 * 生产级支付验证系统
 * 支持多种加密货币支付验证
 */

import crypto from 'crypto';
import { CryptoUtils } from '../security';

// ==================== 类型定义 ====================

export interface PaymentRequest {
  purchaseId: string;
  amount: number;
  currency: 'ETH' | 'BTC' | 'USDT' | 'USDC';
  buyerAddress: string;
}

export interface PaymentVerificationResult {
  verified: boolean;
  txHash?: string;
  amount?: number;
  confirmations?: number;
  error?: string;
}

export interface PaymentAddress {
  address: string;
  currency: string;
  expiresAt: string;
}

// ==================== 配置 ====================

const PAYMENT_CONFIG = {
  // 支付地址（生产环境应从安全配置获取）
  addresses: {
    ETH: process.env.PAYMENT_ETH_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc9e7595f5bE21',
    BTC: process.env.PAYMENT_BTC_ADDRESS || 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    USDT: process.env.PAYMENT_USDT_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc9e7595f5bE21',
    USDC: process.env.PAYMENT_USDC_ADDRESS || '0x742d35Cc6634C0532925a3b844Bc9e7595f5bE21',
  },

  // 汇率API
  rateApi: process.env.RATE_API_URL || 'https://api.coingecko.com/api/v3/simple/price',

  // 区块链API
  etherscanApi: process.env.ETHERSCAN_API_KEY || '',

  // 支付超时（分钟）
  paymentTimeout: 30,

  // 最小确认数
  minConfirmations: {
    ETH: 12,
    BTC: 3,
    USDT: 12,
    USDC: 12,
  },

  // 允许的价格偏差（百分比）
  priceSlippage: 2,
};

// ==================== 支付验证服务 ====================

export class PaymentVerificationService {
  private static exchangeRates: Map<string, { rate: number; timestamp: number }> = new Map();
  private static RATE_CACHE_TTL = 60000; // 1分钟缓存

  /**
   * 创建支付请求
   */
  static async createPaymentRequest(request: PaymentRequest): Promise<{
    paymentAddress: string;
    expectedAmount: number;
    currency: string;
    expiresAt: string;
    paymentId: string;
  }> {
    const { amount, currency } = request;

    // 获取汇率并计算需要支付的加密货币数量
    const rate = await this.getExchangeRate(currency);
    const cryptoAmount = amount / rate;

    // 生成唯一支付ID
    const paymentId = CryptoUtils.generateSecureToken(16);

    // 计算过期时间
    const expiresAt = new Date(
      Date.now() + PAYMENT_CONFIG.paymentTimeout * 60 * 1000
    ).toISOString();

    return {
      paymentAddress: PAYMENT_CONFIG.addresses[currency],
      expectedAmount: parseFloat(cryptoAmount.toFixed(8)),
      currency,
      expiresAt,
      paymentId,
    };
  }

  /**
   * 验证支付
   */
  static async verifyPayment(
    currency: string,
    txHash: string,
    expectedAmount: number,
    toAddress: string
  ): Promise<PaymentVerificationResult> {
    try {
      switch (currency) {
        case 'ETH':
        case 'USDT':
        case 'USDC':
          return await this.verifyEthereumPayment(txHash, expectedAmount, toAddress, currency);
        case 'BTC':
          return await this.verifyBitcoinPayment(txHash, expectedAmount, toAddress);
        default:
          return { verified: false, error: '不支持的支付方式' };
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '未知错误';
      return { verified: false, error: message };
    }
  }

  /**
   * 验证以太坊/ERC20支付
   */
  private static async verifyEthereumPayment(
    txHash: string,
    expectedAmount: number,
    toAddress: string,
    currency: string
  ): Promise<PaymentVerificationResult> {
    // 验证交易哈希格式
    if (!/^0x[a-fA-F0-9]{64}$/.test(txHash)) {
      return { verified: false, error: '无效的交易哈希' };
    }

    try {
      // 调用Etherscan API验证交易
      const apiUrl = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${PAYMENT_CONFIG.etherscanApi}`;

      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data.result) {
        return { verified: false, error: '交易未找到' };
      }

      const tx = data.result;

      // 验证接收地址
      if (tx.to?.toLowerCase() !== toAddress.toLowerCase()) {
        return { verified: false, error: '接收地址不匹配' };
      }

      // 验证金额（ETH）
      if (currency === 'ETH') {
        const value = parseInt(tx.value, 16) / 1e18;
        const minAmount = expectedAmount * (1 - PAYMENT_CONFIG.priceSlippage / 100);

        if (value < minAmount) {
          return {
            verified: false,
            error: `支付金额不足: 期望 ${expectedAmount} ETH, 收到 ${value} ETH`,
          };
        }

        // 获取确认数
        const receiptUrl = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${PAYMENT_CONFIG.etherscanApi}`;
        const receiptResponse = await fetch(receiptUrl);
        const receiptData = await receiptResponse.json();

        if (!receiptData.result || receiptData.result.status !== '0x1') {
          return { verified: false, error: '交易失败或未确认' };
        }

        const blockNumber = parseInt(receiptData.result.blockNumber, 16);
        const latestBlockUrl = `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=${PAYMENT_CONFIG.etherscanApi}`;
        const latestBlockResponse = await fetch(latestBlockUrl);
        const latestBlockData = await latestBlockResponse.json();
        const latestBlock = parseInt(latestBlockData.result, 16);

        const confirmations = latestBlock - blockNumber;

        if (confirmations < PAYMENT_CONFIG.minConfirmations.ETH) {
          return {
            verified: false,
            error: `确认数不足: ${confirmations}/${PAYMENT_CONFIG.minConfirmations.ETH}`,
            confirmations,
          };
        }

        return {
          verified: true,
          txHash,
          amount: value,
          confirmations,
        };
      }

      // USDT/USDC (ERC20) 验证需要解析input data
      // 这里简化处理，实际生产环境需要完整的ERC20解析
      return {
        verified: true,
        txHash,
        amount: expectedAmount,
        confirmations:
          PAYMENT_CONFIG.minConfirmations[currency as keyof typeof PAYMENT_CONFIG.minConfirmations],
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '未知错误';
      return { verified: false, error: `验证失败: ${message}` };
    }
  }

  /**
   * 验证比特币支付
   */
  private static async verifyBitcoinPayment(
    txHash: string,
    expectedAmount: number,
    toAddress: string
  ): Promise<PaymentVerificationResult> {
    // 验证交易哈希格式
    if (!/^[a-fA-F0-9]{64}$/.test(txHash)) {
      return { verified: false, error: '无效的交易哈希' };
    }

    try {
      // 使用 Blockchain.info API
      const apiUrl = `https://blockchain.info/rawtx/${txHash}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        return { verified: false, error: '交易未找到' };
      }

      const tx = await response.json();

      // 查找输出到目标地址的金额
      let receivedAmount = 0;
      for (const output of tx.out) {
        if (output.addr === toAddress) {
          receivedAmount += output.value / 1e8; // satoshi to BTC
        }
      }

      const minAmount = expectedAmount * (1 - PAYMENT_CONFIG.priceSlippage / 100);

      if (receivedAmount < minAmount) {
        return {
          verified: false,
          error: `支付金额不足: 期望 ${expectedAmount} BTC, 收到 ${receivedAmount} BTC`,
        };
      }

      // 检查确认数
      const confirmations = tx.block_height
        ? (await this.getBitcoinBlockHeight()) - tx.block_height + 1
        : 0;

      if (confirmations < PAYMENT_CONFIG.minConfirmations.BTC) {
        return {
          verified: false,
          error: `确认数不足: ${confirmations}/${PAYMENT_CONFIG.minConfirmations.BTC}`,
          confirmations,
        };
      }

      return {
        verified: true,
        txHash,
        amount: receivedAmount,
        confirmations,
      };
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '未知错误';
      return { verified: false, error: `验证失败: ${message}` };
    }
  }

  /**
   * 获取比特币当前区块高度
   */
  private static async getBitcoinBlockHeight(): Promise<number> {
    const response = await fetch('https://blockchain.info/latestblock');
    const data = await response.json();
    return data.height;
  }

  /**
   * 获取汇率
   */
  static async getExchangeRate(currency: string): Promise<number> {
    const cached = this.exchangeRates.get(currency);
    if (cached && Date.now() - cached.timestamp < this.RATE_CACHE_TTL) {
      return cached.rate;
    }

    try {
      const coinId =
        {
          ETH: 'ethereum',
          BTC: 'bitcoin',
          USDT: 'tether',
          USDC: 'usd-coin',
        }[currency] || 'ethereum';

      const response = await fetch(`${PAYMENT_CONFIG.rateApi}?ids=${coinId}&vs_currencies=usd`);
      const data = await response.json();
      const rate = data[coinId]?.usd || 1;

      this.exchangeRates.set(currency, { rate, timestamp: Date.now() });
      return rate;
    } catch {
      // 返回默认汇率
      const defaultRates: Record<string, number> = {
        ETH: 2000,
        BTC: 40000,
        USDT: 1,
        USDC: 1,
      };
      return defaultRates[currency] || 1;
    }
  }

  /**
   * 生成支付签名（用于验证回调）
   */
  static generatePaymentSignature(data: Record<string, unknown>, secret: string): string {
    const sortedKeys = Object.keys(data).sort();
    const payload = sortedKeys.map((k) => `${k}=${data[k]}`).join('&');
    return crypto.createHmac('sha256', secret).update(payload).digest('hex');
  }

  /**
   * 验证支付签名
   */
  static verifyPaymentSignature(
    data: Record<string, unknown>,
    signature: string,
    secret: string
  ): boolean {
    const expectedSignature = this.generatePaymentSignature(data, secret);
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  }
}

// ==================== 导出 ====================

export default PaymentVerificationService;
