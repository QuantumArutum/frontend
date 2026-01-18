/**
 * DeFi 流动性挖矿 API - 连接区块链 RPC
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse } from '@/lib/security/middleware';

const RPC_URL = process.env.RPC_URL || 'http://localhost:8545';

async function callRPC(method: string, params: unknown[] = []) {
  const response = await fetch(RPC_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: Date.now(),
      method,
      params,
    }),
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error.message || 'RPC error');
  }
  return data.result;
}

// Fallback mock data when RPC is unavailable
const fallbackFarms = [
  {
    farm_id: 'FARM-QAU-USDT-LP',
    name: 'QAU-USDT Farm',
    lp_token: 'QAU-USDT LP',
    reward_token: 'QAU',
    total_staked: 5000000,
    apy: 85.6,
    multiplier: 2.0,
    start_block: 1000000,
    end_block: 2000000,
    status: 'ACTIVE',
  },
  {
    farm_id: 'FARM-QAU-ETH-LP',
    name: 'QAU-ETH Farm',
    lp_token: 'QAU-ETH LP',
    reward_token: 'QAU',
    total_staked: 3500000,
    apy: 120.3,
    multiplier: 3.0,
    start_block: 1000000,
    end_block: 2000000,
    status: 'ACTIVE',
  },
  {
    farm_id: 'FARM-USDT-ETH-LP',
    name: 'USDT-ETH Farm',
    lp_token: 'USDT-ETH LP',
    reward_token: 'QAU',
    total_staked: 8000000,
    apy: 45.8,
    multiplier: 1.0,
    start_block: 1000000,
    end_block: 2000000,
    status: 'ACTIVE',
  },
  {
    farm_id: 'FARM-QAU-BTC-LP',
    name: 'QAU-BTC Farm',
    lp_token: 'QAU-BTC LP',
    reward_token: 'QAU',
    total_staked: 2000000,
    apy: 150.2,
    multiplier: 4.0,
    start_block: 1100000,
    end_block: 2100000,
    status: 'ACTIVE',
  },
];

export const GET = createSecureHandler(
  async (_request: NextRequest): Promise<NextResponse> => {
    try {
      const result = await callRPC('qau_getYieldFarms');

      // Transform blockchain data to frontend format
      const farms =
        result.farms?.map((farm: Record<string, unknown>) => ({
          farm_id: farm.farm_id,
          name: farm.name,
          lp_token: farm.lp_token,
          reward_token: farm.reward_token,
          total_staked: Number(farm.total_staked) / 1e18,
          apy: farm.apy || 50.0,
          multiplier: farm.multiplier,
          start_block: farm.start_block,
          end_block: farm.end_block,
          status: farm.status,
        })) || fallbackFarms;

      return successResponse({
        data: { farms },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to fetch yield farms from RPC:', error);
      // Return fallback data
      return successResponse({
        data: { farms: fallbackFarms },
        timestamp: new Date().toISOString(),
      });
    }
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
