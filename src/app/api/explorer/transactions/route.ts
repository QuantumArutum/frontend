/**
 * 区块链浏览器 - 交易列表 API - 优化版本
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, addSecurityHeaders } from '@/lib/security/middleware';

const BLOCKCHAIN_RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';

// 简单内存缓存
let txCache: { data: unknown[]; timestamp: number } | null = null;
const CACHE_TTL = 3000; // 3秒缓存

async function makeRPCCall(method: string, params: unknown[] = []) {
  try {
    const response = await fetch(BLOCKCHAIN_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`RPC failed: ${response.status}`);
    const result = await response.json();
    if (result.error) throw new Error(result.error.message);
    return result.result;
  } catch {
    console.error(`RPC ${method} failed`);
    return null;
  }
}

function toEvenHex(num: number): string {
  const hex = num.toString(16);
  return '0x' + (hex.length % 2 === 1 ? '0' + hex : hex);
}

interface BlockTransaction {
  hash: string;
  from?: string;
  to?: string;
  value?: string;
  gas?: string;
  gasPrice?: string;
  gasUsed?: string;
  nonce?: string;
  input?: string;
  transactionIndex?: string;
}

interface Block {
  number: string;
  hash: string;
  timestamp: string;
  transactions?: BlockTransaction[];
}

export const GET = createSecureHandler(
  async (request: NextRequest): Promise<NextResponse> => {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10'), 1), 100);
    
    // 检查缓存
    if (txCache && Date.now() - txCache.timestamp < CACHE_TTL) {
      return addSecurityHeaders(NextResponse.json(txCache.data.slice(0, limit)));
    }
    
    try {
      const latestBlockNumber = await makeRPCCall('qau_blockNumber');
      if (!latestBlockNumber) throw new Error('无法获取区块号');
      
      const latestBlock = parseInt(latestBlockNumber, 16);
      const transactions: unknown[] = [];
      
      // 分批扫描区块，直到找到足够的交易或扫描完所有区块
      const BATCH_SIZE = 50;  // 每批查询50个区块
      const MAX_BLOCKS = Math.min(latestBlock + 1, 500); // 最多扫描500个区块
      
      for (let offset = 0; offset < MAX_BLOCKS && transactions.length < limit; offset += BATCH_SIZE) {
        const blockPromises = [];
        const batchEnd = Math.min(offset + BATCH_SIZE, MAX_BLOCKS);
        
        for (let i = offset; i < batchEnd && latestBlock - i >= 0; i++) {
          blockPromises.push(makeRPCCall('qau_getBlockByNumber', [toEvenHex(latestBlock - i), true]));
        }
        
        const blocks = await Promise.all(blockPromises);
        
        for (const block of blocks) {
          const typedBlock = block as Block | null;
          if (!typedBlock?.transactions || typedBlock.transactions.length === 0) continue;
          
          for (const tx of typedBlock.transactions) {
            transactions.push({
              hash: tx.hash,
              blockNumber: typedBlock.number,
              blockHash: typedBlock.hash,
              from: tx.from || '0x' + '0'.repeat(40),
              to: tx.to || '0x' + '0'.repeat(40),
              value: tx.value || '0x0',
              gas: tx.gas || '0x5208',
              gasPrice: tx.gasPrice || '0x3b9aca00',
              gasUsed: tx.gasUsed || tx.gas || '0x5208',
              nonce: tx.nonce || '0x0',
              input: tx.input || '0x',
              transactionIndex: tx.transactionIndex || '0x0',
              timestamp: typedBlock.timestamp,
              status: 'success',
            });
          }
          
          // 如果已经找到足够的交易，停止
          if (transactions.length >= limit) break;
        }
      }
      
      // 更新缓存
      txCache = { data: transactions, timestamp: Date.now() };
      
      return addSecurityHeaders(NextResponse.json(transactions.slice(0, limit)));
    } catch {
      console.error('获取交易失败');
      // 返回空数组，不使用fallback数据
      return addSecurityHeaders(NextResponse.json([]));
    }
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
