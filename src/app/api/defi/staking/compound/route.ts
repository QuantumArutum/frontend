/**
 * Compound Rewards API - Real blockchain integration
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
      const { stakeId, userAddress } = body;

      if (!stakeId || !userAddress) {
        return errorResponse('Missing required fields: stakeId, userAddress', 400);
      }

      // Call blockchain RPC to compound rewards
      const result = await callRPC('qau_compoundRewards', [userAddress]);

      if (!result.success) {
        return errorResponse(result.error || 'Compound failed', 500);
      }

      // Convert amounts from wei to QAU
      const compoundedQAU = result.amount ? (Number(BigInt(result.amount)) / 1e18).toFixed(4) : '0';
      const newTotalQAU = result.newTotal
        ? (Number(BigInt(result.newTotal)) / 1e18).toFixed(4)
        : '0';

      return successResponse({
        success: true,
        txHash: result.txHash,
        amount: compoundedQAU,
        newTotal: newTotalQAU,
        message: `Successfully compounded ${compoundedQAU} QAU rewards`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Compound error:', error);
      const message = error instanceof Error ? error.message : 'Failed to compound rewards';
      return errorResponse(message, 500);
    }
  },
  { rateLimit: true, allowedMethods: ['POST'] }
);
