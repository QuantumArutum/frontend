import { NextResponse } from 'next/server';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// 尝试读取部署信息，如果失败则使用默认值（或者保持为空）
let deploymentInfo = { GoldReserve: "" };
try {
  const deploymentPath = path.join(process.cwd(), 'deployment.json');
  if (fs.existsSync(deploymentPath)) {
    deploymentInfo = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  }
} catch (e) {
  console.error("Failed to load deployment info:", e);
}

// GoldReserve Minimal ABI
const GoldReserveABI = [
  "function totalGoldReserve() view returns (uint256)",
  "function totalQAUIssued() view returns (uint256)"
];

// Custom Provider to fix timestamp and 0x issues
class QuantaureumProvider extends ethers.JsonRpcProvider {
    async send(method: string, params: any[]) {
        const result = await super.send(method, params);
        
        // Fix timestamp in block results
        if ((method === 'eth_getBlockByNumber' || method === 'eth_getBlockByHash') && result) {
            if (!result.difficulty) result.difficulty = "0x0";
            if (!result.gasLimit) result.gasLimit = "0x1fffffffffffff";
            if (!result.baseFeePerGas) result.baseFeePerGas = "0x0"; 
            if (!result.extraData) result.extraData = "0x";
            if (!result.nonce) result.nonce = "0x0000000000000000";
            if (!result.mixHash) result.mixHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

            if (result.timestamp && typeof result.timestamp === 'string' && result.timestamp.length > 12) {
                const bigTs = BigInt(result.timestamp);
                const seconds = bigTs / BigInt(1000000000);
                result.timestamp = "0x" + seconds.toString(16);
            }

            // Fix transactions in block
            if (result.transactions && Array.isArray(result.transactions)) {
                result.transactions.forEach((tx: any) => {
                    if (typeof tx === 'object') {
                        if (tx.value === '0x') tx.value = '0x0';
                        if (tx.gas === '0x') tx.gas = '0x0';
                        if (tx.gasPrice === '0x') tx.gasPrice = '0x0';
                        if (tx.nonce === '0x') tx.nonce = '0x0';
                        if (tx.v === '0x') tx.v = '0x0';
                        if (tx.r === '0x') tx.r = '0x0';
                        if (tx.s === '0x') tx.s = '0x0';
                        if (tx.type === '0x') tx.type = '0x0';
                        if (tx.chainId === '0x') tx.chainId = '0x0';
                        
                        if (tx.maxFeePerGas === '0x') tx.maxFeePerGas = '0x0';
                        if (tx.maxPriorityFeePerGas === '0x') tx.maxPriorityFeePerGas = '0x0';
                        if (tx.blockNumber === '0x') tx.blockNumber = '0x0';
                        if (tx.transactionIndex === '0x') tx.transactionIndex = '0x0';

                        if (!tx.r) tx.r = "0x0000000000000000000000000000000000000000000000000000000000000001";
                        if (!tx.s) tx.s = "0x0000000000000000000000000000000000000000000000000000000000000001";
                        if (!tx.v) tx.v = "0x1b";
                        if (!tx.yParity) tx.yParity = "0x0";

                        // Auto-fix any other 0x fields
                        for (const key in tx) {
                            if (tx[key] === '0x') {
                                tx[key] = '0x0';
                            }
                        }
                    }
                });
            }
        }
        return result;
    }
}

export async function GET() {
  let goldData = {
    price_gram: 85.20,
    price_ounce: 2650.00,
    timestamp: new Date().toISOString(),
    source: 'fallback'
  };

  // 1. 获取外部金价
  try {
    const response = await fetch('https://api.gold-api.com/price/XAU', {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' },
      next: { revalidate: 60 }
    });

    if (response.ok) {
      const data = await response.json();
      goldData = {
        price_gram: data.price / 31.1034768,
        price_ounce: data.price,
        timestamp: new Date().toISOString(),
        source: 'realtime'
      };
    }
  } catch (error) {
    console.error('Failed to fetch gold price:', error);
  }

  // 2. 获取链上储备数据
  // 注意：当前 QVM 不支持 EVM 字节码执行，所以跳过合约调用
  // 使用 TOKEN_ECONOMICS.md 中的数据：公开销售 21,600,000 QAU
  let reserveData = {
    totalReserve: "21600000", // 公开销售配额
    totalIssued: "0",
    onChain: false
  };

  // 检查节点是否在线
  try {
    const provider = new QuantaureumProvider('http://localhost:8545');
    const blockNumber = await provider.getBlockNumber();
    if (blockNumber > 0) {
      reserveData.onChain = true;
    }
  } catch (error) {
    // 节点离线，使用默认值
  }

  return NextResponse.json({
    ...goldData,
    ...reserveData,
    currency: 'USD'
  });
}
