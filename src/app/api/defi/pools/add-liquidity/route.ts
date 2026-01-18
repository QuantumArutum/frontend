/**
 * Add Liquidity API - 连接区块链 RPC
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
      const { poolId, userAddress, amountA, amountB } = body;

      if (!poolId || !userAddress || !amountA || !amountB) {
        return errorResponse('Missing required fields: poolId, userAddress, amountA, amountB', 400);
      }

      // Convert amounts to wei
      const amountAWei = BigInt(Math.floor(parseFloat(amountA) * 1e18)).toString();
      const amountBWei = BigInt(Math.floor(parseFloat(amountB) * 1e18)).toString();

      const result = await callRPC('qau_addLiquidity', [
        poolId,
        userAddress,
        amountAWei,
        amountBWei,
      ]);

      if (!result.success) {
        return errorResponse(result.error || 'Add liquidity failed', 500);
      }

      return successResponse({
        success: true,
        txHash: result.txHash,
        lpTokens: result.lp_tokens,
        message: `Successfully added liquidity to ${poolId}`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Add liquidity error:', error);
      const message = error instanceof Error ? error.message : 'Failed to add liquidity';
      return errorResponse(message, 500);
    }
  },
  { rateLimit: true, allowedMethods: ['POST'] }
);
