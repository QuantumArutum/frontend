/**
 * QPOS Validators API
 * 返回 Validator 列表及其详细信息
 */

import { NextResponse } from 'next/server';
import { createSecureHandler, addSecurityHeaders } from '@/lib/security/middleware';

const BLOCKCHAIN_RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';

// 缓存
let validatorsCache: { data: unknown; timestamp: number } | null = null;
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

// 格式化 stake 为可读格式
function formatStake(stakeWei: string): string {
  try {
    const stake = BigInt(stakeWei);
    // stake 值可能是 wei 或者直接是 QAU 数量
    // 如果值很大（> 1e15），假设是 wei
    // 否则假设是直接的 QAU 数量
    if (stake > BigInt(1e15)) {
      const qau = stake / BigInt(1e18);
      if (qau >= BigInt(1e6)) return (Number(qau) / 1e6).toFixed(2) + 'M QAU';
      if (qau >= BigInt(1e3)) return (Number(qau) / 1e3).toFixed(2) + 'K QAU';
      return qau.toString() + ' QAU';
    } else {
      // 直接是 QAU 数量
      const qauNum = Number(stake);
      if (qauNum >= 1e6) return (qauNum / 1e6).toFixed(2) + 'M QAU';
      if (qauNum >= 1e3) return (qauNum / 1e3).toFixed(2) + 'K QAU';
      return qauNum.toLocaleString() + ' QAU';
    }
  } catch {
    return stakeWei;
  }
}

// 计算 validator 状态
function getValidatorStatus(validator: {
  active: boolean;
  slashed: boolean;
}): string {
  if (validator.slashed) return 'slashed';
  if (validator.active) return 'active';
  return 'inactive';
}

export const GET = createSecureHandler(
  async (): Promise<NextResponse> => {
    // 检查缓存
    if (validatorsCache && Date.now() - validatorsCache.timestamp < CACHE_TTL) {
      return addSecurityHeaders(NextResponse.json(validatorsCache.data));
    }

    try {
      const qposStatus = await makeRPCCall('qpos_status');
      
      if (!qposStatus || !qposStatus.validators) {
        return addSecurityHeaders(NextResponse.json({
          validators: [],
          totalCount: 0,
          activeCount: 0,
          slashedCount: 0,
          totalStake: '0',
        }));
      }

      const validators = qposStatus.validators || [];
      
      // 统计
      let activeCount = 0;
      let slashedCount = 0;
      let totalStake = BigInt(0);
      
      // 格式化 validator 信息
      const formattedValidators = validators.map((v: {
        address: string;
        stake: string;
        active: boolean;
        slashed: boolean;
      }, index: number) => {
        const status = getValidatorStatus(v);
        if (v.active) activeCount++;
        if (v.slashed) slashedCount++;
        
        try {
          totalStake += BigInt(v.stake);
        } catch {
          // ignore
        }
        
        return {
          index,
          address: '0x' + v.address,
          stake: v.stake,
          stakeFormatted: formatStake(v.stake),
          status,
          active: v.active,
          slashed: v.slashed,
          isCurrentProposer: qposStatus.currentProposer === v.address,
        };
      });

      const response = {
        validators: formattedValidators,
        totalCount: validators.length,
        activeCount,
        slashedCount,
        inactiveCount: validators.length - activeCount - slashedCount,
        totalStake: totalStake.toString(),
        totalStakeFormatted: formatStake(totalStake.toString()),
        currentEpoch: qposStatus.currentEpoch || 0,
        currentSlot: qposStatus.currentSlot || 0,
        timestamp: Date.now(),
      };

      // 更新缓存
      validatorsCache = { data: response, timestamp: Date.now() };

      return addSecurityHeaders(NextResponse.json(response));
    } catch (error) {
      console.error('获取 Validators 失败:', error);
      return addSecurityHeaders(NextResponse.json({
        validators: [],
        totalCount: 0,
        activeCount: 0,
        slashedCount: 0,
        totalStake: '0',
        error: 'Failed to fetch validators',
      }, { status: 500 }));
    }
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
