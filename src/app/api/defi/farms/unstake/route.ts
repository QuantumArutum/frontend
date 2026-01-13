/**
 * Farm Unstake API - 连接区块链 RPC
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
      const { farmId, userAddress, amount } = body;

      if (!farmId || !userAddress || !amount) {
        return errorResponse('Missing required fields: farmId, userAddress, amount', 400);
      }

      // Convert amount to wei
      const amountWei = BigInt(Math.floor(parseFloat(amount) * 1e18)).toString();

      const result = await callRPC('qau_unstakeFarm', [farmId, userAddress, amountWei]);

      if (!result.success) {
        return errorResponse(result.error || 'Farm unstake failed', 500);
      }

      return successResponse({
        success: true,
        txHash: result.txHash,
        amount: result.amount,
        rewardsClaimed: result.rewards_claimed,
        message: `Successfully unstaked LP tokens from ${farmId}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Farm unstake error:', error);
      const message = error instanceof Error ? error.message : 'Failed to unstake from farm';
      return errorResponse(message, 500);
    }
  },
  { rateLimit: true, allowedMethods: ['POST'] }
);
