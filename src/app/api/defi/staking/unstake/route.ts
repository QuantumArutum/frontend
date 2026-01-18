/**
 * Unstake API - Real blockchain integration
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
      const { stakeId, amount, userAddress } = body;

      if (!stakeId || !amount || !userAddress) {
        return errorResponse('Missing required fields: stakeId, amount, userAddress', 400);
      }

      // Convert amount to wei
      const amountWei = BigInt(Math.floor(parseFloat(amount) * 1e18)).toString();

      // Call blockchain RPC to unstake
      const result = await callRPC('qau_unstake', [userAddress, amountWei]);

      if (!result.success) {
        return errorResponse(result.error || 'Unstaking failed', 500);
      }

      return successResponse({
        success: true,
        txHash: result.txHash,
        unlockHeight: result.unlockHeight,
        message: `Successfully initiated unstake of ${amount} QAU`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Unstake error:', error);
      const message =
        error instanceof Error ? error.message : 'Failed to process unstaking request';
      return errorResponse(message, 500);
    }
  },
  { rateLimit: true, allowedMethods: ['POST'] }
);
