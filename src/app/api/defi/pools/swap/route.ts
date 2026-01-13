/**
 * Swap API - 连接区块链 RPC
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
      const { poolId, tokenIn, amountIn, minAmountOut } = body;

      if (!poolId || !tokenIn || !amountIn) {
        return errorResponse('Missing required fields: poolId, tokenIn, amountIn', 400);
      }

      // Convert amount to wei
      const amountInWei = BigInt(Math.floor(parseFloat(amountIn) * 1e18)).toString();

      const result = await callRPC('qau_swap', [poolId, tokenIn, amountInWei]);

      if (!result.success) {
        return errorResponse(result.error || 'Swap failed', 500);
      }

      // Check slippage if minAmountOut is provided
      if (minAmountOut) {
        const minOut = BigInt(Math.floor(parseFloat(minAmountOut) * 1e18));
        const actualOut = BigInt(result.amount_out);
        if (actualOut < minOut) {
          return errorResponse('Slippage too high', 400);
        }
      }

      return successResponse({
        success: true,
        txHash: result.txHash,
        amountIn: result.amount_in,
        amountOut: result.amount_out,
        message: `Successfully swapped ${tokenIn}`,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Swap error:', error);
      const message = error instanceof Error ? error.message : 'Failed to swap';
      return errorResponse(message, 500);
    }
  },
  { rateLimit: true, allowedMethods: ['POST'] }
);

// GET for swap quote
export const GET = createSecureHandler(
  async (request: NextRequest): Promise<NextResponse> => {
    try {
      const { searchParams } = new URL(request.url);
      const poolId = searchParams.get('poolId');
      const tokenIn = searchParams.get('tokenIn');
      const amountIn = searchParams.get('amountIn');

      if (!poolId || !tokenIn || !amountIn) {
        return errorResponse('Missing required params: poolId, tokenIn, amountIn', 400);
      }

      const amountInWei = BigInt(Math.floor(parseFloat(amountIn) * 1e18)).toString();

      const result = await callRPC('qau_getSwapQuote', [poolId, tokenIn, amountInWei]);

      return successResponse({
        poolId: result.pool_id,
        tokenIn: result.token_in,
        tokenOut: result.token_out,
        amountIn: result.amount_in,
        amountOut: result.amount_out,
        priceImpact: result.price_impact,
        fee: result.fee
      });
    } catch (error) {
      console.error('Swap quote error:', error);
      const message = error instanceof Error ? error.message : 'Failed to get swap quote';
      return errorResponse(message, 500);
    }
  },
  { rateLimit: true, allowedMethods: ['GET'] }
);
