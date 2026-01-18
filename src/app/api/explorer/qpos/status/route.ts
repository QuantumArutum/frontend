/**
 * QPOS 共识状态 API
 * 返回完整的 QPOS 状态信息，包括高级功能
 */

import { NextResponse } from 'next/server';
import { createSecureHandler, addSecurityHeaders } from '@/lib/security/middleware';

const BLOCKCHAIN_RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';

// 缓存
let qposCache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 3000; // 3秒缓存

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
    if (qposCache && Date.now() - qposCache.timestamp < CACHE_TTL) {
      return addSecurityHeaders(NextResponse.json(qposCache.data));
    }

    try {
      const qposStatus = await makeRPCCall('qpos_status');

      if (!qposStatus) {
        return addSecurityHeaders(
          NextResponse.json(
            {
              error: 'QPOS status not available',
              consensus: 'QPOS',
              initialized: false,
            },
            { status: 503 }
          )
        );
      }

      // 格式化响应
      const response = {
        // 基本信息
        consensus: qposStatus.consensus || 'QPOS',
        slotDuration: qposStatus.slotDuration || 12,
        slotsPerEpoch: qposStatus.slotsPerEpoch || 32,

        // 当前状态
        currentSlot: qposStatus.currentSlot || 0,
        currentEpoch: qposStatus.currentEpoch || 0,
        slotInEpoch: qposStatus.slotInEpoch || 0,

        // Finality
        justifiedEpoch: qposStatus.justifiedEpoch || 0,
        finalizedEpoch: qposStatus.finalizedEpoch || 0,
        finality: qposStatus.finality || {},

        // Validators
        validatorCount: qposStatus.validatorCount || 0,
        currentProposer: qposStatus.currentProposer || null,

        // Epoch 摘要
        epochSummary: qposStatus.epochSummary || null,

        // 上一个 Epoch 奖励
        lastEpochRewards: qposStatus.lastEpochRewards || null,

        // Slashed validators
        slashedValidators: qposStatus.slashedValidators || [],

        // Proposer boost
        proposerBoost: qposStatus.proposerBoost || null,

        // 高级功能
        advanced: qposStatus.advanced || null,
        syncCommittee: qposStatus.syncCommittee || null,

        // 时间戳
        timestamp: Date.now(),
      };

      // 更新缓存
      qposCache = { data: response, timestamp: Date.now() };

      return addSecurityHeaders(NextResponse.json(response));
    } catch (error) {
      console.error('获取 QPOS 状态失败:', error);
      return addSecurityHeaders(
        NextResponse.json(
          {
            error: 'Failed to fetch QPOS status',
            consensus: 'QPOS',
            initialized: false,
          },
          { status: 500 }
        )
      );
    }
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
