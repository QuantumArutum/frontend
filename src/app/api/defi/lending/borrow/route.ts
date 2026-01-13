/**
 * Lending Borrow API - 连接区块链 RPC
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
      const { poolId, userAddress, amount } = body;

      if (!poolId || !userAddress || !amount) {
        return errorResponse('Missing required fields: poolId, userAddress, amount', 400);
      }

      // Convert amount to wei
      const amountWei = BigInt(Math.floor(parseFloat(amount) * 1e18)).toString();

      const result = await callRPC('qau_borrow', [poolId, userAddress, amountWei]);

      if (!result.success) {
        return errorResponse(result.error || 'Borrow failed', 500);
      }

      return successResponse({
        success: true,
        txHash: result.txHash,
        amount: result.amount,
        message: `Successfully borrowed from ${poolId}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Borrow error:', error);
      const message = error instanceof Error ? error.message : 'Failed to borrow';
      return errorResponse(message, 500);
    }
  },
  { rateLimit: true, allowedMethods: ['POST'] }
);
