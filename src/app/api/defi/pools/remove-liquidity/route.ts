/**
 * Remove Liquidity API - 连接区块链 RPC
 */

import { NextRequest, NextResponse } from 'next/server';
import { createSecureHandler, successResponse, errorResponse } from '@/lib/security/middleware';

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

export const POST = createSecureHandler(
  async (request: NextRequest): Promise<NextResponse> => {
    try {
      const body = await request.json();
      const { poolId, userAddress, lpAmount } = body;

      if (!poolId || !userAddress || !lpAmount) {
        return errorResponse('Missing required fields: poolId, userAddress, lpAmount', 400);
      }

      // Convert LP amount to wei
      const lpAmountWei = BigInt(Math.floor(parseFloat(lpAmount) * 1e18)).toString();

      const result = await callRPC('qau_removeLiquidity', [poolId, userAddress, lpAmountWei]);

      if (!result.success) {
        return errorResponse(result.error || 'Remove liquidity failed', 500);
      }

      return successResponse({
        success: true,
        txHash: result.txHash,
        amountA: result.amount_a,
        amountB: result.amount_b,
        message: `Successfully removed liquidity from ${poolId}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Remove liquidity error:', error);
      const message = error instanceof Error ? error.message : 'Failed to remove liquidity';
      return errorResponse(message, 500);
    }
  },
  { rateLimit: true, allowedMethods: ['POST'] }
);
