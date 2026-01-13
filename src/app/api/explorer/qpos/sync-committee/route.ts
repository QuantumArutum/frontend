/**
 * QPOS Sync Committee API
 * 返回同步委员会信息（用于轻客户端支持）
 */

import { NextResponse } from 'next/server';
import { createSecureHandler, addSecurityHeaders } from '@/lib/security/middleware';

const BLOCKCHAIN_RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';

// 缓存
let syncCommitteeCache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 10000; // 10秒缓存（同步委员会变化较慢）

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

export const GET = createSecureHandler(
  async (): Promise<NextResponse> => {
    // 检查缓存
    if (syncCommitteeCache && Date.now() - syncCommitteeCache.timestamp < CACHE_TTL) {
      return addSecurityHeaders(NextResponse.json(syncCommitteeCache.data));
    }

    try {
      const qposStatus = await makeRPCCall('qpos_status');
      
      if (!qposStatus) {
        return addSecurityHeaders(NextResponse.json({
          syncCommittee: null,
          error: 'QPOS status not available',
        }));
      }

      const currentEpoch = qposStatus.currentEpoch || 0;
      const syncCommitteePeriod = 256; // epochs per sync committee period
      const currentPeriod = Math.floor(currentEpoch / syncCommitteePeriod);
      const nextPeriodEpoch = (currentPeriod + 1) * syncCommitteePeriod;
      const epochsUntilRotation = nextPeriodEpoch - currentEpoch;

      // 从 QPOS 状态获取同步委员会信息
      const syncCommittee = qposStatus.syncCommittee || null;

      const response = {
        // 同步委员会信息
        syncCommittee: syncCommittee ? {
          period: syncCommittee.period,
          size: syncCommittee.size,
          // 委员会成员索引（如果可用）
          memberCount: syncCommittee.size || 512,
        } : null,
        
        // 周期信息
        currentPeriod,
        syncCommitteePeriod,
        epochsUntilRotation,
        nextRotationEpoch: nextPeriodEpoch,
        
        // 当前状态
        currentEpoch,
        
        // 高级功能状态
        advanced: qposStatus.advanced || null,
        
        timestamp: Date.now(),
      };

      // 更新缓存
      syncCommitteeCache = { data: response, timestamp: Date.now() };

      return addSecurityHeaders(NextResponse.json(response));
    } catch (error) {
      console.error('获取 Sync Committee 失败:', error);
      return addSecurityHeaders(NextResponse.json({
        syncCommittee: null,
        error: 'Failed to fetch sync committee',
      }, { status: 500 }));
    }
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
