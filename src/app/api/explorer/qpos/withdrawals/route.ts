/**
 * QPOS Withdrawals API
 * 返回提款队列信息
 */

import { NextResponse } from 'next/server';
import { createSecureHandler, addSecurityHeaders } from '@/lib/security/middleware';

const BLOCKCHAIN_RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';

// 缓存
let withdrawalsCache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 5000; // 5秒缓存

async function makeRPCCall(method: string, params: unknown[] = []) {
  try {
    const response = await fetch(BLOCKCHAIN_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return null;
    const result = await response.json();
    if (result.error) return null;
    return result.result;
  } catch {
    return null;
  }
}

// 格式化金额
function formatAmount(amountWei: string): string {
  try {
    const amount = BigInt(amountWei);
    const qau = amount / BigInt(1e18);
    const remainder = amount % BigInt(1e18);
    if (remainder === BigInt(0)) {
      return qau.toString() + ' QAU';
    }
    return (Number(amount) / 1e18).toFixed(4) + ' QAU';
  } catch {
    return amountWei;
  }
}

export const GET = createSecureHandler(
  async (): Promise<NextResponse> => {
    // 检查缓存
    if (withdrawalsCache && Date.now() - withdrawalsCache.timestamp < CACHE_TTL) {
      return addSecurityHeaders(NextResponse.json(withdrawalsCache.data));
    }

    try {
      const qposStatus = await makeRPCCall('qpos_status');
      
      if (!qposStatus) {
        return addSecurityHeaders(NextResponse.json({
          pendingWithdrawals: [],
          pendingCount: 0,
          error: 'QPOS status not available',
        }));
      }

      const currentEpoch = qposStatus.currentEpoch || 0;
      const advanced = qposStatus.advanced || {};
      const pendingCount = advanced.pendingWithdrawals || 0;

      // 提款相关常量
      const minWithdrawableEpoch = 256; // ~27 hours
      const maxWithdrawalsPerEpoch = 16;

      const response = {
        // 待处理提款数量
        pendingCount,
        
        // 提款配置
        config: {
          minWithdrawableEpoch,
          maxWithdrawalsPerEpoch,
          estimatedWaitTime: pendingCount > 0 
            ? Math.ceil(pendingCount / maxWithdrawalsPerEpoch) * 12 * 32 // 秒
            : 0,
        },
        
        // 当前状态
        currentEpoch,
        
        // 高级功能状态
        inactivityLeakActive: advanced.inactivityLeakActive || false,
        
        timestamp: Date.now(),
      };

      // 更新缓存
      withdrawalsCache = { data: response, timestamp: Date.now() };

      return addSecurityHeaders(NextResponse.json(response));
    } catch (error) {
      console.error('获取 Withdrawals 失败:', error);
      return addSecurityHeaders(NextResponse.json({
        pendingWithdrawals: [],
        pendingCount: 0,
        error: 'Failed to fetch withdrawals',
      }, { status: 500 }));
    }
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
