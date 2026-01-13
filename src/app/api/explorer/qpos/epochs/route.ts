/**
 * QPOS Epochs API
 * 返回 Epoch 信息和历史
 */

import { NextResponse } from 'next/server';
import { createSecureHandler, addSecurityHeaders } from '@/lib/security/middleware';

const BLOCKCHAIN_RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';

// 缓存
let epochsCache: { data: unknown; timestamp: number } | null = null;
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

// 计算 epoch 的时间范围
function calculateEpochTime(epoch: number, slotDuration: number, slotsPerEpoch: number): {
  startTime: number;
  endTime: number;
  duration: number;
} {
  const epochDuration = slotDuration * slotsPerEpoch * 1000; // 毫秒
  // 假设 epoch 0 从某个基准时间开始
  const genesisTime = Date.now() - (epoch * epochDuration);
  
  return {
    startTime: genesisTime + (epoch * epochDuration),
    endTime: genesisTime + ((epoch + 1) * epochDuration),
    duration: epochDuration,
  };
}

export const GET = createSecureHandler(
  async (): Promise<NextResponse> => {
    // 检查缓存
    if (epochsCache && Date.now() - epochsCache.timestamp < CACHE_TTL) {
      return addSecurityHeaders(NextResponse.json(epochsCache.data));
    }

    try {
      const qposStatus = await makeRPCCall('qpos_status');
      
      if (!qposStatus) {
        return addSecurityHeaders(NextResponse.json({
          currentEpoch: 0,
          epochs: [],
          finality: {},
        }));
      }

      const currentEpoch = qposStatus.currentEpoch || 0;
      const slotDuration = qposStatus.slotDuration || 12;
      const slotsPerEpoch = qposStatus.slotsPerEpoch || 32;
      const justifiedEpoch = qposStatus.justifiedEpoch || 0;
      const finalizedEpoch = qposStatus.finalizedEpoch || 0;

      // 构建最近的 epoch 列表
      const epochs = [];
      const epochCount = Math.min(currentEpoch + 1, 10); // 最多显示 10 个 epoch
      
      for (let i = 0; i < epochCount; i++) {
        const epochNum = currentEpoch - i;
        if (epochNum < 0) break;
        
        const epochTime = calculateEpochTime(epochNum, slotDuration, slotsPerEpoch);
        const startSlot = epochNum * slotsPerEpoch;
        const endSlot = startSlot + slotsPerEpoch - 1;
        
        // 确定 epoch 状态
        let status = 'pending';
        if (epochNum < currentEpoch) status = 'completed';
        if (epochNum <= finalizedEpoch) status = 'finalized';
        else if (epochNum <= justifiedEpoch) status = 'justified';
        
        epochs.push({
          epoch: epochNum,
          startSlot,
          endSlot,
          status,
          isJustified: epochNum <= justifiedEpoch,
          isFinalized: epochNum <= finalizedEpoch,
          isCurrent: epochNum === currentEpoch,
          ...epochTime,
        });
      }

      // 当前 epoch 摘要
      const epochSummary = qposStatus.epochSummary || {
        epoch: currentEpoch,
        startSlot: currentEpoch * slotsPerEpoch,
        endSlot: (currentEpoch + 1) * slotsPerEpoch - 1,
        totalAttestations: 0,
        participationRate: 0,
        isJustified: false,
        isFinalized: false,
      };

      // 上一个 epoch 奖励
      const lastEpochRewards = qposStatus.lastEpochRewards || null;

      const response = {
        currentEpoch,
        currentSlot: qposStatus.currentSlot || 0,
        slotInEpoch: qposStatus.slotInEpoch || 0,
        slotDuration,
        slotsPerEpoch,
        epochDuration: slotDuration * slotsPerEpoch,
        
        // Finality 状态
        justifiedEpoch,
        finalizedEpoch,
        epochsToFinality: currentEpoch - finalizedEpoch,
        
        // Epoch 列表
        epochs,
        
        // 当前 epoch 摘要
        epochSummary,
        
        // 奖励信息
        lastEpochRewards,
        
        // Finality 详情
        finality: qposStatus.finality || {},
        
        timestamp: Date.now(),
      };

      // 更新缓存
      epochsCache = { data: response, timestamp: Date.now() };

      return addSecurityHeaders(NextResponse.json(response));
    } catch (error) {
      console.error('获取 Epochs 失败:', error);
      return addSecurityHeaders(NextResponse.json({
        currentEpoch: 0,
        epochs: [],
        error: 'Failed to fetch epochs',
      }, { status: 500 }));
    }
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
