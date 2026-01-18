/**
 * User Stakes API - Real blockchain integration
 */

import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
): Promise<NextResponse> {
  try {
    const { address } = await params;

    if (!address) {
      return NextResponse.json({
        success: true,
        data: [],
        timestamp: new Date().toISOString(),
      });
    }

    // Call blockchain RPC to get user stakes
    const result = await callRPC('qau_getUserStakes', [address]);

    // Get current block number to calculate time
    const blockNumberHex = await callRPC('eth_blockNumber', []);
    const currentBlock = parseInt(blockNumberHex, 16);
    const blockTime = 12; // 12 seconds per block
    const now = Date.now();

    // Transform stakes to frontend format
    const stakes =
      result.stakes?.map((stake: Record<string, unknown>) => {
        const startBlock = stake.start_time as number;
        const unlockBlock = stake.unlock_time as number;

        // Calculate actual timestamps based on block numbers
        // start_time: how many blocks ago * block_time
        const blocksAgoStart = currentBlock - startBlock;
        const startTimestamp = now - blocksAgoStart * blockTime * 1000;

        // unlock_time: how many blocks until unlock * block_time
        const blocksUntilUnlock = unlockBlock - currentBlock;
        const unlockTimestamp = now + blocksUntilUnlock * blockTime * 1000;

        // Check if stake is locked
        const isLocked = currentBlock < unlockBlock;

        return {
          id: `stake-${address}-${stake.pool_id}`,
          pool_id: stake.pool_id,
          amount: stake.amount ? (Number(BigInt(stake.amount as string)) / 1e18).toFixed(4) : '0',
          rewards: stake.rewards
            ? (Number(BigInt(stake.rewards as string)) / 1e18).toFixed(4)
            : '0',
          start_time: new Date(startTimestamp).toISOString(),
          unlock_time: new Date(unlockTimestamp).toISOString(),
          start_block: startBlock,
          unlock_block: unlockBlock,
          current_block: currentBlock,
          is_locked: isLocked,
          blocks_until_unlock: isLocked ? blocksUntilUnlock : 0,
          status: stake.status || 'active',
          apy: stake.apy || 18.5,
        };
      }) || [];

    return NextResponse.json({
      success: true,
      data: stakes,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to fetch user stakes:', error);
    // Return empty array on error
    return NextResponse.json({
      success: true,
      data: [],
      timestamp: new Date().toISOString(),
    });
  }
}
