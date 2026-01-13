/**
 * 区块链浏览器 - 区块列表 API - 优化版本
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, addSecurityHeaders } from '@/lib/security/middleware';

const BLOCKCHAIN_RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';

// 简单内存缓存
let blockCache: { data: unknown[]; timestamp: number } | null = null;
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
  } catch (error) {
    console.error(`RPC ${method} failed:`, error);
    return null;
  }
}

function toEvenHex(num: number): string {
  const hex = num.toString(16);
  return '0x' + (hex.length % 2 === 1 ? '0' + hex : hex);
}

export const GET = createSecureHandler(
  async (request: NextRequest): Promise<NextResponse> => {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '10'), 1), 100);
    
    // 检查缓存
    if (blockCache && Date.now() - blockCache.timestamp < CACHE_TTL) {
      return addSecurityHeaders(NextResponse.json(blockCache.data.slice(0, limit)));
    }
    
    try {
      const latestBlockNumber = await makeRPCCall('qau_blockNumber');
      if (!latestBlockNumber) throw new Error('无法获取区块号');
      
      const latestBlock = parseInt(latestBlockNumber, 16);
      
      // 并行获取区块
      const blockPromises = [];
      for (let i = 0; i < limit && latestBlock - i >= 0; i++) {
        blockPromises.push(makeRPCCall('qau_getBlockByNumber', [toEvenHex(latestBlock - i), true]));
      }
      
      const blockResults = await Promise.all(blockPromises);
      const blocks = blockResults
        .filter(b => b !== null)
        .map(b => ({
          number: b.number,
          hash: b.hash,
          parentHash: b.parentHash,
          timestamp: b.timestamp,
          miner: b.miner || '0x' + '0'.repeat(40),
          gasUsed: b.gasUsed || '0x0',
          gasLimit: b.gasLimit || '0xe4e1c0',
          difficulty: b.difficulty || '0x0',
          totalDifficulty: b.totalDifficulty || '0x0',
          size: b.size || '0x0',
          nonce: b.nonce || '0x0',
          extraData: b.extraData || '0x',
          transactions: b.transactions || [],
          transactionCount: b.transactions?.length || 0,
        }));
      
      // 更新缓存
      blockCache = { data: blocks, timestamp: Date.now() };
      
      return addSecurityHeaders(NextResponse.json(blocks));
    } catch (error) {
      console.error('获取区块失败:', error);
      // 返回空数组，不使用fallback数据
      return addSecurityHeaders(NextResponse.json([]));
    }
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
