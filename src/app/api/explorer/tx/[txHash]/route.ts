import { NextRequest, NextResponse } from 'next/server';

const BLOCKCHAIN_RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';

async function makeRPCCall(method: string, params: unknown[] = []) {
  try {
    const response = await fetch(BLOCKCHAIN_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error(`RPC failed: ${response.status}`);
    const result = await response.json();
    if (result.error) throw new Error(result.error.message);
    return result.result;
  } catch (error) {
    console.error(`RPC ${method} failed:`, error);
    return null;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ txHash: string }> }
) {
  const { txHash } = await params;
  
  try {
    // 首先尝试获取交易
    const tx = await makeRPCCall('eth_getTransactionByHash', [txHash]);
    
    if (!tx) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }
    
    // 获取交易收据以获取状态
    const receipt = await makeRPCCall('eth_getTransactionReceipt', [txHash]);
    
    // 从区块获取时间戳
    let timestamp = '0x0';
    if (tx.blockNumber) {
      const block = await makeRPCCall('qau_getBlockByNumber', [tx.blockNumber, false]);
      if (block?.timestamp) {
        timestamp = block.timestamp;
      }
    }
    
    const transaction = {
      hash: tx.hash,
      blockNumber: tx.blockNumber,
      blockHash: tx.blockHash,
      from: tx.from,
      to: tx.to,
      value: tx.value,
      gas: tx.gas,
      gasPrice: tx.gasPrice,
      gasUsed: receipt?.gasUsed || tx.gas,
      nonce: tx.nonce,
      input: tx.input,
      transactionIndex: tx.transactionIndex,
      timestamp,
      status: receipt?.status === '0x1' ? 'success' : (receipt?.status === '0x0' ? 'failed' : 'pending'),
    };

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Failed to get transaction:', error);
    return NextResponse.json({ error: 'Failed to get transaction' }, { status: 500 });
  }
}
