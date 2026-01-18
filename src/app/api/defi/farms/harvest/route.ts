/**
 * Farm Harvest API - 连接区块链 RPC
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
      const { farmId, userAddress } = body;

      if (!farmId || !userAddress) {
        return errorResponse('Missing required fields: farmId, userAddress', 400);
      }

      const result = await callRPC('qau_harvestFarm', [farmId, userAddress]);

      if (!result.success) {
        return errorResponse(result.error || 'Harvest failed', 500);
      }

      // Convert rewards from wei to token
      const rewardsQAU = result.rewards ? (Number(BigInt(result.rewards)) / 1e18).toFixed(4) : '0';

      return successResponse({
        success: true,
        txHash: result.txHash,
        rewards: rewardsQAU,
        message: `Successfully harvested ${rewardsQAU} QAU rewards`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Harvest error:', error);
      const message = error instanceof Error ? error.message : 'Failed to harvest rewards';
      return errorResponse(message, 500);
    }
  },
  { rateLimit: true, allowedMethods: ['POST'] }
);
