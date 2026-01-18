/**
 * Wallet Balance API - Get QAU balance from blockchain
 */

import { NextRequest, NextResponse } from 'next/server';

const RPC_URL = process.env.RPC_URL || 'http://localhost:8545';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json({ success: false, error: 'Address required' }, { status: 400 });
    }

    // Call blockchain RPC to get balance
    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'eth_getBalance',
        params: [address, 'latest'],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ success: false, error: data.error.message }, { status: 500 });
    }

    // Convert from wei to QAU
    const balanceWei = BigInt(data.result || '0x0');
    const balanceQAU = Number(balanceWei) / 1e18;

    return NextResponse.json({
      success: true,
      address,
      balance: balanceQAU.toFixed(4),
      balanceWei: balanceWei.toString(),
    });
  } catch (error) {
    console.error('Failed to fetch balance:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch balance' }, { status: 500 });
  }
}
