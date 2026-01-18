/**
 * QPOS Fork Choice API
 * 返回 LMD GHOST Fork Choice 状态
 */

import { NextResponse } from 'next/server';
import { createSecureHandler, addSecurityHeaders } from '@/lib/security/middleware';

const BLOCKCHAIN_RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';

// 缓存
let forkChoiceCache: { data: unknown; timestamp: number } | null = null;
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
    if (forkChoiceCache && Date.now() - forkChoiceCache.timestamp < CACHE_TTL) {
      return addSecurityHeaders(NextResponse.json(forkChoiceCache.data));
    }

    try {
      const qposStatus = await makeRPCCall('qpos_status');

      if (!qposStatus) {
        return addSecurityHeaders(
          NextResponse.json({
            forkChoice: null,
            error: 'QPOS status not available',
          })
        );
      }

      const advanced = qposStatus.advanced || {};
      const forkChoice = advanced.forkChoice || {};

      // Proposer boost 信息
      const proposerBoost = qposStatus.proposerBoost || null;

      const response = {
        // Fork Choice 状态
        forkChoice: {
          head: forkChoice.head || null,
          justifiedRoot: forkChoice.justifiedRoot || null,
          justifiedEpoch: forkChoice.justifiedEpoch || 0,
          finalizedRoot: forkChoice.finalizedRoot || null,
          finalizedEpoch: forkChoice.finalizedEpoch || 0,
          blockCount: forkChoice.blockCount || 0,
          voteCount: forkChoice.voteCount || 0,
        },

        // Proposer Boost
        proposerBoost: proposerBoost
          ? {
              blockRoot: proposerBoost.blockRoot,
              slot: proposerBoost.slot,
              boostPercent: 40, // ProposerScoreBoostPercent
            }
          : null,

        // 配置
        config: {
          proposerScoreBoostPercent: 40,
          reorgMaxEpochsBack: 2,
        },

        // 当前状态
        currentSlot: qposStatus.currentSlot || 0,
        currentEpoch: qposStatus.currentEpoch || 0,

        // Finality
        justifiedEpoch: qposStatus.justifiedEpoch || 0,
        finalizedEpoch: qposStatus.finalizedEpoch || 0,

        timestamp: Date.now(),
      };

      // 更新缓存
      forkChoiceCache = { data: response, timestamp: Date.now() };

      return addSecurityHeaders(NextResponse.json(response));
    } catch (error) {
      console.error('获取 Fork Choice 失败:', error);
      return addSecurityHeaders(
        NextResponse.json(
          {
            forkChoice: null,
            error: 'Failed to fetch fork choice',
          },
          { status: 500 }
        )
      );
    }
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
