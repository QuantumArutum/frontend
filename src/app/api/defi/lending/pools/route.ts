/**
 * DeFi 借贷池 API - 连接区块链 RPC
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
const fallbackPools = [
  { pool_id: 'LEND-QAU', asset: 'QAU', total_supply: 5000000, total_borrowed: 3500000, supply_rate: 8.5, borrow_rate: 12.3, utilization_rate: 70, collateral_factor: 0.75, liquidation_threshold: 0.85, available_to_borrow: 1500000 },
  { pool_id: 'LEND-USDT', asset: 'USDT', total_supply: 10000000, total_borrowed: 6000000, supply_rate: 6.2, borrow_rate: 9.8, utilization_rate: 60, collateral_factor: 0.85, liquidation_threshold: 0.90, available_to_borrow: 4000000 },
  { pool_id: 'LEND-ETH', asset: 'ETH', total_supply: 2000, total_borrowed: 1200, supply_rate: 5.8, borrow_rate: 8.5, utilization_rate: 60, collateral_factor: 0.80, liquidation_threshold: 0.88, available_to_borrow: 800 },
  { pool_id: 'LEND-BTC', asset: 'BTC', total_supply: 100, total_borrowed: 50, supply_rate: 4.5, borrow_rate: 7.2, utilization_rate: 50, collateral_factor: 0.80, liquidation_threshold: 0.88, available_to_borrow: 50 },
  { pool_id: 'LEND-USDC', asset: 'USDC', total_supply: 8000000, total_borrowed: 4800000, supply_rate: 5.5, borrow_rate: 8.8, utilization_rate: 60, collateral_factor: 0.85, liquidation_threshold: 0.90, available_to_borrow: 3200000 }
];

export const GET = createSecureHandler(
  async (_request: NextRequest): Promise<NextResponse> => {
    try {
      const result = await callRPC('qau_getLendingPools');
      
      // Transform blockchain data to frontend format
      const pools = result.pools?.map((pool: Record<string, unknown>) => ({
        pool_id: pool.pool_id,
        asset: pool.asset,
        total_supply: Number(pool.total_supply) / 1e18,
        total_borrowed: Number(pool.total_borrowed) / 1e18,
        supply_rate: pool.supply_rate,
        borrow_rate: pool.borrow_rate,
        utilization_rate: pool.utilization_rate,
        collateral_factor: pool.collateral_factor,
        liquidation_threshold: pool.liquidation_threshold,
        available_to_borrow: Number(pool.available_to_borrow) / 1e18,
      })) || fallbackPools;

      return successResponse({
        data: { pools },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to fetch lending pools from RPC:', error);
      // Return fallback data
      return successResponse({
        data: { pools: fallbackPools },
        timestamp: new Date().toISOString()
      });
    }
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
